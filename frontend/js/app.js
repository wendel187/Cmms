

const API_URL = 'http://localhost:8080';
const API_EQUIPAMENTOS = `${API_URL}/equipamento`;

let currentPage = 0;
const pageSize = 10;
let allEquipamentos = [];
let filteredEquipamentos = [];


document.addEventListener('DOMContentLoaded', () => {
    carregarEquipamentos();
    setupSearchListener();
});


async function carregarEquipamentos(page = 0) {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error-message');
    const tabelaContainer = document.getElementById('tabela-container');

    try {
        // Mostrar loading
        loadingEl.classList.remove('hidden');
        errorEl.classList.add('hidden');
        tabelaContainer.style.opacity = '0.5';

        // Fazer requisição
        const response = await fetch(
            `${API_EQUIPAMENTOS}?page=${page}&size=${pageSize}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include' // Para CORS com cookies se necessário
            }
        );

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        // Armazenar dados
        allEquipamentos = data.content || [];
        filteredEquipamentos = [...allEquipamentos];
        currentPage = page;

        // Renderizar tabela
        renderizarTabela(allEquipamentos);

        // Atualizar paginação
        if (data.totalPages > 1) {
            atualizarPaginacao(data, page);
        } else {
            document.getElementById('paginacao-container').classList.add('hidden');
        }

    } catch (erro) {
        console.error('Erro ao carregar equipamentos:', erro);
        mostrarErro(`❌ Erro ao conectar com o backend: ${erro.message}<br>Certifique-se de que o servidor está rodando em http://localhost:8080`);
    } finally {
        loadingEl.classList.add('hidden');
        tabelaContainer.style.opacity = '1';
    }
}

// ============================================
// RENDERIZAR TABELA
// ============================================

function renderizarTabela(equipamentos) {
    const tbody = document.getElementById('equipamentos-tbody');

    if (!equipamentos || equipamentos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    <p style="color: var(--text-light); padding: 2rem 0;">
                        📭 Nenhum equipamento encontrado
                    </p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = equipamentos.map((equip) => `
        <tr>
            <td><strong>#${equip.id}</strong></td>
            <td>${equip.nome}</td>
            <td><code>${equip.codigo}</code></td>
            <td>
                <span class="badge ${equip.status.toLowerCase()}">
                    ${equip.status}
                </span>
            </td>
            <td>
                <div class="actions">
                    <button class="action-btn" onclick="verDetalhe(${equip.id})" title="Ver detalhes">
                        👁️ Detalhe
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ============================================
// PAGINAÇÃO
// ============================================

function atualizarPaginacao(data, page) {
    const container = document.getElementById('paginacao-container');
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    container.classList.remove('hidden');
    pageInfo.textContent = `Página ${page + 1} de ${data.totalPages} (${data.totalElements} equipamentos)`;

    prevBtn.disabled = page === 0;
    nextBtn.disabled = page >= data.totalPages - 1;
}

function previousPage() {
    if (currentPage > 0) {
        carregarEquipamentos(currentPage - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function nextPage() {
    carregarEquipamentos(currentPage + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// BUSCA E FILTRO
// ============================================

function setupSearchListener() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase().trim();
        
        if (!termo) {
            renderizarTabela(allEquipamentos);
            return;
        }

        const resultados = allEquipamentos.filter(equip =>
            equip.nome.toLowerCase().includes(termo) ||
            equip.codigo.toLowerCase().includes(termo) ||
            String(equip.id).includes(termo)
        );

        renderizarTabela(resultados);
    });
}

// ============================================
// VER DETALHE
// ============================================

async function verDetalhe(id) {
    const loadingDetalhe = document.getElementById('loading-detalhe');
    const errorDetalhe = document.getElementById('error-detalhe');
    const detalheContent = document.getElementById('detalhe-content');

    try {
        loadingDetalhe.classList.remove('hidden');
        errorDetalhe.classList.add('hidden');
        detalheContent.classList.add('hidden');

        const response = await fetch(`${API_EQUIPAMENTOS}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Equipamento não encontrado');
            }
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const equip = await response.json();

        // Preencher detalhes
        document.getElementById('detalhe-id').textContent = `#${equip.id}`;
        document.getElementById('detalhe-nome').textContent = equip.nome;
        document.getElementById('detalhe-codigo').textContent = equip.codigo;
        document.getElementById('detalhe-status').className = `badge ${equip.status.toLowerCase()}`;
        document.getElementById('detalhe-status').textContent = equip.status;
        document.getElementById('detalhe-status-texto').textContent = equip.status;
        document.getElementById('detalhe-criacao').textContent = formatarData(equip.dataCriacao);

        // Trocar de seção
        document.getElementById('listagem-section').classList.remove('active');
        document.getElementById('detalhe-section').classList.add('active');

        detalheContent.classList.remove('hidden');

    } catch (erro) {
        console.error('Erro ao carregar detalhe:', erro);
        errorDetalhe.classList.remove('hidden');
        errorDetalhe.textContent = `❌ ${erro.message}`;
    } finally {
        loadingDetalhe.classList.add('hidden');
    }
}

function voltarParaListagem() {
    document.getElementById('detalhe-section').classList.remove('active');
    document.getElementById('listagem-section').classList.add('active');
}

// ============================================
// UTILIDADES
// ============================================

function formatarData(dataString) {
    if (!dataString) return '-';
    try {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dataString;
    }
}

function reloadEquipamentos() {
    carregarEquipamentos(0);
}

function mostrarErro(mensagem) {
    const errorEl = document.getElementById('error-message');
    errorEl.innerHTML = mensagem;
    errorEl.classList.remove('hidden');
}
