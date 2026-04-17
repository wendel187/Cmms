# CMMS Frontend - HTML/CSS/JavaScript Puro

Frontend minimalista e profissional para o Sistema de Gerenciamento de Manutenção (CMMS).

## ✨ Características

- **HTML/CSS/JavaScript Puro** - Sem frameworks, sem dependências complexas
- **Responsivo** - Funciona em desktop, tablet e celular
- **Integração com Backend** - Conecta à API REST em `http://localhost:8080`
- **Apenas Leitura** - Consulta equipamentos sem alterar dados
- **Paginação** - Suporte automático a paginação da API
- **Busca Local** - Filtro instantâneo de equipamentos
- **Design Moderno** - UI clean com gradientes e animações suaves

## 📁 Estrutura

```
frontend/
├── index.html          # Página principal (HTML)
├── css/
│   └── style.css      # Estilos (CSS moderno com variáveis)
├── js/
│   └── app.js         # Lógica da aplicação (JavaScript fetch)
├── server.py          # Servidor HTTP simples (Python)
└── package.json       # Metadados do projeto
```



## 🚀 Como Rodar

### Opção 1: Script Automático (Recomendado)
```bash
# Na raiz do projeto Cmms
start.cmd
```

Isso inicia automaticamente:
- Backend em `http://localhost:8080`
- Frontend em `http://localhost:3000`

### Opção 2: Manualmente

**Backend (Java Spring Boot):**
```bash
cd Cmms
mvnw spring-boot:run
```

**Frontend (Python HTTP Server):**
```bash
cd frontend
python server.py
```

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
