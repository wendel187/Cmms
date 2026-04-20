package com.example.Cmms.domain.equipamento;

import jakarta.validation.constraints.NotNull;

public record DadosAtualizacaoEquipamento(
        @NotNull
        Long id,
        String nome,
        String codigo,
        Status status,
        Criticidade criticidade,
        String setor
) {
}

