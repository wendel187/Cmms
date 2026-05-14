package com.example.Cmms.service;

import com.example.Cmms.dao.HistoricoStatusDAO;
import com.example.Cmms.dao.OrdemServicoDAO;
import com.example.Cmms.dao.TecnicoDAO;
import com.example.Cmms.model.*;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Serviço de Ordens de Serviço.
 * Contém todas as regras de negócio; não possui SQL.
 */
public class OSService {

    private static final List<String> STATUS_VALIDOS =
            List.of("ABERTA", "EM_ANDAMENTO", "PAUSADA", "CONCLUIDA", "CANCELADA");

    private final OrdemServicoDAO  osDAO        = new OrdemServicoDAO();
    private final HistoricoStatusDAO historicoDAO = new HistoricoStatusDAO();
    private final TecnicoDAO       tecnicoDAO   = new TecnicoDAO();

    // ── Criar ──────────────────────────────────────────────────────────────────

    public OSCorretiva criarCorretiva(Long equipamentoId, Long tecnicoId, String descricao,
                                     String setor, String descricaoFalha,
                                     boolean falhaTotal, int nivelCriticidade) throws SQLException {
        validarTecnicoDisponivel(tecnicoId);
        OSCorretiva os = new OSCorretiva(equipamentoId, tecnicoId, descricao, setor,
                                        descricaoFalha, falhaTotal, nivelCriticidade);
        osDAO.salvarCorretiva(os);
        return os;
    }

    public OSPreventiva criarPreventiva(Long equipamentoId, Long tecnicoId, String descricao,
                                       String setor, LocalDate dataPrevista,
                                       int periodicidadeDias, LocalDate ultimaManutencao) throws SQLException {
        validarTecnicoDisponivel(tecnicoId);
        if (dataPrevista.isBefore(LocalDate.now()))
            throw new IllegalArgumentException("Data prevista não pode ser no passado");
        OSPreventiva os = new OSPreventiva(equipamentoId, tecnicoId, descricao, setor,
                                          dataPrevista, periodicidadeDias, ultimaManutencao);
        osDAO.salvarPreventiva(os);
        return os;
    }

    // ── Consultar ──────────────────────────────────────────────────────────────

    public List<OrdemServico> listarTodas() throws SQLException {
        return osDAO.listarTodas();
    }

    public Optional<OrdemServico> buscarPorId(Long id) throws SQLException {
        return osDAO.buscarPorId(id);
    }

    public List<OrdemServico> listarAbertas() throws SQLException {
        return osDAO.listarAbertas();
    }

    public List<OrdemServico> listarPorEquipamento(Long equipamentoId) throws SQLException {
        return osDAO.listarPorEquipamento(equipamentoId);
    }

    public List<OrdemServico> listarPorTecnico(Long tecnicoId) throws SQLException {
        return osDAO.listarPorTecnico(tecnicoId);
    }

    public List<OrdemServico> listarPorSetor(String setor) throws SQLException {
        return osDAO.listarPorSetor(setor);
    }

    public List<HistoricoStatus> historicoDaOS(Long osId) throws SQLException {
        return historicoDAO.listarPorOS(osId);
    }

    // ── Atualizar ──────────────────────────────────────────────────────────────

    public void atualizarStatus(Long id, String novoStatus, String observacoes) throws SQLException {
        String s = novoStatus.toUpperCase();
        if (!STATUS_VALIDOS.contains(s))
            throw new IllegalArgumentException("Status inválido: " + novoStatus + ". Use: " + STATUS_VALIDOS);
        osDAO.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("OS não encontrada: " + id));
        osDAO.atualizarStatus(id, s, observacoes);
    }

    public void cancelar(Long id) throws SQLException {
        osDAO.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("OS não encontrada: " + id));
        osDAO.cancelar(id);
    }

    // ── Relatórios ─────────────────────────────────────────────────────────────

    public List<OrdemServico> topNPorPrioridade(int n) throws SQLException {
        if (n <= 0) throw new IllegalArgumentException("N deve ser maior que zero");
        return osDAO.topNPorPrioridade(n);
    }

    public List<String> setoresComOSAbertas() throws SQLException {
        return osDAO.setoresComOSAbertas();
    }

    public Map<String, Long> relatorioPorResponsavel() throws SQLException {
        return osDAO.relatorioPorResponsavel();
    }

    // ── Validações ─────────────────────────────────────────────────────────────

    private void validarTecnicoDisponivel(Long tecnicoId) throws SQLException {
        if (tecnicoId == null) return;
        tecnicoDAO.buscarPorId(tecnicoId).ifPresent(t -> {
            if (!t.podeAbrirOS())
                throw new IllegalStateException("Técnico '" + t.getNome() + "' não está disponível para abrir OS");
        });
    }
}
