# 🚀 COMECE AQUI - Frontend HTML/CSS/JavaScript

## ✅ O QUE FOI FEITO

Seu frontend foi **completamente reformulado** e agora é:

✨ **HTML/CSS/JavaScript Puro** (sem React)
✨ **Integrado com seu backend Java**
✨ **Apenas leitura** de equipamentos (conforme solicitado)
✨ **Responsivo** e com design moderno
✨ **Sem dependências complexas**

---

## 🎯 ESTRUTURA CRIADA

```
frontend/
├── index.html           👈 Página principal
├── css/
│   └── style.css       👈 Estilos responsivos
├── js/
│   └── app.js          👈 JavaScript para conectar com backend
├── server.py           👈 Servidor HTTP (Python)
└── package.json        👈 Metadados
```

---

## 📖 COMO RODAR (3 FORMAS)

### **FORMA 1: Automática (RECOMENDADA) ⭐**

Na raiz do projeto, execute:

```bash
start.cmd
```

Isso abre **2 janelas automaticamente**:
1. Backend (Java Spring Boot) - porta 8080
2. Frontend (Python) - porta 3000

✅ Aguarde 15 segundos
✅ Abra: **http://localhost:3000**

---

### **FORMA 2: Manual - Backend + Frontend Separados**

**Terminal 1 - Backend:**
```bash
cd Cmms
mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
python server.py
```

Depois acesse: **http://localhost:3000**

---

### **FORMA 3: Apenas Frontend (se backend já está rodando)**

```bash
cd frontend
python server.py
```

Abra: **http://localhost:3000**

---

## 🌐 O QUE VOCÊ VÊ NO FRONTEND

### Página 1: Listagem de Equipamentos
- ✅ Tabela com: ID, Nome, Código, Status
- ✅ Paginação (10 itens por página)
- ✅ Botão "Detalhe" para cada equipamento
- ✅ Campo de busca em tempo real
- ✅ Botão "Recarregar" para atualizar dados
- ✅ Spinner/loading enquanto carrega
- ✅ Mensagens de erro se backend não responder

### Página 2: Detalhes de um Equipamento
- ✅ Mostra: ID, Nome, Código, Status, Data de Criação
- ✅ Botão "Voltar" para listagem
- ✅ Design card limpo

---

## 🔗 INTEGRAÇÃO COM BACKEND

O frontend consome **apenas estes 2 endpoints**:

| URL | Método | O que faz |
|-----|--------|----------|
| `GET /equipamento?page=0` | GET | Lista equipamentos com paginação |
| `GET /equipamento/{id}` | GET | Mostra detalhe de 1 equipamento |

**✅ Leitura apenas** - nenhuma alteração de dados no backend

---

## ⚙️ CONFIGURAÇÃO

Se o backend está em **outra porta** ou **IP diferente**, edite:

**`frontend/js/app.js` - Linha 8:**
```javascript
const API_URL = 'http://localhost:8080';  // ← Mude aqui se necessário
```

**Exemplos:**
```javascript
const API_URL = 'http://192.168.0.100:8080';  // Outra máquina
const API_URL = 'http://localhost:9000';       // Outra porta
```

---

## 🎨 PERSONALIZAR CORES

Edite `frontend/css/style.css` - seção `:root` (primeiras linhas):

```css
:root {
    --primary-color: #3b82f6;        /* Azul principal */
    --secondary-color: #8b5cf6;      /* Roxo */
    --success-color: #10b981;        /* Verde */
    --danger-color: #ef4444;         /* Vermelho */
    /* ... mais cores */
}
```

Todas as cores atualizam automaticamente em todo o site.

---

## 🐛 SE ALGO NÃO FUNCIONAR

### ❌ "Nenhum equipamento encontrado" ou tabela vazia
- Verifique se backend está rodando: http://localhost:8080
- Abra DevTools (F12) → Console → veja se há erros
- Verifique se há equipamentos cadastrados no banco

### ❌ Erro de CORS ou conexão recusada
- Confirme que backend tem CORS habilitado
- Verifique arquivo: `Cmms/src/main/java/com/example/Cmms/config/CorsConfig.java`
- Ele deve ter algo como: `allowedOrigins = "http://localhost:3000"`

### ❌ "Address already in use" na porta 3000
- Outra aplicação está usando a porta 3000
- Feche aplicações que usam essa porta OU
- Edite `frontend/server.py` linha 41: `PORT = 3001` (ou outra porta livre)

### ❌ Python não encontrado
- Instale Python 3.7+ em: https://www.python.org/downloads/
- Reinicie o terminal após instalar

---

## 📱 RESPONSIVIDADE

O frontend funciona perfeitamente em:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Celular (menos de 768px)

Redimensione a janela do navegador para testar!

---

## 🔄 COMO FUNCIONA A INTEGRAÇÃO

### 1️⃣ Usuário acessa http://localhost:3000
↓
### 2️⃣ JavaScript carrega `js/app.js`
↓
### 3️⃣ `app.js` faz requisição: `GET /equipamento?page=0`
↓
### 4️⃣ Backend retorna:
```json
{
  "content": [
    {"id": 1, "nome": "Equipamento 1", "codigo": "EQ-001", "status": "ATIVO"}
  ],
  "totalPages": 5,
  "totalElements": 50
}
```
↓
### 5️⃣ Frontend renderiza tabela com os dados
↓
### 6️⃣ Usuário clica em "Detalhe"
↓
### 7️⃣ `app.js` faz: `GET /equipamento/1`
↓
### 8️⃣ Mostra a página de detalhes

---

## 📁 ARQUIVOS IMPORTANTES

| Arquivo | O quê | Editar? |
|---------|-------|---------|
| `index.html` | Estrutura do site | ❌ Raramente |
| `css/style.css` | Cores, fontes, layout | ✅ Para personalizar |
| `js/app.js` | Conexão com backend | ✅ Se mudar URL do backend |
| `server.py` | Servidor HTTP | ❌ Não precisa |

---

## 💡 DICAS

1. **DevTools é seu amigo**: Pressione F12 durante uso
2. **Console mostra erros**: Verifique aba Console se algo der errado
3. **Network mostra requisições**: Aba Network mostra o que backend retorna
4. **Limpar cache**: Ctrl+F5 se mudou arquivo e não vê alteração

---

## ✨ PRÓXIMOS PASSOS

Se quiser adicionar mais funcionalidades:

1. **Criar**: Adicione `POST /equipamento` em `js/app.js`
2. **Editar**: Adicione `PUT /equipamento` em `js/app.js`
3. **Deletar**: Adicione `DELETE /equipamento/{id}` em `js/app.js`
4. **Dashboard**: Crie nova seção em `index.html` com `GET /equipamento/stats`

Mas por enquanto, **apenas leitura** está implementado conforme solicitado ✅

---

## 📞 RESUMO RÁPIDO

| O que fazer | Comando |
|-------------|---------|
| Tudo automático | `start.cmd` |
| Só frontend | `cd frontend && python server.py` |
| Abrir em navegador | http://localhost:3000 |
| Parar aplicação | Ctrl+C ou fechar janela |
| Mudar URL backend | Editar `frontend/js/app.js` linha 8 |

---

## ✅ CHECKLIST

- [x] Frontend criado com HTML/CSS/JavaScript puro
- [x] Integração com backend (apenas GET)
- [x] Paginação funcionando
- [x] Busca/filtro de equipamentos
- [x] Visualização de detalhes
- [x] Design responsivo
- [x] Sem dependências complexas
- [x] Tratamento de erros
- [x] Servidor HTTP em Python
- [x] Script de inicialização atualizado

---

**Desenvolvido em 17 de Abril de 2026** ✨

Bora testar! 🚀
