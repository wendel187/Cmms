import { criarTecnico, criarEquipamento } from '../../js/api.js';
import { mostrarToast, obterValor, limparFormulario } from '../../js/utils.js';

export function inicializarHome({ onTecnicoCriado, onEquipamentoCriado } = {}) {
    document.getElementById('form-tecnico')?.addEventListener('submit', async (e) => {
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
            onTecnicoCriado?.();
        } catch (error) {
            mostrarToast(`❌ ${error.message}`, 'error');
        }
    });

    document.getElementById('form-equipamento')?.addEventListener('submit', async (e) => {
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
            onEquipamentoCriado?.();
        } catch (error) {
            mostrarToast(`❌ ${error.message}`, 'error');
        }
    });
}
