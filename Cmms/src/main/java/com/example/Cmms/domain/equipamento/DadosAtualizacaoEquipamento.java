package com.example.Cmms.domain.equipamento;

import java.time.LocalDate;

public record DadosAtualizacaoEquipamento(
        Long id,
        String nome,
        String codigo,
        Status status,
        Criticidade criticidade,
        String setor,
        LocalDate ultimaManutencao
) {
}

