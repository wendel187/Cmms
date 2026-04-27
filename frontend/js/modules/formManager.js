// ==================== GERENCIADOR DE FORMULÁRIOS ====================
// Responsabilidade: Extrair, validar e manipular dados de formulários

/**
 * Config para cada formulário: IDs dos inputs
 */
const FORM_FIELDS = {
    tecnico: [
        'tecnico-nome', 'tecnico-email', 'tecnico-telefone',
        'tecnico-especialidade', 'tecnico-setor', 'tecnico-status'
    ],
    equipamento: [
        'equip-nome', 'equip-codigo', 'equip-status',
        'equip-criticidade', 'equip-setor'
    ],
    osCorretiva: [
        'corr-equipamento', 'corr-tecnico', 'corr-descricao',
        'corr-falha', 'corr-setor', 'corr-criticidade', 'corr-falha-total'
    ],
    osPreventiva: [
        'prev-equipamento', 'prev-tecnico', 'prev-descricao',
        'prev-setor', 'prev-data-prevista', 'prev-periodicidade',
        'prev-ultima-manutencao'
    ]
};

/**
 * Extrair dados de um formulário específico
 * @param {string} formType - Tipo do formulário (tecnico, equipamento, etc)
 * @returns {Object} Dados extraídos
 */
export function extrairDadosFormulario(formType) {
    const fields = FORM_FIELDS[formType];
    if (!fields) return {};

    const dados = {};
    
    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            if (element.type === 'checkbox') {
                dados[converterIdParaNome(fieldId)] = element.checked === true;
            } else {
                const valor = element.value;
                dados[converterIdParaNome(fieldId)] = valor;
            }
        }
    });

    return dados;
}

/**
 * Converter ID HTML para nome de property (camelCase)
 * @param {string} id - ID do elemento
 * @returns {string} Nome da property
 */
function converterIdParaNome(id) {
    return id
        .split('-')
        .map((part, index) => {
            if (index === 0) return part;
            return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join('');
}

/**
 * Preencher formulário com dados
 * @param {string} formId - ID do formulário
 * @param {Object} dados - Dados a preencher
 */
export function preencherFormulario(formId, dados) {
    const form = document.getElementById(formId);
    if (!form) return;

    Object.entries(dados).forEach(([key, value]) => {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.name === key || input.id === key) {
                if (input.type === 'checkbox') {
                    input.checked = value === true;
                } else {
                    input.value = value || '';
                }
            }
        });
    });
}

/**
 * Limpar formulário
 * @param {string} formId - ID do formulário
 */
export function limparFormulario(formId) {
    const form = document.getElementById(formId);
    if (form && form.reset) {
        form.reset();
    }
}

/**
 * Desabilitar/Habilitar inputs de um formulário
 * @param {string} formId - ID do formulário
 * @param {boolean} desabilitado - Estado desejado
 */
export function definirEstadoFormulario(formId, desabilitado) {
    const form = document.getElementById(formId);
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => {
        if (input.type !== 'hidden') {
            input.disabled = desabilitado;
        }
    });
}

/**
 * Validar formulário básico
 * @param {Object} dados - Dados a validar
 * @param {Array} camposObrigatorios - Campos que não podem ser vazios
 * @returns {Object} { valido: boolean, erros: string[] }
 */
export function validarDados(dados, camposObrigatorios = []) {
    const erros = [];

    camposObrigatorios.forEach(campo => {
        if (!dados[campo] || dados[campo].toString().trim() === '') {
            erros.push(`Campo ${campo} é obrigatório`);
        }
    });

    return {
        valido: erros.length === 0,
        erros
    };
}

/**
 * Obter valor de um input específico
 * @param {string} elementId - ID do elemento
 * @returns {string|number|boolean} Valor do elemento
 */
export function obterValor(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return null;

    if (element.type === 'checkbox') {
        return element.checked;
    }

    if (element.type === 'number') {
        return parseInt(element.value);
    }

    return element.value;
}

/**
 * Definir valor de um input específico
 * @param {string} elementId - ID do elemento
 * @param {*} valor - Valor a definir
 */
export function definirValor(elementId, valor) {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (element.type === 'checkbox') {
        element.checked = valor === true;
    } else {
        element.value = valor || '';
    }
}

