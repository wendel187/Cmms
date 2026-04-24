// ==================== PÁGINA: EQUIPAMENTOS ====================

/**
 * Inicializar página EQUIPAMENTOS
 */
export function inicializarEquipamentos() {
    carregarEquipamentosPage();
}

/**
 * Carregar e exibir equipamentos na página
 */
async function carregarEquipamentosPage() {
    const { carregarEquipamentos } = await import('../api.js');
    const { getStatusBadge, getCriticidadeBadge } = await import('../utils.js');

    try {
        const equipamentos = await carregarEquipamentos();
        const listEl = document.getElementById('equipamentos-list-page');

        if (!listEl) return;

        if (equipamentos.length === 0) {
            listEl.innerHTML = `
                <div class="item-empty">
                    <div class="item-empty-icon">🔧</div>
                    <p>Nenhum equipamento cadastrado</p>
                </div>
            `;
        } else {
            listEl.innerHTML = equipamentos.map(e => `
                <div class="item-card-large">
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
                            <span class="item-detail-label">Criticidade:</span>
                            <span>${getCriticidadeBadge(e.criticidade)}</span>
                        </div>
                        <div class="item-detail-row">
                            <span class="item-detail-label">Status:</span>
                            <span>${getStatusBadge(e.status)}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
        const listEl = document.getElementById('equipamentos-list-page');
        if (listEl) {
            listEl.innerHTML = `<div class="error-message">❌ Erro ao carregar equipamentos</div>`;
        }
    }
}

/**
 * Recarregar equipamentos
 */
export async function recarregarEquipamentos() {
    const { mostrarToast } = await import('../utils.js');
    carregarEquipamentosPage();
    mostrarToast('🔄 Equipamentos recarregados', 'info');
}
