// ==================== IMPORTAÇÕES ====================
import { API_BASE_URL } from './config.js';

import { inicializarTecnicos } from '../pages/tecnicos/tecnicos.js';
import { inicializarEquipamentos } from '../pages/equipamentos/equipamentos.js';
import { inicializarOrdens } from '../pages/ordens/ordens.js';

import { ativarAba, ativarListagem, ativarTipoOS, setCarregadores } from './modules/navigationManager.js';

import {
    buscarTecnicos,
    buscarEquipamentos,
    buscarOrdensAbertas,
    buscarTecnico,
    buscarOrdem,
    verificarConexaoBackend,
    criarTecnico,
    criarEquipamento,
    atualizarTecnico as atualizarTecnicoAPI
} from './modules/apiClient.js';

import {
    mostrarToast,
    obterValor,
    limparFormulario
} from './utils.js';


// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Aplicação iniciada...');
    await verificarConexao();
    inicializarEventos();

    inicializarTecnicos();
    inicializarEquipamentos();
    inicializarOrdens();

    setCarregadores({
        carregarTecnicosPage: inicializarTecnicos,
        carregarEquipamentosPage: inicializarEquipamentos,
        carregarOrdensPage: inicializarOrdens,
        carregarTecnicos: carregarTecnicos,
        carregarOrdens: carregarOrdens
    });

    await Promise.all([
        carregarTecnicos(),
        carregarEquipamentos(),
        carregarOrdens()
    ]);

    console.log('✅ Inicialização completa');
});


// ==================== CONEXÃO BACKEND ====================
async function verificarConexao() {
    const badgeEl = document.getElementById('status-conexao');
    if (!badgeEl) return;

    try {
        const conectado = await verificarConexaoBackend();
        badgeEl.textContent = conectado ? '🟢 Conectado' : '🔴 Erro na conexão';
    } catch {
        badgeEl.textContent = '🔴 Desconectado';
    } finally {
        badgeEl.classList.remove('loading');
    }
}


// ==================== EVENTOS ====================
function inicializarEventos() {
    console.log('🔗 Inicializando event listeners...');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id === 'btn-historico') {
                window.location.href = 'pages/historico/historico.html';
                return;
            }
            ativarAba(btn.dataset.tab);
        });
    });

    document.querySelectorAll('.listagem-btn').forEach(btn => {
        btn.addEventListener('click', (e) =>
            ativarListagem(btn.dataset.listagem, e)
        );
    });

    document.querySelectorAll('.tipo-btn').forEach(btn => {
        btn.addEventListener('click', (e) =>
            ativarTipoOS(btn.dataset.tipo, e)
        );
    });

    // forms básicos
    document.getElementById('form-tecnico')?.addEventListener('submit', cadastrarTecnico);
    document.getElementById('form-equipamento')?.addEventListener('submit', cadastrarEquipamento);

    // OS
    document.getElementById('form-os-corretiva')?.addEventListener('submit', criarOSCorretiva);
    document.getElementById('form-os-preventiva')?.addEventListener('submit', criarOSPreventiva);

    // update
    const formAtualizarTecnico = document.getElementById('form-atualizar-tecnico');
    const formAtualizarOS = document.getElementById('form-atualizar-os');
    
    if (formAtualizarTecnico) {
        console.log('✅ Formulário "Atualizar Técnico" encontrado');
        formAtualizarTecnico.addEventListener('submit', atualizarTecnico);
    } else {
        console.warn('❌ Formulário "Atualizar Técnico" NÃO encontrado');
    }
    
    if (formAtualizarOS) {
        console.log('✅ Formulário "Atualizar OS" encontrado');
        formAtualizarOS.addEventListener('submit', atualizarOS);
    } else {
        console.warn('❌ Formulário "Atualizar OS" NÃO encontrado');
    }
    
    console.log('✅ Event listeners inicializados');
}


// ==================== CADASTROS ====================
async function cadastrarTecnico(e) {
    e.preventDefault();

    const dados = {
        nome: obterValor('tecnico-nome'),
        email: obterValor('tecnico-email'),
        telefone: obterValor('tecnico-telefone'),
        especialidade: obterValor('tecnico-especialidade'),
        setor: obterValor('tecnico-setor'),
        status: obterValor('tecnico-status')
    };

    try {
        await criarTecnico(dados);
        mostrarToast('✅ Técnico cadastrado!', 'success');
        limparFormulario('form-tecnico');
        await carregarTecnicos();
    } catch (error) {
        mostrarToast(`❌ ${error.message}`, 'error');
    }
}

async function cadastrarEquipamento(e) {
    e.preventDefault();

    const dados = {
        nome: obterValor('equip-nome'),
        codigo: obterValor('equip-codigo'),
        setor: obterValor('equip-setor'),
        status: obterValor('equip-status'),
        criticidade: obterValor('equip-criticidade')
    };

    try {
        await criarEquipamento(dados);
        mostrarToast('✅ Equipamento cadastrado!', 'success');
        limparFormulario('form-equipamento');
        await carregarEquipamentos();
    } catch (error) {
        mostrarToast(`❌ ${error.message}`, 'error');
    }
}


// ==================== OS CORRETIVA ====================
async function criarOSCorretiva(e) {
    e.preventDefault();

    const dados = {
        equipamentoId: parseInt(document.getElementById('corr-equipamento').value),
        tecnicoId: parseInt(document.getElementById('corr-tecnico').value),
        descricao: document.getElementById('corr-descricao').value,
        descricaoFalha: document.getElementById('corr-falha').value,
        setor: document.getElementById('corr-setor').value,
        nivelCriticidade: parseInt(document.getElementById('corr-criticidade').value),
        falhaTotal: document.getElementById('corr-falha-total')?.checked || false
    };

    try {
        const res = await fetch(`${API_BASE_URL}/ordens-servico/corretiva`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (res.ok) {
            mostrarToast('✅ OS Corretiva criada!', 'success');
            e.target.reset();
            await carregarOrdens();
        } else {
            mostrarToast(await res.text(), 'error');
        }
    } catch {
        mostrarToast('❌ Erro ao criar OS', 'error');
    }
}


// ==================== OS PREVENTIVA ====================
async function criarOSPreventiva(e) {
    e.preventDefault();

    const dados = {
        equipamentoId: parseInt(obterValor('prev-equipamento')),
        tecnicoId: parseInt(obterValor('prev-tecnico')),
        descricao: obterValor('prev-descricao'),
        setor: obterValor('prev-setor'),
        dataPrevista: obterValor('prev-data-prevista'),
        periodicidadeDias: parseInt(obterValor('prev-periodicidade')),
        ultimaManutencao: obterValor('prev-ultima-manutencao') || null
    };

    try {
        const res = await fetch(`${API_BASE_URL}/ordens-servico/preventiva`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (res.ok) {
            mostrarToast('✅ OS Preventiva criada!', 'success');
            limparFormulario('form-os-preventiva');
            await carregarOrdens();
        } else {
            mostrarToast(await res.text(), 'error');
        }
    } catch {
        mostrarToast('❌ Erro ao criar OS', 'error');
    }
}


// ==================== CARREGAMENTOS ====================
async function carregarTecnicos() {
    const tecnicos = await buscarTecnicos();
    atualizarSelectTecnicos(tecnicos);
}

async function carregarEquipamentos() {
    const equipamentos = await buscarEquipamentos();
    atualizarSelectEquipamentos(equipamentos);
}

async function carregarOrdens() {
    const ordens = await buscarOrdensAbertas();
    atualizarSelectOS(ordens);
}


// ==================== SELECTS ====================
function atualizarSelectTecnicos(tecnicos) {
    ['corr-tecnico', 'prev-tecnico', 'atualizar-tecnico-id', 'atualizar-os-tecnico']
        .forEach(id => {
            const select = document.getElementById(id);
            if (!select) return;

            select.innerHTML =
                '<option value="">Selecionar...</option>' +
                tecnicos.map(t =>
                    `<option value="${t.id}">${t.nome}</option>`
                ).join('');
        });
}

function atualizarSelectEquipamentos(equipamentos) {
    ['corr-equipamento', 'prev-equipamento']
        .forEach(id => {
            const select = document.getElementById(id);
            if (!select) return;

            select.innerHTML =
                '<option value="">Selecionar...</option>' +
                equipamentos.map(e =>
                    `<option value="${e.id}">${e.nome}</option>`
                ).join('');
        });
}

function atualizarSelectOS(ordens) {
    const select = document.getElementById('atualizar-os-id');
    if (!select) return;

    select.innerHTML =
        '<option value="">Selecionar...</option>' +
        ordens.map(o =>
            `<option value="${o.id}">OS #${o.id}</option>`
        ).join('');
}


// ==================== ATUALIZAÇÃO TECNICO ====================
async function atualizarTecnico(e) {
    e.preventDefault();
    console.log('📝 Atualizando técnico...');

    const idValue = obterValor('atualizar-tecnico-id');
    const id = parseInt(idValue);

    console.log('ID obtido:', { idValue, id });

    if (!id || id === 0 || isNaN(id)) {
        console.warn('❌ ID inválido:', id);
        mostrarToast('❌ Selecione um técnico primeiro', 'error');
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

    console.log('📦 Dados a enviar:', { id, dados });

    // Validar campos vazios
    for (let [chave, valor] of Object.entries(dados)) {
        if (!valor || valor.trim() === '') {
            console.warn(`❌ Campo vazio: ${chave}`);
            mostrarToast(`❌ Campo "${chave}" não pode estar vazio`, 'error');
            return;
        }
    }

    try {
        mostrarToast('⏳ Salvando técnico...', 'info');
        console.log('🔄 Chamando API...');
        
        await atualizarTecnicoAPI(id, dados);
        
        console.log('✅ Técnico atualizado com sucesso!');
        mostrarToast('✅ Técnico atualizado com sucesso!', 'success');
        
        // Desabilitar campos após sucesso
        cancelarEdicaoTecnico();
        
        // Recarregar dados
        console.log('🔄 Recarregando lista de técnicos...');
        await carregarTecnicos();
        
        console.log('✅ Fluxo completo concluído');
    } catch (error) {
        console.error('❌ Erro detalhado:', error);
        console.error('❌ Stack:', error.stack);
        mostrarToast(`❌ Erro ao atualizar técnico: ${error.message}`, 'error');
    }
}


// ==================== OS UPDATE ====================
async function atualizarOS(e) {
    e.preventDefault();

    const id = parseInt(document.getElementById('atualizar-os-id').value);

    if (!id) {
        mostrarToast('❌ Selecione uma OS primeiro', 'error');
        return;
    }

    const dados = {
        id: id,
        novoStatus: document.getElementById('atualizar-os-status').value,
        observacoes: document.getElementById('atualizar-os-descricao').value
    };

    try {
        const res = await fetch(`${API_BASE_URL}/ordens-servico/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (res.ok) {
            mostrarToast('✅ OS atualizada com sucesso!', 'success');
            
            // Desabilitar campos após sucesso
            cancelarEdicaoOS();
            
            // Recarregar dados
            await carregarOrdens();
        } else {
            const errorMsg = await res.text();
            mostrarToast(`❌ Erro: ${errorMsg || 'Falha ao atualizar OS'}`, 'error');
        }
    } catch (error) {
        console.error('Erro ao atualizar OS:', error);
        mostrarToast(`❌ Erro ao atualizar OS: ${error.message}`, 'error');
    }
}


// ==================== DELETE ====================
async function deletarTecnicoConfirmado(id) {
    await fetch(`${API_BASE_URL}/tecnico/${id}`, { method: 'DELETE' });
    mostrarToast('✅ Técnico removido!', 'success');
    carregarTecnicos();
}

async function deletarOSConfirmada(id) {
    await fetch(`${API_BASE_URL}/ordens-servico/${id}`, { method: 'DELETE' });
    mostrarToast('✅ OS cancelada!', 'success');
    carregarOrdens();
}


// ==================== MODO EDIÇÃO ====================
function ativarEdicaoTecnico() {
    console.log('✏️ Ativando modo edição de técnico...');
    const container = document.getElementById('tecnico-form-container');
    if (!container) {
        console.warn('⚠️ Container não encontrado');
        return;
    }

    const campos = ['nome', 'email', 'telefone', 'especialidade', 'setor', 'status'];
    
    campos.forEach(f => {
        const input = document.getElementById(`atualizar-tecnico-${f}`);
        if (input) {
            input.disabled = false;
            console.log(`  ✅ Campo habilitado: atualizar-tecnico-${f}`);
        } else {
            console.warn(`  ❌ Campo não encontrado: atualizar-tecnico-${f}`);
        }
    });

    const btnEditar = document.getElementById('btn-editar-tecnico');
    const btnSalvar = document.getElementById('btn-salvar-tecnico');
    const btnCancelar = document.getElementById('btn-cancelar-tecnico');
    
    if (btnEditar) btnEditar.style.display = 'none';
    if (btnSalvar) btnSalvar.style.display = 'inline-block';
    if (btnCancelar) btnCancelar.style.display = 'inline-block';
    
    console.log('✅ Modo edição ativado');
}

function cancelarEdicaoTecnico() {
    console.log('❌ Cancelando edição de técnico...');
    const campos = ['nome', 'email', 'telefone', 'especialidade', 'setor', 'status'];
    
    campos.forEach(f => {
        const input = document.getElementById(`atualizar-tecnico-${f}`);
        if (input) input.disabled = true;
    });

    const btnEditar = document.getElementById('btn-editar-tecnico');
    const btnSalvar = document.getElementById('btn-salvar-tecnico');
    const btnCancelar = document.getElementById('btn-cancelar-tecnico');
    
    if (btnEditar) btnEditar.style.display = 'inline-block';
    if (btnSalvar) btnSalvar.style.display = 'none';
    if (btnCancelar) btnCancelar.style.display = 'none';
    
    console.log('✅ Edição cancelada');
}

function ativarEdicaoOS() {
    const container = document.getElementById('os-form-container');
    if (!container) return;

    const campos = ['status', 'tecnico', 'descricao', 'setor', 'data-conclusao'];
    
    campos.forEach(f => {
        const input = document.getElementById(`atualizar-os-${f}`);
        if (input) input.disabled = false;
    });

    document.getElementById('btn-editar-os').style.display = 'none';
    document.getElementById('btn-salvar-os').style.display = 'inline-block';
    document.getElementById('btn-cancelar-os').style.display = 'inline-block';
}

function cancelarEdicaoOS() {
    const campos = ['status', 'tecnico', 'descricao', 'setor', 'data-conclusao'];
    
    campos.forEach(f => {
        const input = document.getElementById(`atualizar-os-${f}`);
        if (input) input.disabled = true;
    });

    document.getElementById('btn-editar-os').style.display = 'inline-block';
    document.getElementById('btn-salvar-os').style.display = 'none';
    document.getElementById('btn-cancelar-os').style.display = 'none';
}


// ==================== CARREGAR DADOS PARA EDIÇÃO ====================
async function carregarDadosTecnico(id) {
    if (!id) {
        console.warn('⚠️ Nenhum técnico selecionado');
        return;
    }
    
    console.log('📥 Carregando dados do técnico:', id);
    
    try {
        const tecnico = await buscarTecnico(id);
        console.log('📦 Dados recebidos:', tecnico);
        
        // Preencher campos
        document.getElementById('atualizar-tecnico-nome').value = tecnico.nome || '';
        document.getElementById('atualizar-tecnico-email').value = tecnico.email || '';
        document.getElementById('atualizar-tecnico-telefone').value = tecnico.telefone || '';
        document.getElementById('atualizar-tecnico-especialidade').value = tecnico.especialidade || '';
        document.getElementById('atualizar-tecnico-setor').value = tecnico.setor || '';
        document.getElementById('atualizar-tecnico-status').value = tecnico.status || '';
        
        console.log('✅ Campos preenchidos');
        
        // Mostrar formulário de edição
        const container = document.getElementById('tecnico-form-container');
        if (container) {
            container.style.display = 'block';
            console.log('✅ Formulário exibido');
        }
        
        // Garantir que campos comecem desabilitados
        cancelarEdicaoTecnico();
        
        mostrarToast('✅ Técnico carregado. Clique em "Editar" para modificar', 'info');
    } catch (error) {
        console.error('❌ Erro ao carregar técnico:', error);
        mostrarToast(`❌ Erro ao carregar dados do técnico: ${error.message}`, 'error');
    }
}

async function carregarDadosOS(id) {
    if (!id) return;
    try {
        const ordem = await buscarOrdem(id);
        
        // Preencher campos
        document.getElementById('atualizar-os-status').value = ordem.status || '';
        document.getElementById('atualizar-os-tecnico').value = ordem.tecnico?.id || '';
        document.getElementById('atualizar-os-descricao').value = ordem.descricao || '';
        document.getElementById('atualizar-os-setor').value = ordem.setor || '';
        
        const dataConclusao = document.getElementById('atualizar-os-data-conclusao');
        if (dataConclusao && ordem.dataConclusao) {
            dataConclusao.value = ordem.dataConclusao.split('T')[0];
        }
        
        // Mostrar formulário de edição
        const container = document.getElementById('os-form-container');
        if (container) container.style.display = 'block';
        
        // Garantir que campos comecem desabilitados
        cancelarEdicaoOS();
        
        mostrarToast('✅ OS carregada. Clique em "Editar" para modificar', 'info');
    } catch (error) {
        console.error('Erro ao carregar OS:', error);
        mostrarToast(`❌ Erro ao carregar dados da OS: ${error.message}`, 'error');
    }
}


window.recarregarTecnicos = carregarTecnicos;
window.recarregarEquipamentos = carregarEquipamentos;
window.recarregarOrdens = carregarOrdens;

// OS actions
window.carregarDadosOS = carregarDadosOS;
window.atualizarOS = atualizarOS;
window.ativarEdicaoOS = ativarEdicaoOS;
window.cancelarEdicaoOS = cancelarEdicaoOS;

window.deletarOSSelecionada = async function() {
    const id = document.getElementById('atualizar-os-id').value;
    if (!id) { mostrarToast('❌ Selecione uma OS primeiro', 'error'); return; }
    if (!confirm('Deseja realmente cancelar esta Ordem de Serviço?')) return;
    await deletarOSConfirmada(id);
};

// técnico actions
window.carregarDadosTecnico = carregarDadosTecnico;
window.atualizarTecnico = atualizarTecnico;
window.ativarEdicaoTecnico = ativarEdicaoTecnico;
window.cancelarEdicaoTecnico = cancelarEdicaoTecnico;

window.deletarTecnicoSelecionado = async function() {
    const id = document.getElementById('atualizar-tecnico-id').value;
    if (!id) { mostrarToast('❌ Selecione um técnico primeiro', 'error'); return; }
    if (!confirm('Deseja realmente deletar este técnico?')) return;
    await deletarTecnicoConfirmado(id);
};