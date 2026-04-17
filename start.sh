#!/bin/bash

# Script para iniciar tanto Backend quanto Frontend do CMMS

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║        CMMS - Sistema de Gerenciamento de Equipamentos        ║"
echo "║            Iniciando Backend e Frontend                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para iniciar backend
start_backend() {
    echo -e "${BLUE}[1/2]${NC} ${YELLOW}Iniciando Backend (Spring Boot)...${NC}"
    echo "Navegando para: Cmms/"
    cd Cmms
    
    if [ -f "mvnw" ]; then
        echo -e "${GREEN}✓${NC} Maven Wrapper encontrado"
        ./mvnw spring-boot:run &
        BACKEND_PID=$!
    else
        echo -e "${YELLOW}⚠${NC} Maven Wrapper não encontrado. Tentando com mvn..."
        mvn spring-boot:run &
        BACKEND_PID=$!
    fi
    
    echo -e "${GREEN}Backend iniciado (PID: $BACKEND_PID)${NC}"
    echo "Aguardando backend inicializar..."
    sleep 10
    cd ..
}

# Função para iniciar frontend
start_frontend() {
    echo ""
    echo -e "${BLUE}[2/2]${NC} ${YELLOW}Iniciando Frontend (React)...${NC}"
    echo "Navegando para: frontend/"
    cd frontend
    
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}⚠${NC} Dependências não instaladas. Instalando..."
        npm install
    fi
    
    echo -e "${GREEN}Iniciando servidor Vite...${NC}"
    npm run dev &
    FRONTEND_PID=$!
    
    echo -e "${GREEN}Frontend iniciado (PID: $FRONTEND_PID)${NC}"
    cd ..
}

# Inicial backend
start_backend

# Iniciar frontend
start_frontend

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo -e "║  ${GREEN}✓${NC}  ${GREEN}PRONTO!${NC}                                               ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo -e "│  Backend:  ${BLUE}http://localhost:8080${NC}                  │"
echo -e "│  Frontend: ${BLUE}http://localhost:3000${NC}                   │"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "│  Backend PID:  $BACKEND_PID                                       │"
echo "│  Frontend PID: $FRONTEND_PID                                      │"
echo "│                                                                │"
echo "│  Para parar ambos os servidores, pressione Ctrl+C             │"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Aguardar para manter os processos rodando
wait
