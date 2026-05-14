package com.example.Cmms.model;

import java.time.LocalDate;

public class Tecnico {

    private Long      id;
    private String    nome;
    private String    email;
    private String    telefone;
    private String    especialidade;
    private String    setor;
    private String    status;
    private LocalDate dataCadastro;
    private boolean   ativo;

    public Tecnico() {}

    public Tecnico(String nome, String email, String especialidade, String setor) {
        if (nome == null || nome.isBlank())           throw new IllegalArgumentException("Nome é obrigatório");
        if (email == null || email.isBlank())         throw new IllegalArgumentException("Email é obrigatório");
        if (especialidade == null || especialidade.isBlank()) throw new IllegalArgumentException("Especialidade é obrigatória");
        if (setor == null || setor.isBlank())         throw new IllegalArgumentException("Setor é obrigatório");
        this.nome          = nome;
        this.email         = email;
        this.especialidade = especialidade;
        this.setor         = setor;
        this.status        = "DISPONIVEL";
        this.ativo         = true;
        this.dataCadastro  = LocalDate.now();
    }

    // Regra de negócio encapsulada
    public boolean podeAbrirOS() {
        return ativo && ("DISPONIVEL".equals(status) || "EM_MANUTENCAO".equals(status));
    }

    // ── Getters ────────────────────────────────────────────────────────────────
    public Long      getId()            { return id; }
    public String    getNome()          { return nome; }
    public String    getEmail()         { return email; }
    public String    getTelefone()      { return telefone; }
    public String    getEspecialidade() { return especialidade; }
    public String    getSetor()         { return setor; }
    public String    getStatus()        { return status; }
    public LocalDate getDataCadastro()  { return dataCadastro; }
    public boolean   isAtivo()          { return ativo; }

    // ── Setters ────────────────────────────────────────────────────────────────
    public void setId(Long id)                           { this.id = id; }
    public void setNome(String nome)                     { this.nome = nome; }
    public void setEmail(String email)                   { this.email = email; }
    public void setTelefone(String telefone)             { this.telefone = telefone; }
    public void setEspecialidade(String especialidade)   { this.especialidade = especialidade; }
    public void setSetor(String setor)                   { this.setor = setor; }
    public void setStatus(String status)                 { this.status = status; }
    public void setDataCadastro(LocalDate dataCadastro)  { this.dataCadastro = dataCadastro; }
    public void setAtivo(boolean ativo)                  { this.ativo = ativo; }

    @Override
    public String toString() {
        return String.format("Tecnico{id=%d, nome='%s', especialidade='%s', setor='%s', status='%s'}",
                id, nome, especialidade, setor, status);
    }
}
