import {
    carregarOrdem as buscarOrdem,
    atualizarOS,
    cancelarOrdemServico,
} from '../../js/api.js';
import { mostrarToast, getPrioridadeBadge } from '../../js/utils.js';

let _onAtualizado = null;
let _osAtual = null;

export function inicializarAtualizarOS({ onAtualizado } = {}) {
    _onAtualizado = onAtualizado;

    document.getElementById('atualizar-os-id')
        ?.addEventListener('change', e => carregarDadosOS(e.target.value));

    document.getElementById('btn-editar-os')
        ?.addEventListener('click', abrirEdicaoOS);

    document.getElementById('btn-cancelar-edicao-os')
        ?.addEventListener('click', fecharEdicaoOS);

    document.getElementById('btn-cancelar-os-action')
        ?.addEventListener('click', cancelarOSSelecionada);

    document.getElementById('form-atualizar-os')
        ?.addEventListener('submit', salvarOS);
}

async function carregarDadosOS(id) {
    const card = document.getElementById('os-detail-card');
    const form = document.getElementById('form-atualizar-os');

    if (!id) {
        card?.classList.add('hidden');
        form?.classList.add('hidden');
        _osAtual = null;
        return;
    }

    try {
        _osAtual = await buscarOrdem(id);
        preencherCardOS(_osAtual);
        card?.classList.remove('hidden');
        form?.classList.add('hidden');
    } catch (err) {
        mostrarToast(`❌ Erro ao carregar OS: ${err.message}`, 'error');
    }
}

function preencherCardOS(os) {
    document.getElementById('ao-id-display').textContent = `OS\n#${os.id}`;

    const desc = os.descricao || 'Sem descrição';
    document.getElementById('ao-descricao-display').textContent =
        desc.length > 70 ? desc.slice(0, 70) + '…' : desc;

    document.getElementById('ao-setor-display').textContent = os.setor || '-';

    document.getElementById('ao-data-display').textContent = os.dataAbertura
        ? new Date(os.dataAbertura).toLocaleString('pt-BR')
        : '-';

    document.getElementById('ao-prioridade-display').textContent =
        os.prioridade != null ? getPrioridadeBadge(os.prioridade) : '-';

    const tecnicoEl = document.getElementById('ao-tecnico-display');
    if (tecnicoEl) {
        const opt = document.querySelector(`#atualizar-os-tecnico option[value="${os.tecnicoId}"]`);
        tecnicoEl.textContent = opt?.textContent
            || (os.tecnicoId ? `Técnico #${os.tecnicoId}` : 'Não atribuído');
    }

    const badge = document.getElementById('ao-status-badge');
    badge.textContent = formatarStatusOS(os.status);
    badge.className = `at-status-pill at-status-${(os.status || '').toLowerCase()}`;
}

function abrirEdicaoOS() {
    if (!_osAtual) return;

    setVal('atualizar-os-status',      _osAtual.status);
    setVal('atualizar-os-tecnico',     _osAtual.tecnicoId ?? '');
    setVal('atualizar-os-descricao',   _osAtual.descricao ?? '');
    setVal('atualizar-os-observacoes', '');

    const dataConc = _osAtual.dataConclusao;
    setVal('atualizar-os-data-conclusao',
        dataConc ? new Date(dataConc).toISOString().slice(0, 10) : '');

    document.getElementById('os-detail-card')?.classList.add('hidden');
    document.getElementById('form-atualizar-os')?.classList.remove('hidden');
}

function fecharEdicaoOS() {
    document.getElementById('form-atualizar-os')?.classList.add('hidden');
    if (_osAtual) {
        document.getElementById('os-detail-card')?.classList.remove('hidden');
    }
}

async function salvarOS(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('atualizar-os-id')?.value);
    if (!id) return;

    const tecnicoVal = document.getElementById('atualizar-os-tecnico')?.value;
    const dataVal    = getVal('atualizar-os-data-conclusao');

    try {
        _osAtual = await atualizarOS(id, {
            id,
            status:        getVal('atualizar-os-status') || null,
            tecnicoId:     tecnicoVal ? parseInt(tecnicoVal) : null,
            descricao:     getVal('atualizar-os-descricao') || null,
            observacoes:   getVal('atualizar-os-observacoes') || null,
            dataConclusao: dataVal ? `${dataVal}T00:00:00` : null,
        });
        mostrarToast('✅ OS atualizada com sucesso!', 'success');
        preencherCardOS(_osAtual);
        fecharEdicaoOS();
        _onAtualizado?.();
    } catch (err) {
        mostrarToast(`❌ ${err.message}`, 'error');
    }
}

async function cancelarOSSelecionada() {
    const id = document.getElementById('atualizar-os-id')?.value;
    if (!id) { mostrarToast('❌ Selecione uma OS primeiro', 'error'); return; }

    if (!confirm(`Cancelar a OS #${id}?\nEsta ação não pode ser desfeita.`)) return;

    try {
        await cancelarOrdemServico(id);
        mostrarToast('✅ OS cancelada!', 'success');
        document.getElementById('os-detail-card')?.classList.add('hidden');
        document.getElementById('form-atualizar-os')?.classList.add('hidden');
        document.getElementById('atualizar-os-id').value = '';
        _osAtual = null;
        _onAtualizado?.();
    } catch (err) {
        mostrarToast(`❌ ${err.message}`, 'error');
    }
}

function formatarStatusOS(status) {
    const mapa = {
        ABERTA:       'Aberta',
        EM_ANDAMENTO: 'Em Andamento',
        PAUSADA:      'Pausada',
        CONCLUIDA:    'Concluída',
        CANCELADA:    'Cancelada',
    };
    return mapa[status] || status || '-';
}

function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val ?? '';
}

function getVal(id) {
    return document.getElementById(id)?.value?.trim() || '';
}
