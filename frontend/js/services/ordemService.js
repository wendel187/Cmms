// ==================== SERVIÇO DE ORDENS DE SERVIÇO ====================

import { API_BASE_URL } from '../config.js';

/**
 * Carregar todas as ordens abertas
 * @returns {Promise<Array>} Lista de ordens
 */
export async function carregarOrdensAbertas() {
    try {
        const response = await fetch(`${API_BASE_URL}/ordens-servico/abertas`);
        if (!response.ok) throw new Error('Erro ao carregar ordens');
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar ordens abertas:', error);
        throw error;
    }
}

/**
 * Carregar ordem específica
 * @param {number} id - ID da ordem
 * @returns {Promise<Object>} Dados da ordem
 */
export async function carregarOrdem(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/ordens-servico/${id}`);
        if (!response.ok) throw new Error('Ordem não encontrada');
        return await response.json();
    } catch (error) {
        console.error(`Erro ao carregar ordem ${id}:`, error);
        throw error;
    }
}

/**
 * Criar OS Corretiva
 * @param {Object} dados - Dados da OS corretiva
 * @returns {Promise<Object>} OS criada
 */
export async function criarOSCorretiva(dados) {
    try {
        const response = await fetch(`${API_BASE_URL}/ordens-servico/corretiva`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        if (!response.ok) {
            const erro = await response.text();
            throw new Error(erro);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro ao criar OS Corretiva:', error);
        throw error;
    }
}

/**
 * Criar OS Preventiva
 * @param {Object} dados - Dados da OS preventiva
 * @returns {Promise<Object>} OS criada
 */
export async function criarOSPreventiva(dados) {
    try {
        const response = await fetch(`${API_BASE_URL}/ordens-servico/preventiva`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        if (!response.ok) {
            const erro = await response.text();
            throw new Error(erro);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro ao criar OS Preventiva:', error);
        throw error;
    }
}

/**
 * Atualizar status da ordem de serviço
 * @param {number} id - ID da ordem
 * @param {Object} dados - Dados a atualizar (novoStatus, observacoes)
 * @returns {Promise<Object>} Ordem atualizada
 */
export async function atualizarOSStatus(id, dados) {
    try {
        const response = await fetch(`${API_BASE_URL}/ordens-servico/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,
                ...dados
            })
        });
        
        if (!response.ok) {
            const erro = await response.text();
            throw new Error(erro);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Erro ao atualizar status da ordem ${id}:`, error);
        throw error;
    }
}

/**
 * Atualizar ordem de serviço completa
 * @param {number} id - ID da ordem
 * @param {Object} dados - Dados a atualizar
 * @returns {Promise<Object>} Ordem atualizada
 */
export async function atualizarOrdem(id, dados) {
    try {
        const response = await fetch(`${API_BASE_URL}/ordens-servico/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        if (!response.ok) {
            const erro = await response.text();
            throw new Error(erro);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Erro ao atualizar ordem ${id}:`, error);
        throw error;
    }
}

/**
 * Deletar/Cancelar ordem de serviço
 * @param {number} id - ID da ordem
 * @returns {Promise<void>}
 */
export async function deletarOrdem(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/ordens-servico/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            const erro = await response.text();
            throw new Error(erro);
        }
    } catch (error) {
        console.error(`Erro ao deletar ordem ${id}:`, error);
        throw error;
    }
}

