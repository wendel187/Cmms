package com.example.Cmms.domain.equipamento;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DadosCadastroEquipamento(
        @NotBlank
        String nome,
        
        @NotBlank
        String codigo,

        @NotNull
        Status status
) {
}

