// ==================== CONFIGURAÇÃO GLOBAL ====================

// API Configuration
export const API_BASE_URL = 'http://localhost:8080';

// Endpoints da API
export const API_ENDPOINTS = {
    // Técnicos
    tecnicos: '/tecnico',
    tecnico: (id) => `/tecnico/${id}`,
    
    // Equipamentos
    equipamentos: '/equipamento',
    equipamento: (id) => `/equipamento/${id}`,
    
    // Ordens de Serviço
    ordensAbertas: '/ordens-servico/abertas',
    ordem: (id) => `/ordens-servico/${id}`,
    ordemCorretiva: '/ordens-servico/corretiva',
    ordemPreventiva: '/ordens-servico/preventiva',
    
    // Health check
    health: '/actuator/health'
};

// Status Badges
export const STATUS_BADGES = {
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

// Criticidade Badges
export const CRITICIDADE_BADGES = {
    'ALTA': '🔴 Alta',
    'MEDIA': '🟡 Média',
    'BAIXA': '🟢 Baixa'
};

// Pages Configuration
export const PAGES = {
    HOME: 'home',
    TECNICOS: 'tecnicos',
    EQUIPAMENTOS: 'equipamentos',
    REQUISICOES: 'requisicoes',
    ORDENS: 'ordens',
    ATUALIZAR_TECNICO: 'atualizar-tecnico',
    ATUALIZAR_OS: 'atualizar-os'
};

// Paginação padrão
export const PAGINATION = {
    PAGE: 0,
    SIZE: 100
};
