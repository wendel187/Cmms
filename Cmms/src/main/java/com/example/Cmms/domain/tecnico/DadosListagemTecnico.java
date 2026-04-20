package com.example.Cmms.domain.tecnico;

import java.time.LocalDate;

public record DadosListagemTecnico(
        Long id,
        String nome,
        String email,
        String telefone,
        String especialidade,
        String setor,
        StatusTecnico status,
        LocalDate dataCadastro,
        boolean ativo
) {
    public DadosListagemTecnico(Tecnico tecnico) {
        this(
                tecnico.getId(),
                tecnico.getNome(),
                tecnico.getEmail(),
                tecnico.getTelefone(),
                tecnico.getEspecialidade(),
                tecnico.getSetor(),
                tecnico.getStatus(),
                tecnico.getDataCadastro(),
                tecnico.isAtivo()
        );
    }
}

