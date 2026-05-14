package com.example.Cmms.dao;

import com.example.Cmms.connection.ConnectionFactory;
import com.example.Cmms.model.*;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * DAO de Ordens de Serviço com JDBC puro.
 * A desserialização do ResultSet instancia OSCorretiva ou OSPreventiva
 * com base na coluna tipo_os — demonstrando polimorfismo em tempo de execução.
 */
public class OrdemServicoDAO {

    private final HistoricoStatusDAO historicoDAO = new HistoricoStatusDAO();

    // ── Salvar ─────────────────────────────────────────────────────────────────

    public void salvarCorretiva(OSCorretiva os) throws SQLException {
        String sql = "INSERT INTO ordens_servico " +
                     "(tipo_os, equipamento_id, tecnico_id, descricao, status, setor, " +
                     " descricao_falha, falha_total, nivel_criticidade) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, "CORRETIVA");
            ps.setLong(2, os.getEquipamentoId());
            ps.setObject(3, os.getTecnicoId());
            ps.setString(4, os.getDescricao());
            ps.setString(5, "ABERTA");
            ps.setString(6, os.getSetor());
            ps.setString(7, os.getDescricaoFalha());
            ps.setBoolean(8, os.isFalhaTotal());
            ps.setInt(9, os.getNivelCriticidade());
            ps.executeUpdate();
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    os.setId(rs.getLong(1));
                    historicoDAO.registrar(new HistoricoStatus(os.getId(), "ABERTA", "OS Corretiva criada"));
                }
            }
        }
    }

    public void salvarPreventiva(OSPreventiva os) throws SQLException {
        String sql = "INSERT INTO ordens_servico " +
                     "(tipo_os, equipamento_id, tecnico_id, descricao, status, setor, " +
                     " data_prevista, periodicidade_dias, ultima_manutencao) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, "PREVENTIVA");
            ps.setLong(2, os.getEquipamentoId());
            ps.setObject(3, os.getTecnicoId());
            ps.setString(4, os.getDescricao());
            ps.setString(5, "ABERTA");
            ps.setString(6, os.getSetor());
            ps.setDate(7, Date.valueOf(os.getDataPrevista()));
            ps.setInt(8, os.getPeriodicidadeDias());
            ps.setDate(9, os.getUltimaManutencao() != null ? Date.valueOf(os.getUltimaManutencao()) : null);
            ps.executeUpdate();
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    os.setId(rs.getLong(1));
                    historicoDAO.registrar(new HistoricoStatus(os.getId(), "ABERTA", "OS Preventiva criada"));
                }
            }
        }
    }

    // ── Consultas ──────────────────────────────────────────────────────────────

    public List<OrdemServico> listarTodas() throws SQLException {
        List<OrdemServico> lista = new ArrayList<>();
        String sql = "SELECT * FROM ordens_servico ORDER BY data_abertura DESC";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) lista.add(mapear(rs));
        }
        return lista;
    }

    public Optional<OrdemServico> buscarPorId(Long id) throws SQLException {
        String sql = "SELECT * FROM ordens_servico WHERE id = ?";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.of(mapear(rs));
            }
        }
        return Optional.empty();
    }

    public List<OrdemServico> listarAbertas() throws SQLException {
        List<OrdemServico> lista = new ArrayList<>();
        String sql = "SELECT * FROM ordens_servico WHERE status IN ('ABERTA','EM_ANDAMENTO','PAUSADA')";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) lista.add(mapear(rs));
        }
        // Polimorfismo: cada objeto chama seu próprio calcularPrioridade()
        lista.sort(Comparator.comparingInt(OrdemServico::calcularPrioridade).reversed());
        return lista;
    }

    public List<OrdemServico> listarPorEquipamento(Long equipamentoId) throws SQLException {
        List<OrdemServico> lista = new ArrayList<>();
        String sql = "SELECT * FROM ordens_servico WHERE equipamento_id = ? ORDER BY data_abertura DESC";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, equipamentoId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) lista.add(mapear(rs));
            }
        }
        return lista;
    }

    public List<OrdemServico> listarPorTecnico(Long tecnicoId) throws SQLException {
        List<OrdemServico> lista = new ArrayList<>();
        String sql = "SELECT * FROM ordens_servico WHERE tecnico_id = ? ORDER BY data_abertura DESC";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, tecnicoId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) lista.add(mapear(rs));
            }
        }
        return lista;
    }

    public List<OrdemServico> listarPorSetor(String setor) throws SQLException {
        List<OrdemServico> lista = new ArrayList<>();
        String sql = "SELECT * FROM ordens_servico WHERE setor = ? AND status NOT IN ('CANCELADA','CONCLUIDA')";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, setor);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) lista.add(mapear(rs));
            }
        }
        return lista;
    }

    // ── Atualização ────────────────────────────────────────────────────────────

    public void atualizarStatus(Long id, String novoStatus, String observacoes) throws SQLException {
        String sql = "UPDATE ordens_servico SET status = ? WHERE id = ?";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, novoStatus);
            ps.setLong(2, id);
            ps.executeUpdate();
        }
        historicoDAO.registrar(new HistoricoStatus(id, novoStatus, observacoes));
    }

    public void cancelar(Long id) throws SQLException {
        atualizarStatus(id, "CANCELADA", "OS cancelada pelo operador");
    }

    // ── Relatórios ─────────────────────────────────────────────────────────────

    public List<OrdemServico> topNPorPrioridade(int n) throws SQLException {
        List<OrdemServico> abertas = listarAbertas();
        return abertas.size() > n ? abertas.subList(0, n) : abertas;
    }

    public List<String> setoresComOSAbertas() throws SQLException {
        List<String> setores = new ArrayList<>();
        String sql = "SELECT DISTINCT setor FROM ordens_servico " +
                     "WHERE status IN ('ABERTA','EM_ANDAMENTO') ORDER BY setor";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) setores.add(rs.getString("setor"));
        }
        return setores;
    }

    public Map<String, Long> relatorioPorResponsavel() throws SQLException {
        Map<String, Long> resultado = new LinkedHashMap<>();
        String sql = "SELECT t.nome, COUNT(os.id) AS total " +
                     "FROM ordens_servico os " +
                     "JOIN tecnicos t ON os.tecnico_id = t.id " +
                     "WHERE os.status IN ('ABERTA','EM_ANDAMENTO') " +
                     "GROUP BY t.nome ORDER BY total DESC";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) resultado.put(rs.getString("nome"), rs.getLong("total"));
        }
        return resultado;
    }

    // ── Mapeamento ─────────────────────────────────────────────────────────────

    private OrdemServico mapear(ResultSet rs) throws SQLException {
        String tipo = rs.getString("tipo_os");
        OrdemServico os;

        if ("CORRETIVA".equals(tipo)) {
            OSCorretiva c = new OSCorretiva();
            c.setDescricaoFalha(rs.getString("descricao_falha"));
            c.setFalhaTotal(rs.getBoolean("falha_total"));
            c.setNivelCriticidade(rs.getInt("nivel_criticidade"));
            os = c;
        } else {
            OSPreventiva p = new OSPreventiva();
            Date dp = rs.getDate("data_prevista");
            if (dp != null) p.setDataPrevista(dp.toLocalDate());
            p.setPeriodicidadeDias(rs.getInt("periodicidade_dias"));
            Date um = rs.getDate("ultima_manutencao");
            if (um != null) p.setUltimaManutencao(um.toLocalDate());
            os = p;
        }

        os.setId(rs.getLong("id"));
        os.setTipo(tipo);
        os.setEquipamentoId(rs.getLong("equipamento_id"));
        long tecId = rs.getLong("tecnico_id");
        if (!rs.wasNull()) os.setTecnicoId(tecId);
        os.setDescricao(rs.getString("descricao"));
        os.setStatus(rs.getString("status"));
        os.setSetor(rs.getString("setor"));
        Timestamp da = rs.getTimestamp("data_abertura");
        if (da != null) os.setDataAbertura(da.toLocalDateTime());
        Timestamp dc = rs.getTimestamp("data_conclusao");
        if (dc != null) os.setDataConclusao(dc.toLocalDateTime());

        return os;
    }
}
