// ==================== EQUIPAMENTOS PAGE ====================

import { carregarEquipamentos, carregarEquipamento, atualizarEquipamento } from '../../js/api.js';
import { mostrarToast } from '../../js/utils.js';
import { mostrarModal, criarFormularioEdicao, obterValoresFormularioModal, fecharModal } from '../../js/modal.js';

/**
 * Inicializar página EQUIPAMENTOS
 */
export function inicializarEquipamentos() {
    const btnRecarregar = document.getElementById('btn-recarregar-equipamentos');
    if (btnRecarregar) {
        btnRecarregar.addEventListener('click', recarregarEquipamentos);
    }
    carregarEquipamentosPage();
}

/**
 * Carregar e exibir equipamentos
 */
async function carregarEquipamentosPage() {
    try {
        const equipamentos = await carregarEquipamentos();
        const listEl = document.getElementById('equipamentos-list');

        if (!listEl) return;

        if (!equipamentos || equipamentos.length === 0) {
            listEl.innerHTML = `
                <div class="item-empty">
                    <div class="item-empty-icon">🔧</div>
                    <p>Nenhum equipamento cadastrado</p>
                </div>
            `;
        } else {
            listEl.innerHTML = equipamentos.map(e => `
                <div class="item-card">
                    <div class="item-title">🔧 ${e.nome}</div>
                    <div class="item-detail">
                        <div class="item-detail-row">
                            <span class="item-detail-label">Código:</span>
                            <span><strong>${e.codigo}</strong></span>
                        </div>
                        <div class="item-detail-row">
                            <span class="item-detail-label">Setor:</span>
                            <span>${e.setor}</span>
                        </div>
                        <div class="item-detail-row">
                            <span class="item-detail-label">Status:</span>
                            <span class="status-badge ${e.status?.toLowerCase()}">${e.status}</span>
                        </div>
                        <div class="item-detail-row">
                            <span class="item-detail-label">Criticidade:</span>
                            <span class="criticidade-badge ${e.criticidade?.toLowerCase()}">${e.criticidade}</span>
                        </div>
                        <div class="item-detail-row">
                            <span class="item-detail-label">Última Manutenção:</span>
                            <span>${e.ultimaManutencao ? formatarData(e.ultimaManutencao) : 'N/A'}</span>
                        </div>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-secondary btn-sm" onclick="editarEquipamento(${e.id})">
                            <span class="icon">✏️</span> Editar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deletarEquipamento(${e.id})">
                            <span class="icon">🗑️</span> Deletar
                        </button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
        const listEl = document.getElementById('equipamentos-list');
        if (listEl) {
            listEl.innerHTML = `<div class="error-message">❌ Erro ao carregar equipamentos</div>`;
        }
        mostrarToast('❌ Erro ao carregar equipamentos', 'error');
    }
}

/**
 * Recarregar equipamentos
 */
async function recarregarEquipamentos() {
    mostrarToast('🔄 Recarregando equipamentos...', 'info');
    await carregarEquipamentosPage();
}

/**
 * Editar equipamento
 */
async function editarEquipamento(id) {
    try {
        const equipamento = await carregarEquipamento(id);
        
        const campos = [
            { nome: 'id', label: 'ID', tipo: 'text', readonly: true },
            { nome: 'nome', label: 'Nome', tipo: 'text' },
            { nome: 'codigo', label: 'Código', tipo: 'text' },
            { nome: 'setor', label: 'Setor', tipo: 'text' },
            {
                nome: 'criticidade',
                label: 'Criticidade',
                tipo: 'select',
                opcoes: [
                    { value: 'BAIXA', label: 'Baixa' },
                    { value: 'MEDIA', label: 'Média' },
                    { value: 'ALTA', label: 'Alta' }
                ]
            },
            {
                nome: 'status',
                label: 'Status',
                tipo: 'select',
                opcoes: [
                    { value: 'ATIVO', label: 'Ativo' },
                    { value: 'INATIVO', label: 'Inativo' }
                ]
            },
            { nome: 'ultimaManutencao', label: 'Última Manutenção', tipo: 'date' }
        ];

        const conteudoFormulario = criarFormularioEdicao(equipamento, campos);

        const nomesCampos = campos.map(c => c.nome);

        mostrarModal('Editar Equipamento', conteudoFormulario, [
            {
                label: '💾 Salvar',
                classe: 'btn-primary',
                callback: async () => {
                    await salvarEquipamento(id, nomesCampos);
                }
            }
        ]);
    } catch (error) {
        console.error('Erro ao editar equipamento:', error);
        mostrarToast('❌ Erro ao carregar dados do equipamento', 'error');
    }
}

/**
 * Salvar equipamento editado
 */
async function salvarEquipamento(id, nomesCampos) {
    try {
        const valores = obterValoresFormularioModal(nomesCampos);
        
        // Remover campo id antes de enviar
        delete valores.id;

        await atualizarEquipamento(valores);
        mostrarToast('✅ Equipamento atualizado com sucesso!', 'success');
        fecharModal();
        await recarregarEquipamentos();
    } catch (error) {
        console.error('Erro ao salvar equipamento:', error);
        mostrarToast('❌ Erro ao atualizar equipamento', 'error');
    }
}

/**
 * Deletar equipamento (stub - implementar no futuro)
 */
function deletarEquipamento(id) {
    if (confirm('Tem certeza que deseja deletar este equipamento?')) {
        mostrarToast(`Deletar equipamento ${id}`, 'info');
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
window.editarEquipamento = editarEquipamento;
window.deletarEquipamento = deletarEquipamento;

