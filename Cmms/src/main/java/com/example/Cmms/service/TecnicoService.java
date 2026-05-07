package com.example.Cmms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Cmms.domain.tecnico.DadosAtualizacaoTecnico;
import com.example.Cmms.domain.tecnico.DadosCadastroTecnico;
import com.example.Cmms.domain.tecnico.StatusTecnico;
import com.example.Cmms.domain.tecnico.Tecnico;
import com.example.Cmms.domain.tecnico.TecnicoRepository;
import com.example.Cmms.exception.RecursoNaoEncontradoException;

import java.util.List;

/**
 * Serviço de Técnico - Responsável pela lógica de negócio
 * Camada de serviço que intermediária entre Controller e Repository
 */
@Service
public class TecnicoService {
    
    @Autowired
    private TecnicoRepository repository;
    
    /**
     * Criar um novo técnico
     */
    @Transactional
    public Tecnico criarTecnico(DadosCadastroTecnico dados) {
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
        return repository.save(tecnico);
    }
    
    /**
     * Buscar um técnico por ID
     */
    public Tecnico buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Técnico não encontrado com ID: " + id));
    }
    
    /**
     * Listar todos os técnicos ativos
     */
    public Page<Tecnico> listarTodos(Pageable pageable) {
        return repository.findByAtivo(true, pageable);
    }
    
    /**
     * Listar técnicos por status
     */
    public Page<Tecnico> listarPorStatus(StatusTecnico status, Pageable pageable) {
        return repository.findByStatusAndAtivo(status, true, pageable);
    }
    
    /**
     * Listar técnicos por setor
     */
    public Page<Tecnico> listarPorSetor(String setor, Pageable pageable) {
        return repository.findBySetorAndAtivo(setor, true, pageable);
    }
    
    /**
     * Listar técnicos disponíveis para abertura de OS
     */
    public List<Tecnico> listarDisponiveisParaOS() {
        return repository.findByAtivoAndStatusIn(true, List.of(
                StatusTecnico.DISPONIVEL,
                StatusTecnico.EM_MANUTENCAO
        ));
    }
    
    /**
     * Atualizar informações de um técnico
     */
    @Transactional
    public Tecnico atualizar(Long id, DadosAtualizacaoTecnico dados) {
        var tecnico = buscarPorId(id);
        tecnico.atualizarInformacoes(dados);
        return repository.save(tecnico);
    }
    
    /**
     * Atualizar status de um técnico
     */
    @Transactional
    public Tecnico atualizarStatus(Long id, StatusTecnico novoStatus) {
        var tecnico = buscarPorId(id);
        tecnico.setStatus(novoStatus);
        return repository.save(tecnico);
    }
    
    /**
     * Desativar um técnico (exclusão lógica)
     */
    @Transactional
    public void desativar(Long id) {
        var tecnico = buscarPorId(id);
        tecnico.desativar();
        repository.save(tecnico);
    }
    
    /**
     * Deletar um técnico fisicamente (apenas se nunca teve OS)
     */
    @Transactional
    public void deletar(Long id) {
        var tecnico = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Técnico não encontrado com ID: " + id));
        repository.delete(tecnico);
    }
    
    /**
     * Contar técnicos ativos
     */
    public long contarAtivos() {
        return repository.countByAtivo(true);
    }
}

