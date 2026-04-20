package com.example.Cmms.domain.equipamento;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;

@Table(name = "equipamentos")
@Entity(name = "Equipamentos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Equipamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String codigo;

    @Enumerated(EnumType.STRING)
    private Status status;
    
    @Enumerated(EnumType.STRING)
    private Criticidade criticidade;
    
    private String setor;

    @CreationTimestamp
    private LocalDate dataAquisicao;

    // Construtor customizado para aceitar DadosCadastroEquipamento
    public Equipamento(DadosCadastroEquipamento dados) {
        this.nome = dados.nome();
        this.codigo = dados.codigo();
        this.status = dados.status();
        this.criticidade = dados.criticidade();
        this.setor = dados.setor();
    }

    public void atualizarInformacoes(DadosAtualizacaoEquipamento dados) {
        if (dados.nome() != null) {
            this.nome = dados.nome();
        }
        if (dados.codigo() != null) {
            this.codigo = dados.codigo();
        }
        if (dados.status() != null) {
            this.status = dados.status();
        }
        if (dados.criticidade() != null) {
            this.criticidade = dados.criticidade();
        }
        if (dados.setor() != null) {
            this.setor = dados.setor();
        }
    }

    public void excluir() {
        this.status = Status.INATIVO;
    }
}
