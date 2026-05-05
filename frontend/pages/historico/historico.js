// ==================== PÁGINA DE HISTÓRICO DE OS ====================

import { carregarHistoricoOS } from '../../js/services/historicoService.js';
import { mostrarToast } from '../../js/utils.js';

// Elementos do DOM
const formBuscar = document.getElementById('form-buscar-historico');
const inputOsId = document.getElementById('historico-os-id');
const feedbackEl = document.getElementById('historico-feedback');
const resultsEl = document.getElementById('historico-results');
const emptyEl = document.getElementById('historico-empty');
const loadingEl = document.getElementById('historico-loading');
const listaEl = document.getElementById('historico-lista');
const tituloEl = document.getElementById('historico-titulo');
const quantidadeEl = document.getElementById('historico-quantidade');

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    verificarConexao();
    formBuscar.addEventListener('submit', buscarHistorico);
});

// ==================== VERIFICAR CONEXÃO ====================
async function verificarConexao() {
    const badgeEl = document.getElementById('status-conexao');
    if (!badgeEl) return;

    try {
        const response = await fetch('http://localhost:8080/actuator/health');
        const conectado = response.ok;
        badgeEl.textContent = conectado ? '🟢 Conectado' : '🔴 Erro na conexão';
    } catch (error) {
        console.error('Erro ao verificar conexão:', error);
        badgeEl.textContent = '🔴 Desconectado';
    } finally {
        badgeEl.classList.remove('loading');
    }
}

// ==================== BUSCAR HISTÓRICO ====================
async function buscarHistorico(e) {
    e.preventDefault();

    const osId = inputOsId.value.trim();

    if (!osId || isNaN(osId) || parseInt(osId) <= 0) {
        mostrarFeedback(feedbackEl, '❌ Por favor, digite um ID válido', 'error');
        return;
    }

    // Mostrar loading
    emptyEl.style.display = 'none';
    resultsEl.style.display = 'block';
    loadingEl.style.display = 'flex';
    listaEl.innerHTML = '';
    feedbackEl.className = 'feedback';

    try {
        // Carregar dados
        const historico = await carregarHistoricoOS(osId);

        // Atualizar título e quantidade
        tituloEl.textContent = `Histórico da OS #${osId}`;

        // Renderizar resultados
        renderizarHistorico(historico, osId);

        mostrarToast('✅ Histórico carregado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao buscar histórico:', error);

        let mensagem = '❌ Erro ao carregar histórico';
        if (error.message.includes('não encontrada')) {
            mensagem = `❌ OS #${osId} não encontrada`;
        } else if (error.message.includes('inválido')) {
            mensagem = '❌ ID da OS inválido';
        }

        mostrarFeedback(feedbackEl, mensagem, 'error');
        loadingEl.style.display = 'none';
        listaEl.innerHTML = `
            <div class="item-empty">
                <div class="item-empty-icon">⚠️</div>
                <p>${mensagem}</p>
            </div>
        `;

        mostrarToast(mensagem, 'error');
    }
}

// ==================== RENDERIZAR HISTÓRICO ====================
function renderizarHistorico(historico, osId) {
    loadingEl.style.display = 'none';

    if (!historico || historico.length === 0) {
        quantidadeEl.textContent = '(0 registros)';
        listaEl.innerHTML = `
            <div class="item-empty">
                <div class="item-empty-icon">📋</div>
                <p>Nenhum histórico encontrado para a OS #${osId}</p>
            </div>
        `;
        return;
    }

    quantidadeEl.textContent = `(${historico.length} registro${historico.length !== 1 ? 's' : ''})`;

    // Renderizar tabela
    const tableHTML = `
        <table class="historico-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Data/Hora</th>
                    <th>Status</th>
                    <th>Observações</th>
                </tr>
            </thead>
            <tbody>
                ${historico.map(h => `
                    <tr>
                        <td class="cell-id">#${h.id}</td>
                        <td class="cell-data">${formatarDataHora(h.dataHora)}</td>
                        <td class="cell-status">${renderizarBadgeStatus(h.status)}</td>
                        <td class="cell-observacoes">${h.observacoes || '—'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    listaEl.innerHTML = tableHTML;
}

// ==================== FUNÇÕES AUXILIARES ====================

/**
 * Formatar data/hora para o padrão brasileiro (dd/MM/yyyy HH:mm:ss)
 */
function formatarDataHora(dataHora) {
    if (!dataHora) return '—';
    try {
        const d = new Date(dataHora);
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        const hora = String(d.getHours()).padStart(2, '0');
        const minuto = String(d.getMinutes()).padStart(2, '0');
        const segundo = String(d.getSeconds()).padStart(2, '0');
        return `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
    } catch {
        return dataHora;
    }
}

/**
 * Renderizar badge de status com cores apropriadas
 */
function renderizarBadgeStatus(status) {
    const statusMap = {
        'ABERTA': { icon: '🔵', label: 'Aberta', classe: 'status-aberta' },
        'EM_ANDAMENTO': { icon: '🟡', label: 'Em Andamento', classe: 'status-em-andamento' },
        'CONCLUIDA': { icon: '🟢', label: 'Concluída', classe: 'status-concluida' },
        'FINALIZADA': { icon: '🟢', label: 'Finalizada', classe: 'status-concluida' },
        'CANCELADA': { icon: '🔴', label: 'Cancelada', classe: 'status-cancelada' }
    };

    const config = statusMap[status] || { icon: '⚪', label: status, classe: 'status-unknown' };

    return `<span class="status-badge-inline ${config.classe}">${config.icon} ${config.label}</span>`;
}

/**
 * Mostrar feedback em um elemento
 */
function mostrarFeedback(elemento, mensagem, tipo) {
    if (!elemento) return;
    elemento.textContent = mensagem;
    elemento.className = `feedback show ${tipo}`;
}

// ==================== VERIFICAR CONEXÃO BACKEND ====================
async function verificarConexaoBackend() {
    try {
        const response = await fetch('http://localhost:8080/actuator/health');
        return response.ok;
    } catch {
        return false;
    }
}

