# 🎯 CMMS - Quick Start Guide

## 📁 Estrutura de Projeto Completa

```
Cmms/
├── Cmms/                           # Backend (Spring Boot)
│   ├── mvnw.cmd, mvnw              # Maven Wrapper
│   ├── pom.xml                     # Dependências Maven
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/Cmms/
│   │   │   │   ├── CmmsApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   └── CorsConfig.java   ✨ NOVO
│   │   │   │   ├── controller/
│   │   │   │   │   └── EquipamentoController.java
│   │   │   │   └── domain/
│   │   │   │       └── equipamento/
│   │   │   │           ├── Equipamento.java
│   │   │   │           ├── EquipamentoRepository.java
│   │   │   │           ├── Status.java
│   │   │   │           └── DTOs...
│   │   │   └── resources/
│   │   │       └── application.yaml
│   │   └── test/
│   │       └── java/...
│   └── target/
│
├── frontend/                       # Frontend (React)
│   ├── node_modules/              # Dependências npm (após npm install)
│   ├── public/                    # Assets públicos
│   ├── src/
│   │   ├── components/            # ✨ Componentes Reutilizáveis
│   │   │   ├── Badge/
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Error/
│   │   │   ├── Header/
│   │   │   ├── Layout/
│   │   │   ├── Loading/
│   │   │   ├── Pagination/
│   │   │   ├── Sidebar/
│   │   │   └── Table/
│   │   ├── hooks/                 # ✨ Hooks Customizados
│   │   │   └── useFetch.js
│   │   ├── pages/                 # ✨ Páginas da App
│   │   │   ├── Dashboard/
│   │   │   ├── Equipamentos/
│   │   │   └── NotFound/
│   │   ├── services/              # ✨ Integração com API
│   │   │   ├── api.js
│   │   │   └── equipamentoService.js
│   │   ├── styles/                # Estilos globais
│   │   │   └── global.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                       # Variáveis de ambiente
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── ARQUITETURA.md                 # Documentação existente
├── GUIA_INTEGRACAO.md            # ✨ NOVO - Guia de integração
├── start.cmd                      # ✨ NOVO - Script Windows
├── start.sh                       # ✨ NOVO - Script Linux/Mac
└── README.md
```

## 🚀 Como Iniciar (3 Opções)

### **Opção 1: Script Automático (RECOMENDADO)**

**Windows:**
```bash
start.cmd
```

**Linux/Mac:**
```bash
bash start.sh
```

---

### **Opção 2: Manualmente em Dois Terminais**

**Terminal 1 - Backend:**
```bash
cd Cmms
./mvnw.cmd spring-boot:run    # Windows
# ou
./mvnw spring-boot:run         # Linux/Mac
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # só na primeira vez
npm run dev
```

---

### **Opção 3: Via IDE**

**Backend (VS Code/IntelliJ):**
- Abra `Cmms/`
- Run → `CmmsApplication.java`

**Frontend (VS Code):**
- Abra `frontend/`
- Terminal → `npm run dev`

---

## ✨ Acessar a Aplicação

Após iniciar ambos:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Documentação Integração**: Leia [GUIA_INTEGRACAO.md](./GUIA_INTEGRACAO.md)

---

## 📊 Fluxo de Dados

```
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Pages                                                  │ │
│  │ ├── Dashboard ──→ Mostra 📊 estatísticas              │ │
│  │ └── Equipamentos ──→ Lista 📋 equipamentos           │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Services                                               │ │
│  │ └── equipamentoService.listar()                       │ │
│  │     └── api.get('/equipamento')                       │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                           ↓ (HTTP GET)
              
         ┌─────────────────────────────────┐
         │    CORS Proxy (Vite Dev)        │
         │  http://localhost:8080          │
         └─────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────────┐
│                   BACKEND (Spring Boot)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Controller: @GetMapping("/equipamento")               │ │
│  │ ├── Recebe: page, size, sort                          │ │
│  │ └── Chama: EquipamentoRepository.findByStatus()       │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Database: MySQL                                        │ │
│  │ Tabela: equipamentos                                   │ │
│  │ ├── id, nome, codigo, status, dataCriacao             │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 📱 Páginas Frontend

### 1. **Dashboard** (`/`)
```
┌─────────────────────────────────────┐
│          CMMS Dashboard             │
├─────────────────────────────────────┤
│ Total Equipamentos: 25  ⚙️          │
│ Equipamentos Ativos: 20  ✅         │
│ Equipamentos Inativos: 5  ⚠️        │
└─────────────────────────────────────┘
```

### 2. **Equipamentos** (`/equipamentos`)
```
┌──────────────────────────────────────────────┐
│  ID │ Nome          │ Código │ Status      │
├──────────────────────────────────────────────┤
│ 1  │ Bomba         │ EQ-001 │ ✅ ATIVO    │
│ 2  │ Compressor    │ EQ-002 │ ✅ ATIVO    │
│ 3  │ Filtro        │ EQ-003 │ ⚠️ INATIVO  │
├──────────────────────────────────────────────┤
│ Página 1 de 3 | ◄ página ► 3 itens/página  │
└──────────────────────────────────────────────┘
```

---

## 🔧 Tecnologias Utilizadas

### Backend
- **Java 17** (LTS)
- **Spring Boot 4.0.5** (último estável)
- **Spring Data JPA** (ORM)
- **MySQL** (Banco de dados)
- **Maven** (Build tool)

### Frontend
- **React 18** (UI Library)
- **Vite 5** (Build tool super rápido)
- **Styled Components** (CSS-in-JS)
- **Axios** (HTTP Client)
- **React Router 6** (Roteamento)
- **React Icons** (Ícones SVG)

---

## 📝 Configurações Importantes

### `.env` Frontend
```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=CMMS - Sistema de Gerenciamento de Equipamentos
```

### Backend - `application.yaml`
```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/cmms_db
    username: root
    password:

  jpa:
    hibernate:
      ddl-auto: update
```

### Backend - `CorsConfig.java` ✨ NOVO
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                // ... mais configs
    }
}
```

---

## 🐛 Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| "Connection refused" | Backend não rodando | Execute `./mvnw.cmd spring-boot:run` |
| "CORS error" | CORS não configurado | Verifique `CorsConfig.java` no backend |
| "npm not found" | Node.js não instalado | Instale Node.js v16+ de nodejs.org |
| Tabela vazia | Sem dados no BD | Cadastre equipamentos com status ATIVO no backend |
| "Failed to fetch" | API URL incorreta | Verifique `.env` do frontend |

---

## 📚 Documentação Completa

Leia [GUIA_INTEGRACAO.md](./GUIA_INTEGRACAO.md) para:
- Explicação detalhada de cada endpoint
- Como adicionar novos endpoints
- Fluxo de requisição passo-a-passo
- Próximas funcionalidades sugeridas

---

## ✅ Checklist - Pronto Para Usar

- ✅ Frontend React criado com arquitetura modular
- ✅ Integração com API backend para **LEITURA**
- ✅ CORS configurado no backend
- ✅ Dashboard com estatísticas
- ✅ Listagem de equipamentos com paginação
- ✅ Componentes reutilizáveis
- ✅ Tratamento de erros e loading
- ✅ Scripts para iniciar automaticamente
- ✅ Documentação completa

---

## 🎨 Exemplos de Uso

### Adicionar Nova Página

1. Crie `frontend/src/pages/MinhaPage/index.jsx`
2. Importe em `App.jsx`:
```jsx
import MinhaPage from './pages/MinhaPage'

<Route path="/minha-page" element={<MinhaPage />} />
```
3. Adicione menu em `Sidebar/index.jsx`

### Chamar Outra API

```jsx
// services/minhaService.js
import api from './api'

export async function obterDados() {
  const response = await api.get('/outro-endpoint')
  return response.data
}

// pages/MinhaPage/index.jsx
import { useFetch } from '../../hooks/useFetch'
import { obterDados } from '../../services/minhaService'

const { loading, data, error } = useFetch(obterDados)
```

---

## 📞 Próximos Passos

1. **Instale Node.js** se ainda não tiver: https://nodejs.org/
2. **Execute** `start.cmd` (Windows) ou `bash start.sh` (Linux/Mac)
3. **Abra** http://localhost:3000
4. **Explore** o Dashboard e Equipamentos
5. **Leia** [GUIA_INTEGRACAO.md](./GUIA_INTEGRACAO.md) para avançado

---

**Desenvolvido com ❤️ para seu projeto CMMS**
