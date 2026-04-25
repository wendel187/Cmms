// ==================== HOME PAGE ==================== 

import { criarTecnico, criarEquipamento } from '../../js/api.js';
import { mostrarToast } from '../../js/utils.js';

/**
 * Inicializar página HOME
 */
export function inicializarHome() {
    // Formulário de Técnico
    const formTecnico = document.getElementById('form-tecnico');
    if (formTecnico) {
        formTecnico.addEventListener('submit', cadastrarTecnico);
    }

    // Formulário de Equipamento
    const formEquipamento = document.getElementById('form-equipamento');
    if (formEquipamento) {
        formEquipamento.addEventListener('submit', cadastrarEquipamento);
    }
}

/**
 * Cadastrar novo técnico
 */
async function cadastrarTecnico(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const dados = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        telefone: formData.get('telefone'),
        especialidade: formData.get('especialidade'),
        setor: formData.get('setor'),
        status: formData.get('status')
    };

    try {
        await criarTecnico(dados);
        mostrarToast('✅ Técnico cadastrado com sucesso!', 'success');
        e.target.reset();
        
        // Limpar feedback
        const feedback = document.getElementById('tecnico-feedback');
        if (feedback) {
            feedback.classList.remove('show');
        }
    } catch (error) {
        mostrarToast('❌ Erro ao cadastrar técnico', 'error');
        console.error(error);
        
        // Mostrar feedback de erro
        const feedback = document.getElementById('tecnico-feedback');
        if (feedback) {
            feedback.textContent = 'Erro: ' + error.message;
            feedback.classList.add('show', 'error');
        }
    }
}

/**
 * Cadastrar novo equipamento
 */
async function cadastrarEquipamento(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const dados = {
        nome: formData.get('nome'),
        codigo: formData.get('codigo'),
        setor: formData.get('setor'),
        status: formData.get('status'),
        criticidade: formData.get('criticidade'),
        ultimaManutencao: formData.get('ultimaManutencao')
    };

    try {
        await criarEquipamento(dados);
        mostrarToast('✅ Equipamento cadastrado com sucesso!', 'success');
        e.target.reset();
        
        // Limpar feedback
        const feedback = document.getElementById('equipamento-feedback');
        if (feedback) {
            feedback.classList.remove('show');
        }
    } catch (error) {
        mostrarToast('❌ Erro ao cadastrar equipamento', 'error');
        console.error(error);
        
        // Mostrar feedback de erro
        const feedback = document.getElementById('equipamento-feedback');
        if (feedback) {
            feedback.textContent = 'Erro: ' + error.message;
            feedback.classList.add('show', 'error');
        }
    }
}

