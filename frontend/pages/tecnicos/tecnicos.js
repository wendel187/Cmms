// ==================== TÉCNICOS PAGE ====================

import { carregarTecnicos, carregarTecnico, atualizarTecnico, desativarTecnico } from '../../js/api.js';
import { mostrarToast } from '../../js/utils.js';
import { mostrarModal, criarFormularioEdicao, obterValoresFormularioModal, fecharModal } from '../../js/modal.js';

/**
 * Inicializar página TÉCNICOS
 */
export function inicializarTecnicos() {
    const btnRecarregar = document.getElementById('btn-recarregar-tecnicos');
    if (btnRecarregar) {
        btnRecarregar.addEventListener('click', recarregarTecnicos);
    }
    carregarTecnicosPage();
}

/**
 * Carregar e exibir técnicos
 */
async function carregarTecnicosPage() {
    try {
        const tecnicos = await carregarTecnicos();
        const listEl = document.getElementById('tecnicos-list');

        if (!listEl) return;

        if (!tecnicos || tecnicos.length === 0) {
            listEl.innerHTML = `
                <div class="item-empty">
                    <div class="item-empty-icon">👨‍🔧</div>
                    <p>Nenhum técnico cadastrado</p>
                </div>
            `;
        } else {
            listEl.innerHTML = tecnicos.map(t => `
                <div class="item-card">
                    <div class="item-title">👨‍🔧 ${t.nome}</div>
                    <div class="item-detail">
                        <div class="item-detail-row">
                            <span class="item-detail-label">Email:</span>
                            <span><a href="mailto:${t.email}">${t.email}</a></span>
                        </div>
                        <div class="item-detail-row">
                            <span class="item-detail-label">Telefone:</span>
                            <span><a href="tel:${t.telefone}">${t.telefone}</a></span>
                        </div>
                        <div class="item-detail-row">
                            <span class="item-detail-label">Especialidade:</span>
                            <span>${t.especialidade}</span>
                        </div>
                        <div class="item-detail-row">
                            <span class="item-detail-label">Setor:</span>
                            <span>${t.setor}</span>
                        </div>
                        <div class="item-detail-row">
                            <span class="item-detail-label">Status:</span>
                            <span class="status-badge ${t.status?.toLowerCase().replace('_', '-')}">${t.status}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar técnicos:', error);
        const listEl = document.getElementById('tecnicos-list');
        if (listEl) {
            listEl.innerHTML = `<div class="error-message">❌ Erro ao carregar técnicos</div>`;
        }
        mostrarToast('❌ Erro ao carregar técnicos', 'error');
    }
}

/**
 * Recarregar técnicos
 */
async function recarregarTecnicos() {
    mostrarToast('🔄 Recarregando técnicos...', 'info');
    await carregarTecnicosPage();
}

/**
 * Editar técnico
 */
async function editarTecnico(id) {
    try {
        const tecnico = await carregarTecnico(id);
        
        const campos = [
            { nome: 'id', label: 'ID', tipo: 'text', readonly: true },
            { nome: 'nome', label: 'Nome', tipo: 'text' },
            { nome: 'email', label: 'Email', tipo: 'email' },
            { nome: 'telefone', label: 'Telefone', tipo: 'tel' },
            { nome: 'especialidade', label: 'Especialidade', tipo: 'text' },
            { nome: 'setor', label: 'Setor', tipo: 'text' },
            {
                nome: 'status',
                label: 'Status',
                tipo: 'select',
                opcoes: [
                    { value: 'DISPONIVEL', label: 'Disponível' },
                    { value: 'OCUPADO', label: 'Ocupado' },
                    { value: 'AUSENTE', label: 'Ausente' }
                ]
            }
        ];

        const conteudoFormulario = criarFormularioEdicao(tecnico, campos);

        const nomesCampos = campos.map(c => c.nome);

        mostrarModal('Editar Técnico', conteudoFormulario, [
            {
                label: '💾 Salvar',
                classe: 'btn-primary',
                callback: async () => {
                    await salvarTecnico(id, nomesCampos);
                }
            }
        ]);
    } catch (error) {
        console.error('Erro ao editar técnico:', error);
        mostrarToast('❌ Erro ao carregar dados do técnico', 'error');
    }
}

/**
 * Salvar técnico editado
 */
async function salvarTecnico(id, nomesCampos) {
    try {
        const valores = obterValoresFormularioModal(nomesCampos);
        
        // Remover campo id antes de enviar
        delete valores.id;

        await atualizarTecnico(id, valores);
        mostrarToast('✅ Técnico atualizado com sucesso!', 'success');
        fecharModal();
        await recarregarTecnicos();
    } catch (error) {
        console.error('Erro ao salvar técnico:', error);
        mostrarToast('❌ Erro ao atualizar técnico', 'error');
    }
}

/**
 * Deletar/Desativar técnico
 * @param {number} id - ID do técnico
 */
async function deletarTecnico(id) {
    const confirmacao = confirm('⚠️ Desativar este técnico? Essa ação não pode ser desfeita.');
    
    if (!confirmacao) {
        mostrarToast('❌ Operação cancelada', 'info');
        return;
    }

    try {
        mostrarToast('🗑️ Desativando técnico...', 'info');
        
        await desativarTecnico(id);
        mostrarToast('✅ Técnico desativado com sucesso!', 'success');
        await recarregarTecnicos();
    } catch (error) {
        console.error('Erro ao desativar técnico:', error);
        mostrarToast('❌ Erro ao desativar técnico', 'error');
    }
}

// Expor funções globais
window.editarTecnico = editarTecnico;
window.deletarTecnico = deletarTecnico;

