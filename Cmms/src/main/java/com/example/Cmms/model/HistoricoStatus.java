package com.example.Cmms.model;

import java.time.LocalDateTime;

public class HistoricoStatus {

    private Long          id;
    private Long          ordemServicoId;
    private String        status;
    private LocalDateTime dataHora;
    private String        observacoes;

    public HistoricoStatus() {}

    public HistoricoStatus(Long ordemServicoId, String status, String observacoes) {
        if (ordemServicoId == null)            throw new IllegalArgumentException("OS é obrigatória");
        if (status == null || status.isBlank()) throw new IllegalArgumentException("Status é obrigatório");
        this.ordemServicoId = ordemServicoId;
        this.status         = status;
        this.observacoes    = observacoes;
        this.dataHora       = LocalDateTime.now();
    }

    // ── Getters ────────────────────────────────────────────────────────────────
    public Long          getId()             { return id; }
    public Long          getOrdemServicoId() { return ordemServicoId; }
    public String        getStatus()         { return status; }
    public LocalDateTime getDataHora()       { return dataHora; }
    public String        getObservacoes()    { return observacoes; }

    // ── Setters ────────────────────────────────────────────────────────────────
    public void setId(Long id)                          { this.id = id; }
    public void setOrdemServicoId(Long ordemServicoId)  { this.ordemServicoId = ordemServicoId; }
    public void setStatus(String status)                { this.status = status; }
    public void setDataHora(LocalDateTime dataHora)     { this.dataHora = dataHora; }
    public void setObservacoes(String observacoes)      { this.observacoes = observacoes; }

    @Override
    public String toString() {
        return String.format("[%s] Status: %-12s | Obs: %s", dataHora, status, observacoes);
    }
}
