// ==================== CONFIGURAÇÃO ====================
import { API_BASE_URL, API_ENDPOINTS } from './config.js';
import { inicializarTecnicos } from '../pages/tecnicos/tecnicos.js';
import { inicializarEquipamentos } from '../pages/equipamentos/equipamentos.js';
import { inicializarOrdens } from '../pages/ordens/ordens.js';
import { mostrarModal, fecharModal } from './modal.js';

// Para compatibilidade com código existente
const API_CONFIG = {
    BASE_URL: API_BASE_URL,
    ENDPOINTS: API_ENDPOINTS
};

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    verificarConexao();
    inicializarEventos();
    
    // Inicializar módulos de páginas
    inicializarTecnicos();
    inicializarEquipamentos();
    inicializarOrdens();
    
    carregarTecnicos();
    carregarEquipamentos();
    carregarOrdens();
});

// ==================== VERIFICAR CONEXÃO ====================
async function verificarConexao() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/actuator/health`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        const badgeEl = document.getElementById('status-conexao');
        if (response.ok) {
            badgeEl.textContent = '🟢 Conectado';
            badgeEl.classList.remove('loading');
        } else {
            badgeEl.textContent = '🔴 Erro na conexão';
            badgeEl.classList.remove('loading');
        }
    } catch (error) {
        console.error('Erro ao conectar:', error);
        const badgeEl = document.getElementById('status-conexao');
        badgeEl.textContent = '🔴 Desconectado';
        badgeEl.classList.remove('loading');
    }
}

// ==================== INICIALIZAR EVENTOS ====================
function inicializarEventos() {
    // Abas principais
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => mudarAba(btn.dataset.tab));
    });

    // Abas de listagem
    document.querySelectorAll('.listagem-btn').forEach(btn => {
        btn.addEventListener('click', () => mudarListagem(btn.dataset.listagem));
    });

    // Seletor de tipo de OS
    document.querySelectorAll('.tipo-btn').forEach(btn => {
        btn.addEventListener('click', () => mudarTipoOS(btn.dataset.tipo));
    });

    // Formulários
    document.getElementById('form-tecnico').addEventListener('submit', cadastrarTecnico);
    document.getElementById('form-equipamento').addEventListener('submit', cadastrarEquipamento);
    document.getElementById('form-os-corretiva').addEventListener('submit', criarOSCorretiva);
    document.getElementById('form-os-preventiva').addEventListener('submit', criarOSPreventiva);
    document.getElementById('form-atualizar-tecnico').addEventListener('submit', atualizarTecnico);
    document.getElementById('form-atualizar-os').addEventListener('submit', atualizarOS);

    // Fechar modal ao clicar fora (no fundo escuro)
    const modalOS = document.getElementById('modal-os');
    if (modalOS) {
        modalOS.addEventListener('click', (e) => {
            // Se clicou no fundo (modal), fechar
            if (e.target === modalOS) {
                fecharModalOS();
            }
        });
    }

    // Fechar modal ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('modal-os');
            if (modal && modal.classList.contains('show')) {
                fecharModalOS();
            }
        }
    });
}

// ==================== NAVEGAÇÃO ENTRE ABAS ====================
function mudarAba(nomeAba) {
    // Remover ativo de todos
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // Ativar aba selecionada
    const tabId = nomeAba + '-tab';
    const tabEl = document.getElementById(tabId);
    if (tabEl) {
        tabEl.classList.add('active');
    }
    
    // Encontra e ativa o botão clicado
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.dataset.tab === nomeAba) {
            btn.classList.add('active');
        }
    });

    // Recarregar dados se necessário
    if (nomeAba === 'tecnicos') {
        setTimeout(() => carregarTecnicosPage(), 100);
    } else if (nomeAba === 'equipamentos') {
        setTimeout(() => carregarEquipamentosPage(), 100);
    } else if (nomeAba === 'ordens') {
        setTimeout(() => carregarOrdensPage(), 100);
    }
}

function mudarListagem(tipo) {
    // Remover ativo de todos
    document.querySelectorAll('.listagem-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.listagem-btn').forEach(btn => btn.classList.remove('active'));

    // Ativar selecionado
    document.getElementById('listagem-' + tipo).classList.add('active');
    event.target.closest('.listagem-btn').classList.add('active');
}

function mudarTipoOS(tipo) {
    // Remover ativo
    document.querySelectorAll('.requisicao-form-container').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tipo-btn').forEach(btn => btn.classList.remove('active'));

    // Ativar selecionado
    document.getElementById('form-' + tipo + '-container').classList.add('active');
    event.target.closest('.tipo-btn').classList.add('active');
}

// ==================== CADASTRO TÉCNICO ====================
async function cadastrarTecnico(e) {
    e.preventDefault();
    
    const form = e.target;
    const dados = {
        nome: document.getElementById('tecnico-nome').value,
        email: document.getElementById('tecnico-email').value,
        telefone: document.getElementById('tecnico-telefone').value,
        especialidade: document.getElementById('tecnico-especialidade').value,
        setor: document.getElementById('tecnico-setor').value,
        status: document.getElementById('tecnico-status').value
    };

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/tecnico`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const feedback = document.getElementById('tecnico-feedback');
        
        if (response.ok) {
            const resultado = await response.json();
            mostrarFeedback(feedback, `✅ Técnico ${dados.nome} cadastrado com sucesso!`, 'success');
            form.reset();
            carregarTecnicos();
            setTimeout(() => carregarEquipamentos(), 500);
        } else {
            const erro = await response.text();
            mostrarFeedback(feedback, `❌ Erro: ${erro}`, 'error');
        }
    } catch (error) {
        mostrarFeedback(document.getElementById('tecnico-feedback'), `❌ Erro: ${error.message}`, 'error');
    }
}

// ==================== CADASTRO EQUIPAMENTO ====================
async function cadastrarEquipamento(e) {
    e.preventDefault();
    
    const form = e.target;
    const dados = {
        nome: document.getElementById('equip-nome').value,
        codigo: document.getElementById('equip-codigo').value,
        status: document.getElementById('equip-status').value,
        criticidade: document.getElementById('equip-criticidade').value,
        setor: document.getElementById('equip-setor').value
    };

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/equipamento`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const feedback = document.getElementById('equipamento-feedback');
        
        if (response.ok) {
            const resultado = await response.json();
            mostrarFeedback(feedback, `✅ Equipamento ${dados.nome} cadastrado com sucesso!`, 'success');
            form.reset();
            carregarEquipamentos();
        } else {
            const erro = await response.text();
            mostrarFeedback(feedback, `❌ Erro: ${erro}`, 'error');
        }
    } catch (error) {
        mostrarFeedback(document.getElementById('equipamento-feedback'), `❌ Erro: ${error.message}`, 'error');
    }
}

// ==================== CRIAR OS CORRETIVA ====================
async function criarOSCorretiva(e) {
    e.preventDefault();
    
    const form = e.target;
    const falhaCheckbox = document.getElementById('corr-falha-total');
    const dados = {
        equipamentoId: parseInt(document.getElementById('corr-equipamento').value),
        tecnicoId: parseInt(document.getElementById('corr-tecnico').value),
        descricao: document.getElementById('corr-descricao').value,
        descricaoFalha: document.getElementById('corr-falha').value,
        setor: document.getElementById('corr-setor').value,
        nivelCriticidade: parseInt(document.getElementById('corr-criticidade').value),
        falhaTotal: falhaCheckbox ? falhaCheckbox.checked : false
    };

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/ordens-servico/corretiva`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const feedback = document.getElementById('corretiva-feedback');
        
        if (response.ok) {
            const resultado = await response.json();
            mostrarToast(`✅ OS Corretiva #${resultado.id} criada com sucesso!`, 'success');
            mostrarFeedback(feedback, `✅ Ordem de Serviço #${resultado.id} aberta! Status: ${resultado.status}`, 'success');
            form.reset();
            carregarOrdens();
            setTimeout(() => feedback.classList.remove('show'), 3000);
        } else {
            const erro = await response.text();
            mostrarFeedback(feedback, `❌ Erro: ${erro}`, 'error');
        }
    } catch (error) {
        mostrarFeedback(document.getElementById('corretiva-feedback'), `❌ Erro: ${error.message}`, 'error');
    }
}

// ==================== CRIAR OS PREVENTIVA ====================
async function criarOSPreventiva(e) {
    e.preventDefault();
    
    const form = e.target;
    const dados = {
        equipamentoId: parseInt(document.getElementById('prev-equipamento').value),
        tecnicoId: parseInt(document.getElementById('prev-tecnico').value),
        descricao: document.getElementById('prev-descricao').value,
        setor: document.getElementById('prev-setor').value,
        dataPrevista: document.getElementById('prev-data-prevista').value,
        periodicidadeDias: parseInt(document.getElementById('prev-periodicidade').value),
        ultimaManutencao: document.getElementById('prev-ultima-manutencao').value || null
    };

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/ordens-servico/preventiva`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const feedback = document.getElementById('preventiva-feedback');
        
        if (response.ok) {
            const resultado = await response.json();
            mostrarToast(`✅ OS Preventiva #${resultado.id} criada com sucesso!`, 'success');
            mostrarFeedback(feedback, `✅ Ordem de Serviço #${resultado.id} agendada! Data prevista: ${dados.dataPrevista}`, 'success');
            form.reset();
            carregarOrdens();
            setTimeout(() => feedback.classList.remove('show'), 3000);
        } else {
            const erro = await response.text();
            mostrarFeedback(feedback, `❌ Erro: ${erro}`, 'error');
        }
    } catch (error) {
        mostrarFeedback(document.getElementById('preventiva-feedback'), `❌ Erro: ${error.message}`, 'error');
    }
}

// ==================== CARREGAR TÉCNICOS ====================
async function carregarTecnicos() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/tecnico?page=0&size=100`);
        const data = await response.json();
        const tecnicos = data.content || [];

        // Popular selects
        atualizarSelectTecnicos(tecnicos);

        // Popular listagem
        const listEl = document.getElementById('tecnicos-list');
        if (tecnicos.length === 0) {
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
                            <span>${t.email}</span>
                        </div>
                        <div class="item-detail-row">
                            <span class="item-detail-label">Telefone:</span>
                            <span>${t.telefone}</span>
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
                            <span>${getStatusBadge(t.status)}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar técnicos:', error);
    }
}

// ==================== CARREGAR EQUIPAMENTOS ====================
async function carregarEquipamentos() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/equipamento?page=0&size=100`);
        const data = await response.json();
        const equipamentos = data.content || [];

        // Popular selects
        atualizarSelectEquipamentos(equipamentos);

        // Popular listagem
        const listEl = document.getElementById('equipamentos-list');
        if (equipamentos.length === 0) {
            listEl.innerHTML = `
                <div class="item-empty">
                    <div class="item-empty-icon">🔧</div>
                    <p>Nenhum equipamento cadastrado</p>
                </div>
            `;
        } else {
            listEl.innerHTML = equipamentos.map(e => `
                <div class="item-card">
                    <div class="item-title">🔧 ${e.nome} (${e.codigo})</div>
                    <div class="item-detail">
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
    }
}

// ==================== CARREGAR ORDENS ====================
async function carregarOrdens() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/ordens-servico/abertas`);
        const ordens = await response.json();

        // Atualizar select de atualização de OS
        atualizarSelectOS(ordens);

        const listEl = document.getElementById('ordens-list');
        if (!Array.isArray(ordens) || ordens.length === 0) {
            listEl.innerHTML = `
                <div class="item-empty">
                    <div class="item-empty-icon">📋</div>
                    <p>Nenhuma ordem aberta</p>
                </div>
            `;
        } else {
            listEl.innerHTML = ordens.map(o => `
                <div class="item-card">
                    <div class="item-title">📋 OS #${o.id} - ${o.descricao.substring(0, 50)}...</div>
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
    }
}

// ==================== ATUALIZAR SELECTS ====================
function atualizarSelectTecnicos(tecnicos) {
    const selects = ['corr-tecnico', 'prev-tecnico', 'atualizar-tecnico-id', 'atualizar-os-tecnico'];
    selects.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            const currentValue = select.value;
            const html = tecnicos.map(t => `<option value="${t.id}">${t.nome} - ${t.especialidade}</option>`).join('');
            select.innerHTML = '<option value="">Selecionar...</option>' + html;
            select.value = currentValue; // Restore selected value
        }
    });
}

function atualizarSelectEquipamentos(equipamentos) {
    const selects = ['corr-equipamento', 'prev-equipamento'];
    selects.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            const html = equipamentos.map(e => `<option value="${e.id}">${e.nome} (${e.codigo}) - ${e.setor}</option>`).join('');
            select.innerHTML = '<option value="">Selecionar...</option>' + html;
        }
    });
}

function atualizarSelectOS(ordens) {
    const select = document.getElementById('atualizar-os-id');
    if (select) {
        const html = ordens.map(o => `<option value="${o.id}">OS #${o.id} - ${o.descricao.substring(0, 40)}... (${o.status})</option>`).join('');
        select.innerHTML = '<option value="">Selecionar OS...</option>' + html;
    }
}

// ==================== HELPERS ====================
function getStatusBadge(status) {
    const badges = {
        'DISPONIVEL': '🟢 Disponível',
        'EM_PAUSA': '🟡 Em Pausa',
        'INDISPONIVEL': '🔴 Indisponível',
        'ATIVO': '🟢 Ativo',
        'INATIVO': '🔴 Inativo',
        'MANUTENCAO': '🟡 Manutenção',
        'ABERTA': '🔵 Aberta',
        'EM_ANDAMENTO': '🟡 Em Andamento',
        'CONCLUIDA': '🟢 Concluída',
        'CANCELADA': '🔴 Cancelada'
    };
    return badges[status] || status;
}

function getCriticidadeBadge(critica) {
    const badges = {
        'ALTA': '🔴 Alta',
        'MEDIA': '🟡 Média',
        'BAIXA': '🟢 Baixa'
    };
    return badges[critica] || critica;
}

function getPrioridadeBadge(prioridade) {
    if (prioridade >= 12) return '🔴 Crítica';
    if (prioridade >= 8) return '🟠 Alta';
    if (prioridade >= 4) return '🟡 Média';
    return '🟢 Baixa';
}

function formatarData(data) {
    if (!data) return '-';
    try {
        const d = new Date(data);
        return d.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return data;
    }
}

function mostrarFeedback(elemento, mensagem, tipo) {
    elemento.textContent = mensagem;
    elemento.className = `feedback show ${tipo}`;
}

function mostrarToast(mensagem, tipo = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = mensagem;
    toast.className = `toast show ${tipo}`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==================== RECARREGAR ====================
function recarregarTecnicos() {
    carregarTecnicos();
    mostrarToast('🔄 Técnicos recarregados', 'info');
}

function recarregarEquipamentos() {
    carregarEquipamentos();
    mostrarToast('🔄 Equipamentos recarregados', 'info');
}

function recarregarOrdens() {
    carregarOrdens();
    mostrarToast('🔄 Ordens recarregadas', 'info');
}

// ==================== CARREGAR PÁGINAS SEPARADAS ====================
async function carregarTecnicosPage() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/tecnico?page=0&size=100`);
        const data = await response.json();
        const tecnicos = data.content || [];

        const listEl = document.getElementById('tecnicos-list-page');
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
        document.getElementById('tecnicos-list-page').innerHTML = `<div class="error-message">❌ Erro ao carregar técnicos</div>`;
    }
}

async function carregarEquipamentosPage() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/equipamento?page=0&size=100`);
        const data = await response.json();
        const equipamentos = data.content || [];

        const listEl = document.getElementById('equipamentos-list-page');
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
        document.getElementById('equipamentos-list-page').innerHTML = `<div class="error-message">❌ Erro ao carregar equipamentos</div>`;
    }
}

async function carregarOrdensPage() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/ordens-servico/abertas`);
        const ordens = await response.json();

        const listEl = document.getElementById('ordens-list-page');
        if (!Array.isArray(ordens) || ordens.length === 0) {
            listEl.innerHTML = `
                <div class="item-empty">
                    <div class="item-empty-icon">📋</div>
                    <p>Nenhuma ordem aberta</p>
                </div>
            `;
        } else {
            listEl.innerHTML = ordens.map(o => `
                <div class="item-card-large" onclick="abrirModalOS(${o.id})">
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
        document.getElementById('ordens-list-page').innerHTML = `<div class="error-message">❌ Erro ao carregar ordens de serviço</div>`;
    }
}

// ==================== MODAL PARA DETALHES DE OS ====================
async function abrirModalOS(osId) {
    const modal = document.getElementById('modal-os');
    const body = document.getElementById('modal-os-body');
    
    try {
        // Mostrar modal com carregamento
        document.getElementById('modal-os-title').textContent = '⏳ Carregando...';
        body.innerHTML = `<div style="text-align: center; padding: 40px;"><p>⏳ Carregando dados da OS...</p></div>`;
        modal.classList.add('show');
        
        const response = await fetch(`${API_CONFIG.BASE_URL}/ordens-servico/${osId}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Ordem de Serviço não encontrada (404)');
            } else if (response.status === 500) {
                throw new Error('Erro no servidor ao carregar OS (500)');
            } else {
                throw new Error(`Erro ao carregar OS: ${response.status}`);
            }
        }
        
        const os = await response.json();

        const titulo = `📋 Ordem de Serviço #${os.id}`;
        document.getElementById('modal-os-title').textContent = titulo;
        
        body.innerHTML = `
            <div class="modal-details">
                <div class="detail-section">
                    <h3>📋 Informações Gerais</h3>
                    <div class="detail-item">
                        <span class="detail-label">ID:</span>
                        <span><strong>#${os.id}</strong></span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Status:</span>
                        <span>${getStatusBadge(os.status)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Setor:</span>
                        <span>${os.setor || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Data de Abertura:</span>
                        <span>${formatarData(os.dataAbertura)}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h3>🔧 Equipamento e Técnico</h3>
                    <div class="detail-item">
                        <span class="detail-label">Equipamento:</span>
                        <span>${os.equipamento ? os.equipamento.nome + ' (#' + os.equipamento.id + ')' : 'ID #' + os.equipamentoId}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Técnico:</span>
                        <span>${os.tecnico ? os.tecnico.nome + ' (#' + os.tecnico.id + ')' : 'ID #' + os.tecnicoId}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h3>📝 Descrição da OS</h3>
                    <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${os.descricao || '-'}</p>
                </div>

                ${os.descricaoFalha ? `
                <div class="detail-section">
                    <h3>⚠️ Descrição da Falha</h3>
                    <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${os.descricaoFalha}</p>
                </div>
                ` : ''}

                ${os.nivelCriticidade ? `
                <div class="detail-section">
                    <h3>🎯 Nível de Criticidade</h3>
                    <div class="detail-item">
                        <span class="detail-label">Prioridade:</span>
                        <span>${getPrioridadeBadge(os.prioridade || os.nivelCriticidade * 3)}</span>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
    } catch (error) {
        console.error('Erro ao carregar detalhes da OS:', error);
        document.getElementById('modal-os-title').textContent = '❌ Erro ao Carregar';
        body.innerHTML = `
            <div style="text-align: center; padding: 30px; color: var(--danger);">
                <h3 style="margin-bottom: 10px;">❌ Erro ao Carregar</h3>
                <p style="margin: 10px 0; font-size: 1rem;">${error.message}</p>
                <p style="margin: 10px 0; font-size: 0.85rem; color: var(--secondary);">Verifique se o servidor está disponível</p>
            </div>
        `;
    }
}

function fecharModalOS() {
    const modal = document.getElementById('modal-os');
    if (modal) {
        modal.classList.remove('show');
        
        // Limpar conteúdo
        const title = document.getElementById('modal-os-title');
        const body = document.getElementById('modal-os-body');
        
        if (title) title.textContent = 'Detalhes da Ordem de Serviço';
        if (body) body.innerHTML = '';
        
        // Garantir que o modal fica invisível
        modal.style.display = 'none';
        setTimeout(() => {
            if (!modal.classList.contains('show')) {
                modal.style.display = 'none';
            }
        }, 100);
    }
}



// ==================== ATUALIZAR TÉCNICO ====================
async function carregarDadosTecnico(tecnicoId) {
    if (!tecnicoId) {
        document.getElementById('tecnico-form-container').style.display = 'none';
        document.getElementById('atualizar-tecnico-feedback').textContent = '';
        return;
    }

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/tecnico/${tecnicoId}`);
        if (!response.ok) {
            throw new Error('Técnico não encontrado');
        }

        const tecnico = await response.json();
        
        // Preencher formulário
        document.getElementById('atualizar-tecnico-nome').value = tecnico.nome || '';
        document.getElementById('atualizar-tecnico-email').value = tecnico.email || '';
        document.getElementById('atualizar-tecnico-telefone').value = tecnico.telefone || '';
        document.getElementById('atualizar-tecnico-especialidade').value = tecnico.especialidade || '';
        document.getElementById('atualizar-tecnico-setor').value = tecnico.setor || '';
        document.getElementById('atualizar-tecnico-status').value = tecnico.status || '';
        
        // Mostrar formulário
        document.getElementById('tecnico-form-container').style.display = 'block';
        document.getElementById('atualizar-tecnico-feedback').textContent = '';
    } catch (error) {
        document.getElementById('tecnico-form-container').style.display = 'none';
        mostrarFeedback(document.getElementById('atualizar-tecnico-feedback'), `❌ Erro ao carregar técnico: ${error.message}`, 'error');
    }
}

async function atualizarTecnico(e) {
    e.preventDefault();

    const tecnicoId = document.getElementById('atualizar-tecnico-id').value;
    if (!tecnicoId) {
        mostrarFeedback(document.getElementById('atualizar-tecnico-feedback'), `❌ Selecione um técnico primeiro!`, 'error');
        return;
    }

    const dados = {
        id: parseInt(tecnicoId),
        nome: document.getElementById('atualizar-tecnico-nome').value,
        email: document.getElementById('atualizar-tecnico-email').value,
        telefone: document.getElementById('atualizar-tecnico-telefone').value,
        especialidade: document.getElementById('atualizar-tecnico-especialidade').value,
        setor: document.getElementById('atualizar-tecnico-setor').value,
        status: document.getElementById('atualizar-tecnico-status').value
    };

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/tecnico/${tecnicoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const feedback = document.getElementById('atualizar-tecnico-feedback');
        
        if (response.ok) {
            mostrarFeedback(feedback, `✅ Técnico ${dados.nome} atualizado com sucesso!`, 'success');
            mostrarToast(`✅ Técnico atualizado!`, 'success');
            carregarTecnicos();
            setTimeout(() => limparFormularioTecnico(), 1500);
        } else {
            const erro = await response.text();
            mostrarFeedback(feedback, `❌ Erro ao atualizar: ${erro}`, 'error');
        }
    } catch (error) {
        mostrarFeedback(document.getElementById('atualizar-tecnico-feedback'), `❌ Erro: ${error.message}`, 'error');
    }
}

function limparFormularioTecnico() {
    document.getElementById('form-atualizar-tecnico').reset();
    document.getElementById('atualizar-tecnico-id').value = '';
    document.getElementById('tecnico-form-container').style.display = 'none';
    document.getElementById('atualizar-tecnico-feedback').textContent = '';
    document.getElementById('atualizar-tecnico-feedback').classList.remove('show');
}

// ==================== ATUALIZAR ORDEM DE SERVIÇO ====================
async function carregarDadosOS(osId) {
    if (!osId) {
        document.getElementById('os-form-container').style.display = 'none';
        document.getElementById('atualizar-os-feedback').textContent = '';
        return;
    }

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/ordens-servico/${osId}`);
        if (!response.ok) {
            throw new Error('OS não encontrada');
        }

        const os = await response.json();
        
        // Preencher formulário - apenas status é editável
        document.getElementById('atualizar-os-status').value = os.status || '';
        document.getElementById('atualizar-os-tecnico').value = os.tecnico?.id || os.tecnicoId || '';
        document.getElementById('atualizar-os-descricao').value = os.descricao || '';
        document.getElementById('atualizar-os-setor').value = os.setor || '';
        document.getElementById('atualizar-os-data-conclusao').value = os.dataConclusao ? os.dataConclusao.split('T')[0] : '';
        
        // Tornar campos não editáveis read-only
        document.getElementById('atualizar-os-tecnico').disabled = true;
        document.getElementById('atualizar-os-descricao').readOnly = true;
        document.getElementById('atualizar-os-setor').readOnly = true;
        document.getElementById('atualizar-os-data-conclusao').readOnly = true;
        
        // Mostrar formulário
        document.getElementById('os-form-container').style.display = 'block';
        document.getElementById('atualizar-os-feedback').textContent = '';
    } catch (error) {
        document.getElementById('os-form-container').style.display = 'none';
        mostrarFeedback(document.getElementById('atualizar-os-feedback'), `❌ Erro ao carregar OS: ${error.message}`, 'error');
    }
}

async function atualizarOS(e) {
    e.preventDefault();

    const osId = document.getElementById('atualizar-os-id').value;
    if (!osId) {
        mostrarFeedback(document.getElementById('atualizar-os-feedback'), `❌ Selecione uma OS primeiro!`, 'error');
        return;
    }

    const dados = {
        id: parseInt(osId),
        novoStatus: document.getElementById('atualizar-os-status').value,
        observacoes: document.getElementById('atualizar-os-descricao').value // using descricao as observacoes
    };

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/ordens-servico/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const feedback = document.getElementById('atualizar-os-feedback');
        
        if (response.ok) {
            mostrarFeedback(feedback, `✅ Status da Ordem de Serviço #${osId} atualizado com sucesso!`, 'success');
            mostrarToast(`✅ OS #${osId} atualizada!`, 'success');
            carregarOrdens();
            setTimeout(() => limparFormularioOS(), 1500);
        } else {
            const erro = await response.text();
            mostrarFeedback(feedback, `❌ Erro ao atualizar: ${erro}`, 'error');
        }
    } catch (error) {
        mostrarFeedback(document.getElementById('atualizar-os-feedback'), `❌ Erro: ${error.message}`, 'error');
    }
}

function limparFormularioOS() {
    document.getElementById('form-atualizar-os').reset();
    document.getElementById('atualizar-os-id').value = '';
    document.getElementById('os-form-container').style.display = 'none';
    document.getElementById('atualizar-os-feedback').textContent = '';
    document.getElementById('atualizar-os-feedback').classList.remove('show');
    
    // Re-enable fields
    document.getElementById('atualizar-os-tecnico').disabled = false;
    document.getElementById('atualizar-os-descricao').readOnly = false;
    document.getElementById('atualizar-os-setor').readOnly = false;
    document.getElementById('atualizar-os-data-conclusao').readOnly = false;
}
