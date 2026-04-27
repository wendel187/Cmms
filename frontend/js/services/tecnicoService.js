// ==================== SERVIÇO DE TÉCNICOS ====================

import { API_BASE_URL } from '../config.js';

/**
 * Carregar todos os técnicos
 * @returns {Promise<Array>} Lista de técnicos
 */
export async function carregarTecnicos() {
    try {
        const response = await fetch(`${API_BASE_URL}/tecnico?page=0&size=100`);
        const data = await response.json();
        return data.content || [];
    } catch (error) {
        console.error('Erro ao carregar técnicos:', error);
        throw error;
    }
}

/**
 * Carregar técnico específico
 * @param {number} id - ID do técnico
 * @returns {Promise<Object>} Dados do técnico
 */
export async function carregarTecnico(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/tecnico/${id}`);
        if (!response.ok) throw new Error('Técnico não encontrado');
        return await response.json();
    } catch (error) {
        console.error(`Erro ao carregar técnico ${id}:`, error);
        throw error;
    }
}

/**
 * Criar novo técnico
 * @param {Object} dados - Dados do técnico
 * @returns {Promise<Object>} Técnico criado
 */
export async function criarTecnico(dados) {
    try {
        const response = await fetch(`${API_BASE_URL}/tecnico`, {
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
        console.error('Erro ao criar técnico:', error);
        throw error;
    }
}

/**
 * Atualizar técnico
 * @param {number} id - ID do técnico
 * @param {Object} dados - Dados a atualizar
 * @returns {Promise<Object>} Técnico atualizado
 */
export async function atualizarTecnico(id, dados) {
    try {
        const response = await fetch(`${API_BASE_URL}/tecnico/${id}`, {
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
        console.error(`Erro ao atualizar técnico ${id}:`, error);
        throw error;
    }
}

/**
 * Deletar/Desativar técnico
 * @param {number} id - ID do técnico
 * @returns {Promise<void>}
 */
export async function deletarTecnico(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/tecnico/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            const erro = await response.text();
            throw new Error(erro);
        }
    } catch (error) {
        console.error(`Erro ao deletar técnico ${id}:`, error);
        throw error;
    }
}

