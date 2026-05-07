package com.example.Cmms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Cmms.domain.equipamento.Criticidade;
import com.example.Cmms.domain.equipamento.DadosAtualizacaoEquipamento;
import com.example.Cmms.domain.equipamento.DadosCadastroEquipamento;
import com.example.Cmms.domain.equipamento.Equipamento;
import com.example.Cmms.domain.equipamento.EquipamentoRepository;
import com.example.Cmms.domain.equipamento.Status;
import com.example.Cmms.exception.RecursoNaoEncontradoException;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Serviço de Equipamento - Responsável pela lógica de negócio
 * Camada de serviço que intermediária entre Controller e Repository
 */
@Service
public class EquipamentoService {
    
    @Autowired
    private EquipamentoRepository repository;
    
    /**
     * Criar um novo equipamento
     */
    @Transactional
    public Equipamento criarEquipamento(DadosCadastroEquipamento dados) {
        var equipamento = new Equipamento(dados);
        return repository.save(equipamento);
    }
    
    /**
     * Buscar um equipamento por ID
     */
    public Equipamento buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Equipamento não encontrado com ID: " + id));
    }
    
    /**
     * Buscar equipamento por código
     */
    public Equipamento buscarPorCodigo(String codigo) {
        return repository.findByCodigo(codigo)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Equipamento não encontrado com código: " + codigo));
    }
    
    /**
     * Listar todos os equipamentos ativos
     */
    public Page<Equipamento> listarTodos(Pageable pageable) {
        return repository.findByStatus(Status.ATIVO, pageable);
    }
    
    /**
     * Listar equipamentos por status
     */
    public Page<Equipamento> listarPorStatus(Status status, Pageable pageable) {
        return repository.findByStatus(status, pageable);
    }
    
    /**
     * Listar equipamentos por criticidade
     */
    public Page<Equipamento> listarPorCriticidade(Criticidade criticidade, Pageable pageable) {
        return repository.findByCriticidade(criticidade, pageable);
    }
    
    /**
     * Listar equipamentos por setor
     */
    public Page<Equipamento> listarPorSetor(String setor, Pageable pageable) {
        return repository.findBySetorAndStatus(setor, Status.ATIVO, pageable);
    }
    
    /**
     * Listar equipamentos críticos
     */
    public List<Equipamento> listarEquipamentosCriticos() {
        return repository.findByCriticidade(Criticidade.CRITICA, Pageable.unpaged())
                .getContent()
                .stream()
                .filter(e -> e.getStatus() == Status.ATIVO)
                .collect(Collectors.toList());
    }
    
    /**
     * Listar equipamentos em manutenção
     */
    public List<Equipamento> listarEmManutencao() {
        return repository.findByStatus(Status.MANUTENCAO, Pageable.unpaged())
                .getContent();
    }
    
    /**
     * Atualizar informações de um equipamento
     */
    @Transactional
    public Equipamento atualizar(Long id, DadosAtualizacaoEquipamento dados) {
        var equipamento = buscarPorId(id);
        equipamento.atualizarInformacoes(dados);
        return repository.save(equipamento);
    }
    
    /**
     * Atualizar status de um equipamento
     */
    @Transactional
    public Equipamento atualizarStatus(Long id, Status novoStatus) {
        var equipamento = buscarPorId(id);
        equipamento.setStatus(novoStatus);
        return repository.save(equipamento);
    }
    
    /**
     * Atualizar criticidade de um equipamento
     */
    @Transactional
    public Equipamento atualizarCriticidade(Long id, Criticidade novaCriticidade) {
        var equipamento = buscarPorId(id);
        equipamento.setCriticidade(novaCriticidade);
        return repository.save(equipamento);
    }
    
    /**
     * Desativar um equipamento (exclusão lógica)
     */
    @Transactional
    public void desativar(Long id) {
        var equipamento = buscarPorId(id);
        equipamento.setStatus(Status.INATIVO);
        repository.save(equipamento);
    }
    
    /**
     * Deletar um equipamento fisicamente
     */
    @Transactional
    public void deletar(Long id) {
        var equipamento = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Equipamento não encontrado com ID: " + id));
        repository.delete(equipamento);
    }
    
    /**
     * Contar equipamentos ativos
     */
    public long contarAtivos() {
        return repository.findByStatus(Status.ATIVO, Pageable.unpaged()).getTotalElements();
    }
    
    /**
     * Contar equipamentos críticos ativos
     */
    public long contarCriticos() {
        return repository.findByCriticidade(Criticidade.CRITICA, Pageable.unpaged()).getTotalElements();
    }
    
    /**
     * Obter relatório de equipamentos por criticidade
     */
    public List<String> relatorioEquipamentosPorCriticidade() {
        return List.of(
                "CRITICA: " + repository.findByCriticidade(Criticidade.CRITICA, Pageable.unpaged()).getTotalElements(),
                "ALTA: " + repository.findByCriticidade(Criticidade.ALTA, Pageable.unpaged()).getTotalElements(),
                "MEDIA: " + repository.findByCriticidade(Criticidade.MEDIA, Pageable.unpaged()).getTotalElements(),
                "BAIXA: " + repository.findByCriticidade(Criticidade.BAIXA, Pageable.unpaged()).getTotalElements()
        );
    }
}

