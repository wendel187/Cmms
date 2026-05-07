// ==================== GERENCIADOR DE REQUISIÇÕES ====================
// Responsabilidade: Abstrair e centralizar todas as chamadas HTTP

import { API_BASE_URL } from '../config.js';
import { mostrarToast } from '../utils.js';

/**
 * Tipos de requisição HTTP
 */
const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
};

/**
 * Realizar requisição genérica
 * @param {string} endpoint - Endpoint da API
 * @param {string} method - Método HTTP
 * @param {Object} dados - Dados a enviar (para POST/PUT)
 * @param {Object} opcoes - Opções adicionais
 * @returns {Promise<Object>} Resposta da API
 */
async function fazerRequisicao(endpoint, method = HTTP_METHODS.GET, dados = null, opcoes = {}) {
    try {
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...opcoes.headers
            }
        };

        if (dados && (method === HTTP_METHODS.POST || method === HTTP_METHODS.PUT)) {
            config.body = JSON.stringify(dados);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            const erro = await response.text();
            throw new Error(erro || `Erro HTTP ${response.status}`);
        }

        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error(`Erro na requisição ${method} ${endpoint}:`, error);
        throw error;
    }
}

/**
 * Fazer requisição GET
 */
export async function get(endpoint) {
    return fazerRequisicao(endpoint, HTTP_METHODS.GET);
}

/**
 * Fazer requisição POST
 */
export async function post(endpoint, dados) {
    return fazerRequisicao(endpoint, HTTP_METHODS.POST, dados);
}

/**
 * Fazer requisição PUT
 */
export async function put(endpoint, dados) {
    return fazerRequisicao(endpoint, HTTP_METHODS.PUT, dados);
}

/**
 * Fazer requisição DELETE
 */
export async function del(endpoint) {
    return fazerRequisicao(endpoint, HTTP_METHODS.DELETE);
}

// ==================== OPERAÇÕES TÉCNICO ====================

export async function buscarTecnicos() {
    return get('/tecnico?page=0&size=100')
        .then(res => res.content || [])
        .catch(err => {
            console.error('Erro ao buscar técnicos:', err);
            return [];
        });
}

export async function buscarTecnico(id) {
    return get(`/tecnico/${id}`);
}

export async function criarTecnico(dados) {
    return post('/tecnico', dados);
}

export async function atualizarTecnico(id, dados) {
    console.log(`🔄 Enviando PUT para /tecnico/${id}`, { id, dados });
    return put(`/tecnico/${id}`, dados);
}

export async function deletarTecnico(id) {
    return del(`/tecnico/${id}`);
}

// ==================== OPERAÇÕES EQUIPAMENTO ====================

export async function buscarEquipamentos() {
    return get('/equipamento?page=0&size=100')
        .then(res => res.content || [])
        .catch(err => {
            console.error('Erro ao buscar equipamentos:', err);
            return [];
        });
}

export async function buscarEquipamento(id) {
    return get(`/equipamento/${id}`);
}

export async function criarEquipamento(dados) {
    return post('/equipamento', dados);
}

export async function atualizarEquipamento(id, dados) {
    console.log(`🔄 Enviando PUT para /equipamento/${id}`, { id, dados });
    return put(`/equipamento/${id}`, dados);
}

export async function deletarEquipamento(id) {
    return del(`/equipamento/${id}`);
}

// ==================== OPERAÇÕES ORDEM DE SERVIÇO ====================

export async function buscarOrdensAbertas() {
    return get('/ordens-servico/abertas')
        .catch(err => {
            console.error('Erro ao buscar ordens:', err);
            return [];
        });
}

export async function buscarOrdem(id) {
    return get(`/ordens-servico/${id}`);
}

export async function criarOSCorretiva(dados) {
    return post('/ordens-servico/corretiva', dados);
}

export async function criarOSPreventiva(dados) {
    return post('/ordens-servico/preventiva', dados);
}

export async function atualizarStatusOS(id, novoStatus, observacoes = '') {
    return put('/ordens-servico/status', {
        id,
        novoStatus,
        observacoes
    });
}

export async function atualizarOS(id, dados) {
    console.log(`🔄 Enviando PUT para /ordens-servico/${id}`, { id, dados });
    return put(`/ordens-servico/${id}`, dados);
}

export async function deletarOrdem(id) {
    return del(`/ordens-servico/${id}`);
}

// ==================== VERIFICAÇÃO DE SAÚDE ====================

export async function verificarConexaoBackend() {
    try {
        await get('/tecnico?page=0&size=1');
        return true;
    } catch {
        return false;
    }
}

/**
 * Executar requisição com feedback automático
 * @param {Function} funcaoRequisicao - Função que faz a requisição
 * @param {string} mensagemSucesso - Mensagem de sucesso
 * @param {string} mensagemErro - Mensagem de erro
 * @returns {Promise<*>} Resultado da requisição
 */
export async function comFeedback(funcaoRequisicao, mensagemSucesso = 'Operação concluída', mensagemErro = 'Erro na operação') {
    try {
        const resultado = await funcaoRequisicao();
        mostrarToast(mensagemSucesso, 'success');
        return resultado;
    } catch (error) {
        mostrarToast(`${mensagemErro}: ${error.message}`, 'error');
        throw error;
    }
}

