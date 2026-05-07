package com.example.Cmms.domain.tecnico;

public record DadosAtualizacaoTecnico(
        String nome,
        String email,
        String telefone,
        String especialidade,
        StatusTecnico status,
        String setor
) {
}

