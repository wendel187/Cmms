// ==================== ORDENS PAGE ====================

import { carregarOrdensAbertas, carregarOrdem, atualizarOS } from '../../js/api.js';
import { mostrarToast } from '../../js/utils.js';
import { mostrarModal, criarFormularioEdicao, obterValoresFormularioModal, fecharModal } from '../../js/modal.js';

let ordensGlobal = [];

/**
 * Inicializar página ORDENS
 */
export function inicializarOrdens() {
    const btnRecarregar = document.getElementById('btn-recarregar-ordens');
    if (btnRecarregar) {
        btnRecarregar.addEventListener('click', recarregarOrdens);
    }

    const filtroStatus = document.getElementById('filtro-status');
    if (filtroStatus) {
        filtroStatus.addEventListener('change', filtrarOrdensPorStatus);
    }

    carregarOrdensPage();
}

/**
 * Carregar e exibir ordens
 */
async function carregarOrdensPage() {
    try {
        const ordens = await carregarOrdensAbertas();
        ordensGlobal = ordens || [];
        renderizarOrdens(ordensGlobal);
    } catch (error) {
        console.error('Erro ao carregar ordens:', error);
        const listEl = document.getElementById('ordens-list');
        if (listEl) {
            listEl.innerHTML = `<div class="error-message">❌ Erro ao carregar ordens</div>`;
        }
        mostrarToast('❌ Erro ao carregar ordens', 'error');
    }
}

/**
 * Renderizar ordens na tela
 */
function renderizarOrdens(ordens) {
    const listEl = document.getElementById('ordens-list');

    if (!listEl) return;

    if (!ordens || ordens.length === 0) {
        listEl.innerHTML = `
            <div class="item-empty">
                <div class="item-empty-icon">📋</div>
                <p>Nenhuma ordem de serviço encontrada</p>
            </div>
        `;
    } else {
        listEl.innerHTML = ordens.map(o => `
            <div class="item-card">
                <div class="item-title">📋 OS #${o.id}</div>
                <div class="item-detail">
                    <div class="item-detail-row">
                        <span class="item-detail-label">Tipo:</span>
                        <span>${o.tipo || 'N/A'}</span>
                    </div>
                    <div class="item-detail-row">
                        <span class="item-detail-label">Status:</span>
                        <span class="status-badge ${o.status?.toLowerCase().replace('_', '-')}">${o.status || 'N/A'}</span>
                    </div>
                    <div class="item-detail-row">
                        <span class="item-detail-label">Equipamento:</span>
                        <span>${o.equipamento?.nome || 'N/A'}</span>
                    </div>
                    <div class="item-detail-row">
                        <span class="item-detail-label">Técnico Responsável:</span>
                        <span>${o.tecnico?.nome || 'Não atribuído'}</span>
                    </div>
                    <div class="item-detail-row">
                        <span class="item-detail-label">Prioridade:</span>
                        <span class="priority-badge ${o.prioridade?.toLowerCase()}">${o.prioridade || 'N/A'}</span>
                    </div>
                    <div class="item-detail-row">
                        <span class="item-detail-label">Data Abertura:</span>
                        <span>${o.dataAbertura ? formatarData(o.dataAbertura) : 'N/A'}</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editarOrdem(${o.id})">
                        <span class="icon">✏️</span> Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deletarOrdem(${o.id})">
                        <span class="icon">🗑️</span> Deletar
                    </button>
                </div>
            </div>
        `).join('');
    }
}

/**
 * Filtrar ordens por status
 */
function filtrarOrdensPorStatus() {
    const filtro = document.getElementById('filtro-status').value;
    
    if (!filtro) {
        renderizarOrdens(ordensGlobal);
    } else {
        const ordensFiltradas = ordensGlobal.filter(o => o.status === filtro);
        renderizarOrdens(ordensFiltradas);
    }
}

/**
 * Recarregar ordens
 */
async function recarregarOrdens() {
    mostrarToast('🔄 Recarregando ordens...', 'info');
    await carregarOrdensPage();
}

/**
 * Editar ordem
 */
async function editarOrdem(id) {
    try {
        const ordem = await carregarOrdem(id);
        
        const campos = [
            { nome: 'id', label: 'ID', tipo: 'text', readonly: true },
            {
                nome: 'status',
                label: 'Status',
                tipo: 'select',
                opcoes: [
                    { value: 'ABERTA', label: 'Aberta' },
                    { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
                    { value: 'PAUSADA', label: 'Pausada' },
                    { value: 'CONCLUIDA', label: 'Concluída' },
                    { value: 'CANCELADA', label: 'Cancelada' }
                ]
            },
            {
                nome: 'prioridade',
                label: 'Prioridade',
                tipo: 'select',
                opcoes: [
                    { value: 'BAIXA', label: 'Baixa' },
                    { value: 'MEDIA', label: 'Média' },
                    { value: 'ALTA', label: 'Alta' },
                    { value: 'CRITICA', label: 'Crítica' }
                ]
            },
            { nome: 'descricao', label: 'Descrição', tipo: 'textarea' },
            { nome: 'dataAbertura', label: 'Data Abertura', tipo: 'date', readonly: true },
            { nome: 'dataFechamento', label: 'Data Fechamento', tipo: 'date' }
        ];

        const conteudoFormulario = criarFormularioEdicao(ordem, campos);

        const nomesCampos = campos.map(c => c.nome);

        mostrarModal('Editar Ordem de Serviço', conteudoFormulario, [
            {
                label: '💾 Salvar',
                classe: 'btn-primary',
                callback: async () => {
                    await salvarOrdem(id, nomesCampos);
                }
            }
        ]);
    } catch (error) {
        console.error('Erro ao editar ordem:', error);
        mostrarToast('❌ Erro ao carregar dados da ordem', 'error');
    }
}

/**
 * Salvar ordem editada
 */
async function salvarOrdem(id, nomesCampos) {
    try {
        const valores = obterValoresFormularioModal(nomesCampos);
        
        // Remover campos que não devem ser atualizados
        delete valores.id;
        delete valores.dataAbertura;

        await atualizarOS(id, valores);
        mostrarToast('✅ Ordem atualizada com sucesso!', 'success');
        fecharModal();
        await recarregarOrdens();
    } catch (error) {
        console.error('Erro ao salvar ordem:', error);
        mostrarToast('❌ Erro ao atualizar ordem', 'error');
    }
}

/**
 * Deletar ordem (stub - implementar no futuro)
 */
function deletarOrdem(id) {
    if (confirm('Tem certeza que deseja deletar esta ordem?')) {
        mostrarToast(`Deletar ordem ${id}`, 'info');
        // TODO: Implementar deleção
    }
}

/**
 * Formatar data para exibição
 */
function formatarData(data) {
    if (!data) return 'N/A';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
}

// Expor funções globais
window.editarOrdem = editarOrdem;
window.deletarOrdem = deletarOrdem;

