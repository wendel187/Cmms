package com.example.Cmms.domain.ordemservico;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Table(name = "historico_status")
@Entity(name = "HistoricoStatus")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class HistoricoStatus {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "ordem_servico_id")
    private Long ordemServicoId;
    
    @Enumerated(EnumType.STRING)
    private StatusOrdemServico status;
    
    @CreationTimestamp
    private LocalDateTime dataHora;
    
    private String observacoes;
    
    public HistoricoStatus(Long ordemServicoId, StatusOrdemServico status, String observacoes) {
        this.ordemServicoId = ordemServicoId;
        this.status = status;
        this.observacoes = observacoes;
    }
}

