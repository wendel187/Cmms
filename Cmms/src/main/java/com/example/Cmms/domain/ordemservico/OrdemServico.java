package com.example.Cmms.domain.ordemservico;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

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
}

