package com.example.Cmms.model;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * OS Preventiva: prioridade baseada na proximidade da data prevista.
 * Regra: se passou da data → 100 (máximo); senão → max(0, 30 − diasFaltantes).
 */
public class OSPreventiva extends OrdemServico {

    private LocalDate dataPrevista;
    private int       periodicidadeDias;
    private LocalDate ultimaManutencao;

    public OSPreventiva() {
        super();
        setTipo("PREVENTIVA");
    }

    public OSPreventiva(Long equipamentoId, Long tecnicoId, String descricao, String setor,
                        LocalDate dataPrevista, int periodicidadeDias, LocalDate ultimaManutencao) {
        super(equipamentoId, tecnicoId, descricao, setor);
        if (dataPrevista == null)   throw new IllegalArgumentException("Data prevista é obrigatória");
        if (periodicidadeDias <= 0) throw new IllegalArgumentException("Periodicidade deve ser positiva");
        this.dataPrevista      = dataPrevista;
        this.periodicidadeDias = periodicidadeDias;
        this.ultimaManutencao  = ultimaManutencao;
        setTipo("PREVENTIVA");
    }

    @Override
    public int calcularPrioridade() {
        if (dataPrevista == null) return 0;
        long diasFaltantes = ChronoUnit.DAYS.between(LocalDate.now(), dataPrevista);
        if (diasFaltantes <= 0) return 100;
        return (int) Math.min(30, Math.max(0, 30 - diasFaltantes));
    }

    // ── Getters ────────────────────────────────────────────────────────────────
    public LocalDate getDataPrevista()     { return dataPrevista; }
    public int       getPeriodicidadeDias(){ return periodicidadeDias; }
    public LocalDate getUltimaManutencao() { return ultimaManutencao; }

    // ── Setters ────────────────────────────────────────────────────────────────
    public void setDataPrevista(LocalDate dataPrevista)         { this.dataPrevista = dataPrevista; }
    public void setPeriodicidadeDias(int periodicidadeDias)     { this.periodicidadeDias = periodicidadeDias; }
    public void setUltimaManutencao(LocalDate ultimaManutencao) { this.ultimaManutencao = ultimaManutencao; }
}
