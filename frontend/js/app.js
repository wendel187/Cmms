// ==================== CONFIGURAÇÃO E IMPORTAÇÕES ====================
import { API_BASE_URL, API_ENDPOINTS } from './config.js';
import { inicializarTecnicos } from '../pages/tecnicos/tecnicos.js';
import { inicializarEquipamentos } from '../pages/equipamentos/equipamentos.js';
import { inicializarOrdens } from '../pages/ordens/ordens.js';
import { mostrarModal, fecharModal } from './modal.js';

// Importar módulos refatorados
import { ativarAba, ativarListagem, ativarTipoOS } from './modules/navigationManager.js';
import { 
    post, get, put, del, 
    buscarTecnicos, buscarEquipamentos, buscarOrdensAbertas,
    buscarTecnico, buscarOrdem,
    criarTecnico, criarEquipamento, criarOSCorretiva, criarOSPreventiva,
    atualizarTecnico as atualizarTecnicoAPI, atualizarEquipamento, atualizarStatusOS,
    deletarTecnico, deletarEquipamento, deletarOrdem,
    verificarConexaoBackend,
    comFeedback
} from './modules/apiClient.js';
import {
    renderizarListaTecnicos, renderizarListaEquipamentos, renderizarListaOrdens,
    renderizarErro
} from './modules/componentRenderer.js';
import {
    extrairDadosFormulario, limparFormulario as limparFormularioHelper,
    preencherFormulario, definirEstadoFormulario, obterValor, definirValor
} from './modules/formManager.js';
import {
    mostrarToast, formatarData, getStatusBadge, getCriticidadeBadge, getPrioridadeBadge,
    mostrarFeedback
} from './utils.js';

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', async () => {
    await verificarConexao();
    inicializarEventos();
    
    // Inicializar módulos de páginas
    inicializarTecnicos();
    inicializarEquipamentos();
    inicializarOrdens();
    
    // Carregar dados iniciais
    await Promise.all([
        carregarTecnicos(),
        carregarEquipamentos(),
        carregarOrdens()
    ]);
});

// ==================== VERIFICAR CONEXÃO ====================
async function verificarConexao() {
    const badgeEl = document.getElementById('status-conexao');
    if (!badgeEl) return;

    try {
        const conectado = await verificarConexaoBackend();
        badgeEl.textContent = conectado ? '🟢 Conectado' : '🔴 Erro na conexão';
    } catch (error) {
        console.error('Erro ao verificar conexão:', error);
        badgeEl.textContent = '🔴 Desconectado';
    } finally {
        badgeEl.classList.remove('loading');
    }
}

// ==================== INICIALIZAR EVENTOS ====================
function inicializarEventos() {
    // Abas principais
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => ativarAba(btn.dataset.tab));
    });

    // Abas de listagem
    document.querySelectorAll('.listagem-btn').forEach(btn => {
        btn.addEventListener('click', (event) => ativarListagem(btn.dataset.listagem, event));
    });

    // Seletor de tipo de OS
    document.querySelectorAll('.tipo-btn').forEach(btn => {
        btn.addEventListener('click', (event) => ativarTipoOS(btn.dataset.tipo, event));
    });

    // Formulários
    document.getElementById('form-tecnico')?.addEventListener('submit', cadastrarTecnico);
    document.getElementById('form-equipamento')?.addEventListener('submit', cadastrarEquipamento);
    document.getElementById('form-os-corretiva')?.addEventListener('submit', criarOSCorretiva);
    document.getElementById('form-os-preventiva')?.addEventListener('submit', criarOSPreventiva);
    document.getElementById('form-atualizar-tecnico')?.addEventListener('submit', atualizarTecnico);
    document.getElementById('form-atualizar-os')?.addEventListener('submit', atualizarOS);
}




// ==================== CADASTRO TÉCNICO ====================
async function cadastrarTecnico(e) {
    e.preventDefault();
    
    const form = e.target;
    const dados = extrairDadosFormulario('tecnico');
    
    try {
        await criarTecnico(dados);
        mostrarToast(`✅ Técnico ${dados.tecnicoNome} cadastrado com sucesso!`, 'success');
        limparFormulario('form-tecnico');
        await Promise.all([carregarTecnicos(), carregarEquipamentos()]);
    } catch (error) {
        mostrarToast(`❌ Erro: ${error.message}`, 'error');
    }
}

// ==================== CADASTRO EQUIPAMENTO ====================
async function cadastrarEquipamento(e) {
    e.preventDefault();
    
    const dados = extrairDadosFormulario('equipamento');
    
    try {
        await criarEquipamento(dados);
        mostrarToast(`✅ Equipamento ${dados.equipNome} cadastrado com sucesso!`, 'success');
        limparFormulario('form-equipamento');
        await carregarEquipamentos();
    } catch (error) {
        mostrarToast(`❌ Erro: ${error.message}`, 'error');
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
            mostrarToast('✅ OS Corretiva criada com sucesso!', 'success');
            form.reset();
        } else {
            const error = await response.text();
            mostrarToast(`❌ Erro ao criar OS: ${error}`, 'error');
        }
    } catch (error) {
        console.error('Erro ao criar OS Corretiva:', error);
        mostrarToast('❌ Erro ao criar OS Corretiva', 'error');
    }
}

// ==================== CRIAR OS PREVENTIVA ====================
async function criarOSPreventiva(e) {
    e.preventDefault();
    
    const dados = extrairDadosFormulario('osPreventiva');
    // Garantir tipos corretos
    dados.prevEquipamento = parseInt(dados.prevEquipamento);
    dados.prevTecnico = parseInt(dados.prevTecnico);
    dados.prevPeriodicidade = parseInt(dados.prevPeriodicidade);
    
    try {
        const resultado = await criarOSPreventiva({
            equipamentoId: dados.prevEquipamento,
            tecnicoId: dados.prevTecnico,
            descricao: dados.prevDescricao,
            setor: dados.prevSetor,
            dataPrevista: dados.prevDataPrevista,
            periodicidadeDias: dados.prevPeriodicidade,
            ultimaManutencao: dados.prevUltimaManutencao || null
        });
        
        mostrarToast(`✅ OS Preventiva #${resultado.id} criada com sucesso!`, 'success');
        limparFormulario('form-os-preventiva');
        await carregarOrdens();
    } catch (error) {
        mostrarToast(`❌ Erro ao criar OS: ${error.message}`, 'error');
    }
}

// ==================== CARREGAR TÉCNICOS ====================
async function carregarTecnicos() {
    try {
        const tecnicos = await buscarTecnicos();
        
        // Popular selects com técnicos
        atualizarSelectTecnicos(tecnicos);
        
        // Renderizar listagem
        const container = document.getElementById('tecnicos-list');
        renderizarListaTecnicos(container, tecnicos, false);
    } catch (error) {
        console.error('Erro ao carregar técnicos:', error);
        const container = document.getElementById('tecnicos-list');
        renderizarErro(container, 'Erro ao carregar técnicos');
    }
}

// ==================== CARREGAR EQUIPAMENTOS ====================
async function carregarEquipamentos() {
    try {
        const equipamentos = await buscarEquipamentos();
        
        // Popular selects com equipamentos
        atualizarSelectEquipamentos(equipamentos);
        
        // Renderizar listagem
        const container = document.getElementById('equipamentos-list');
        renderizarListaEquipamentos(container, equipamentos, false);
    } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
        const container = document.getElementById('equipamentos-list');
        renderizarErro(container, 'Erro ao carregar equipamentos');
    }
}

// ==================== CARREGAR ORDENS ====================
async function carregarOrdens() {
    try {
        const ordens = await buscarOrdensAbertas();
        
        // Popular select de atualização de OS
        atualizarSelectOS(ordens);
        
        // Renderizar listagem
        const container = document.getElementById('ordens-list');
        renderizarListaOrdens(container, ordens, false);
    } catch (error) {
        console.error('Erro ao carregar ordens:', error);
        const container = document.getElementById('ordens-list');
        renderizarErro(container, 'Erro ao carregar ordens de serviço');
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
        const tecnicos = await buscarTecnicos();
        const container = document.getElementById('tecnicos-list-page');
        renderizarListaTecnicos(container, tecnicos, true);
    } catch (error) {
        console.error('Erro ao carregar técnicos:', error);
        const container = document.getElementById('tecnicos-list-page');
        renderizarErro(container, 'Erro ao carregar técnicos');
    }
}

async function carregarEquipamentosPage() {
    try {
        const equipamentos = await buscarEquipamentos();
        const container = document.getElementById('equipamentos-list-page');
        renderizarListaEquipamentos(container, equipamentos, true);
    } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
        const container = document.getElementById('equipamentos-list-page');
        renderizarErro(container, 'Erro ao carregar equipamentos');
    }
}

async function carregarOrdensPage() {
    try {
        const ordens = await buscarOrdensAbertas();
        const container = document.getElementById('ordens-list-page');
        renderizarListaOrdens(container, ordens, true);
    } catch (error) {
        console.error('Erro ao carregar ordens:', error);
        const container = document.getElementById('ordens-list-page');
        renderizarErro(container, 'Erro ao carregar ordens de serviço');
    }
}

// ==================== ATUALIZAR TÉCNICO ====================
async function carregarDadosTecnico(tecnicoId) {
    if (!tecnicoId) {
        document.getElementById('tecnico-form-container').style.display = 'none';
        return;
    }

    try {
        const tecnico = await buscarTecnico(tecnicoId);
        preencherFormulario('form-atualizar-tecnico', tecnico);
        document.getElementById('tecnico-form-container').style.display = 'block';
        
        // Resetar botões
        document.getElementById('btn-editar-tecnico').style.display = 'inline-block';
        documento.getElementById('btn-salvar-tecnico').style.display = 'none';
        document.getElementById('btn-cancelar-tecnico').style.display = 'none';
    } catch (error) {
        document.getElementById('tecnico-form-container').style.display = 'none';
        mostrarToast(`❌ Erro ao carregar técnico: ${error.message}`, 'error');
    }
}

async function atualizarTecnico(e) {
    e.preventDefault();

    const tecnicoId = obterValor('atualizar-tecnico-id');
    if (!tecnicoId) {
        mostrarToast('❌ Selecione um técnico primeiro!', 'error');
        return;
    }

    const dados = {
        nome: obterValor('atualizar-tecnico-nome'),
        email: obterValor('atualizar-tecnico-email'),
        telefone: obterValor('atualizar-tecnico-telefone'),
        especialidade: obterValor('atualizar-tecnico-especialidade'),
        setor: obterValor('atualizar-tecnico-setor'),
        status: obterValor('atualizar-tecnico-status')
    };

    try {
        await atualizarTecnicoAPI(tecnicoId, dados);
        mostrarToast(`✅ Técnico atualizado!`, 'success');
        limparFormulario('form-atualizar-tecnico');
        await carregarTecnicos();
        cancelarEdicaoTecnico();
    } catch (error) {
        mostrarToast(`❌ Erro ao atualizar: ${error.message}`, 'error');
    }
}

function limparFormulario(formId) {
    limparFormularioHelper(formId);
    const container = document.getElementById('tecnico-form-container');
    if (container) {
        container.style.display = 'none';
    }
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
        
        // Desabilitar campos por padrão
        document.getElementById('atualizar-os-status').disabled = true;
        document.getElementById('atualizar-os-tecnico').disabled = true;
        document.getElementById('atualizar-os-descricao').disabled = true;
        document.getElementById('atualizar-os-setor').disabled = true;
        document.getElementById('atualizar-os-data-conclusao').disabled = true;
        
        // Mostrar formulário
        document.getElementById('os-form-container').style.display = 'block';
        document.getElementById('atualizar-os-feedback').textContent = '';
        
        // Resetar estado dos botões (mostrar Editar, esconder Salvar/Cancelar)
        document.getElementById('btn-editar-os').style.display = 'inline-block';
        document.getElementById('btn-salvar-os').style.display = 'none';
        document.getElementById('btn-cancelar-os').style.display = 'none';
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
            setTimeout(() => {
                limparFormularioOS();
                cancelarEdicaoOS();
            }, 1500);
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
    
    // Resetar botões de edição
    document.getElementById('btn-editar-os').style.display = 'inline-block';
    document.getElementById('btn-salvar-os').style.display = 'none';
    document.getElementById('btn-cancelar-os').style.display = 'none';
}

// ==================== FUNÇÕES GLOBAIS PARA BOTÕES DE EDITAR ====================

/**
 * Abrir formulário para editar técnico
 * @param {number} tecnicoId - ID do técnico
 */
function abrirEditarTecnico(tecnicoId) {
    // Navegar para a aba de atualizar técnico
    mudarAba('atualizar-tecnico');
    
    // Selecionar o técnico no dropdown
    const selectTecnico = document.getElementById('atualizar-tecnico-id');
    if (selectTecnico) {
        selectTecnico.value = tecnicoId;
        // Disparar o event de change para carregar os dados
        const event = new Event('change');
        selectTecnico.dispatchEvent(event);
    }
}

/**
 * Abrir formulário para deletar técnico
 * @param {number} tecnicoId - ID do técnico
 */
function abrirDeletarTecnico(tecnicoId) {
    const confirmacao = confirm('⚠️ Desativar este técnico? Essa ação não pode ser desfeita.');
    
    if (!confirmacao) {
        mostrarToast('❌ Operação cancelada', 'info');
        return;
    }

    deletarTecnicoConfirmado(tecnicoId);
}

/**
 * Deletar técnico confirmado
 * @param {number} tecnicoId - ID do técnico
 */
async function deletarTecnicoConfirmado(tecnicoId) {
    try {
        mostrarToast('🗑️ Desativando técnico...', 'info');
        
        const response = await fetch(`${API_CONFIG.BASE_URL}/tecnico/${tecnicoId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            mostrarToast('✅ Técnico desativado com sucesso!', 'success');
            carregarTecnicos();
            carregarTecnicosPage();
        } else {
            const erro = await response.text();
            mostrarToast(`❌ Erro ao desativar técnico: ${erro}`, 'error');
        }
    } catch (error) {
        console.error('Erro ao desativar técnico:', error);
        mostrarToast('❌ Erro ao desativar técnico', 'error');
    }
}

/**
 * Abrir formulário para editar ordem de serviço
 * @param {number} osId - ID da ordem
 */
function abrirEditarOS(osId) {
    // Navegar para a aba de atualizar OS
    mudarAba('atualizar-os');
    
    // Selecionar a OS no dropdown
    const selectOS = document.getElementById('atualizar-os-id');
    if (selectOS) {
        selectOS.value = osId;
        // Disparar o event de change para carregar os dados
        const event = new Event('change');
        selectOS.dispatchEvent(event);
    }
}

/**
 * Abrir confirmação para deletar ordem de serviço
 * @param {number} osId - ID da ordem
 */
function abrirDeletarOS(osId) {
    const confirmacao = confirm('⚠️ Cancelar esta ordem de serviço? Essa ação não pode ser desfeita.');
    
    if (!confirmacao) {
        mostrarToast('❌ Operação cancelada', 'info');
        return;
    }

    deletarOSConfirmada(osId);
}

/**
 * Deletar ordem de serviço confirmada
 * @param {number} osId - ID da ordem
 */
async function deletarOSConfirmada(osId) {
    try {
        mostrarToast('🗑️ Cancelando ordem...', 'info');
        
        const response = await fetch(`${API_CONFIG.BASE_URL}/ordens-servico/${osId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            mostrarToast('✅ Ordem cancelada com sucesso!', 'success');
            carregarOrdens();
            carregarOrdensPage();
        } else {
            const erro = await response.text();
            mostrarToast(`❌ Erro ao cancelar ordem: ${erro}`, 'error');
        }
    } catch (error) {
        console.error('Erro ao cancelar ordem:', error);
        mostrarToast('❌ Erro ao cancelar ordem', 'error');
    }
}

/**
 * Deletar técnico selecionado no dropdown da aba "Atualizar Técnico"
 */
function deletarTecnicoSelecionado() {
    const tecnicoId = document.getElementById('atualizar-tecnico-id').value;
    
    if (!tecnicoId) {
        mostrarToast('❌ Selecione um técnico primeiro!', 'error');
        return;
    }
    
    // Chamar a função existente que já trata a confirmação e deleção
    abrirDeletarTecnico(tecnicoId);
}

/**
 * Deletar ordem de serviço selecionada no dropdown da aba "Atualizar OS"
 */
function deletarOSSelecionada() {
    const osId = document.getElementById('atualizar-os-id').value;
    
    if (!osId) {
        mostrarToast('❌ Selecione uma ordem de serviço primeiro!', 'error');
        return;
    }
    
    // Chamar a função existente que já trata a confirmação e deleção
    abrirDeletarOS(osId);
}

/**
 * Ativar modo de edição para técnico
 */
function ativarEdicaoTecnico() {
    // Habilitar campos
    document.getElementById('atualizar-tecnico-nome').disabled = false;
    document.getElementById('atualizar-tecnico-email').disabled = false;
    document.getElementById('atualizar-tecnico-telefone').disabled = false;
    document.getElementById('atualizar-tecnico-especialidade').disabled = false;
    document.getElementById('atualizar-tecnico-setor').disabled = false;
    document.getElementById('atualizar-tecnico-status').disabled = false;
    
    // Mostrar botões de salvar/cancelar
    document.getElementById('btn-salvar-tecnico').style.display = 'inline-block';
    document.getElementById('btn-cancelar-tecnico').style.display = 'inline-block';
    
    // Esconder botão de editar
    document.getElementById('btn-editar-tecnico').style.display = 'none';
    
    mostrarToast('✏️ Modo edição ativado', 'info');
}

/**
 * Cancelar modo de edição para técnico
 */
function cancelarEdicaoTecnico() {
    // Desabilitar campos
    document.getElementById('atualizar-tecnico-nome').disabled = true;
    document.getElementById('atualizar-tecnico-email').disabled = true;
    document.getElementById('atualizar-tecnico-telefone').disabled = true;
    document.getElementById('atualizar-tecnico-especialidade').disabled = true;
    document.getElementById('atualizar-tecnico-setor').disabled = true;
    document.getElementById('atualizar-tecnico-status').disabled = true;
    
    // Esconder botões de salvar/cancelar
    document.getElementById('btn-salvar-tecnico').style.display = 'none';
    document.getElementById('btn-cancelar-tecnico').style.display = 'none';
    
    // Mostrar botão de editar
    document.getElementById('btn-editar-tecnico').style.display = 'inline-block';
    
    mostrarToast('❌ Edição cancelada', 'info');
}

/**
 * Ativar modo de edição para ordem de serviço
 */
function ativarEdicaoOS() {
    // Habilitar campos
    document.getElementById('atualizar-os-status').disabled = false;
    document.getElementById('atualizar-os-tecnico').disabled = false;
    document.getElementById('atualizar-os-descricao').disabled = false;
    document.getElementById('atualizar-os-setor').disabled = false;
    document.getElementById('atualizar-os-data-conclusao').disabled = false;
    
    // Mostrar botões de salvar/cancelar
    document.getElementById('btn-salvar-os').style.display = 'inline-block';
    document.getElementById('btn-cancelar-os').style.display = 'inline-block';
    
    // Esconder botão de editar
    document.getElementById('btn-editar-os').style.display = 'none';
    
    mostrarToast('✏️ Modo edição ativado', 'info');
}

/**
 * Cancelar modo de edição para ordem de serviço
 */
function cancelarEdicaoOS() {
    // Desabilitar campos
    document.getElementById('atualizar-os-status').disabled = true;
    document.getElementById('atualizar-os-tecnico').disabled = true;
    document.getElementById('atualizar-os-descricao').disabled = true;
    document.getElementById('atualizar-os-setor').disabled = true;
    document.getElementById('atualizar-os-data-conclusao').disabled = true;
    
    // Esconder botões de salvar/cancelar
    document.getElementById('btn-salvar-os').style.display = 'none';
    document.getElementById('btn-cancelar-os').style.display = 'none';
    
    // Mostrar botão de editar
    document.getElementById('btn-editar-os').style.display = 'inline-block';
    
    mostrarToast('❌ Edição cancelada', 'info');
}

// ==================== EXPORTAR FUNÇÕES GLOBAIS ====================
// Tornar funções acessíveis do HTML (onclick, etc)
window.ativarEdicaoTecnico = ativarEdicaoTecnico;
window.cancelarEdicaoTecnico = cancelarEdicaoTecnico;
window.ativarEdicaoOS = ativarEdicaoOS;
window.cancelarEdicaoOS = cancelarEdicaoOS;
window.deletarTecnicoSelecionado = deletarTecnicoSelecionado;
window.deletarOSSelecionada = deletarOSSelecionada;
window.carregarDadosTecnico = carregarDadosTecnico;
window.carregarDadosOS = carregarDadosOS;
window.limparFormularioTecnico = limparFormularioTecnico;
window.limparFormularioOS = limparFormularioOS;
window.atualizarTecnico = atualizarTecnico;
window.atualizarOS = atualizarOS;
window.mostrarToast = mostrarToast;
window.recarregarTecnicos = recarregarTecnicos;
window.recarregarEquipamentos = recarregarEquipamentos;
window.recarregarOrdens = recarregarOrdens;
