// ==================== APLICAÇÃO PRINCIPAL MODULARIZADA ====================

// Importar módulos de páginas
import { inicializarHome } from './pages/home/home.js';
import { inicializarTecnicos } from './pages/tecnicos/tecnicos.js';
import { inicializarEquipamentos } from './pages/equipamentos/equipamentos.js';
import { inicializarOrdens } from './pages/ordens/ordens.js';

import { verificarConexao } from './api.js';
import { mostrarToast } from './utils.js';

// Mapa de páginas e seus módulos
const PAGES = {
    home: {
        file: 'pages/home/home.html',
        init: inicializarHome
    },
    tecnicos: {
        file: 'pages/tecnicos/tecnicos.html',
        init: inicializarTecnicos
    },
    equipamentos: {
        file: 'pages/equipamentos/equipamentos.html',
        init: inicializarEquipamentos
    },
    ordens: {
        file: 'pages/ordens/ordens.html',
        init: inicializarOrdens
    }
};

let paginasCarregadas = new Set();

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Inicializando CMMS...');
    
    // Verificar conexão
    await verificarConexao();
    
    // Inicializar eventos de navegação
    inicializarEventos();
    
    // Carregar página inicial
    await carregarPagina('home');
    
    console.log('✅ CMMS iniciado com sucesso!');
});

// ==================== EVENTOS DE NAVEGAÇÃO ====================
function inicializarEventos() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nomeAba = btn.dataset.tab;
            carregarPagina(nomeAba);
        });
    });
}

// ==================== CARREGAMENTO DE PÁGINAS ====================
async function carregarPagina(nomePagina) {
    try {
        const pagina = PAGES[nomePagina];
        
        if (!pagina) {
            console.error(`❌ Página ${nomePagina} não encontrada`);
            return;
        }

        // Atualizar botões ativos
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${nomePagina}"]`).classList.add('active');

        // Carregar HTML da página se ainda não foi carregado
        if (!paginasCarregadas.has(nomePagina)) {
            await carregarHTML(nomePagina, pagina.file);
            paginasCarregadas.add(nomePagina);
        }

        // Mostrar/ocultar seções
        document.querySelectorAll('.tab-content').forEach(section => {
            section.classList.remove('active');
        });

        const tabId = nomePagina + '-tab';
        const tabEl = document.getElementById(tabId);
        
        if (tabEl) {
            tabEl.classList.add('active');
        }

        // Inicializar página
        if (pagina.init && typeof pagina.init === 'function') {
            pagina.init();
        }

        // Scroll para o topo
        window.scrollTo(0, 0);

    } catch (erro) {
        console.error(`Erro ao carregar página ${nomePagina}:`, erro);
        mostrarToast(`❌ Erro ao carregar ${nomePagina}`, 'error');
    }
}

// ==================== CARREGAR HTML DINAMICAMENTE ====================
async function carregarHTML(nomePagina, caminhoArquivo) {
    try {
        const resposta = await fetch(caminhoArquivo);
        
        if (!resposta.ok) {
            throw new Error(`HTTP error! status: ${resposta.status}`);
        }

        const html = await resposta.text();
        const mainContent = document.getElementById('main-content');
        
        // Criar seção com ID correto
        const section = document.createElement('section');
        section.id = nomePagina + '-tab';
        section.className = 'tab-content';
        section.innerHTML = html;
        
        mainContent.appendChild(section);

        console.log(`✅ Página ${nomePagina} carregada`);

    } catch (erro) {
        console.error(`❌ Erro ao carregar HTML de ${nomePagina}:`, erro);
        throw erro;
    }
}

// ==================== EXPORTAR PARA JANELA GLOBAL ====================
// Alguns utilitários podem precisar ser acessados globalmente
window.carregarPagina = carregarPagina;

