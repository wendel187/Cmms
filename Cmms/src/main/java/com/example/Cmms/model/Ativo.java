package com.example.Cmms.model;

import java.time.LocalDate;

public class Ativo {

    private Long id;
    private String nome;
    private String codigo;
    private String status;
    private String criticidade;
    private String setor;
    private LocalDate dataAquisicao;

    public Ativo() {}

    public Ativo(String nome, String codigo, String criticidade, String setor) {
        if (nome == null || nome.isBlank())        throw new IllegalArgumentException("Nome é obrigatório");
        if (codigo == null || codigo.isBlank())    throw new IllegalArgumentException("Código é obrigatório");
        if (criticidade == null || criticidade.isBlank()) throw new IllegalArgumentException("Criticidade é obrigatória");
        if (setor == null || setor.isBlank())      throw new IllegalArgumentException("Setor é obrigatório");
        this.nome        = nome;
        this.codigo      = codigo;
        this.criticidade = criticidade;
        this.setor       = setor;
        this.status      = "ATIVO";
    }

    // ── Getters ────────────────────────────────────────────────────────────────
    public Long      getId()           { return id; }
    public String    getNome()         { return nome; }
    public String    getCodigo()       { return codigo; }
    public String    getStatus()       { return status; }
    public String    getCriticidade()  { return criticidade; }
    public String    getSetor()        { return setor; }
    public LocalDate getDataAquisicao(){ return dataAquisicao; }

    // ── Setters ────────────────────────────────────────────────────────────────
    public void setId(Long id)                       { this.id = id; }
    public void setNome(String nome)                 { this.nome = nome; }
    public void setCodigo(String codigo)             { this.codigo = codigo; }
    public void setStatus(String status)             { this.status = status; }
    public void setCriticidade(String criticidade)   { this.criticidade = criticidade; }
    public void setSetor(String setor)               { this.setor = setor; }
    public void setDataAquisicao(LocalDate d)        { this.dataAquisicao = d; }

    @Override
    public String toString() {
        return String.format("Ativo{id=%d, nome='%s', codigo='%s', criticidade='%s', setor='%s', status='%s'}",
                id, nome, codigo, criticidade, setor, status);
    }
}
