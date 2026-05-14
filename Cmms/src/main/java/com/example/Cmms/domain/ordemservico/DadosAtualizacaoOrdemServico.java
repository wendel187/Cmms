package com.example.Cmms.domain.ordemservico;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;

public record DadosAtualizacaoOrdemServico(
        @NotNull(message = "ID da ordem não pode ser nulo")
        Long id,

        String descricao,

        StatusOrdemServico status,

        Long tecnicoId,

        String observacoes,

        LocalDateTime dataConclusao
) {
}
