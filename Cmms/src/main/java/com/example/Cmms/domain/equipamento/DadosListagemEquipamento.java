package com.example.Cmms.domain.equipamento;

import java.time.LocalDate;

public record DadosListagemEquipamento(
        Long id,
        String nome,
        String codigo,
        Status status,
        Criticidade criticidade,
        String setor,
        LocalDate dataAquisicao
) {
    public DadosListagemEquipamento(Equipamento equipamento) {
        this(
                equipamento.getId(),
                equipamento.getNome(),
                equipamento.getCodigo(),
                equipamento.getStatus(),
                equipamento.getCriticidade(),
                equipamento.getSetor(),
                equipamento.getDataAquisicao()
        );
    }
}

