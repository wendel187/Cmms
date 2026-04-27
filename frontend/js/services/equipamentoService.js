// ==================== SERVIÇO DE EQUIPAMENTOS ====================

import { API_BASE_URL } from '../config.js';

/**
 * Carregar todos os equipamentos
 * @returns {Promise<Array>} Lista de equipamentos
 */
export async function carregarEquipamentos() {
    try {
        const response = await fetch(`${API_BASE_URL}/equipamento?page=0&size=100`);
        const data = await response.json();
        return data.content || [];
    } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
        throw error;
    }
}

/**
 * Carregar equipamento específico
 * @param {number} id - ID do equipamento
 * @returns {Promise<Object>} Dados do equipamento
 */
export async function carregarEquipamento(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/equipamento/${id}`);
        if (!response.ok) throw new Error('Equipamento não encontrado');
        return await response.json();
    } catch (error) {
        console.error(`Erro ao carregar equipamento ${id}:`, error);
        throw error;
    }
}

/**
 * Criar novo equipamento
 * @param {Object} dados - Dados do equipamento
 * @returns {Promise<Object>} Equipamento criado
 */
export async function criarEquipamento(dados) {
    try {
        const response = await fetch(`${API_BASE_URL}/equipamento`, {
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
        console.error('Erro ao criar equipamento:', error);
        throw error;
    }
}

/**
 * Atualizar equipamento
 * @param {number} id - ID do equipamento
 * @param {Object} dados - Dados a atualizar
 * @returns {Promise<Object>} Equipamento atualizado
 */
export async function atualizarEquipamento(id, dados) {
    try {
        const response = await fetch(`${API_BASE_URL}/equipamento/${id}`, {
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
        console.error(`Erro ao atualizar equipamento ${id}:`, error);
        throw error;
    }
}

/**
 * Deletar equipamento
 * @param {number} id - ID do equipamento
 * @returns {Promise<void>}
 */
export async function deletarEquipamento(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/equipamento/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            const erro = await response.text();
            throw new Error(erro);
        }
    } catch (error) {
        console.error(`Erro ao deletar equipamento ${id}:`, error);
        throw error;
    }
}

