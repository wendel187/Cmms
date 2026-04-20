package com.example.Cmms.domain.ordemservico;

import jakarta.validation.constraints.NotNull;

public record DadosAtualizacaoStatusOS(
        @NotNull
        Long id,
        
        @NotNull
        StatusOrdemServico novoStatus,
        
        String observacoes
) {
}

