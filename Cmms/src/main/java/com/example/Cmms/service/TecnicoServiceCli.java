package com.example.Cmms.service;

import com.example.Cmms.dao.TecnicoDAO;
import com.example.Cmms.model.Tecnico;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

/**
 * Serviço de Técnicos para a camada console.
 * Contém validações e regras; não possui SQL.
 */
public class TecnicoServiceCli {

    private static final List<String> STATUS_VALIDOS =
            List.of("DISPONIVEL", "EM_MANUTENCAO", "AUSENTE", "INDISPONIVEL");

    private final TecnicoDAO tecnicoDAO = new TecnicoDAO();

    public Tecnico cadastrar(String nome, String email, String telefone,
                             String especialidade, String setor) throws SQLException {
        Tecnico t = new Tecnico(nome, email, especialidade, setor);
        t.setTelefone(telefone);
        tecnicoDAO.salvar(t);
        return t;
    }

    public List<Tecnico> listarAtivos() throws SQLException {
        return tecnicoDAO.listarAtivos();
    }

    public Optional<Tecnico> buscarPorId(Long id) throws SQLException {
        if (id == null || id <= 0) throw new IllegalArgumentException("ID inválido");
        return tecnicoDAO.buscarPorId(id);
    }

    public void atualizar(Long id, String nome, String telefone,
                          String especialidade, String setor, String status) throws SQLException {
        if (!STATUS_VALIDOS.contains(status.toUpperCase()))
            throw new IllegalArgumentException("Status inválido. Use: " + STATUS_VALIDOS);
        Tecnico t = tecnicoDAO.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Técnico não encontrado: " + id));
        t.setNome(nome);
        t.setTelefone(telefone);
        t.setEspecialidade(especialidade);
        t.setSetor(setor);
        t.setStatus(status.toUpperCase());
        tecnicoDAO.atualizar(t);
    }

    public void desativar(Long id) throws SQLException {
        tecnicoDAO.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Técnico não encontrado: " + id));
        tecnicoDAO.desativar(id);
    }

    public List<Tecnico> listarPorStatus(String status) throws SQLException {
        return tecnicoDAO.listarPorStatus(status.toUpperCase());
    }

    public List<Tecnico> listarPorSetor(String setor) throws SQLException {
        return tecnicoDAO.listarPorSetor(setor);
    }
}
