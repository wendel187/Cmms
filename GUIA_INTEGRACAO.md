# Guia de Integração Frontend e Backend - CMMS

## 📋 Visão Geral

Este documento descreve como o frontend React está integrado com o backend Spring Boot para ler dados de equipamentos.

## 🔗 Endpoints Utilizados

### Apenas Leitura (GET)

#### 1. **Listar Equipamentos** (com paginação)
```
GET /equipamento?page=0&size=10&sort=nome
```

**Parâmetros:**
- `page`: Número da página (padrão: 0)
- `size`: Quantidade de itens por página (padrão: 10)
- `sort`: Campo para ordenação (padrão: "nome")

**Resposta:**
```json
{
  "content": [
    {
      "id": 1,
      "nome": "Bomba de Água",
      "codigo": "EQ-001",
      "status": "ATIVO"
    }
  ],
  "totalElements": 25,
  "totalPages": 3,
  "number": 0,
  "size": 10
}
```

## 🛠️ Arquitetura Frontend

### Estrutura em Camadas

```
Frontend
├── Components (UI)
│   ├── Layout, Header, Sidebar
│   ├── Card, Button, Badge
│   ├── Table, Pagination, Loading, Error
│
├── Pages (Páginas/Rotas)
│   ├── Dashboard
│   ├── Equipamentos
│   └── NotFound
│
├── Services (Integração API)
│   ├── api.js (Client HTTP com Axios)
│   └── equipamentoService.js (Métodos específicos)
│
├── Hooks (Lógica Reutilizável)
│   └── useFetch.js (Busca de dados com states)
│
└── Styles (Temas com Styled-Components)
    └── global.css (Variáveis CSS)
```

### Fluxo de Dados

```
API (Backend) 
    ↓
equipamentoService.listar()
    ↓
useFetch hook
    ↓
Component State
    ↓
UI Rendering
```

## 🚀 Como Iniciar

### Backend (Spring Boot)

1. Abra o terminal no diretório `Cmms/`
2. Execute:
```bash
./mvnw.cmd spring-boot:run
```
3. Backend rodará em `http://localhost:8080`

### Frontend (React)

1. Abra o terminal no diretório `frontend/`
2. Instale dependências:
```bash
npm install
```
3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
4. Frontend estará em `http://localhost:3000`

## ⚙️ Configuração CORS

Para que o frontend consiga comunicar com o backend, o CORS deve estar habilitado. Adicione a seguinte classe no seu backend:

### 1. Criar Classe de Configuração CORS

Arquivo: `src/main/java/com/example/Cmms/config/CorsConfig.java`

```java
package com.example.Cmms.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### 2. Ou Usar Anotação @CrossOrigin (Simples)

No seu `EquipamentoController.java`:

```java
@RestController
@RequestMapping("/equipamento")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class EquipamentoController {
    // ... resto do código
}
```

## 📊 Páginas Disponíveis

### 1. Dashboard (`/`)
- Exibe estatísticas gerais
- Total de equipamentos
- Equipamentos ativos
- Equipamentos inativos

### 2. Equipamentos (`/equipamentos`)
- Lista paginada de todos os equipamentos
- Visualização de: ID, Nome, Código, Status
- Paginação com botões de navegação
- Botão de atualizar dados

## 🔄 Fluxo de Requisição

```
1. Usuário clica em "Equipamentos" no menu
   ↓
2. React Router navega para /equipamentos
   ↓
3. Componente Equipamentos monta → useEffect dispara
   ↓
4. useFetch chama equipamentoService.listar(page, size, sort)
   ↓
5. equipamentoService chama api.get('/equipamento', params)
   ↓
6. Axios envia requisição GET para http://localhost:8080/equipamento
   ↓
7. Backend processa e retorna dados paginados
   ↓
8. Component atualiza state com dados
   ↓
9. UI re-renderiza com a tabela de equipamentos
```

## 🔐 Variáveis de Ambiente

Arquivo `.env`:

```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=CMMS - Sistema de Gerenciamento de Equipamentos
```

## 📱 Componentes Principais

### Layout
- Container principal com Header, Sidebar e conteúdo

### Header
- Logo/Menu icon
- Titulo da aplicação

### Sidebar
- Navegação entre páginas
- Links para Dashboard e Equipamentos

### Table
- Componente genérico para exibição de dados tabulares
- Suporta renderização customizada de células

### Pagination
- Navegação entre páginas
- Indica página atual e total

### Card
- Container estilizado para agrupar conteúdo

### Badge
- Labels de status (ATIVO/INATIVO) com cores

### Loading
- Spinner animado + mensagem durante carregamento

### Error
- Exibição de erro com botão de retry (tentar novamente)

## 🐛 Troubleshooting

### Erro: "Failed to fetch"
**Causa**: Backend desligado ou URL incorreta
**Solução**: 
1. Verifique se backend está rodando em http://localhost:8080
2. Verifique URL em `.env`

### Erro: "Access to XMLHttpRequest blocked by CORS"
**Causa**: CORS não configurado no backend
**Solução**: Adicionar [CorsConfig](#-configuração-cors) no backend

### Erro: "ERR_CONNECTION_REFUSED"
**Causa**: Conexão recusada na porta 8080
**Solução**: 
1. Verifique se backend startou sem erros
2. Tente: `netstat -ano | findstr :8080` (Windows) ou `lsof -i :8080` (Mac/Linux)

### Tabela vazia mesmo com dados no banco
**Causa**: Dados não estão com status ATIVO
**Solução**: Verifique no backend - equipamentos devem ter `status = 'ATIVO'`

## 📈 Próximos Passos

### Funcionalidades Futuras
- [ ] Criar novo equipamento (POST)
- [ ] Editar equipamento (PUT)
- [ ] Deletar equipamento (DELETE)
- [ ] Buscar/Filtrar equipamentos
- [ ] Autenticação de usuários
- [ ] Dashboard com gráficos
- [ ] Exportar dados

### Melhorias Sugeridas
- [ ] Adicionar testes unitários
- [ ] Implementar toast notifications
- [ ] Adicionar dark mode
- [ ] Internacionalização (i18n)
- [ ] Melhorar performance com React.memo

## 📞 Suporte

Verifique os logs do navegador (F12 → Console) para mensagens de erro detalhadas.
