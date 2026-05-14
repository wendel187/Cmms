package com.example.Cmms.dao;

import com.example.Cmms.connection.ConnectionFactory;
import com.example.Cmms.model.Ativo;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * DAO de Ativos (equipamentos). Usa apenas JDBC + PreparedStatement — sem ORM.
 */
public class AtivoDAO {

    public void salvar(Ativo ativo) throws SQLException {
        String sql = "INSERT INTO equipamentos (nome, codigo, status, criticidade, setor, data_aquisicao) " +
                     "VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, ativo.getNome());
            ps.setString(2, ativo.getCodigo());
            ps.setString(3, ativo.getStatus() != null ? ativo.getStatus() : "ATIVO");
            ps.setString(4, ativo.getCriticidade());
            ps.setString(5, ativo.getSetor());
            ps.setDate(6, ativo.getDataAquisicao() != null ? Date.valueOf(ativo.getDataAquisicao()) : null);
            ps.executeUpdate();
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) ativo.setId(rs.getLong(1));
            }
        }
    }

    public List<Ativo> listarTodos() throws SQLException {
        List<Ativo> lista = new ArrayList<>();
        String sql = "SELECT * FROM equipamentos WHERE status != 'INATIVO' ORDER BY nome";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) lista.add(mapear(rs));
        }
        return lista;
    }

    public Optional<Ativo> buscarPorId(Long id) throws SQLException {
        String sql = "SELECT * FROM equipamentos WHERE id = ?";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.of(mapear(rs));
            }
        }
        return Optional.empty();
    }

    public void atualizar(Ativo ativo) throws SQLException {
        String sql = "UPDATE equipamentos SET nome = ?, criticidade = ?, setor = ?, status = ? WHERE id = ?";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, ativo.getNome());
            ps.setString(2, ativo.getCriticidade());
            ps.setString(3, ativo.getSetor());
            ps.setString(4, ativo.getStatus());
            ps.setLong(5, ativo.getId());
            ps.executeUpdate();
        }
    }

    public void excluir(Long id) throws SQLException {
        String sql = "UPDATE equipamentos SET status = 'INATIVO' WHERE id = ?";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        }
    }

    public List<Ativo> listarPorSetor(String setor) throws SQLException {
        List<Ativo> lista = new ArrayList<>();
        String sql = "SELECT * FROM equipamentos WHERE setor = ? AND status != 'INATIVO'";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, setor);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) lista.add(mapear(rs));
            }
        }
        return lista;
    }

    public List<Ativo> listarPorCriticidade(String criticidade) throws SQLException {
        List<Ativo> lista = new ArrayList<>();
        String sql = "SELECT * FROM equipamentos WHERE criticidade = ? AND status != 'INATIVO'";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, criticidade);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) lista.add(mapear(rs));
            }
        }
        return lista;
    }

    // Relatório: contagem de ativos por nível de criticidade
    public Map<String, Long> relatorioPorCriticidade() throws SQLException {
        Map<String, Long> resultado = new LinkedHashMap<>();
        String sql = "SELECT criticidade, COUNT(*) AS total FROM equipamentos " +
                     "WHERE status != 'INATIVO' GROUP BY criticidade " +
                     "ORDER BY FIELD(criticidade, 'CRITICA','ALTA','MEDIA','BAIXA')";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                resultado.put(rs.getString("criticidade"), rs.getLong("total"));
            }
        }
        return resultado;
    }

    private Ativo mapear(ResultSet rs) throws SQLException {
        Ativo a = new Ativo();
        a.setId(rs.getLong("id"));
        a.setNome(rs.getString("nome"));
        a.setCodigo(rs.getString("codigo"));
        a.setStatus(rs.getString("status"));
        a.setCriticidade(rs.getString("criticidade"));
        a.setSetor(rs.getString("setor"));
        Date data = rs.getDate("data_aquisicao");
        if (data != null) a.setDataAquisicao(data.toLocalDate());
        return a;
    }
}
