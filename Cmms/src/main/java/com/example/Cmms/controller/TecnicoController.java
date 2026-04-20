package com.example.Cmms.controller;

import com.example.Cmms.domain.tecnico.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tecnico")
public class TecnicoController {
    
    @Autowired
    private TecnicoRepository repository;
    
    @PostMapping
    @Transactional
    public ResponseEntity cadastrarTecnico(
            @RequestBody @Valid DadosCadastroTecnico dados,
            UriComponentsBuilder uriBuilder) {
        
        var tecnico = new Tecnico(
                null,
                dados.nome(),
                dados.email(),
                dados.telefone(),
                dados.especialidade(),
                dados.setor(),
                dados.status(),
                null,
                true
        );
        repository.save(tecnico);
        var uri = uriBuilder
                .path("/tecnico/{id}")
                .buildAndExpand(tecnico.getId())
                .toUri();
        
        var dto = new DadosDetalhamentoTecnico(tecnico);
        return ResponseEntity.created(uri).body(dto);
    }
    
    @GetMapping
    public ResponseEntity<Page<DadosListagemTecnico>> listarTecnicos(
            @PageableDefault(size = 10, sort = {"nome"}) Pageable paginacao) {
        var page = repository.findByAtivoTrue(paginacao)
                .map(DadosListagemTecnico::new);
        return ResponseEntity.ok(page);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity obterTecnicoPorId(@PathVariable Long id) {
        var tecnico = repository.findById(id);
        if (tecnico.isPresent() && tecnico.get().isAtivo()) {
            return ResponseEntity.ok(new DadosDetalhamentoTecnico(tecnico.get()));
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<Page<DadosListagemTecnico>> listarPorStatus(
            @PathVariable StatusTecnico status,
            @PageableDefault(size = 10, sort = {"nome"}) Pageable paginacao) {
        var page = repository.findByStatus(status, paginacao)
                .map(DadosListagemTecnico::new);
        return ResponseEntity.ok(page);
    }
    
    @GetMapping("/setor/{setor}")
    public ResponseEntity<java.util.List<DadosListagemTecnico>> listarPorSetor(
            @PathVariable String setor) {
        var tecnicos = repository.findBySetorAndAtivoTrue(setor);
        var dtos = tecnicos.stream()
                .map(DadosListagemTecnico::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @PutMapping
    @Transactional
    public ResponseEntity atualizarTecnico(
            @RequestBody @Valid DadosAtualizacaoTecnico dados) {
        var tecnico = repository.getReferenceById(dados.id());
        tecnico.atualizarInformacoes(dados);
        return ResponseEntity.ok(new DadosDetalhamentoTecnico(tecnico));
    }
    
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity desativarTecnico(@PathVariable Long id) {
        var tecnico = repository.getReferenceById(id);
        tecnico.desativar();
        return ResponseEntity.noContent().build();
    }
}

