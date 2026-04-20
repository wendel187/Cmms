package com.example.Cmms.service;

import com.example.Cmms.domain.ordemservico.*;
import com.example.Cmms.domain.tecnico.TecnicoRepository;
import com.example.Cmms.exception.RecursoNaoEncontradoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrdemServicoService {
    
    @Autowired
    private OrdemServicoRepository repository;
    
    @Autowired
    private HistoricoStatusRepository historicoRepository;
    
    @Autowired
    private TecnicoRepository tecnicoRepository;
    
    @Transactional
    public OSCorretiva criarOSCorretiva(DadosCadastroOSCorretiva dados) {
        // Validar se técnico existe e está disponível
        var tecnico = tecnicoRepository.findById(dados.tecnicoId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Técnico não encontrado com ID: " + dados.tecnicoId()));
        
        if (!tecnico.podeAbrirOS()) {
            throw new IllegalArgumentException("Técnico não está disponível para abrir uma OS. Status: " + tecnico.getStatus());
        }
        
        OSCorretiva os = new OSCorretiva();
        os.setEquipamentoId(dados.equipamentoId());
        os.setTecnicoId(dados.tecnicoId());
        os.setDescricao(dados.descricao());
        os.setDescricaoFalha(dados.descricaoFalha());
        os.setSetor(dados.setor());
        os.setFalhaTotal(dados.falhaTotal());
        os.setNivelCriticidade(dados.nivelCriticidade());
        os.setStatus(StatusOrdemServico.ABERTA);
        os.setTipo(TipoOrdemServico.CORRETIVA);
        
        os = repository.save(os);
        
        // Registrar no histórico
        historicoRepository.save(new HistoricoStatus(os.getId(), StatusOrdemServico.ABERTA, "Ordem criada por " + tecnico.getNome()));
        
        return os;
    }
    
    @Transactional
    public OSPreventiva criarOSPreventiva(DadosCadastroOSPreventiva dados) {
        // Validar se técnico existe e está disponível
        var tecnico = tecnicoRepository.findById(dados.tecnicoId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Técnico não encontrado com ID: " + dados.tecnicoId()));
        
        if (!tecnico.podeAbrirOS()) {
            throw new IllegalArgumentException("Técnico não está disponível para abrir uma OS. Status: " + tecnico.getStatus());
        }
        
        OSPreventiva os = new OSPreventiva();
        os.setEquipamentoId(dados.equipamentoId());
        os.setTecnicoId(dados.tecnicoId());
        os.setDescricao(dados.descricao());
        os.setSetor(dados.setor());
        os.setDataPrevista(dados.dataPrevista());
        os.setPeriodicidadeDias(dados.periodicidadeDias());
        os.setUltimaManutencao(dados.ultimaManutencao());
        os.setStatus(StatusOrdemServico.ABERTA);
        os.setTipo(TipoOrdemServico.PREVENTIVA);
        
        os = repository.save(os);
        
        // Registrar no histórico
        historicoRepository.save(new HistoricoStatus(os.getId(), StatusOrdemServico.ABERTA, "Ordem criada por " + tecnico.getNome()));
        
        return os;
    }
    
    @Transactional
    public void atualizarStatus(DadosAtualizacaoStatusOS dados) {
        var os = repository.getReferenceById(dados.id());
        os.atualizarStatus(dados.novoStatus());
        repository.save(os);
        
        // Registrar no histórico
        historicoRepository.save(new HistoricoStatus(dados.id(), dados.novoStatus(), dados.observacoes()));
    }
    
    public List<OrdemServico> listarOrdenadasPorPrioridade() {
        var todasAbiertas = repository.findAllAbertasOrdenadas();
        return todasAbiertas.stream()
                .sorted(Comparator.comparingInt(OrdemServico::calcularPrioridade).reversed())
                .collect(Collectors.toList());
    }
    
    public Page<OrdemServico> listarPorStatus(StatusOrdemServico status, Pageable pageable) {
        return repository.findByStatus(status, pageable);
    }
    
    public Page<OrdemServico> listarPorTecnico(Long tecnicoId, Pageable pageable) {
        return repository.findByTecnicoId(tecnicoId, pageable);
    }
    
    public List<OrdemServico> listarPorSetor(String setor) {
        return repository.findBySetor(setor);
    }
    
    public List<HistoricoStatus> obterHistoricoOS(Long osId) {
        return historicoRepository.findByOrdemServicoIdOrderByDataHoraDesc(osId);
    }
    
    // RELATÓRIO: Top N OS por prioridade
    public List<OrdemServico> relatorioOSPorPrioridade(int limite) {
        return listarOrdenadasPorPrioridade()
                .stream()
                .limit(limite)
                .collect(Collectors.toList());
    }
    
    // RELATÓRIO: OS abertas por setor
    public List<String> relatorioSetoresComOSAbertas() {
        var abiertas = repository.findByStatus(StatusOrdemServico.ABERTA, Pageable.unpaged());
        return abiertas.getContent()
                .stream()
                .map(OrdemServico::getSetor)
                .distinct()
                .collect(Collectors.toList());
    }
}

