package com.example.Cmms.domain.ordemservico;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DadosCadastroOSCorretiva(
        @NotNull
        Long equipamentoId,
        
        @NotNull
        Long tecnicoId,
        
        @NotBlank
        String descricao,
        
        @NotBlank
        String descricaoFalha,
        
        @NotBlank
        String setor,
        
        boolean falhaTotal,
        
        @NotNull
        int nivelCriticidade
) {
}

