package com.example.Cmms.domain.ordemservico;

import jakarta.validation.constraints.NotNull;

/**
 * DTO para atualização de Ordem de Serviço
 * Permite atualizar: descrição, status, técnico e observações
 */
public record DadosAtualizacaoOrdemServico(
        @NotNull(message = "ID da ordem não pode ser nulo")
        Long id,
        
        String descricao,
        
        StatusOrdemServico status,
        
        Long tecnicoId,
        
        String observacoes
) {
}
