package com.example.Cmms.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.Cmms.domain.ordemservico.DadosAtualizacaoOrdemServico;
import com.example.Cmms.domain.ordemservico.DadosAtualizacaoStatusOS;
import com.example.Cmms.domain.ordemservico.DadosCadastroOSCorretiva;
import com.example.Cmms.domain.ordemservico.DadosCadastroOSPreventiva;
import com.example.Cmms.domain.ordemservico.DadosDetalhamentoOrdemServico;
import com.example.Cmms.domain.ordemservico.DadosListagemOrdemServico;
import com.example.Cmms.domain.ordemservico.HistoricoStatus;
import com.example.Cmms.domain.ordemservico.HistoricoStatusRepository;
import com.example.Cmms.domain.ordemservico.OrdemServicoRepository;
import com.example.Cmms.domain.ordemservico.StatusOrdemServico;
import com.example.Cmms.exception.RecursoNaoEncontradoException;
import com.example.Cmms.service.OrdemServicoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/ordens-servico")
public class OrdemServicoController {
    
    @Autowired
    private OrdemServicoService service;
    
    @Autowired
    private OrdemServicoRepository repository;
    
    @Autowired
    private HistoricoStatusRepository historicoRepository;
    
    // ===== OS CORRETIVA =====
    
    @PostMapping("/corretiva")
    @Transactional
    public ResponseEntity criarOSCorretiva(
            @RequestBody @Valid DadosCadastroOSCorretiva dados,
            UriComponentsBuilder uriBuilder) {
        
        var os = service.criarOSCorretiva(dados);
        var uri = uriBuilder
                .path("/ordens-servico/{id}")
                .buildAndExpand(os.getId())
                .toUri();
        
        return ResponseEntity.created(uri).body(new DadosDetalhamentoOrdemServico(os));
    }
    
    // ===== OS PREVENTIVA =====
    
    @PostMapping("/preventiva")
    @Transactional
    public ResponseEntity criarOSPreventiva(
            @RequestBody @Valid DadosCadastroOSPreventiva dados,
            UriComponentsBuilder uriBuilder) {
        
        var os = service.criarOSPreventiva(dados);
        var uri = uriBuilder
                .path("/ordens-servico/{id}")
                .buildAndExpand(os.getId())
                .toUri();
        
        return ResponseEntity.created(uri).body(new DadosDetalhamentoOrdemServico(os));
    }
    
    // ===== LISTAGEM =====
    
    @GetMapping
    public ResponseEntity<Page<DadosListagemOrdemServico>> listarTodas(
            @PageableDefault(size = 10, sort = {"dataAbertura"}) Pageable paginacao) {
        
        var page = repository.findAll(paginacao)
                .map(DadosListagemOrdemServico::new);
        return ResponseEntity.ok(page);
    }
    
    @GetMapping("/abertas")
    public ResponseEntity<List<DadosDetalhamentoOrdemServico>> listarAbertas() {
        var abertas = service.listarOrdenadasPorPrioridade();
        var dtos = abertas.stream()
                .map(DadosDetalhamentoOrdemServico::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<Page<DadosListagemOrdemServico>> listarPorStatus(
            @PathVariable StatusOrdemServico status,
            @PageableDefault(size = 10, sort = {"dataAbertura"}) Pageable paginacao) {
        
        var page = service.listarPorStatus(status, paginacao)
                .map(DadosListagemOrdemServico::new);
        return ResponseEntity.ok(page);
    }
    
    @GetMapping("/tecnico/{tecnicoId}")
    public ResponseEntity<Page<DadosListagemOrdemServico>> listarPorTecnico(
            @PathVariable Long tecnicoId,
            @PageableDefault(size = 10) Pageable paginacao) {
        
        var page = service.listarPorTecnico(tecnicoId, paginacao)
                .map(DadosListagemOrdemServico::new);
        return ResponseEntity.ok(page);
    }
    
    @GetMapping("/setor/{setor}")
    public ResponseEntity<List<DadosListagemOrdemServico>> listarPorSetor(
            @PathVariable String setor) {
        
        var lista = service.listarPorSetor(setor);
        var dtos = lista.stream()
                .map(DadosListagemOrdemServico::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity obterPorId(@PathVariable Long id) {
        var os = repository.findById(id);
        if (os.isPresent()) {
            return ResponseEntity.ok(new DadosDetalhamentoOrdemServico(os.get()));
        }
        return ResponseEntity.notFound().build();
    }
    
    // ===== ATUALIZAÇÃO =====
    
    @PutMapping("/status")
    @Transactional
    public ResponseEntity atualizarStatus(@RequestBody @Valid DadosAtualizacaoStatusOS dados) {
        service.atualizarStatus(dados);
        var os = repository.getReferenceById(dados.id());
        return ResponseEntity.ok(new DadosDetalhamentoOrdemServico(os));
    }
    
    /**
     * Atualiza uma Ordem de Serviço
     * Permite atualizar: descrição, status, técnico e observações
     */
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity atualizarOrdemServico(
            @PathVariable Long id,
            @RequestBody @Valid DadosAtualizacaoOrdemServico dados) {
        
        try {
            var osAtualizada = service.atualizarInformacoes(new DadosAtualizacaoOrdemServico(
                    id,
                    dados.descricao(),
                    dados.status(),
                    dados.tecnicoId(),
                    dados.observacoes()
            ));
            return ResponseEntity.ok(new DadosDetalhamentoOrdemServico(osAtualizada));
        } catch (RecursoNaoEncontradoException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
    
    // ===== HISTÓRICO =====
    
    @GetMapping("/{id}/historico")
    public ResponseEntity<List<HistoricoStatus>> obterHistoricoOS(@PathVariable Long id) {
        var historico = service.obterHistoricoOS(id);
        return ResponseEntity.ok(historico);
    }
    
    // ===== RELATÓRIOS =====
    
    @GetMapping("/relatorios/top-prioridade")
    public ResponseEntity<List<DadosDetalhamentoOrdemServico>> relatorioTopPrioridade(
            @RequestParam(defaultValue = "10") int limite) {
        
        var top = service.relatorioOSPorPrioridade(limite);
        var dtos = top.stream()
                .map(DadosDetalhamentoOrdemServico::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/relatorios/setores-com-abertas")
    public ResponseEntity<List<String>> relatorioSetoresComAbertas() {
        var setores = service.relatorioSetoresComOSAbertas();
        return ResponseEntity.ok(setores);
    }
    
    // ===== EXCLUSÃO (LÓGICA) =====
    
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity cancelarOS(@PathVariable Long id) {
        var os = repository.findById(id);
        if (os.isPresent()) {
            service.atualizarStatus(new DadosAtualizacaoStatusOS(id, StatusOrdemServico.CANCELADA, "Cancelada"));
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

