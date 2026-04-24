// ==================== PÁGINA: ORDENS DE SERVIÇO ====================

/**
 * Inicializar página ORDENS
 */
export function inicializarOrdens() {
    carregarOrdensPage();
}

/**
 * Carregar e exibir ordens na página
 */
async function carregarOrdensPage() {
    const { carregarOrdensAbertas } = await import('../api.js');
    const { getStatusBadge, getPrioridadeBadge, formatarData } = await import('../utils.js');
    const { abrirModalOS } = await import('./modal.js');

    try {
        const ordens = await carregarOrdensAbertas();
        const listEl = document.getElementById('ordens-list-page');

        if (!listEl) return;

        if (!Array.isArray(ordens) || ordens.length === 0) {
            listEl.innerHTML = `
                <div class="item-empty">
                    <div class="item-empty-icon">📋</div>
                    <p>Nenhuma ordem aberta</p>
                </div>
            `;
        } else {
            listEl.innerHTML = ordens.map(o => `
                <div class="item-card-large" onclick="window.abrirModalOS(${o.id})">
                    <div class="item-title clickable">📋 OS #${o.id} - ${o.descricao.substring(0, 60)}...</div>
                    <div class="item-detail">
                        <div class="item-detail-row">
                            <span class="item-detail-label">Setor:</span>
                            <span>${o.setor}</span>
                        </div>
                        <div class="item-detail-row">
                            <span class="item-detail-label">Status:</span>
                            <span>${getStatusBadge(o.status)}</span>
                        </div>
                        <div class="item-detail-row">
                            <span class="item-detail-label">Prioridade:</span>
                            <span>${getPrioridadeBadge(o.prioridade)}</span>
                        </div>
                        <div class="item-detail-row">
                            <span class="item-detail-label">Abertura:</span>
                            <span>${formatarData(o.dataAbertura)}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar ordens:', error);
        const listEl = document.getElementById('ordens-list-page');
        if (listEl) {
            listEl.innerHTML = `<div class="error-message">❌ Erro ao carregar ordens de serviço</div>`;
        }
    }
}

/**
 * Recarregar ordens
 */
export async function recarregarOrdens() {
    const { mostrarToast } = await import('../utils.js');
    carregarOrdensPage();
    mostrarToast('🔄 Ordens recarregadas', 'info');
}
