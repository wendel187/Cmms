package com.example.Cmms.domain.ordemservico;

import java.time.LocalDateTime;

public record DadosListagemOrdemServico(
        Long id,
        Long equipamentoId,
        Long tecnicoId,
        StatusOrdemServico status,
        LocalDateTime dataAbertura,
        String setor,
        int prioridade
) {
    public DadosListagemOrdemServico(OrdemServico os) {
        this(
                os.getId(),
                os.getEquipamentoId(),
                os.getTecnicoId(),
                os.getStatus(),
                os.getDataAbertura(),
                os.getSetor(),
                os.calcularPrioridade()
        );
    }
}

