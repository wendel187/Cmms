package com.example.Cmms.dao;

import com.example.Cmms.connection.ConnectionFactory;
import com.example.Cmms.model.Tecnico;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class TecnicoDAO {

    public void salvar(Tecnico tecnico) throws SQLException {
        String sql = "INSERT INTO tecnicos (nome, email, telefone, especialidade, setor, status, data_cadastro, ativo) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, tecnico.getNome());
            ps.setString(2, tecnico.getEmail());
            ps.setString(3, tecnico.getTelefone());
            ps.setString(4, tecnico.getEspecialidade());
            ps.setString(5, tecnico.getSetor());
            ps.setString(6, tecnico.getStatus() != null ? tecnico.getStatus() : "DISPONIVEL");
            LocalDate dc = tecnico.getDataCadastro() != null ? tecnico.getDataCadastro() : LocalDate.now();
            ps.setDate(7, Date.valueOf(dc));
            ps.setBoolean(8, tecnico.isAtivo());
            ps.executeUpdate();
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) tecnico.setId(rs.getLong(1));
            }
        }
    }

    public List<Tecnico> listarAtivos() throws SQLException {
        List<Tecnico> lista = new ArrayList<>();
        String sql = "SELECT * FROM tecnicos WHERE ativo = true ORDER BY nome";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) lista.add(mapear(rs));
        }
        return lista;
    }

    public Optional<Tecnico> buscarPorId(Long id) throws SQLException {
        String sql = "SELECT * FROM tecnicos WHERE id = ?";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.of(mapear(rs));
            }
        }
        return Optional.empty();
    }

    public void atualizar(Tecnico tecnico) throws SQLException {
        String sql = "UPDATE tecnicos SET nome = ?, telefone = ?, especialidade = ?, setor = ?, status = ? WHERE id = ?";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, tecnico.getNome());
            ps.setString(2, tecnico.getTelefone());
            ps.setString(3, tecnico.getEspecialidade());
            ps.setString(4, tecnico.getSetor());
            ps.setString(5, tecnico.getStatus());
            ps.setLong(6, tecnico.getId());
            ps.executeUpdate();
        }
    }

    public void desativar(Long id) throws SQLException {
        String sql = "UPDATE tecnicos SET ativo = false, status = 'INDISPONIVEL' WHERE id = ?";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        }
    }

    public List<Tecnico> listarPorStatus(String status) throws SQLException {
        List<Tecnico> lista = new ArrayList<>();
        String sql = "SELECT * FROM tecnicos WHERE status = ? AND ativo = true";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) lista.add(mapear(rs));
            }
        }
        return lista;
    }

    public List<Tecnico> listarPorSetor(String setor) throws SQLException {
        List<Tecnico> lista = new ArrayList<>();
        String sql = "SELECT * FROM tecnicos WHERE setor = ? AND ativo = true";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, setor);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) lista.add(mapear(rs));
            }
        }
        return lista;
    }

    private Tecnico mapear(ResultSet rs) throws SQLException {
        Tecnico t = new Tecnico();
        t.setId(rs.getLong("id"));
        t.setNome(rs.getString("nome"));
        t.setEmail(rs.getString("email"));
        t.setTelefone(rs.getString("telefone"));
        t.setEspecialidade(rs.getString("especialidade"));
        t.setSetor(rs.getString("setor"));
        t.setStatus(rs.getString("status"));
        t.setAtivo(rs.getBoolean("ativo"));
        Date dc = rs.getDate("data_cadastro");
        if (dc != null) t.setDataCadastro(dc.toLocalDate());
        return t;
    }
}
