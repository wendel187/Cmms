// ==================== SERVIÇO DE HISTÓRICO DE OS ====================

import { API_BASE_URL } from '../config.js';

/**
 * Carregar histórico de uma ordem de serviço
 * @param {number} osId - ID da ordem de serviço
 * @returns {Promise<Array>} Lista de histórico
 */
export async function carregarHistoricoOS(osId) {
    try {
        if (!osId || isNaN(osId)) {
            throw new Error('ID da Ordem de Serviço inválido');
        }
        
        const response = await fetch(`${API_BASE_URL}/ordens-servico/${osId}/historico`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Ordem de Serviço não encontrada');
            }
            throw new Error(`Erro ao carregar histórico (HTTP ${response.status})`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Erro ao carregar histórico da OS ${osId}:`, error);
        throw error;
    }
}

