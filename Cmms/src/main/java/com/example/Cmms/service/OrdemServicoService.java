package com.example.Cmms.service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Cmms.domain.ordemservico.DadosAtualizacaoOrdemServico;
import com.example.Cmms.domain.ordemservico.DadosAtualizacaoStatusOS;
import com.example.Cmms.domain.ordemservico.DadosCadastroOSCorretiva;
import com.example.Cmms.domain.ordemservico.DadosCadastroOSPreventiva;
import com.example.Cmms.domain.ordemservico.HistoricoStatus;
import com.example.Cmms.domain.ordemservico.HistoricoStatusRepository;
import com.example.Cmms.domain.ordemservico.OSCorretiva;
import com.example.Cmms.domain.ordemservico.OSPreventiva;
import com.example.Cmms.domain.ordemservico.OrdemServico;
import com.example.Cmms.domain.ordemservico.OrdemServicoRepository;
import com.example.Cmms.domain.ordemservico.StatusOrdemServico;
import com.example.Cmms.domain.ordemservico.TipoOrdemServico;
import com.example.Cmms.domain.tecnico.TecnicoRepository;
import com.example.Cmms.exception.RecursoNaoEncontradoException;

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
    
    /**
     * Atualiza os dados de uma Ordem de Serviço
     * @param dados DTO com os dados a atualizar
     * @return OrdemServico atualizada
     */
    @Transactional
    public OrdemServico atualizarInformacoes(DadosAtualizacaoOrdemServico dados) {
        // Validar se a OS existe
        var os = repository.findById(dados.id())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Ordem de Serviço não encontrada com ID: " + dados.id()));
        
        // Se for atualizar o técnico, validar se técnico existe e está disponível
        if (dados.tecnicoId() != null && !dados.tecnicoId().equals(os.getTecnicoId())) {
            var tecnico = tecnicoRepository.findById(dados.tecnicoId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Técnico não encontrado com ID: " + dados.tecnicoId()));
            
            if (!tecnico.podeAbrirOS()) {
                throw new IllegalArgumentException("Técnico não está disponível. Status: " + tecnico.getStatus());
            }
        }
        
        // Armazenar status anterior para o histórico
        StatusOrdemServico statusAnterior = os.getStatus();
        
        // Atualizar informações
        os.atualizarInformacoes(dados);
        
        // Se o status mudou, registrar no histórico
        if (!statusAnterior.equals(os.getStatus())) {
            historicoRepository.save(new HistoricoStatus(dados.id(), os.getStatus(), dados.observacoes() != null ? dados.observacoes() : "Atualizado"));
        }
        
        return repository.save(os);
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

