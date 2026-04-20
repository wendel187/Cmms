package com.example.Cmms.domain.ordemservico;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@DiscriminatorValue("CORRETIVA")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OSCorretiva extends OrdemServico {
    
    private String descricaoFalha;
    private boolean falhaTotal;
    private int nivelCriticidade; // 1-4
    
    /**
     * Calcula a prioridade da OS Corretiva
     * Prioridade = (nivelCriticidade * 2) + (falhaTotal ? 10 : 0)
     * Quanto maior, mais prioritário
     */
    @Override
    public int calcularPrioridade() {
        int prioridade = nivelCriticidade * 2;
        if (falhaTotal) {
            prioridade += 10; // Falha total aumenta muito a prioridade
        }
        return prioridade;
    }
}

