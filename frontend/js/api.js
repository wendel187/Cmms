import { API_BASE_URL, API_ENDPOINTS, PAGINATION } from './config.js';

async function fazerRequisicao(endpoint, method = 'GET', dados = null) {
    const opcoes = {
        method,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    };

    if (dados && (method === 'POST' || method === 'PUT')) {
        opcoes.body = JSON.stringify(dados);
    }

    const resposta = await fetch(`${API_BASE_URL}${endpoint}`, opcoes);

    if (!resposta.ok) {
        const mensagem = await resposta.text().catch(() => '');
        throw new Error(mensagem || `Erro ${resposta.status}: ${resposta.statusText}`);
    }

    if (resposta.status === 204 || resposta.headers.get('content-length') === '0') {
        return null;
    }

    return resposta.json();
}

export async function verificarConexao() {
    try {
        await fazerRequisicao(`${API_ENDPOINTS.tecnicos}?page=0&size=1`);
        return true;
    } catch {
        return false;
    }
}

// ==================== TÉCNICOS ====================

export async function carregarTecnicos() {
    const res = await fazerRequisicao(
        `${API_ENDPOINTS.tecnicos}?page=${PAGINATION.PAGE}&size=${PAGINATION.SIZE}`
    );
    return res.content || [];
}

export async function carregarTecnico(id) {
    return fazerRequisicao(API_ENDPOINTS.tecnico(id));
}

export async function criarTecnico(dados) {
    return fazerRequisicao(API_ENDPOINTS.tecnicos, 'POST', dados);
}

// BUG CORRIGIDO: era enviado para /tecnico (lista) em vez de /tecnico/{id}
export async function atualizarTecnico(id, dados) {
    return fazerRequisicao(API_ENDPOINTS.tecnico(id), 'PUT', dados);
}

export async function desativarTecnico(id) {
    return fazerRequisicao(API_ENDPOINTS.tecnico(id), 'DELETE');
}

// ==================== EQUIPAMENTOS ====================

export async function carregarEquipamentos() {
    const res = await fazerRequisicao(
        `${API_ENDPOINTS.equipamentos}?page=${PAGINATION.PAGE}&size=${PAGINATION.SIZE}`
    );
    return res.content || [];
}

export async function carregarEquipamento(id) {
    return fazerRequisicao(API_ENDPOINTS.equipamento(id));
}

export async function criarEquipamento(dados) {
    return fazerRequisicao(API_ENDPOINTS.equipamentos, 'POST', dados);
}

// BUG CORRIGIDO: era enviado para /equipamento (lista) em vez de /equipamento/{id}
export async function atualizarEquipamento(id, dados) {
    return fazerRequisicao(API_ENDPOINTS.equipamento(id), 'PUT', dados);
}

export async function deletarEquipamento(id) {
    return fazerRequisicao(API_ENDPOINTS.equipamento(id), 'DELETE');
}

// ==================== ORDENS DE SERVIÇO ====================

export async function carregarOrdensAbertas() {
    return fazerRequisicao(API_ENDPOINTS.ordensAbertas);
}

export async function carregarTodasOrdens() {
    const res = await fazerRequisicao(
        `${API_ENDPOINTS.ordens}?page=${PAGINATION.PAGE}&size=${PAGINATION.SIZE}`
    );
    return res.content || [];
}

export async function carregarOrdem(id) {
    return fazerRequisicao(API_ENDPOINTS.ordem(id));
}

export async function criarOSCorretiva(dados) {
    return fazerRequisicao(API_ENDPOINTS.ordemCorretiva, 'POST', dados);
}

export async function criarOSPreventiva(dados) {
    return fazerRequisicao(API_ENDPOINTS.ordemPreventiva, 'POST', dados);
}

export async function atualizarOS(id, dados) {
    return fazerRequisicao(API_ENDPOINTS.ordem(id), 'PUT', dados);
}

export async function atualizarStatusOS(id, novoStatus, observacoes = '') {
    return fazerRequisicao('/ordens-servico/status', 'PUT', { id, novoStatus, observacoes });
}

export async function cancelarOrdemServico(id) {
    return fazerRequisicao(API_ENDPOINTS.ordem(id), 'DELETE');
}

// ==================== HISTÓRICO ====================

export async function carregarHistoricoOS(osId) {
    if (!osId || isNaN(osId)) throw new Error('ID da Ordem de Serviço inválido');
    return fazerRequisicao(`/ordens-servico/${osId}/historico`);
}
