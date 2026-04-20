package com.example.Cmms.domain.tecnico;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DadosCadastroTecnico(
        @NotBlank
        String nome,
        
        @NotBlank
        @Email
        String email,
        
        @NotBlank
        String telefone,
        
        @NotBlank
        String especialidade,
        
        @NotBlank
        String setor,
        
        @NotNull
        StatusTecnico status
) {
}

