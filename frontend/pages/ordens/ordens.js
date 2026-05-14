import {
    carregarTodasOrdens,
    carregarOrdem,
    carregarTecnicos,
    carregarEquipamentos,
} from '../../js/api.js';
import { mostrarToast, formatarData, getPrioridadeBadge } from '../../js/utils.js';
import { mostrarModal, fecharModal } from '../../js/modal.js';

let ordensGlobal = [];
let _inicializado = false;

const TIPO_LABEL = { CORRETIVA: 'Corretiva', PREVENTIVA: 'Preventiva' };
const STATUS_LABEL = {
    ABERTA: 'Aberta',
    EM_ANDAMENTO: 'Em Andamento',
    PAUSADA: 'Pausada',
    CONCLUIDA: 'Concluída',
    CANCELADA: 'Cancelada',
};

// ─── Ponto de entrada ────────────────────────────────────────────────────────

export function inicializarOrdens() {
    if (!_inicializado) {
        setupHandlers();
        _inicializado = true;
    }
    carregarTudo();
}

function setupHandlers() {
    document.getElementById('btn-recarregar-ordens').onclick = () => {
        mostrarToast('🔄 Recarregando...', 'info');
        carregarTudo();
    };

    ['filtro-status', 'filtro-tipo', 'filtro-tecnico', 'filtro-equipamento'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.onchange = filtrarOrdens;
    });
}

// ─── Carregamento de dados ────────────────────────────────────────────────────

async function carregarTudo() {
    mostrarLoading();

    const [tecnicos, equipamentos, ordens] = await Promise.all([
        carregarTecnicos().catch(err => { console.error('[Ordens] Erro GET técnicos:', err); return []; }),
        carregarEquipamentos().catch(err => { console.error('[Ordens] Erro GET equipamentos:', err); return []; }),
        carregarTodasOrdens().catch(err => { console.error('[Ordens] Erro GET ordens:', err); return null; }),
    ]);

    popularSelectTecnicos(tecnicos);
    popularSelectEquipamentos(equipamentos);

    if (ordens === null) {
        mostrarErro();
        mostrarToast('❌ Erro ao carregar ordens', 'error');
        return;
    }

    ordensGlobal = ordens;
    filtrarOrdens(); // aplica filtros ativos ao renderizar
}

function popularSelectTecnicos(tecnicos) {
    const el = document.getElementById('filtro-tecnico');
    if (!el) return;
    el.innerHTML = '<option value="">Todos</option>' +
        tecnicos.map(t => `<option value="${t.id}">${t.nome}</option>`).join('');
}

function popularSelectEquipamentos(equipamentos) {
    const el = document.getElementById('filtro-equipamento');
    if (!el) return;
    el.innerHTML = '<option value="">Todos</option>' +
        equipamentos.map(e => `<option value="${e.id}">${e.nome}</option>`).join('');
}

// ─── Filtragem ────────────────────────────────────────────────────────────────

function filtrarOrdens() {
    const status       = document.getElementById('filtro-status')?.value      || '';
    const tipo         = document.getElementById('filtro-tipo')?.value         || '';
    const tecnicoId    = document.getElementById('filtro-tecnico')?.value     || '';
    const equipId      = document.getElementById('filtro-equipamento')?.value || '';

    renderizar(ordensGlobal.filter(o => {
        if (status    && o.status          !== status)              return false;
        if (tipo      && o.tipo            !== tipo)                return false;
        if (tecnicoId && String(o.tecnicoId)   !== tecnicoId)      return false;
        if (equipId   && String(o.equipamentoId) !== equipId)      return false;
        return true;
    }));
}

// ─── Renderização ─────────────────────────────────────────────────────────────

function renderizar(lista) {
    const el = document.getElementById('ordens-list');
    if (!el) return;

    if (!lista || lista.length === 0) {
        el.innerHTML = `
            <div class="item-empty">
                <div class="item-empty-icon">📋</div>
                <p>Nenhuma ordem de serviço encontrada</p>
            </div>`;
        return;
    }

    el.innerHTML = lista.map(o => {
        const tipoCss   = (o.tipo   || '').toLowerCase();
        const statusCss = (o.status || '').toLowerCase().replace('_', '-');

        return `
        <div class="item-card os-card" data-id="${o.id}" style="cursor:pointer">
            <div class="item-title">📋 OS #${o.id}</div>
            <div class="item-detail">
                <div class="item-detail-row">
                    <span class="item-detail-label">Tipo:</span>
                    <span class="tipo-badge ${tipoCss}">${TIPO_LABEL[o.tipo] || o.tipo || 'N/A'}</span>
                </div>
                <div class="item-detail-row">
                    <span class="item-detail-label">Status:</span>
                    <span class="status-badge ${statusCss}">${STATUS_LABEL[o.status] || o.status || 'N/A'}</span>
                </div>
                <div class="item-detail-row">
                    <span class="item-detail-label">Equipamento:</span>
                    <span>${o.nomeEquipamento || resolverNomeEquipamento(o.equipamentoId)}</span>
                </div>
                <div class="item-detail-row">
                    <span class="item-detail-label">Técnico:</span>
                    <span>${o.nomeTecnico || resolverNomeTecnico(o.tecnicoId)}</span>
                </div>
                <div class="item-detail-row">
                    <span class="item-detail-label">Prioridade:</span>
                    <span>${getPrioridadeBadge(o.prioridade)}</span>
                </div>
                <div class="item-detail-row">
                    <span class="item-detail-label">Data Abertura:</span>
                    <span>${o.dataAbertura ? formatarData(o.dataAbertura) : 'N/A'}</span>
                </div>
            </div>
        </div>`;
    }).join('');

    el.querySelectorAll('.os-card').forEach(card => {
        card.addEventListener('click', () => abrirDetalhes(card.dataset.id));
    });
}

function resolverNomeTecnico(id) {
    if (!id) return 'Não atribuído';
    const opt = document.querySelector(`#filtro-tecnico option[value="${id}"]`);
    return opt ? opt.textContent : `Técnico #${id}`;
}

function resolverNomeEquipamento(id) {
    if (!id) return 'N/A';
    const opt = document.querySelector(`#filtro-equipamento option[value="${id}"]`);
    return opt ? opt.textContent : `Equipamento #${id}`;
}

// ─── Modal de detalhes ────────────────────────────────────────────────────────

async function abrirDetalhes(id) {
    try {
        const o = await carregarOrdem(id);
        mostrarModal(`OS #${o.id} — Detalhes`, `
            <div class="detalhes-ordem">
                <p><strong>Tipo:</strong>          ${TIPO_LABEL[o.tipo]   || o.tipo   || '—'}</p>
                <p><strong>Status:</strong>        ${STATUS_LABEL[o.status] || o.status || '—'}</p>
                <p><strong>Equipamento:</strong>   ${o.nomeEquipamento || resolverNomeEquipamento(o.equipamentoId)}</p>
                <p><strong>Técnico:</strong>       ${o.nomeTecnico     || resolverNomeTecnico(o.tecnicoId)}</p>
                <p><strong>Setor:</strong>         ${o.setor           || '—'}</p>
                <p><strong>Prioridade:</strong>    ${getPrioridadeBadge(o.prioridade)}</p>
                <p><strong>Data Abertura:</strong> ${o.dataAbertura ? formatarData(o.dataAbertura) : '—'}</p>
                <p><strong>Descrição:</strong>     ${o.descricao       || '—'}</p>
            </div>`,
            [{ label: 'Fechar', classe: 'btn-secondary', callback: fecharModal }]
        );
    } catch {
        mostrarToast('❌ Erro ao carregar detalhes da OS', 'error');
    }
}

// ─── Estados de UI ────────────────────────────────────────────────────────────

function mostrarLoading() {
    const el = document.getElementById('ordens-list');
    if (el) el.innerHTML = '<div class="loading-spinner"><span>⏳ Carregando ordens...</span></div>';
}

function mostrarErro() {
    const el = document.getElementById('ordens-list');
    if (el) el.innerHTML = '<div class="item-empty"><div class="item-empty-icon">❌</div><p>Erro ao carregar ordens</p></div>';
}
