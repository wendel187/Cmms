package com.example.Cmms.domain.ordemservico;

import java.time.LocalDateTime;

public record DadosDetalhamentoOrdemServico(
        Long id,
        Long equipamentoId,
        Long tecnicoId,
        String descricao,
        StatusOrdemServico status,
        LocalDateTime dataAbertura,
        LocalDateTime dataConclusao,
        String setor,
        int prioridade
) {
    public DadosDetalhamentoOrdemServico(OrdemServico os) {
        this(
                os.getId(),
                os.getEquipamentoId(),
                os.getTecnicoId(),
                os.getDescricao(),
                os.getStatus(),
                os.getDataAbertura(),
                os.getDataConclusao(),
                os.getSetor(),
                os.calcularPrioridade()
        );
    }
}

