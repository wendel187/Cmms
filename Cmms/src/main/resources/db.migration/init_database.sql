-- Script SQL para criar e inicializar banco de dados CMMS

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS cmms_db;
USE cmms_db;

-- Tabela de Equipamentos
CREATE TABLE IF NOT EXISTS equipamentos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    codigo VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('ATIVO', 'INATIVO', 'QUEBRADO', 'MANUTENCAO') NOT NULL DEFAULT 'ATIVO',
    criticidade ENUM('BAIXA', 'MEDIA', 'ALTA', 'CRITICA') NOT NULL DEFAULT 'MEDIA',
    setor VARCHAR(100) NOT NULL,
    data_aquisicao DATE,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_setor (setor),
    INDEX idx_criticidade (criticidade)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Técnicos
CREATE TABLE IF NOT EXISTS tecnicos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    especialidade VARCHAR(100) NOT NULL,
    setor VARCHAR(100) NOT NULL,
    status ENUM('DISPONIVEL', 'EM_MANUTENCAO', 'AUSENTE', 'INDISPONIVEL') NOT NULL DEFAULT 'DISPONIVEL',
    data_cadastro DATE,
    ativo BOOLEAN NOT NULL DEFAULT true,
    INDEX idx_status (status),
    INDEX idx_setor (setor),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Ordens de Serviço (com Single Table Inheritance)
CREATE TABLE IF NOT EXISTS ordens_servico (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tipo_os VARCHAR(50) NOT NULL,
    equipamento_id BIGINT NOT NULL,
    tecnico_id BIGINT NOT NULL,
    descricao TEXT,
    status ENUM('ABERTA', 'EM_ANDAMENTO', 'PAUSADA', 'CONCLUIDA', 'CANCELADA') NOT NULL DEFAULT 'ABERTA',
    data_abertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_conclusao TIMESTAMP NULL,
    setor VARCHAR(100) NOT NULL,
    -- Campos específicos para OS Corretiva
    descricao_falha VARCHAR(500),
    falha_total BOOLEAN,
    nivel_criticidade INT,
    -- Campos específicos para OS Preventiva
    data_prevista DATE,
    periodicidade_dias INT,
    ultima_manutencao DATE,
    FOREIGN KEY (tecnico_id) REFERENCES tecnicos(id),
    INDEX idx_status (status),
    INDEX idx_equipamento (equipamento_id),
    INDEX idx_tecnico (tecnico_id),
    INDEX idx_setor (setor),
    INDEX idx_tipo (tipo_os),
    INDEX idx_data_abertura (data_abertura),
    INDEX idx_data_prevista (data_prevista)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Histórico de Status
CREATE TABLE IF NOT EXISTS historico_status (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ordem_servico_id BIGINT NOT NULL,
    status ENUM('ABERTA', 'EM_ANDAMENTO', 'PAUSADA', 'CONCLUIDA', 'CANCELADA') NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacoes TEXT,
    FOREIGN KEY (ordem_servico_id) REFERENCES ordens_servico(id) ON DELETE CASCADE,
    INDEX idx_ordem_servico (ordem_servico_id),
    INDEX idx_status (status),
    INDEX idx_data_hora (data_hora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir técnicos de exemplo
INSERT INTO tecnicos (nome, email, telefone, especialidade, setor, status, data_cadastro, ativo) VALUES
('João Silva', 'joao.silva@cmms.com', '11987654321', 'Eletricista', 'Produção', 'DISPONIVEL', '2024-01-15', true),
('Maria Santos', 'maria.santos@cmms.com', '11987654322', 'Mecânica', 'Produção', 'DISPONIVEL', '2024-01-20', true),
('Pedro Costa', 'pedro.costa@cmms.com', '11987654323', 'Eletrônica', 'Energia', 'DISPONIVEL', '2024-02-10', true),
('Ana Paula', 'ana.paula@cmms.com', '11987654324', 'Eletricista', 'Manutenção', 'EM_MANUTENCAO', '2024-02-15', true),
('Carlos Oliveira', 'carlos@cmms.com', '11987654325', 'Mecânica', 'Produção', 'INDISPONIVEL', '2024-03-01', false);

-- Inserir equipamentos de exemplo
INSERT INTO equipamentos (nome, codigo, status, criticidade, setor, data_aquisicao) VALUES
('Compressor Industrial', 'COMP-001', 'ATIVO', 'CRITICA', 'Produção', '2022-01-15'),
('Bomba Centrífuga', 'BOMB-002', 'ATIVO', 'ALTA', 'Produção', '2021-06-20'),
('Transformador Elétrico', 'TRAF-003', 'ATIVO', 'CRITICA', 'Energia', '2020-03-10'),
('Motosserra', 'MOTO-004', 'ATIVO', 'MEDIA', 'Manutenção', '2023-05-12'),
('Gerador', 'GERA-005', 'ATIVO', 'ALTA', 'Backup', '2022-09-08');

-- Ordens de Serviço Corretiva (exemplo)
INSERT INTO ordens_servico (tipo_os, equipamento_id, tecnico_id, descricao, status, data_abertura, setor, descricao_falha, falha_total, nivel_criticidade) VALUES
('CORRETIVA', 1, 1, 'Vazamento no compressor', 'ABERTA', NOW(), 'Produção', 'Vazamento de óleo', true, 4),
('CORRETIVA', 2, 2, 'Barulho anormal na bomba', 'EM_ANDAMENTO', NOW(), 'Produção', 'Barulho de rolamento', false, 3);

-- Ordens de Serviço Preventiva (exemplo)
INSERT INTO ordens_servico (tipo_os, equipamento_id, tecnico_id, descricao, status, data_abertura, setor, data_prevista, periodicidade_dias, ultima_manutencao) VALUES
('PREVENTIVA', 3, 3, 'Manutenção preventiva do transformador', 'ABERTA', NOW(), 'Energia', DATE_ADD(NOW(), INTERVAL 7 DAY), 90, DATE_SUB(NOW(), INTERVAL 83 DAY)),
('PREVENTIVA', 4, 4, 'Limpeza e inspeção da motosserra', 'CONCLUIDA', NOW(), 'Manutenção', DATE_ADD(NOW(), INTERVAL 30 DAY), 30, NOW());

-- Históricos de exemplo
INSERT INTO historico_status (ordem_servico_id, status, data_hora, observacoes) VALUES
(1, 'ABERTA', NOW(), 'Ordem criada por João Silva'),
(2, 'ABERTA', NOW(), 'Ordem criada por Maria Santos'),
(2, 'EM_ANDAMENTO', NOW(), 'Técnico iniciou o trabalho');



