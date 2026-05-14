import { inicializarHome }            from '../pages/home/home.js';
import { inicializarTecnicos }        from '../pages/tecnicos/tecnicos.js';
import { inicializarEquipamentos }    from '../pages/equipamentos/equipamentos.js';
import { inicializarRequisicoes }     from '../pages/requisicoes/requisicoes.js';
import { inicializarOrdens }          from '../pages/ordens/ordens.js';
import { inicializarAtualizarTecnico } from '../pages/atualizar-tecnico/atualizar-tecnico.js';
import { inicializarAtualizarOS }     from '../pages/atualizar-os/atualizar-os.js';
import { inicializarRelatorios }      from '../pages/relatorios/relatorios.js';

import { ativarAba, setCarregadores } from './modules/navigationManager.js';

import {
    verificarConexao as verificarConexaoAPI,
    carregarTecnicos as buscarTecnicos,
    carregarEquipamentos as buscarEquipamentos,
    carregarTodasOrdens as buscarTodasOrdens,
} from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await verificarConexao();
        inicializarNavegacao();
        inicializarPaginas();
        await carregarDadosIniciais();  // popula selects compartilhados (requisições, atualizar-os)
        inicializarOrdens();            // faz seus próprios GETs (técnicos, equipamentos, ordens)
        ativarAba('home');
    } catch (err) {
        console.error('[CMMS] Erro na inicialização:', err);
    }
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


// ==================== NAVEGAÇÃO ====================
function inicializarNavegacao() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id === 'btn-historico') {
                window.location.href = '/pages/historico/historico.html';
                return;
            }
            ativarAba(btn.dataset.tab);
        });
    });

    setCarregadores({
        carregarTecnicosPage:     inicializarTecnicos,
        carregarEquipamentosPage: inicializarEquipamentos,
        carregarOrdensPage:       inicializarOrdens,
        carregarTecnicos:         recarregarTecnicos,
        carregarOrdens:           recarregarOrdens,
        carregarRelatoriosPage:   inicializarRelatorios,
    });
}


// ==================== INICIALIZAÇÃO DAS PÁGINAS ====================
function inicializarPaginas() {
    inicializarHome({
        onTecnicoCriado:    recarregarTecnicos,
        onEquipamentoCriado: recarregarEquipamentos,
    });
    inicializarTecnicos();
    inicializarEquipamentos();
    inicializarRequisicoes({ onOSCriada: recarregarOrdens });
    inicializarAtualizarTecnico({
        onAtualizado: async () => {
            await recarregarTecnicos();
            inicializarTecnicos();
        }
    });
    inicializarAtualizarOS({ onAtualizado: recarregarOrdens });
    inicializarRelatorios();
}


// ==================== DADOS COMPARTILHADOS ====================
async function carregarDadosIniciais() {
    await Promise.all([
        recarregarTecnicos(),
        recarregarEquipamentos(),
        recarregarOrdens(),
    ]);
}

async function recarregarTecnicos() {
    const tecnicos = await buscarTecnicos().catch(() => []);
    window.__cmms_tecnicos = tecnicos;
    atualizarSelectsTecnicos(tecnicos);
}

async function recarregarEquipamentos() {
    const equipamentos = await buscarEquipamentos().catch(() => []);
    window.__cmms_equipamentos = equipamentos;
    atualizarSelectsEquipamentos(equipamentos);
}

async function recarregarOrdens() {
    const ordens = await buscarTodasOrdens().catch(() => []);
    atualizarSelectOrdens(ordens);
}


// ==================== ATUALIZAÇÃO DE SELECTS ====================
function atualizarSelectsTecnicos(tecnicos) {
    const opcoes = '<option value="">Selecionar...</option>' +
        tecnicos.map(t => `<option value="${t.id}">${t.nome}</option>`).join('');
    ['corr-tecnico', 'prev-tecnico', 'atualizar-tecnico-id', 'atualizar-os-tecnico'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = opcoes;
    });
}

function atualizarSelectsEquipamentos(equipamentos) {
    const opcoes = '<option value="">Selecionar...</option>' +
        equipamentos.map(e => `<option value="${e.id}">${e.nome}</option>`).join('');
    ['corr-equipamento', 'prev-equipamento'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = opcoes;
    });
}

function atualizarSelectOrdens(ordens) {
    const select = document.getElementById('atualizar-os-id');
    if (!select) return;
    const statusLabel = {
        ABERTA: 'Aberta', EM_ANDAMENTO: 'Em Andamento', PAUSADA: 'Pausada',
        CONCLUIDA: 'Concluída', CANCELADA: 'Cancelada',
    };
    select.innerHTML = '<option value="">Selecionar...</option>' +
        ordens.map(o => `<option value="${o.id}">OS #${o.id} — ${statusLabel[o.status] || o.status}</option>`).join('');
}
