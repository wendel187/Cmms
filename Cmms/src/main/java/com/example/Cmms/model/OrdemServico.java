package com.example.Cmms.model;

import java.time.LocalDateTime;

/**
 * Superclasse abstrata da hierarquia de Ordens de Serviço.
 * Demonstra: herança, encapsulamento e polimorfismo via calcularPrioridade().
 */
public abstract class OrdemServico {

    private Long          id;
    private String        tipo;
    private Long          equipamentoId;
    private Long          tecnicoId;
    private String        descricao;
    private String        status;
    private LocalDateTime dataAbertura;
    private LocalDateTime dataConclusao;
    private String        setor;

    public OrdemServico() {
        this.status       = "ABERTA";
        this.dataAbertura = LocalDateTime.now();
    }

    public OrdemServico(Long equipamentoId, Long tecnicoId, String descricao, String setor) {
        if (equipamentoId == null)                 throw new IllegalArgumentException("Equipamento é obrigatório");
        if (descricao == null || descricao.isBlank()) throw new IllegalArgumentException("Descrição é obrigatória");
        if (setor == null || setor.isBlank())      throw new IllegalArgumentException("Setor é obrigatório");
        this.equipamentoId = equipamentoId;
        this.tecnicoId     = tecnicoId;
        this.descricao     = descricao;
        this.setor         = setor;
        this.status        = "ABERTA";
        this.dataAbertura  = LocalDateTime.now();
    }

    // Método abstrato: cada subclasse implementa sua regra de prioridade (POLIMORFISMO)
    public abstract int calcularPrioridade();

    public void atualizarStatus(String novoStatus) {
        if (novoStatus == null || novoStatus.isBlank()) throw new IllegalArgumentException("Status inválido");
        this.status = novoStatus;
        if ("CONCLUIDA".equals(novoStatus) || "CANCELADA".equals(novoStatus)) {
            this.dataConclusao = LocalDateTime.now();
        }
    }

    // ── Getters ────────────────────────────────────────────────────────────────
    public Long          getId()            { return id; }
    public String        getTipo()          { return tipo; }
    public Long          getEquipamentoId() { return equipamentoId; }
    public Long          getTecnicoId()     { return tecnicoId; }
    public String        getDescricao()     { return descricao; }
    public String        getStatus()        { return status; }
    public LocalDateTime getDataAbertura()  { return dataAbertura; }
    public LocalDateTime getDataConclusao() { return dataConclusao; }
    public String        getSetor()         { return setor; }

    // ── Setters ────────────────────────────────────────────────────────────────
    public void setId(Long id)                           { this.id = id; }
    public void setTipo(String tipo)                     { this.tipo = tipo; }
    public void setEquipamentoId(Long equipamentoId)     { this.equipamentoId = equipamentoId; }
    public void setTecnicoId(Long tecnicoId)             { this.tecnicoId = tecnicoId; }
    public void setDescricao(String descricao)           { this.descricao = descricao; }
    public void setStatus(String status)                 { this.status = status; }
    public void setDataAbertura(LocalDateTime d)         { this.dataAbertura = d; }
    public void setDataConclusao(LocalDateTime d)        { this.dataConclusao = d; }
    public void setSetor(String setor)                   { this.setor = setor; }

    @Override
    public String toString() {
        return String.format("OrdemServico{id=%d, tipo='%s', equipId=%d, status='%s', prioridade=%d}",
                id, tipo, equipamentoId, status, calcularPrioridade());
    }
}
