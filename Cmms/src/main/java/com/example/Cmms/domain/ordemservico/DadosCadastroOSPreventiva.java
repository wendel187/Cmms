package com.example.Cmms.domain.ordemservico;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DadosCadastroOSPreventiva(
        @NotNull
        Long equipamentoId,
        
        @NotNull
        Long tecnicoId,
        
        @NotBlank
        String descricao,
        
        @NotBlank
        String setor,
        
        @NotNull
        LocalDate dataPrevista,
        
        @NotNull
        int periodicidadeDias,
        
        LocalDate ultimaManutencao
) {
}

