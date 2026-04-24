# 🎨 CMMS Frontend v2.0 - Sistema de Gerenciamento de Manutenção

![Version](https://img.shields.io/badge/version-2.0-blue)
![Status](https://img.shields.io/badge/status-Production-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

Frontend moderno e responsivo para o Sistema Computadorizado de Gerenciamento de Manutenção (CMMS).

## ✨ O que há de novo na v2.0?

### 🎯 Principais Mudanças
- ✅ **Separação de Técnicos e Equipamentos** - Páginas dedicadas para cada tipo
- ✅ **Modal de Detalhes de OS** - Visualizar ordens de serviço em detalhe
- ✅ **Navegação Melhorada** - 5 abas bem organizadas
- ✅ **Layouts Responsivos** - Cards maiores e mais informativos
- ✅ **Animações Suaves** - Transições profissionais
- ✅ **Documentação Completa** - 5 arquivos de guias e referência

## 📋 Características

### Core Features
- **HTML/CSS/JavaScript Puro** - Sem frameworks, sem dependências complexas
- **Totalmente Responsivo** - Desktop, tablet, mobile
- **API Integration** - REST backend em `http://localhost:8080`
- **Paginação Automática** - Suporte a grandes listas
- **Tratamento de Erros** - Mensagens amigáveis
- **Status em Tempo Real** - Conexão com backend exibida

### Funcionalidades
- 📝 Cadastro de Técnicos
- 📝 Cadastro de Equipamentos
- 📋 Criação de Ordens de Serviço (Corretiva e Preventiva)
- 👨‍🔧 Listagem de Técnicos com detalhes
- 🔧 Listagem de Equipamentos com detalhes
- 📊 Listagem de Ordens de Serviço com modal interativo

## 📁 Estrutura

```
frontend/
├── index.html              # Página principal
├── js/
│   └── app.js             # Aplicação (JavaScript)
├── css/
│   └── style.css          # Estilos (CSS3)
├── README.md              # Este arquivo
├── ATUALIZACOES.md        # Changelog detalhado
├── GUIA_RAPIDO.md         # Como usar o sistema
├── EXEMPLOS_API.md        # Exemplos de requisições
├── CHECKLIST.md           # Features implementadas
└── DEPLOYMENT.md          # Guia de deploy
```

## 🚀 Como Começar

### Pré-requisitos
- Node.js 14+ (opcional)
- Navegador moderno
- Backend rodando em `http://localhost:8080`

### Instalação Rápida

**Opção 1: Com npm (Recomendado)**
```bash
cd frontend
npm install
npm start
```

**Opção 2: Com Python**
```bash
cd frontend
python -m http.server 3000
# Acesse: http://localhost:3000
```

**Opção 3: Com http-server**
```bash
cd frontend
npx http-server -p 3000 -o
```

**Opção 4: Script automático**
```bash
# Na raiz do projeto
./start.cmd  (Windows)
./start.sh   (Linux/Mac)
```

## 📱 Navegação

O frontend é dividido em 5 abas principais:

### 🏠 Inicial
- Cadastrar novo Técnico
- Cadastrar novo Equipamento

### 👨‍🔧 Técnicos
- Lista completa de técnicos
- Detalhes: Nome, Email, Telefone, Especialidade, Setor, Status
- Recarregar lista

### 🔧 Equipamentos
- Lista completa de equipamentos
- Detalhes: Nome, Código, Setor, Criticidade, Status
- Recarregar lista

### 📋 Requisições OS
- **OS Corretiva**: Solicitação de conserto urgente
- **OS Preventiva**: Manutenção programada

### 📊 Ordens de Serviço
- Lista de todas as OS abertas
- **Clique em qualquer OS** para ver detalhes em um modal interativo

## 🎯 Exemplos de Uso

### Cadastrar um Técnico
1. Clique na aba **🏠 Inicial**
2. Preencha: Nome, Email, Telefone, Especialidade, Setor, Status
3. Clique em **➕ Cadastrar Técnico**

### Visualizar Técnicos
1. Clique na aba **👨‍🔧 Técnicos**
2. Veja todos os técnicos em cards informativos
3. Clique em **🔄 Recarregar** para atualizar

### Abrir Ordem de Serviço
1. Clique na aba **📊 Ordens de Serviço**
2. **Clique em qualquer OS** para abrir o modal
3. Feche com **X**, **Fechar** ou clique fora

### Criar Nova OS
1. Clique na aba **📋 Requisições OS**
2. Escolha **🔴 Corretiva** ou **🟡 Preventiva**
3. Preencha o formulário
4. Clique em **📤 Abrir OS**

## 🔌 API Endpoints

Todos os endpoints usados:

| Método | Endpoint | Status |
|--------|----------|--------|
| GET | `/tecnico?page=0&size=100` | ✅ |
| POST | `/tecnico` | ✅ |
| GET | `/equipamento?page=0&size=100` | ✅ |
| POST | `/equipamento` | ✅ |
| GET | `/ordens-servico/abertas` | ✅ |
| GET | `/ordens-servico/{id}` | ✅ |
| POST | `/ordens-servico/corretiva` | ✅ |
| POST | `/ordens-servico/preventiva` | ✅ |

## 🎨 Customização

### Mudar Cor Primária
Edite `css/style.css`:
```css
:root {
    --primary: #3498db;      /* Sua cor aqui */
    --primary-dark: #2980b9;
    /* ... outras cores ... */
}
```

### Mudar URL da API
Edite `js/app.js`:
```javascript
const API_BASE_URL = 'http://seu-servidor:8080';
```

## 📊 Compatibilidade

| Navegador | Versão | Status |
|-----------|--------|--------|
| Chrome | 90+ | ✅ |
| Firefox | 88+ | ✅ |
| Safari | 14+ | ✅ |
| Edge | 90+ | ✅ |
| Opera | 76+ | ✅ |

## 📱 Responsividade

- ✅ Desktop (1920x1080+)
- ✅ Tablet (768x1024)
- ✅ Mobile (320x480+)

## 🔒 Segurança

- ✅ CORS configurado
- ✅ Validação frontend
- ✅ Sem dados sensíveis hardcoded
- ✅ Mensagens de erro amigáveis
- ✅ Proteção CSRF (esperado no backend)

## 📚 Documentação

Arquivos de referência inclusos:

- **[ATUALIZACOES.md](./ATUALIZACOES.md)** - O que foi alterado na v2.0
- **[GUIA_RAPIDO.md](./GUIA_RAPIDO.md)** - Como usar o sistema passo a passo
- **[EXEMPLOS_API.md](./EXEMPLOS_API.md)** - Exemplos de requisições para teste
- **[CHECKLIST.md](./CHECKLIST.md)** - Lista completa de features implementadas
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Como fazer deploy em produção

## 🐛 Troubleshooting

### "🔴 Desconectado"
```
1. Verifique se o backend está rodando em http://localhost:8080
2. Verifique CORS no backend (CorsConfig.java)
3. Verifique a porta do backend
```

### Lista vazia
```
1. Certifique-se de ter cadastrado dados no backend
2. Clique em "🔄 Recarregar"
3. Verifique o console do navegador (F12)
```

### Modal não abre
```
1. Verifique se a OS existe
2. Abra o console (F12) e procure por erros
3. Certifique-se que o endpoint GET /ordens-servico/{id} está implementado
```

## 🎓 Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Grid, Flexbox, Animações
- **JavaScript ES6+** - Fetch API, Async/Await
- **REST API** - Integração com backend

## 📈 Performance

- ⚡ Carregamento rápido (sem dependências pesadas)
- 🎯 Bundle pequeno (~50KB gzipped)
- 📱 Responsivo em todos os dispositivos
- 🔄 Requisições otimizadas

## 🚀 Deploy

Veja [DEPLOYMENT.md](./DEPLOYMENT.md) para instruções detalhadas sobre:
- Deploy em Apache/Nginx
- Deploy com Docker
- Deploy em AWS/Vercel/Netlify
- Configuração de HTTPS
- Otimizações de produção

## 💬 Feedback

Encontrou um bug? Tem uma sugestão?

1. Verifique [CHECKLIST.md](./CHECKLIST.md) para status das features
2. Consulte [GUIA_RAPIDO.md](./GUIA_RAPIDO.md) para dúvidas de uso
3. Abra o console do navegador (F12) para ver erros detalhados

## 📜 Licença

MIT License - Veja LICENSE file para detalhes

## 👥 Contribuidores

Desenvolvido como parte do projeto CMMS.

## 📞 Contato

- **Status**: ✅ Pronto para Produção
- **Versão**: 2.0
- **Data**: Abril 2026
- **Mantido por**: Equipe de Desenvolvimento CMMS

---

### Quick Links
- 🏗️ [Como usar](./GUIA_RAPIDO.md)
- 🔧 [API Examples](./EXEMPLOS_API.md)
- ✅ [Features](./CHECKLIST.md)
- 🚀 [Deploy](./DEPLOYMENT.md)
- 📝 [Changelog](./ATUALIZACOES.md)

**Desenvolvido com ❤️ para melhorar a manutenção**

Abra o navegador em: **http://localhost:3000**

## 🔗 Integração

O frontend consome a API do backend:

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/equipamento` | GET | Listar equipamentos com paginação |
| `/equipamento/{id}` | GET | Obter detalhes de um equipamento |

**Configuração:** Edite `js/app.js` se precisar alterar a URL do backend:
```javascript
const API_URL = 'http://localhost:8080';
```

## 📋 Funcionalidades

### Listagem de Equipamentos
- Tabela com ID, Nome, Código e Status
- Paginação automática (10 itens por página)
- Carregamento de dados com spinner
- Tratamento de erros

### Busca e Filtro
- Campo de busca em tempo real
- Filtra por: Nome, Código ou ID
- Mostra resultados instantaneamente

### Visualizar Detalhe
- Clique em "Detalhe" para ver informações completas
- ID, Nome, Código, Status e Data de Criação
- Botão para voltar à listagem

## 🎨 Personalização

### Cores
Edite `css/style.css` - seção `:root`:
```css
:root {
    --primary-color: #3b82f6;
    --secondary-color: #8b5cf6;
    /* ... mais cores */
}
```

### Estilos
Todos os componentes (tabela, botões, cards) estão em `css/style.css` com comentários claros separados por seção.

## 🔧 Requisitos

- **Backend**: Java 11+ com Spring Boot rodando em `http://localhost:8080`
- **Python**: 3.7+ (para servidor HTTP)
- **Navegador**: Chrome, Firefox, Safari ou Edge (últimas versões)
- **CORS**: Habilitado no backend

## ⚠️ Notas Importantes

1. **URL do Backend**: O frontend está configurado para conectar em `http://localhost:8080`. Se seu backend roda em outra porta, atualize `API_URL` em `js/app.js`

2. **CORS**: Certifique-se de que o backend tem CORS habilitado para `http://localhost:3000`

3. **Apenas Leitura**: Este frontend só faz requisições GET. Não altera ou deleta dados (conforme solicitado)

## 📚 Arquivos Principais

### `index.html`
- Estrutura do DOM
- Seções para: Listagem e Detalhe
- Loader e mensagens de erro

### `css/style.css`
- Design responsivo com CSS Grid/Flexbox
- Variáveis CSS para temas
- Animações suaves
- Media queries para mobile

### `js/app.js`
- Fetch API para comunicação com backend
- Funções de: listagem, paginação, busca, detalhe
- Tratamento de erros e loading

### `server.py`
- Servidor HTTP simples com suporte a CORS
- Redireciona URLs desconhecidas para `index.html`

## 🐛 Troubleshooting

**Erro: "Failed to connect to backend"**
- Verifique se o Backend está rodando em `http://localhost:8080`
- Confirme que CORS está habilitado

**Tabela vazia ou erro de paginação**
- Abra DevTools (F12) → Console
- Verifique as requisições na aba Network
- Veja se há mensagens de CORS bloqueado

**Servidor Python não funciona**
- Certifique-se de que Python 3.7+ está instalado
- Rode `python --version` para confirmar

## 📝 Licença

Parte do projeto CMMS - 2026

---

**Desenvolvido com ❤️ para demonstrar integração simples HTML/CSS/JS com API REST Java**
