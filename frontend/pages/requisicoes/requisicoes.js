import {
    criarOSCorretiva,
    criarOSPreventiva,
} from '../../js/api.js';
import { mostrarToast, obterValor, limparFormulario } from '../../js/utils.js';
import { ativarTipoOS } from '../../js/modules/navigationManager.js';

export function inicializarRequisicoes({ onOSCriada } = {}) {
    document.querySelectorAll('.tipo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => ativarTipoOS(btn.dataset.tipo, e));
    });

    document.getElementById('form-os-corretiva')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dados = {
            equipamentoId: parseInt(obterValor('corr-equipamento')),
            tecnicoId: parseInt(obterValor('corr-tecnico')),
            descricao: obterValor('corr-descricao'),
            descricaoFalha: obterValor('corr-falha'),
            setor: obterValor('corr-setor'),
            nivelCriticidade: parseInt(obterValor('corr-criticidade')),
            falhaTotal: document.getElementById('corr-falha-total')?.checked || false
        };
        try {
            await criarOSCorretiva(dados);
            mostrarToast('✅ OS Corretiva criada!', 'success');
            e.target.reset();
            onOSCriada?.();
        } catch (error) {
            mostrarToast(`❌ ${error.message}`, 'error');
        }
    });

    document.getElementById('form-os-preventiva')?.addEventListener('submit', async (e) => {
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
            await criarOSPreventiva(dados);
            mostrarToast('✅ OS Preventiva criada!', 'success');
            limparFormulario('form-os-preventiva');
            onOSCriada?.();
        } catch (error) {
            mostrarToast(`❌ ${error.message}`, 'error');
        }
    });
}
