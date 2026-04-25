// ==================== GERENCIADOR DE MODAIS ====================

/**
 * Criar e exibir um modal genérico
 * @param {string} titulo - Título do modal
 * @param {string} conteudo - Conteúdo HTML do modal
 * @param {Array} botoes - Array de botões [{label, classe, callback}]
 */
export function mostrarModal(titulo, conteudo, botoes = []) {
    // Remover modal anterior se existir
    const modalAnterior = document.getElementById('generic-modal');
    if (modalAnterior) {
        modalAnterior.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'generic-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${titulo}</h2>
                <button class="modal-close" onclick="fecharModal()">✕</button>
            </div>
            <div class="modal-body">
                ${conteudo}
            </div>
            <div class="modal-footer">
                ${botoes.map((btn, idx) => `
                    <button 
                        id="modal-btn-${idx}"
                        class="btn ${btn.classe || 'btn-secondary'}"
                        onclick="executarCallbackBotaoModal(${idx})"
                    >
                        ${btn.label}
                    </button>
                `).join('')}
                <button class="btn btn-secondary" onclick="fecharModal()">Fechar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Armazenar callbacks globais
    window._modalCallbacks = botoes;

    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            fecharModal();
        }
    });
}

/**
 * Fechar modal
 */
export function fecharModal() {
    const modal = document.getElementById('generic-modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Executar callback do botão do modal
 */
window.executarCallbackBotaoModal = function(idx) {
    if (window._modalCallbacks && window._modalCallbacks[idx]) {
        window._modalCallbacks[idx].callback?.();
    }
};

/**
 * Fechar modal globalmente
 */
window.fecharModal = fecharModal;

/**
 * Criar formulário de edição HTML
 * @param {Object} dados - Objeto com os dados para editar
 * @param {Array} campos - Array de campos [{nome, label, tipo, valor?}]
 */
export function criarFormularioEdicao(dados, campos) {
    return campos.map(campo => {
        const valor = dados[campo.nome] || (campo.valor !== undefined ? campo.valor : '');
        const placeholder = campo.placeholder || campo.label;
        
        if (campo.tipo === 'select') {
            return `
                <div class="form-group">
                    <label>${campo.label}</label>
                    <select id="field-${campo.nome}" name="${campo.nome}">
                        <option value="">Selecionar...</option>
                        ${(campo.opcoes || []).map(opt => `
                            <option value="${opt.value}" ${valor === opt.value ? 'selected' : ''}>
                                ${opt.label}
                            </option>
                        `).join('')}
                    </select>
                </div>
            `;
        } else if (campo.tipo === 'textarea') {
            return `
                <div class="form-group">
                    <label>${campo.label}</label>
                    <textarea 
                        id="field-${campo.nome}" 
                        name="${campo.nome}"
                        placeholder="${placeholder}"
                        rows="4"
                    >${valor}</textarea>
                </div>
            `;
        } else {
            return `
                <div class="form-group">
                    <label>${campo.label}</label>
                    <input 
                        type="${campo.tipo || 'text'}"
                        id="field-${campo.nome}"
                        name="${campo.nome}"
                        placeholder="${placeholder}"
                        value="${valor}"
                        ${campo.readonly ? 'readonly' : ''}
                    />
                </div>
            `;
        }
    }).join('');
}

/**
 * Obter valores do formulário modal
 * @param {Array} nomposCampos - Array com nomes dos campos
 * @returns {Object}
 */
export function obterValoresFormularioModal(nomesCampos) {
    const valores = {};
    nomesCampos.forEach(nome => {
        const campo = document.getElementById(`field-${nome}`);
        if (campo) {
            valores[nome] = campo.value;
        }
    });
    return valores;
}

