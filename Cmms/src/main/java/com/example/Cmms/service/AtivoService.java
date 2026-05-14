package com.example.Cmms.service;

import com.example.Cmms.dao.AtivoDAO;
import com.example.Cmms.model.Ativo;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Serviço de Ativos — contém validações e regras de negócio.
 * Não possui SQL: delega ao AtivoDAO.
 */
public class AtivoService {

    private static final List<String> CRITICIDADES = List.of("BAIXA", "MEDIA", "ALTA", "CRITICA");
    private static final List<String> STATUS_VALIDOS = List.of("ATIVO", "INATIVO", "QUEBRADO", "MANUTENCAO");

    private final AtivoDAO ativoDAO = new AtivoDAO();

    public Ativo cadastrar(String nome, String codigo, String criticidade, String setor) throws SQLException {
        validarCriticidade(criticidade);
        Ativo ativo = new Ativo(nome, codigo, criticidade.toUpperCase(), setor);
        ativoDAO.salvar(ativo);
        return ativo;
    }

    public List<Ativo> listarTodos() throws SQLException {
        return ativoDAO.listarTodos();
    }

    public Optional<Ativo> buscarPorId(Long id) throws SQLException {
        if (id == null || id <= 0) throw new IllegalArgumentException("ID inválido");
        return ativoDAO.buscarPorId(id);
    }

    public void atualizar(Long id, String nome, String criticidade, String setor, String status) throws SQLException {
        validarCriticidade(criticidade);
        if (!STATUS_VALIDOS.contains(status.toUpperCase()))
            throw new IllegalArgumentException("Status inválido. Use: " + STATUS_VALIDOS);
        Ativo ativo = ativoDAO.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Ativo não encontrado: " + id));
        ativo.setNome(nome);
        ativo.setCriticidade(criticidade.toUpperCase());
        ativo.setSetor(setor);
        ativo.setStatus(status.toUpperCase());
        ativoDAO.atualizar(ativo);
    }

    public void excluir(Long id) throws SQLException {
        ativoDAO.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Ativo não encontrado: " + id));
        ativoDAO.excluir(id);
    }

    public List<Ativo> listarPorSetor(String setor) throws SQLException {
        return ativoDAO.listarPorSetor(setor);
    }

    public List<Ativo> listarPorCriticidade(String criticidade) throws SQLException {
        validarCriticidade(criticidade);
        return ativoDAO.listarPorCriticidade(criticidade.toUpperCase());
    }

    public Map<String, Long> relatorioAtivosporCriticidade() throws SQLException {
        return ativoDAO.relatorioPorCriticidade();
    }

    private void validarCriticidade(String criticidade) {
        if (!CRITICIDADES.contains(criticidade.toUpperCase()))
            throw new IllegalArgumentException("Criticidade inválida. Use: " + CRITICIDADES);
    }
}
