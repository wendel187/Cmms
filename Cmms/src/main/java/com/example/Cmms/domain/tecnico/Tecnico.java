package com.example.Cmms.domain.tecnico;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;

@Table(name = "tecnicos")
@Entity(name = "Tecnicos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Tecnico {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    private String email;
    private String telefone;
    private String especialidade;
    private String setor;
    
    @Enumerated(EnumType.STRING)
    private StatusTecnico status;
    
    @CreationTimestamp
    private LocalDate dataCadastro;
    
    private boolean ativo;
    
    public void atualizarInformacoes(DadosAtualizacaoTecnico dados) {
        if (dados.nome() != null) {
            this.nome = dados.nome();
        }
        if (dados.email() != null) {
            this.email = dados.email();
        }
        if (dados.telefone() != null) {
            this.telefone = dados.telefone();
        }
        if (dados.especialidade() != null) {
            this.especialidade = dados.especialidade();
        }
        if (dados.status() != null) {
            this.status = dados.status();
        }
        if (dados.setor() != null) {
            this.setor = dados.setor();
        }
    }
    
    public void desativar() {
        this.ativo = false;
        this.status = StatusTecnico.INDISPONIVEL;
    }
    
    // Valida se técnico pode abrir uma OS
    public boolean podeAbrirOS() {
        return this.ativo && (this.status == StatusTecnico.DISPONIVEL || this.status == StatusTecnico.EM_MANUTENCAO);
    }
}

