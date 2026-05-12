import { inicializarTecnicos } from '../pages/tecnicos/tecnicos.js';
import { inicializarEquipamentos } from '../pages/equipamentos/equipamentos.js';
import { inicializarOrdens } from '../pages/ordens/ordens.js';

import { ativarAba, ativarListagem, ativarTipoOS, setCarregadores } from './modules/navigationManager.js';

import {
    verificarConexao as verificarConexaoAPI,
    carregarTecnicos as buscarTecnicos,
    carregarEquipamentos as buscarEquipamentos,
    carregarOrdensAbertas as buscarOrdensAbertas,
    carregarTecnico as buscarTecnico,
    carregarOrdem as buscarOrdem,
    criarTecnico,
    criarEquipamento,
    criarOSCorretiva as criarOSCorretivaAPI,
    criarOSPreventiva as criarOSPreventivaAPI,
    atualizarTecnico as atualizarTecnicoAPI,
    atualizarStatusOS,
    desativarTecnico,
    cancelarOrdemServico
} from './api.js';

import { mostrarToast, obterValor, limparFormulario } from './utils.js';


// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', async () => {
    await verificarConexao();
    inicializarEventos();

    inicializarTecnicos();
    inicializarEquipamentos();
    inicializarOrdens();

    setCarregadores({
        carregarTecnicosPage: inicializarTecnicos,
        carregarEquipamentosPage: inicializarEquipamentos,
        carregarOrdensPage: inicializarOrdens,
        carregarTecnicos,
        carregarOrdens
    });

    await Promise.all([carregarTecnicos(), carregarEquipamentos(), carregarOrdens()]);
});


// ==================== CONEXÃO BACKEND ====================
async function verificarConexao() {
    const badgeEl = document.getElementById('status-conexao');
    if (!badgeEl) return;
    try {
        const conectado = await verificarConexaoAPI();
        badgeEl.textContent = conectado ? '🟢 Conectado' : '🔴 Erro na conexão';
    } catch {
        badgeEl.textContent = '🔴 Desconectado';
    } finally {
        badgeEl.classList.remove('loading');
    }
}


// ==================== EVENTOS ====================
function inicializarEventos() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id === 'btn-historico') {
                window.location.href = 'pages/historico/historico.html';
                return;
            }
            ativarAba(btn.dataset.tab);
        });
    });

    document.querySelectorAll('.listagem-btn').forEach(btn => {
        btn.addEventListener('click', (e) => ativarListagem(btn.dataset.listagem, e));
    });

    document.querySelectorAll('.tipo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => ativarTipoOS(btn.dataset.tipo, e));
    });

    document.getElementById('form-tecnico')?.addEventListener('submit', cadastrarTecnico);
    document.getElementById('form-equipamento')?.addEventListener('submit', cadastrarEquipamento);
    document.getElementById('form-os-corretiva')?.addEventListener('submit', submitOSCorretiva);
    document.getElementById('form-os-preventiva')?.addEventListener('submit', submitOSPreventiva);
    document.getElementById('form-atualizar-tecnico')?.addEventListener('submit', submitAtualizarTecnico);
    document.getElementById('form-atualizar-os')?.addEventListener('submit', submitAtualizarOS);
    document.getElementById('btn-recarregar-tecnicos')?.addEventListener('click', carregarTecnicos);
    document.getElementById('btn-recarregar-equipamentos')?.addEventListener('click', carregarEquipamentos);
    document.getElementById('btn-recarregar-ordens')?.addEventListener('click', carregarOrdens);
}


// ==================== CADASTRAR ====================
async function cadastrarTecnico(e) {
    e.preventDefault();
    const dados = {
        nome: obterValor('tecnico-nome'),
        email: obterValor('tecnico-email'),
        telefone: obterValor('tecnico-telefone'),
        especialidade: obterValor('tecnico-especialidade'),
        setor: obterValor('tecnico-setor'),
        status: obterValor('tecnico-status')
    };
    try {
        await criarTecnico(dados);
        mostrarToast('✅ Técnico cadastrado!', 'success');
        limparFormulario('form-tecnico');
        await carregarTecnicos();
    } catch (error) {
        mostrarToast(`❌ ${error.message}`, 'error');
    }
}

async function cadastrarEquipamento(e) {
    e.preventDefault();
    const dados = {
        nome: obterValor('equip-nome'),
        codigo: obterValor('equip-codigo'),
        setor: obterValor('equip-setor'),
        status: obterValor('equip-status'),
        criticidade: obterValor('equip-criticidade')
    };
    try {
        await criarEquipamento(dados);
        mostrarToast('✅ Equipamento cadastrado!', 'success');
        limparFormulario('form-equipamento');
        await carregarEquipamentos();
    } catch (error) {
        mostrarToast(`❌ ${error.message}`, 'error');
    }
}


// ==================== CRIAR OS ====================
async function submitOSCorretiva(e) {
    e.preventDefault();
    const dados = {
        equipamentoId: parseInt(obterValor('corr-equipamento')),
        tecnicoId: parseInt(obterValor('corr-tecnico')),
        descricao: obterValor('corr-descricao'),
        descricaoFalha: obterValor('corr-falha'),
        setor: obterValor('corr-setor'),
        nivelCriticidade: parseInt(obterValor('corr-criticidade')),
        falhaTotal: document.getElementById('corr-falha-total')?.checked || false
    };
    try {
        await criarOSCorretivaAPI(dados);
        mostrarToast('✅ OS Corretiva criada!', 'success');
        e.target.reset();
        await carregarOrdens();
    } catch (error) {
        mostrarToast(`❌ ${error.message}`, 'error');
    }
}

async function submitOSPreventiva(e) {
    e.preventDefault();
    const dados = {
        equipamentoId: parseInt(obterValor('prev-equipamento')),
        tecnicoId: parseInt(obterValor('prev-tecnico')),
        descricao: obterValor('prev-descricao'),
        setor: obterValor('prev-setor'),
        dataPrevista: obterValor('prev-data-prevista'),
        periodicidadeDias: parseInt(obterValor('prev-periodicidade')),
        ultimaManutencao: obterValor('prev-ultima-manutencao') || null
    };
    try {
        await criarOSPreventivaAPI(dados);
        mostrarToast('✅ OS Preventiva criada!', 'success');
        limparFormulario('form-os-preventiva');
        await carregarOrdens();
    } catch (error) {
        mostrarToast(`❌ ${error.message}`, 'error');
    }
}


// ==================== CARREGAMENTOS ====================
async function carregarTecnicos() {
    const tecnicos = await buscarTecnicos().catch(() => []);
    atualizarSelectTecnicos(tecnicos);
}

async function carregarEquipamentos() {
    const equipamentos = await buscarEquipamentos().catch(() => []);
    atualizarSelectEquipamentos(equipamentos);
}

async function carregarOrdens() {
    const ordens = await buscarOrdensAbertas().catch(() => []);
    atualizarSelectOS(ordens);
}


// ==================== SELECTS ====================
function atualizarSelectTecnicos(tecnicos) {
    const opcoes = '<option value="">Selecionar...</option>' +
        tecnicos.map(t => `<option value="${t.id}">${t.nome}</option>`).join('');
    ['corr-tecnico', 'prev-tecnico', 'atualizar-tecnico-id', 'atualizar-os-tecnico'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = opcoes;
    });
}

function atualizarSelectEquipamentos(equipamentos) {
    const opcoes = '<option value="">Selecionar...</option>' +
        equipamentos.map(e => `<option value="${e.id}">${e.nome}</option>`).join('');
    ['corr-equipamento', 'prev-equipamento'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = opcoes;
    });
}

function atualizarSelectOS(ordens) {
    const select = document.getElementById('atualizar-os-id');
    if (!select) return;
    select.innerHTML = '<option value="">Selecionar...</option>' +
        ordens.map(o => `<option value="${o.id}">OS #${o.id}</option>`).join('');
}


// ==================== MODO EDIÇÃO ====================
function setEditMode(prefixo, campos, editing) {
    campos.forEach(f => {
        const el = document.getElementById(`${prefixo}-${f}`);
        if (el) el.disabled = !editing;
    });
    const suffix      = prefixo.replace('atualizar-', '');
    const btnEditar   = document.getElementById(`btn-editar-${suffix}`);
    const btnSalvar   = document.getElementById(`btn-salvar-${suffix}`);
    const btnCancelar = document.getElementById(`btn-cancelar-${suffix}`);
    if (btnEditar)   btnEditar.classList.toggle('hidden', editing);
    if (btnSalvar)   btnSalvar.classList.toggle('hidden', !editing);
    if (btnCancelar) btnCancelar.classList.toggle('hidden', !editing);
}

function ativarEdicaoTecnico()  { setEditMode('atualizar-tecnico', ['nome','email','telefone','especialidade','setor','status'], true); }
function cancelarEdicaoTecnico() { setEditMode('atualizar-tecnico', ['nome','email','telefone','especialidade','setor','status'], false); }
function ativarEdicaoOS()  { setEditMode('atualizar-os', ['status','tecnico','descricao','setor','data-conclusao'], true); }
function cancelarEdicaoOS() { setEditMode('atualizar-os', ['status','tecnico','descricao','setor','data-conclusao'], false); }


// ==================== ATUALIZAR TÉCNICO ====================
async function submitAtualizarTecnico(e) {
    e.preventDefault();
    const id = parseInt(obterValor('atualizar-tecnico-id'));
    if (!id || isNaN(id)) { mostrarToast('❌ Selecione um técnico primeiro', 'error'); return; }

    const dados = {
        nome: obterValor('atualizar-tecnico-nome'),
        email: obterValor('atualizar-tecnico-email'),
        telefone: obterValor('atualizar-tecnico-telefone'),
        especialidade: obterValor('atualizar-tecnico-especialidade'),
        setor: obterValor('atualizar-tecnico-setor'),
        status: obterValor('atualizar-tecnico-status')
    };

    for (const [chave, valor] of Object.entries(dados)) {
        if (!valor || valor.trim() === '') {
            mostrarToast(`❌ Campo "${chave}" não pode estar vazio`, 'error');
            return;
        }
    }

    try {
        await atualizarTecnicoAPI(id, dados);
        mostrarToast('✅ Técnico atualizado!', 'success');
        cancelarEdicaoTecnico();
        await carregarTecnicos();
    } catch (error) {
        mostrarToast(`❌ ${error.message}`, 'error');
    }
}


// ==================== ATUALIZAR OS ====================
async function submitAtualizarOS(e) {
    e.preventDefault();
    const id = parseInt(obterValor('atualizar-os-id'));
    if (!id) { mostrarToast('❌ Selecione uma OS primeiro', 'error'); return; }

    try {
        await atualizarStatusOS(
            id,
            obterValor('atualizar-os-status'),
            obterValor('atualizar-os-descricao')
        );
        mostrarToast('✅ OS atualizada!', 'success');
        cancelarEdicaoOS();
        await carregarOrdens();
    } catch (error) {
        mostrarToast(`❌ ${error.message}`, 'error');
    }
}


// ==================== CARREGAR DADOS PARA EDIÇÃO ====================
async function carregarDadosTecnico(id) {
    if (!id) return;
    try {
        const tecnico = await buscarTecnico(id);
        ['nome', 'email', 'telefone', 'especialidade', 'setor', 'status'].forEach(campo => {
            const el = document.getElementById(`atualizar-tecnico-${campo}`);
            if (el) el.value = tecnico[campo] || '';
        });
        document.getElementById('tecnico-form-container').classList.remove('hidden');
        cancelarEdicaoTecnico();
        mostrarToast('✅ Técnico carregado. Clique em "Editar" para modificar', 'info');
    } catch (error) {
        mostrarToast(`❌ ${error.message}`, 'error');
    }
}

async function carregarDadosOS(id) {
    if (!id) return;
    try {
        const ordem = await buscarOrdem(id);
        document.getElementById('atualizar-os-status').value = ordem.status || '';
        document.getElementById('atualizar-os-tecnico').value = ordem.tecnico?.id || '';
        document.getElementById('atualizar-os-descricao').value = ordem.descricao || '';
        document.getElementById('atualizar-os-setor').value = ordem.setor || '';
        const dataConcEl = document.getElementById('atualizar-os-data-conclusao');
        if (dataConcEl && ordem.dataConclusao) dataConcEl.value = ordem.dataConclusao.split('T')[0];
        document.getElementById('os-form-container').classList.remove('hidden');
        cancelarEdicaoOS();
        mostrarToast('✅ OS carregada. Clique em "Editar" para modificar', 'info');
    } catch (error) {
        mostrarToast(`❌ ${error.message}`, 'error');
    }
}


// ==================== GLOBALS ====================
window.carregarDadosTecnico = carregarDadosTecnico;
window.ativarEdicaoTecnico  = ativarEdicaoTecnico;
window.cancelarEdicaoTecnico = cancelarEdicaoTecnico;
window.deletarTecnicoSelecionado = async function () {
    const id = obterValor('atualizar-tecnico-id');
    if (!id) { mostrarToast('❌ Selecione um técnico primeiro', 'error'); return; }
    if (!confirm('Deseja realmente deletar este técnico?')) return;
    try {
        await desativarTecnico(id);
        mostrarToast('✅ Técnico removido!', 'success');
        await carregarTecnicos();
    } catch (error) {
        mostrarToast(`❌ ${error.message}`, 'error');
    }
};

window.carregarDadosOS    = carregarDadosOS;
window.ativarEdicaoOS     = ativarEdicaoOS;
window.cancelarEdicaoOS   = cancelarEdicaoOS;
window.deletarOSSelecionada = async function () {
    const id = obterValor('atualizar-os-id');
    if (!id) { mostrarToast('❌ Selecione uma OS primeiro', 'error'); return; }
    if (!confirm('Deseja realmente cancelar esta Ordem de Serviço?')) return;
    try {
        await cancelarOrdemServico(id);
        mostrarToast('✅ OS cancelada!', 'success');
        await carregarOrdens();
    } catch (error) {
        mostrarToast(`❌ ${error.message}`, 'error');
    }
};
