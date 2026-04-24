// ==================== PÁGINA: TÉCNICOS ====================

/**
 * Inicializar página TÉCNICOS
 */
export function inicializarTecnicos() {
    carregarTecnicosPage();
}

/**
 * Carregar e exibir técnicos na página
 */
async function carregarTecnicosPage() {
    const { carregarTecnicos } = await import('../api.js');
    const { getStatusBadge } = await import('../utils.js');

    try {
        const tecnicos = await carregarTecnicos();
        const listEl = document.getElementById('tecnicos-list-page');

        if (!listEl) return;

        if (tecnicos.length === 0) {
            listEl.innerHTML = `
                <div class="item-empty">
                    <div class="item-empty-icon">👨‍🔧</div>
                    <p>Nenhum técnico cadastrado</p>
                </div>
            `;
        } else {
            listEl.innerHTML = tecnicos.map(t => `
                <div class="item-card-large">
                    <div class="item-title">👨‍🔧 ${t.nome}</div>
                    <div class="item-detail">
                        <div class="item-detail-row">
                            <span class="item-detail-label">Email:</span>
                            <span>${t.email}</span>
                        </div>
                        <div class="item-detail-row">
                            <span class="item-detail-label">Telefone:</span>
                            <span>${t.telefone}</span>
                        </div>
                        <div class="item-detail-row">
                            <span class="item-detail-label">Especialidade:</span>
                            <span><strong>${t.especialidade}</strong></span>
                        </div>
                        <div class="item-detail-row">
                            <span class="item-detail-label">Setor:</span>
                            <span>${t.setor}</span>
                        </div>
                        <div class="item-detail-row">
                            <span class="item-detail-label">Status:</span>
                            <span>${getStatusBadge(t.status)}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar técnicos:', error);
        const listEl = document.getElementById('tecnicos-list-page');
        if (listEl) {
            listEl.innerHTML = `<div class="error-message">❌ Erro ao carregar técnicos</div>`;
        }
    }
}

/**
 * Recarregar técnicos
 */
export async function recarregarTecnicos() {
    const { mostrarToast } = await import('../utils.js');
    carregarTecnicosPage();
    mostrarToast('🔄 Técnicos recarregados', 'info');
}
