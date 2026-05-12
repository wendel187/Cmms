import { carregarHistoricoOS } from '../../js/api.js';
import { mostrarToast, mostrarFeedback } from '../../js/utils.js';

const formBuscar   = document.getElementById('form-buscar-historico');
const inputOsId    = document.getElementById('historico-os-id');
const feedbackEl   = document.getElementById('historico-feedback');
const resultsEl    = document.getElementById('historico-results');
const emptyEl      = document.getElementById('historico-empty');
const loadingEl    = document.getElementById('historico-loading');
const listaEl      = document.getElementById('historico-lista');
const tituloEl     = document.getElementById('historico-titulo');
const quantidadeEl = document.getElementById('historico-quantidade');

document.addEventListener('DOMContentLoaded', () => {
    formBuscar.addEventListener('submit', buscarHistorico);
});

async function buscarHistorico(e) {
    e.preventDefault();
    const osId = inputOsId.value.trim();

    if (!osId || isNaN(osId) || parseInt(osId) <= 0) {
        mostrarFeedback(feedbackEl, '❌ Por favor, digite um ID válido', 'error');
        return;
    }

    emptyEl.style.display   = 'none';
    resultsEl.style.display  = 'block';
    loadingEl.style.display  = 'flex';
    listaEl.innerHTML        = '';
    feedbackEl.className     = 'feedback';

    try {
        const historico = await carregarHistoricoOS(osId);
        tituloEl.textContent = `Histórico da OS #${osId}`;
        renderizarHistorico(historico, osId);
        mostrarToast('✅ Histórico carregado com sucesso!', 'success');
    } catch (error) {
        let mensagem = '❌ Erro ao carregar histórico';
        if (error.message.includes('não encontrada')) mensagem = `❌ OS #${osId} não encontrada`;
        else if (error.message.includes('inválido'))  mensagem = '❌ ID da OS inválido';

        mostrarFeedback(feedbackEl, mensagem, 'error');
        loadingEl.style.display = 'none';
        listaEl.innerHTML = `
            <div class="item-empty">
                <div class="item-empty-icon">⚠️</div>
                <p>${mensagem}</p>
            </div>`;
        mostrarToast(mensagem, 'error');
    }
}

function renderizarHistorico(historico, osId) {
    loadingEl.style.display = 'none';

    if (!historico || historico.length === 0) {
        quantidadeEl.textContent = '(0 registros)';
        listaEl.innerHTML = `
            <div class="item-empty">
                <div class="item-empty-icon">📋</div>
                <p>Nenhum histórico encontrado para a OS #${osId}</p>
            </div>`;
        return;
    }

    quantidadeEl.textContent = `(${historico.length} registro${historico.length !== 1 ? 's' : ''})`;
    listaEl.innerHTML = `
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
                    </tr>`).join('')}
            </tbody>
        </table>`;
}

function formatarDataHora(dataHora) {
    if (!dataHora) return '—';
    try {
        const d = new Date(dataHora);
        return [
            String(d.getDate()).padStart(2, '0'),
            String(d.getMonth() + 1).padStart(2, '0'),
            d.getFullYear()
        ].join('/') + ' ' + [
            String(d.getHours()).padStart(2, '0'),
            String(d.getMinutes()).padStart(2, '0'),
            String(d.getSeconds()).padStart(2, '0')
        ].join(':');
    } catch {
        return dataHora;
    }
}

function renderizarBadgeStatus(status) {
    const mapa = {
        'ABERTA':       { icon: '🔵', label: 'Aberta',      classe: 'status-aberta' },
        'EM_ANDAMENTO': { icon: '🟡', label: 'Em Andamento', classe: 'status-em-andamento' },
        'CONCLUIDA':    { icon: '🟢', label: 'Concluída',    classe: 'status-concluida' },
        'FINALIZADA':   { icon: '🟢', label: 'Finalizada',   classe: 'status-concluida' },
        'CANCELADA':    { icon: '🔴', label: 'Cancelada',    classe: 'status-cancelada' }
    };
    const cfg = mapa[status] || { icon: '⚪', label: status, classe: 'status-unknown' };
    return `<span class="status-badge-inline ${cfg.classe}">${cfg.icon} ${cfg.label}</span>`;
}
