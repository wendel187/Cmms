import {
    carregarTecnico as buscarTecnico,
    atualizarTecnico as atualizarTecnicoAPI,
    desativarTecnico,
} from '../../js/api.js';
import { mostrarToast } from '../../js/utils.js';

let _onAtualizado = null;
let _tecnicoAtual = null;

export function inicializarAtualizarTecnico({ onAtualizado } = {}) {
    _onAtualizado = onAtualizado;

    document.getElementById('atualizar-tecnico-id')
        ?.addEventListener('change', e => carregarDadosTecnico(e.target.value));

    document.getElementById('btn-editar-tecnico')
        ?.addEventListener('click', abrirEdicao);

    document.getElementById('btn-cancelar-edicao-tecnico')
        ?.addEventListener('click', fecharEdicao);

    document.getElementById('btn-desativar-tecnico')
        ?.addEventListener('click', desativarTecnicoSelecionado);

    document.getElementById('form-atualizar-tecnico')
        ?.addEventListener('submit', salvarTecnico);
}

async function carregarDadosTecnico(id) {
    const card = document.getElementById('tecnico-detail-card');
    const form = document.getElementById('form-atualizar-tecnico');

    if (!id) {
        card?.classList.add('hidden');
        form?.classList.add('hidden');
        _tecnicoAtual = null;
        return;
    }

    try {
        _tecnicoAtual = await buscarTecnico(id);
        preencherCard(_tecnicoAtual);
        card?.classList.remove('hidden');
        form?.classList.add('hidden');
    } catch (err) {
        mostrarToast(`❌ Erro ao carregar técnico: ${err.message}`, 'error');
    }
}

function preencherCard(t) {
    document.getElementById('at-avatar').textContent = (t.nome || '?')[0].toUpperCase();
    document.getElementById('at-nome-display').textContent = t.nome || '';
    document.getElementById('at-email-display').textContent = t.email || '-';
    document.getElementById('at-telefone-display').textContent = t.telefone || '-';
    document.getElementById('at-especialidade-display').textContent = t.especialidade || '-';
    document.getElementById('at-setor-display').textContent = t.setor || '-';
    document.getElementById('at-data-display').textContent = t.dataCadastro
        ? new Date(t.dataCadastro).toLocaleDateString('pt-BR')
        : '-';

    const badge = document.getElementById('at-status-badge');
    badge.textContent = formatarStatusTecnico(t.status);
    badge.className = `at-status-pill at-status-${(t.status || '').toLowerCase()}`;
}

function abrirEdicao() {
    if (!_tecnicoAtual) return;

    setVal('atualizar-tecnico-nome',         _tecnicoAtual.nome);
    setVal('atualizar-tecnico-email',         _tecnicoAtual.email);
    setVal('atualizar-tecnico-telefone',      _tecnicoAtual.telefone);
    setVal('atualizar-tecnico-especialidade', _tecnicoAtual.especialidade);
    setVal('atualizar-tecnico-setor',         _tecnicoAtual.setor);
    setVal('atualizar-tecnico-status',        _tecnicoAtual.status);

    document.getElementById('tecnico-detail-card')?.classList.add('hidden');
    const form = document.getElementById('form-atualizar-tecnico');
    form?.classList.remove('hidden');
    form?.querySelector('input')?.focus();
}

function fecharEdicao() {
    document.getElementById('form-atualizar-tecnico')?.classList.add('hidden');
    if (_tecnicoAtual) {
        document.getElementById('tecnico-detail-card')?.classList.remove('hidden');
    }
}

async function salvarTecnico(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('atualizar-tecnico-id')?.value);
    if (!id) return;

    const dados = {
        nome:          getVal('atualizar-tecnico-nome'),
        email:         getVal('atualizar-tecnico-email'),
        telefone:      getVal('atualizar-tecnico-telefone'),
        especialidade: getVal('atualizar-tecnico-especialidade'),
        setor:         getVal('atualizar-tecnico-setor'),
        status:        getVal('atualizar-tecnico-status'),
    };

    try {
        _tecnicoAtual = await atualizarTecnicoAPI(id, dados);
        mostrarToast('✅ Técnico atualizado com sucesso!', 'success');
        preencherCard(_tecnicoAtual);
        fecharEdicao();
        _onAtualizado?.();
    } catch (err) {
        mostrarToast(`❌ ${err.message}`, 'error');
    }
}

async function desativarTecnicoSelecionado() {
    const id = document.getElementById('atualizar-tecnico-id')?.value;
    if (!id) { mostrarToast('❌ Selecione um técnico primeiro', 'error'); return; }

    const nome = _tecnicoAtual?.nome || `ID ${id}`;
    if (!confirm(`Desativar o técnico "${nome}"?\nEsta ação não pode ser desfeita.`)) return;

    try {
        await desativarTecnico(id);
        mostrarToast('✅ Técnico desativado!', 'success');
        document.getElementById('tecnico-detail-card')?.classList.add('hidden');
        document.getElementById('form-atualizar-tecnico')?.classList.add('hidden');
        document.getElementById('atualizar-tecnico-id').value = '';
        _tecnicoAtual = null;
        _onAtualizado?.();
    } catch (err) {
        mostrarToast(`❌ ${err.message}`, 'error');
    }
}

function formatarStatusTecnico(status) {
    const mapa = {
        DISPONIVEL:    'Disponível',
        EM_MANUTENCAO: 'Em Manutenção',
        AUSENTE:       'Ausente',
        INDISPONIVEL:  'Indisponível',
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
