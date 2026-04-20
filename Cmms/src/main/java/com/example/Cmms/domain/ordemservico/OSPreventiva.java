package com.example.Cmms.domain.ordemservico;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Entity
@DiscriminatorValue("PREVENTIVA")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OSPreventiva extends OrdemServico {
    
    private LocalDate dataPrevista;
    private int periodicidadeDias; // Quantos dias entre manutenções
    private LocalDate ultimaManutencao;
    
    /**
     * Calcula a prioridade da OS Preventiva
     * Quanto mais próximo da data prevista, maior a prioridade
     * Prioridade = dias faltantes para data prevista (invertido)
     * Se passou da data, prioridade máxima
     */
    @Override
    public int calcularPrioridade() {
        long diasFaltantes = ChronoUnit.DAYS.between(LocalDate.now(), dataPrevista);
        
        if (diasFaltantes <= 0) {
            return 100; // Máxima prioridade se passou da data prevista
        }
        
        // Quanto menos dias faltam, maior a prioridade
        int prioridade = (int) Math.max(0, 30 - diasFaltantes);
        return Math.min(prioridade, 30); // Máximo 30 para preventivas
    }
}

