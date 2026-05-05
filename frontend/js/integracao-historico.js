// ==================== EXEMPLO: INTEGRAÇÃO COM PÁGINA DE ORDENS ====================

/**
 * Este arquivo mostra como integrar um botão "Ver Histórico" 
 * na página de detalhes/listagem de Ordens de Serviço
 * 
 * Você pode adicionar este código à página de ordens ou criar
 * um módulo separado que gerencia essa integração.
 */

/**
 * Função para abrir a página de histórico para uma OS específica
 * @param {number} osId - ID da Ordem de Serviço
 */
export function abrirHistoricoOS(osId) {
    if (!osId || isNaN(osId)) {
        alert('⚠️ ID da OS inválido');
        return;
    }

    // Opção 1: Abrir em nova aba
    const url = `../../pages/historico/historico.html?osId=${osId}`;
    window.open(url, '_blank');

    // Opção 2: Navegar na mesma aba
    // window.location.href = url;
}

/**
 * Adicionar botão de histórico aos cards de OS
 */
export function adicionarBotaoHistoricoAosCards() {
    const cards = document.querySelectorAll('.item-card[data-id]');
    
    cards.forEach(card => {
        // Verificar se o botão já existe
        if (card.querySelector('.btn-historico')) {
            return;
        }

        const osId = card.dataset.id;
        const botao = document.createElement('button');
        botao.className = 'btn btn-sm btn-info btn-historico';
        botao.innerHTML = '<span class="icon">📜</span> Ver Histórico';
        botao.type = 'button';
        botao.onclick = (e) => {
            e.stopPropagation();
            abrirHistoricoOS(osId);
        };

        // Adicionar ao card
        const detalhes = card.querySelector('.item-detail');
        if (detalhes) {
            detalhes.appendChild(botao);
        } else {
            card.appendChild(botao);
        }
    });
}

/**
 * Adicionar botão ao modal de detalhes
 * Use essa função quando exibir detalhes em um modal
 */
export function adicionarBotaoHistoricoAoModal(osId, modalElement) {
    if (!modalElement) return;

    // Verificar se o botão já existe
    if (modalElement.querySelector('.btn-historico')) {
        return;
    }

    const botao = document.createElement('button');
    botao.className = 'btn btn-sm btn-info btn-historico';
    botao.innerHTML = '<span class="icon">📜</span> Ver Histórico Completo';
    botao.type = 'button';
    botao.onclick = (e) => {
        e.preventDefault();
        abrirHistoricoOS(osId);
    };

    // Adicionar ao rodapé do modal (procurar por elemento com classe 'modal-footer' ou 'modal-actions')
    const footer = modalElement.querySelector('.modal-footer') || 
                   modalElement.querySelector('.modal-actions') ||
                   modalElement.querySelector('.modal-buttons');

    if (footer) {
        footer.appendChild(botao);
    } else {
        modalElement.appendChild(botao);
    }
}

/**
 * Exemplo de uso na página de ordens
 * 
 * Adicione este código ao arquivo pages/ordens/ordens.js
 */

/*
import { abrirHistoricoOS, adicionarBotaoHistoricoAosCards } from '../../js/integracao-historico.js';

// Após renderizar os cards de ordens
function renderizarOrdens(ordens) {
    // ... código existente ...
    
    // Adicionar botão de histórico aos cards
    setTimeout(() => {
        adicionarBotaoHistoricoAosCards();
    }, 100);
}

// Ou ao exibir detalhes em modal
async function exibirDetalhesOrdem(id) {
    try {
        const ordem = await carregarOrdem(id);
        
        const conteudo = `
            <div class="detalhes-ordem">
                <h3>Detalhes da OS #${ordem.id}</h3>
                <p><strong>Tipo:</strong> ${ordem.tipo || 'N/A'}</p>
                <p><strong>Status:</strong> ${ordem.status || 'N/A'}</p>
                <!-- ... mais detalhes ... -->
            </div>
        `;

        mostrarModal(`Detalhes da OS #${ordem.id}`, conteudo, [
            {
                label: '📜 Ver Histórico',
                classe: 'btn-info',
                callback: () => abrirHistoricoOS(ordem.id)
            },
            {
                label: 'Fechar',
                classe: 'btn-secondary',
                callback: fecharModal
            }
        ]);
    } catch (error) {
        console.error('Erro ao carregar detalhes da ordem:', error);
    }
}
*/

// ==================== CSS OPCIONAL ====================

/**
 * Adicione este CSS ao seu arquivo style.css se quiser estilos específicos
 * 
.btn-info {
    background: #17a2b8;
    color: white;
}

.btn-info:hover {
    background: #138496;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-historico {
    margin-top: 10px;
    width: 100%;
    text-align: center;
}

@media (max-width: 768px) {
    .btn-historico {
        font-size: 0.9rem;
        padding: 8px 12px;
    }
}
 */

// ==================== TESTE ====================

/**
 * Para testar, abra o console do navegador (F12) e execute:
 * 
 * import { abrirHistoricoOS } from './integracao-historico.js';
 * abrirHistoricoOS(1);  // Abre histórico da OS #1
 */

