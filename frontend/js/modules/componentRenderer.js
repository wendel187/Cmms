// ==================== RENDERIZADOR DE COMPONENTES ====================
// Responsabilidade: Gerar HTML para listas e componentes recorrentes

import { getStatusBadge, getCriticidadeBadge, getPrioridadeBadge, formatarData } from '../utils.js';

/**
 * Criar card vazio para quando não há dados
 * @param {string} iconemoji - Emoji do ícone
 * @param {string} mensagem - Mensagem a exibir
 * @returns {string} HTML do card vazio
 */
function renderizarCardVazio(iconEmoji, mensagem) {
    return `
        <div class="item-empty">
            <div class="item-empty-icon">${iconEmoji}</div>
            <p>${mensagem}</p>
        </div>
    `;
}

/**
 * Renderizar card de técnico
 * @param {Object} tecnico - Dados do técnico
 * @param {boolean} expandido - Se deve usar card expandido
 * @returns {string} HTML do card
 */
export function renderizarTecnico(tecnico, expandido = false) {
    const cardClass = expandido ? 'item-card-large' : 'item-card';
    
    return `
        <div class="${cardClass}">
            <div class="item-title">👨‍🔧 ${tecnico.nome}</div>
            <div class="item-detail">
                <div class="item-detail-row">
                    <span class="item-detail-label">Email:</span>
                    <span>${tecnico.email}</span>
                </div>
                <div class="item-detail-row">
                    <span class="item-detail-label">Telefone:</span>
                    <span>${tecnico.telefone}</span>
                </div>
                <div class="item-detail-row">
                    <span class="item-detail-label">Especialidade:</span>
                    <span><strong>${tecnico.especialidade}</strong></span>
                </div>
                <div class="item-detail-row">
                    <span class="item-detail-label">Setor:</span>
                    <span>${tecnico.setor}</span>
                </div>
                <div class="item-detail-row">
                    <span class="item-detail-label">Status:</span>
                    <span>${getStatusBadge(tecnico.status)}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Renderizar card de equipamento
 * @param {Object} equipamento - Dados do equipamento
 * @param {boolean} expandido - Se deve usar card expandido
 * @returns {string} HTML do card
 */
export function renderizarEquipamento(equipamento, expandido = false) {
    const cardClass = expandido ? 'item-card-large' : 'item-card';
    
    return `
        <div class="${cardClass}">
            <div class="item-title">🔧 ${equipamento.nome}${!expandido ? ` (${equipamento.codigo})` : ''}</div>
            <div class="item-detail">
                ${expandido ? `
                    <div class="item-detail-row">
                        <span class="item-detail-label">Código:</span>
                        <span><strong>${equipamento.codigo}</strong></span>
                    </div>
                ` : ''}
                <div class="item-detail-row">
                    <span class="item-detail-label">Setor:</span>
                    <span>${equipamento.setor}</span>
                </div>
                <div class="item-detail-row">
                    <span class="item-detail-label">Criticidade:</span>
                    <span>${getCriticidadeBadge(equipamento.criticidade)}</span>
                </div>
                <div class="item-detail-row">
                    <span class="item-detail-label">Status:</span>
                    <span>${getStatusBadge(equipamento.status)}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Renderizar card de ordem de serviço
 * @param {Object} ordem - Dados da ordem
 * @param {boolean} expandido - Se deve usar card expandido
 * @returns {string} HTML do card
 */
export function renderizarOrdem(ordem, expandido = false) {
    const cardClass = expandido ? 'item-card-large' : 'item-card';
    const descricaoCompleta = ordem.descricao || '';
    const descricaoLimitada = expandido 
        ? descricaoCompleta.substring(0, 60) 
        : descricaoCompleta.substring(0, 50);
    
    return `
        <div class="${cardClass}">
            <div class="item-title">📋 OS #${ordem.id} - ${descricaoLimitada}...</div>
            <div class="item-detail">
                <div class="item-detail-row">
                    <span class="item-detail-label">Setor:</span>
                    <span>${ordem.setor}</span>
                </div>
                <div class="item-detail-row">
                    <span class="item-detail-label">Status:</span>
                    <span>${getStatusBadge(ordem.status)}</span>
                </div>
                <div class="item-detail-row">
                    <span class="item-detail-label">Prioridade:</span>
                    <span>${getPrioridadeBadge(ordem.prioridade)}</span>
                </div>
                <div class="item-detail-row">
                    <span class="item-detail-label">Abertura:</span>
                    <span>${formatarData(ordem.dataAbertura)}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Renderizar lista de técnicos
 * @param {HTMLElement} containerElement - Elemento container
 * @param {Array} tecnicos - Lista de técnicos
 * @param {boolean} expandido - Se deve usar cards expandidos
 */
export function renderizarListaTecnicos(containerElement, tecnicos, expandido = false) {
    if (!containerElement) return;

    if (!tecnicos || tecnicos.length === 0) {
        containerElement.innerHTML = renderizarCardVazio('👨‍🔧', 'Nenhum técnico cadastrado');
        return;
    }

    containerElement.innerHTML = tecnicos
        .map(t => renderizarTecnico(t, expandido))
        .join('');
}

/**
 * Renderizar lista de equipamentos
 * @param {HTMLElement} containerElement - Elemento container
 * @param {Array} equipamentos - Lista de equipamentos
 * @param {boolean} expandido - Se deve usar cards expandidos
 */
export function renderizarListaEquipamentos(containerElement, equipamentos, expandido = false) {
    if (!containerElement) return;

    if (!equipamentos || equipamentos.length === 0) {
        containerElement.innerHTML = renderizarCardVazio('🔧', 'Nenhum equipamento cadastrado');
        return;
    }

    containerElement.innerHTML = equipamentos
        .map(e => renderizarEquipamento(e, expandido))
        .join('');
}

/**
 * Renderizar lista de ordens
 * @param {HTMLElement} containerElement - Elemento container
 * @param {Array} ordens - Lista de ordens
 * @param {boolean} expandido - Se deve usar cards expandidos
 */
export function renderizarListaOrdens(containerElement, ordens, expandido = false) {
    if (!containerElement) return;

    if (!Array.isArray(ordens) || ordens.length === 0) {
        containerElement.innerHTML = renderizarCardVazio('📋', 'Nenhuma ordem aberta');
        return;
    }

    containerElement.innerHTML = ordens
        .map(o => renderizarOrdem(o, expandido))
        .join('');
}

/**
 * Renderizar mensagem de erro
 * @param {HTMLElement} containerElement - Elemento container
 * @param {string} mensagem - Mensagem de erro
 */
export function renderizarErro(containerElement, mensagem = 'Erro ao carregar dados') {
    if (!containerElement) return;
    containerElement.innerHTML = `<div class="error-message">❌ ${mensagem}</div>`;
}

