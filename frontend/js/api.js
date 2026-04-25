// ==================== SERVIÇO DE API ====================

import { API_BASE_URL, API_ENDPOINTS, PAGINATION } from './config.js';

/**
 * Faz uma requisição genérica à API
 * @param {string} endpoint - Endpoint da API
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
 * @param {Object} dados - Dados a enviar (para POST/PUT)
 * @returns {Promise<Object>} Resposta da API
 */
async function fazerRequisicao(endpoint, method = 'GET', dados = null) {
    try {
        const opcoes = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        if (dados && (method === 'POST' || method === 'PUT')) {
            opcoes.body = JSON.stringify(dados);
        }

        const resposta = await fetch(`${API_BASE_URL}${endpoint}`, opcoes);

        if (!resposta.ok) {
            throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
        }

        return await resposta.json();
    } catch (erro) {
        console.error(`Erro na requisição ${method} ${endpoint}:`, erro);
        throw erro;
    }
}

/**
 * Verifica conexão com o servidor
 * @returns {Promise<boolean>}
 */
export async function verificarConexao() {
    try {
        await fazerRequisicao(API_ENDPOINTS.health);
        return true;
    } catch {
        return false;
    }
}

// ==================== TÉCNICOS ====================

/**
 * Carregar todos os técnicos
 * @returns {Promise<Array>}
 */
export async function carregarTecnicos() {
    const resposta = await fazerRequisicao(
        `${API_ENDPOINTS.tecnicos}?page=${PAGINATION.PAGE}&size=${PAGINATION.SIZE}`
    );
    return resposta.content || [];
}

/**
 * Carregar um técnico específico
 * @param {number} tecnicoId - ID do técnico
 * @returns {Promise<Object>}
 */
export async function carregarTecnico(tecnicoId) {
    return await fazerRequisicao(API_ENDPOINTS.tecnico(tecnicoId));
}

/**
 * Criar novo técnico
 * @param {Object} dados - Dados do técnico
 * @returns {Promise<Object>}
 */
export async function criarTecnico(dados) {
    return await fazerRequisicao(API_ENDPOINTS.tecnicos, 'POST', dados);
}

/**
 * Atualizar técnico
 * @param {number} tecnicoId - ID do técnico
 * @param {Object} dados - Dados a atualizar
 * @returns {Promise<Object>}
 */
export async function atualizarTecnico(tecnicoId, dados) {
    return await fazerRequisicao(API_ENDPOINTS.tecnico(tecnicoId), 'PUT', dados);
}

// ==================== EQUIPAMENTOS ====================

/**
 * Carregar todos os equipamentos
 * @returns {Promise<Array>}
 */
export async function carregarEquipamentos() {
    const resposta = await fazerRequisicao(
        `${API_ENDPOINTS.equipamentos}?page=${PAGINATION.PAGE}&size=${PAGINATION.SIZE}`
    );
    return resposta.content || [];
}

/**
 * Carregar um equipamento específico
 * @param {number} equipamentoId - ID do equipamento
 * @returns {Promise<Object>}
 */
export async function carregarEquipamento(equipamentoId) {
    return await fazerRequisicao(API_ENDPOINTS.equipamento(equipamentoId));
}

/**
 * Criar novo equipamento
 * @param {Object} dados - Dados do equipamento
 * @returns {Promise<Object>}
 */
export async function criarEquipamento(dados) {
    return await fazerRequisicao(API_ENDPOINTS.equipamentos, 'POST', dados);
}

/**
 * Atualizar equipamento
 * @param {Object} dados - Dados a atualizar (deve incluir 'id')
 * @returns {Promise<Object>}
 */
export async function atualizarEquipamento(dados) {
    return await fazerRequisicao(API_ENDPOINTS.equipamentos, 'PUT', dados);
}

// ==================== ORDENS DE SERVIÇO ====================

/**
 * Carregar todas as ordens abertas
 * @returns {Promise<Array>}
 */
export async function carregarOrdensAbertas() {
    return await fazerRequisicao(API_ENDPOINTS.ordensAbertas);
}

/**
 * Carregar uma ordem específica
 * @param {number} ordemId - ID da ordem
 * @returns {Promise<Object>}
 */
export async function carregarOrdem(ordemId) {
    return await fazerRequisicao(API_ENDPOINTS.ordem(ordemId));
}

/**
 * Criar OS Corretiva
 * @param {Object} dados - Dados da OS
 * @returns {Promise<Object>}
 */
export async function criarOSCorretiva(dados) {
    return await fazerRequisicao(API_ENDPOINTS.ordemCorretiva, 'POST', dados);
}

/**
 * Criar OS Preventiva
 * @param {Object} dados - Dados da OS
 * @returns {Promise<Object>}
 */
export async function criarOSPreventiva(dados) {
    return await fazerRequisicao(API_ENDPOINTS.ordemPreventiva, 'POST', dados);
}

/**
 * Atualizar OS
 * @param {number} ordemId - ID da ordem
 * @param {Object} dados - Dados a atualizar
 * @returns {Promise<Object>}
 */
export async function atualizarOS(ordemId, dados) {
    return await fazerRequisicao(API_ENDPOINTS.ordem(ordemId), 'PUT', dados);
}
