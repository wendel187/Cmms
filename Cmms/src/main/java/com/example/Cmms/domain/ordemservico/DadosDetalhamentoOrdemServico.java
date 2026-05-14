package com.example.Cmms.domain.ordemservico;

import java.time.LocalDateTime;

public record DadosDetalhamentoOrdemServico(
        Long id,
        TipoOrdemServico tipo,
        Long equipamentoId,
        String nomeEquipamento,
        Long tecnicoId,
        String nomeTecnico,
        String descricao,
        StatusOrdemServico status,
        LocalDateTime dataAbertura,
        LocalDateTime dataConclusao,
        String setor,
        int prioridade
) {
    public DadosDetalhamentoOrdemServico(OrdemServico os, String nomeEquipamento, String nomeTecnico) {
        this(
                os.getId(),
                os.getTipo(),
                os.getEquipamentoId(),
                nomeEquipamento,
                os.getTecnicoId(),
                nomeTecnico,
                os.getDescricao(),
                os.getStatus(),
                os.getDataAbertura(),
                os.getDataConclusao(),
                os.getSetor(),
                os.calcularPrioridade()
        );
    }
}
