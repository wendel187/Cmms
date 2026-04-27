// ==================== GERENCIADOR DE NAVEGAÇÃO ====================
// Responsabilidade: Controlar mudança de abas, listagens e tipos de OS

import { API_BASE_URL } from './config.js';

/**
 * Mapeamento de abas dinâmicas com suas ações de carregamento
 */
const TAB_HANDLERS = {
    'tecnicos': () => carregarTecnicosPage(),
    'equipamentos': () => carregarEquipamentosPage(),
    'ordens': () => carregarOrdensPage(),
    'atualizar-tecnico': () => carregarTecnicos(),
    'atualizar-os': () => Promise.all([carregarOrdens(), carregarTecnicos()])
};

/**
 * Ativar aba específica e executar ações associadas
 * @param {string} tabName - Nome da aba a ativar
 */
export function ativarAba(tabName) {
    // Desativar todas as abas
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    // Ativar aba selecionada
    const tabElement = document.getElementById(`${tabName}-tab`);
    if (tabElement) {
        tabElement.classList.add('active');
    }

    // Ativar botão correspondente
    const button = document.querySelector(`[data-tab="${tabName}"]`);
    if (button) {
        button.classList.add('active');
    }

    // Executar ações de carregamento se existirem
    if (TAB_HANDLERS[tabName]) {
        setTimeout(() => TAB_HANDLERS[tabName](), 100);
    }
}

/**
 * Ativar listagem específica
 * @param {string} listingType - Tipo de listagem
 * @param {Event} event - Evento do clique
 */
export function ativarListagem(listingType, event) {
    document.querySelectorAll('.listagem-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.listagem-btn').forEach(el => el.classList.remove('active'));

    const contentElement = document.getElementById(`listagem-${listingType}`);
    if (contentElement) {
        contentElement.classList.add('active');
    }

    const button = event.target.closest('.listagem-btn');
    if (button) {
        button.classList.add('active');
    }
}

/**
 * Ativar tipo de OS (Corretiva/Preventiva)
 * @param {string} osType - Tipo de OS
 * @param {Event} event - Evento do clique
 */
export function ativarTipoOS(osType, event) {
    document.querySelectorAll('.requisicao-form-container').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tipo-btn').forEach(el => el.classList.remove('active'));

    const formContainer = document.getElementById(`form-${osType}-container`);
    if (formContainer) {
        formContainer.classList.add('active');
    }

    const button = event.target.closest('.tipo-btn');
    if (button) {
        button.classList.add('active');
    }
}

// Funções vazias como placeholders para as funções reais
// Elas serão importadas do módulo de carregamento
let carregarTecnicosPage = () => {};
let carregarEquipamentosPage = () => {};
let carregarOrdensPage = () => {};
let carregarTecnicos = () => {};
let carregarOrdens = () => {};

export function setCarregadores(handlers) {
    carregarTecnicosPage = handlers.carregarTecnicosPage;
    carregarEquipamentosPage = handlers.carregarEquipamentosPage;
    carregarOrdensPage = handlers.carregarOrdensPage;
    carregarTecnicos = handlers.carregarTecnicos;
    carregarOrdens = handlers.carregarOrdens;
}

