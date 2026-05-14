package com.example.Cmms.domain.ordemservico;

import java.time.LocalDateTime;

public record DadosListagemOrdemServico(
        Long id,
        TipoOrdemServico tipo,
        Long equipamentoId,
        String nomeEquipamento,
        Long tecnicoId,
        String nomeTecnico,
        StatusOrdemServico status,
        LocalDateTime dataAbertura,
        String setor,
        int prioridade
) {
    public DadosListagemOrdemServico(OrdemServico os, String nomeEquipamento, String nomeTecnico) {
        this(
                os.getId(),
                os.getTipo(),
                os.getEquipamentoId(),
                nomeEquipamento,
                os.getTecnicoId(),
                nomeTecnico,
                os.getStatus(),
                os.getDataAbertura(),
                os.getSetor(),
                os.calcularPrioridade()
        );
    }
}
