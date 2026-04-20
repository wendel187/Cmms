package com.example.Cmms.domain.tecnico;

import jakarta.validation.constraints.NotNull;

public record DadosAtualizacaoTecnico(
        @NotNull
        Long id,
        String nome,
        String email,
        String telefone,
        String especialidade,
        StatusTecnico status,
        String setor
) {
}

