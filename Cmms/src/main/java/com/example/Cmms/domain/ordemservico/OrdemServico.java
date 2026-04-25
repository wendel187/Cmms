package com.example.Cmms.domain.ordemservico;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "OrdenServiço")
@Table(name = "ordens_servico")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo_os", discriminatorType = DiscriminatorType.STRING)
public abstract class OrdemServico {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_os", insertable = false, updatable = false)
    private TipoOrdemServico tipo;
    
    private Long equipamentoId;
    
    private Long tecnicoId;
    
    @Column(columnDefinition = "TEXT")
    private String descricao;
    
    @Enumerated(EnumType.STRING)
    private StatusOrdemServico status;
    
    @CreationTimestamp
    private LocalDateTime dataAbertura;
    
    private LocalDateTime dataConclusao;
    
    private String setor;
    
    // Método abstrato para calcular prioridade (POLIMORFISMO)
    public abstract int calcularPrioridade();
    
    public void atualizarStatus(StatusOrdemServico novoStatus) {
        this.status = novoStatus;
        if (novoStatus == StatusOrdemServico.CONCLUIDA) {
            this.dataConclusao = LocalDateTime.now();
        }
    }
    
    /**
     * Atualiza os campos da Ordem de Serviço
     * @param dados DTO com os novos dados
     */
    public void atualizarInformacoes(DadosAtualizacaoOrdemServico dados) {
        if (dados.descricao() != null) {
            this.descricao = dados.descricao();
        }
        if (dados.status() != null) {
            this.atualizarStatus(dados.status());
        }
        if (dados.tecnicoId() != null) {
            this.tecnicoId = dados.tecnicoId();
        }
    }
}

