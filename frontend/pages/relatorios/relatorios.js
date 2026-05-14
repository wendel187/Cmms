// ==================== RELATÓRIOS PAGE ====================

import { carregarOrdensAbertas } from '../../js/api.js';
import { mostrarToast, formatarData, getPrioridadeBadge } from '../../js/utils.js';

let ordensAbertas = [];

export function inicializarRelatorios() {
    document.getElementById('btn-gerar-top-n')
        ?.addEventListener('click', () => renderTopN());
    document.getElementById('btn-recarregar-relatorios')
        ?.addEventListener('click', carregarRelatorios);
    carregarRelatorios();
}

async function carregarRelatorios() {
    mostrarLoadingTodos();
    try {
        ordensAbertas = await carregarOrdensAbertas();
        renderTopN();
        renderPorSetor();
        renderPorResponsavel();
    } catch (err) {
        console.error('[Relatórios] Erro:', err);
        mostrarToast('❌ Erro ao carregar dados dos relatórios', 'error');
    }
}

// ─── Top N por Prioridade ─────────────────────────────────────────────────────

function renderTopN() {
    const limite = parseInt(document.getElementById('input-top-n')?.value) || 10;
    const container = document.getElementById('relatorio-top-n-lista');
    if (!container) return;

    const top = [...ordensAbertas]
        .sort((a, b) => b.prioridade - a.prioridade)
        .slice(0, limite);

    if (top.length === 0) {
        container.innerHTML = vazioHTML('📋', 'Nenhuma OS aberta encontrada');
        return;
    }

    container.innerHTML = `<div class="top-n-list">${
        top.map((os, i) => {
            const classeP = classePrioridade(os.prioridade);
            const rankClass = i < 3 ? `rank-${i + 1}` : '';
            return `
                <div class="top-n-item ${classeP}">
                    <div class="top-n-rank ${rankClass}">#${i + 1}</div>
                    <div class="top-n-info">
                        <div class="top-n-descricao">OS #${os.id} — ${os.descricao || 'Sem descrição'}</div>
                        <div class="top-n-meta">
                            <span>🔧 ${os.nomeEquipamento || 'N/D'}</span>
                            <span>👨‍🔧 ${os.nomeTecnico || 'Sem responsável'}</span>
                            <span>📍 ${os.setor || 'N/D'}</span>
                            <span>📅 ${formatarData(os.dataAbertura)}</span>
                            <span>${os.tipo === 'CORRETIVA' ? '🔴 Corretiva' : '🟡 Preventiva'}</span>
                        </div>
                    </div>
                    <div class="top-n-prioridade">${getPrioridadeBadge(os.prioridade)}</div>
                </div>
            `;
        }).join('')
    }</div>`;
}

// ─── OS Abertas por Setor ─────────────────────────────────────────────────────

function renderPorSetor() {
    const container = document.getElementById('relatorio-por-setor');
    if (!container) return;

    const grupos = agruparPor(ordensAbertas, os => os.setor || 'Sem setor');

    if (grupos.size === 0) {
        container.innerHTML = vazioHTML('🏭', 'Nenhuma OS aberta encontrada');
        return;
    }

    container.innerHTML = `<div class="grupo-list">${
        [...grupos.entries()]
            .sort((a, b) => b[1].length - a[1].length)
            .map(([setor, lista]) => grupoHTML(setor, lista, '🏭'))
            .join('')
    }</div>`;

    ativarToggleGrupos(container);
}

// ─── OS Abertas por Responsável ───────────────────────────────────────────────

function renderPorResponsavel() {
    const container = document.getElementById('relatorio-por-responsavel');
    if (!container) return;

    const grupos = agruparPor(ordensAbertas, os => os.nomeTecnico || 'Sem responsável');

    if (grupos.size === 0) {
        container.innerHTML = vazioHTML('👨‍🔧', 'Nenhuma OS aberta encontrada');
        return;
    }

    container.innerHTML = `<div class="grupo-list">${
        [...grupos.entries()]
            .sort((a, b) => b[1].length - a[1].length)
            .map(([tecnico, lista]) => grupoHTML(tecnico, lista, '👨‍🔧'))
            .join('')
    }</div>`;

    ativarToggleGrupos(container);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function agruparPor(lista, keyFn) {
    return lista.reduce((map, item) => {
        const key = keyFn(item);
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(item);
        return map;
    }, new Map());
}

function grupoHTML(titulo, ordens, icon) {
    const ordensHTML = [...ordens]
        .sort((a, b) => b.prioridade - a.prioridade)
        .map(os => `
            <div class="grupo-os-item">
                <span class="grupo-os-id">OS #${os.id}</span>
                <span class="grupo-os-descricao" title="${os.descricao || ''}">${os.descricao || 'Sem descrição'}</span>
                <div class="grupo-os-meta">
                    <span>${getPrioridadeBadge(os.prioridade)}</span>
                    <span>${os.tipo === 'CORRETIVA' ? '🔴' : '🟡'}</span>
                </div>
            </div>
        `).join('');

    return `
        <div class="grupo-item">
            <div class="grupo-header">
                <div class="grupo-titulo">
                    ${icon} ${titulo}
                    <span class="grupo-badge">${ordens.length}</span>
                </div>
                <span class="grupo-seta">▼</span>
            </div>
            <div class="grupo-ordens">${ordensHTML}</div>
        </div>
    `;
}

function ativarToggleGrupos(container) {
    container.querySelectorAll('.grupo-header').forEach(header => {
        header.addEventListener('click', () => {
            header.closest('.grupo-item').classList.toggle('aberto');
        });
    });
}

function classePrioridade(p) {
    if (p >= 12) return 'prioridade-critica';
    if (p >= 8)  return 'prioridade-alta';
    if (p >= 4)  return 'prioridade-media';
    return 'prioridade-baixa';
}

function vazioHTML(icon, msg) {
    return `<div class="relatorio-vazio"><div class="relatorio-vazio-icon">${icon}</div><p>${msg}</p></div>`;
}

function mostrarLoadingTodos() {
    ['relatorio-top-n-lista', 'relatorio-por-setor', 'relatorio-por-responsavel'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = `<div class="relatorio-loading">⏳ Carregando...</div>`;
    });
}
