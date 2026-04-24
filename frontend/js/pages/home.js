// ==================== PÁGINA: HOME ====================

/**
 * Inicializar página HOME
 */
export function inicializarHome() {
    // Adicionar listeners de formulários
    const formTecnico = document.getElementById('form-tecnico');
    const formEquipamento = document.getElementById('form-equipamento');

    if (formTecnico) {
        formTecnico.addEventListener('submit', handleCadastrarTecnico);
    }

    if (formEquipamento) {
        formEquipamento.addEventListener('submit', handleCadastrarEquipamento);
    }
}

/**
 * Handle: Cadastrar Técnico
 */
async function handleCadastrarTecnico(e) {
    e.preventDefault();

    const { criarTecnico } = await import('../api.js');
    const { mostrarFeedback, mostrarToast } = await import('../utils.js');

    const dados = {
        nome: document.getElementById('tecnico-nome').value,
        email: document.getElementById('tecnico-email').value,
        telefone: document.getElementById('tecnico-telefone').value,
        especialidade: document.getElementById('tecnico-especialidade').value,
        setor: document.getElementById('tecnico-setor').value,
        status: document.getElementById('tecnico-status').value
    };

    try {
        await criarTecnico(dados);
        mostrarFeedback(
            document.getElementById('tecnico-feedback'),
            `✅ Técnico ${dados.nome} cadastrado com sucesso!`,
            'success'
        );
        mostrarToast('✅ Técnico cadastrado!', 'success');
        e.target.reset();

        // Recarregar dados globais
        window.recarregarDadosGlobais?.();
    } catch (error) {
        mostrarFeedback(
            document.getElementById('tecnico-feedback'),
            `❌ Erro: ${error.message}`,
            'error'
        );
    }
}

/**
 * Handle: Cadastrar Equipamento
 */
async function handleCadastrarEquipamento(e) {
    e.preventDefault();

    const { criarEquipamento } = await import('../api.js');
    const { mostrarFeedback, mostrarToast } = await import('../utils.js');

    const dados = {
        nome: document.getElementById('equip-nome').value,
        codigo: document.getElementById('equip-codigo').value,
        status: document.getElementById('equip-status').value,
        criticidade: document.getElementById('equip-criticidade').value,
        setor: document.getElementById('equip-setor').value
    };

    try {
        await criarEquipamento(dados);
        mostrarFeedback(
            document.getElementById('equipamento-feedback'),
            `✅ Equipamento ${dados.nome} cadastrado com sucesso!`,
            'success'
        );
        mostrarToast('✅ Equipamento cadastrado!', 'success');
        e.target.reset();

        // Recarregar dados globais
        window.recarregarDadosGlobais?.();
    } catch (error) {
        mostrarFeedback(
            document.getElementById('equipamento-feedback'),
            `❌ Erro: ${error.message}`,
            'error'
        );
    }
}
