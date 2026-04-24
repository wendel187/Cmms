// ==================== UTILIDADES GERAIS ====================

import { STATUS_BADGES, CRITICIDADE_BADGES } from './config.js';

/**
 * Formata uma data para o padrão brasileiro
 * @param {string|Date} data - Data a formatar
 * @returns {string} Data formatada
 */
export function formatarData(data) {
    if (!data) return '-';
    try {
        const d = new Date(data);
        return d.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return data;
    }
}

/**
 * Retorna badge de status formatado
 * @param {string} status - Status
 * @returns {string} Badge HTML
 */
export function getStatusBadge(status) {
    return STATUS_BADGES[status] || status;
}

/**
 * Retorna badge de criticidade formatado
 * @param {string} criticidade - Criticidade
 * @returns {string} Badge HTML
 */
export function getCriticidadeBadge(criticidade) {
    return CRITICIDADE_BADGES[criticidade] || criticidade;
}

/**
 * Calcula prioridade e retorna badge
 * @param {number} prioridade - Número de prioridade
 * @returns {string} Badge HTML
 */
export function getPrioridadeBadge(prioridade) {
    if (prioridade >= 12) return '🔴 Crítica';
    if (prioridade >= 8) return '🟠 Alta';
    if (prioridade >= 4) return '🟡 Média';
    return '🟢 Baixa';
}

/**
 * Mostra feedback em um elemento
 * @param {HTMLElement} elemento - Elemento para mostrar feedback
 * @param {string} mensagem - Mensagem a mostrar
 * @param {string} tipo - Tipo (success, error, info)
 */
export function mostrarFeedback(elemento, mensagem, tipo) {
    if (!elemento) return;
    elemento.textContent = mensagem;
    elemento.className = `feedback show ${tipo}`;
}

/**
 * Mostra toast notification
 * @param {string} mensagem - Mensagem a mostrar
 * @param {string} tipo - Tipo (success, error, info)
 */
export function mostrarToast(mensagem, tipo = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = mensagem;
    toast.className = `toast show ${tipo}`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

/**
 * Limpa um formulário
 * @param {string} formId - ID do formulário
 */
export function limparFormulario(formId) {
    const form = document.getElementById(formId);
    if (form) form.reset();
}

/**
 * Alterna classe ativa de um elemento
 * @param {string} elementId - ID do elemento
 * @param {string} className - Nome da classe
 */
export function alternarClasse(elementId, className) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.classList.toggle(className);
    }
}

/**
 * Adiciona classe ativa a um elemento
 * @param {string} elementId - ID do elemento
 * @param {string} className - Nome da classe
 */
export function adicionarClasse(elementId, className) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.classList.add(className);
    }
}

/**
 * Remove classe de um elemento
 * @param {string} elementId - ID do elemento
 * @param {string} className - Nome da classe
 */
export function removerClasse(elementId, className) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.classList.remove(className);
    }
}

/**
 * Obtém valor de um input
 * @param {string} inputId - ID do input
 * @returns {string} Valor do input
 */
export function obterValor(inputId) {
    const input = document.getElementById(inputId);
    return input ? input.value : '';
}

/**
 * Define valor de um input
 * @param {string} inputId - ID do input
 * @param {string} valor - Valor a definir
 */
export function definirValor(inputId, valor) {
    const input = document.getElementById(inputId);
    if (input) input.value = valor || '';
}

/**
 * Verifica se um elemento existe no DOM
 * @param {string} elementId - ID do elemento
 * @returns {boolean}
 */
export function elementoExiste(elementId) {
    return document.getElementById(elementId) !== null;
}

/**
 * Oculta um elemento
 * @param {string} elementId - ID do elemento
 */
export function ocultarElemento(elementId) {
    const elemento = document.getElementById(elementId);
    if (elemento) elemento.style.display = 'none';
}

/**
 * Mostra um elemento
 * @param {string} elementId - ID do elemento
 * @param {string} display - Tipo de display (block, flex, grid, etc)
 */
export function mostrarElemento(elementId, display = 'block') {
    const elemento = document.getElementById(elementId);
    if (elemento) elemento.style.display = display;
}

/**
 * Extrai dados de um formulário para objeto
 * @param {string} formId - ID do formulário
 * @returns {Object} Dados do formulário
 */
export function obterDadosFormulario(formId) {
    const form = document.getElementById(formId);
    if (!form) return {};
    
    const formData = new FormData(form);
    const dados = {};
    
    formData.forEach((value, key) => {
        // Handle checkboxes
        if (form.elements[key] && form.elements[key].type === 'checkbox') {
            dados[key] = form.elements[key].checked;
        } else {
            dados[key] = value;
        }
    });
    
    return dados;
}

/**
 * Preenche formulário com dados
 * @param {string} formId - ID do formulário
 * @param {Object} dados - Dados a preencher
 */
export function preencherFormulario(formId, dados) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    Object.keys(dados).forEach(key => {
        const input = form.elements[key];
        if (input) {
            if (input.type === 'checkbox') {
                input.checked = dados[key];
            } else {
                input.value = dados[key] || '';
            }
        }
    });
}
