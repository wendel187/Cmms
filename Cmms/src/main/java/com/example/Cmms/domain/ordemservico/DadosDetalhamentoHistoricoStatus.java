package com.example.Cmms.domain.ordemservico;

import java.time.LocalDateTime;

public record DadosDetalhamentoHistoricoStatus(
        Long id,
        Long ordemServicoId,
        StatusOrdemServico status,
        LocalDateTime dataHora,
        String observacoes
) {
    public DadosDetalhamentoHistoricoStatus(HistoricoStatus historico) {
        this(
                historico.getId(),
                historico.getOrdemServicoId(),
                historico.getStatus(),
                historico.getDataHora(),
                historico.getObservacoes()
        );
    }
}

