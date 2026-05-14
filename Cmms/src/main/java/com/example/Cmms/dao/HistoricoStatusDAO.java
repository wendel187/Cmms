package com.example.Cmms.dao;

import com.example.Cmms.connection.ConnectionFactory;
import com.example.Cmms.model.HistoricoStatus;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class HistoricoStatusDAO {

    public void registrar(HistoricoStatus historico) throws SQLException {
        String sql = "INSERT INTO historico_status (ordem_servico_id, status, data_hora, observacoes) " +
                     "VALUES (?, ?, NOW(), ?)";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setLong(1, historico.getOrdemServicoId());
            ps.setString(2, historico.getStatus());
            ps.setString(3, historico.getObservacoes());
            ps.executeUpdate();
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) historico.setId(rs.getLong(1));
            }
        }
    }

    public List<HistoricoStatus> listarPorOS(Long osId) throws SQLException {
        List<HistoricoStatus> lista = new ArrayList<>();
        String sql = "SELECT * FROM historico_status WHERE ordem_servico_id = ? ORDER BY data_hora DESC";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, osId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) lista.add(mapear(rs));
            }
        }
        return lista;
    }

    private HistoricoStatus mapear(ResultSet rs) throws SQLException {
        HistoricoStatus h = new HistoricoStatus();
        h.setId(rs.getLong("id"));
        h.setOrdemServicoId(rs.getLong("ordem_servico_id"));
        h.setStatus(rs.getString("status"));
        h.setObservacoes(rs.getString("observacoes"));
        Timestamp ts = rs.getTimestamp("data_hora");
        if (ts != null) h.setDataHora(ts.toLocalDateTime());
        return h;
    }
}
