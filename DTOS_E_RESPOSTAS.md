# 📊 DTOs e Estruturas de Resposta

Este documento descreve as estruturas de dados (DTOs) utilizadas na comunicação entre Frontend e Backend.

## 📋 DTOs de Equipamento

### 1. **DadosListagemEquipamento**
Utilizado na listagem de equipamentos (busca paginada)

**Frontend:** Resposta do `GET /equipamento`

```json
{
  "content": [
    {
      "id": 1,
      "nome": "Bomba de Água",
      "codigo": "EQ-001",
      "status": "ATIVO"
    },
    {
      "id": 2,
      "nome": "Compressor",
      "codigo": "EQ-002",
      "status": "ATIVO"
    },
    {
      "id": 3,
      "nome": "Filtro de Ar",
      "codigo": "EQ-003",
      "status": "INATIVO"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "last": true,
  "totalPages": 1,
  "totalElements": 3,
  "size": 10,
  "number": 0,
  "sort": {
    "empty": false,
    "sorted": true,
    "unsorted": false
  },
  "numberOfElements": 3,
  "first": true,
  "empty": false
}
```

**Backend:** Classe `DadosListagemEquipamento.java`

```java
public record DadosListagemEquipamento(
    Long id,
    String nome,
    String codigo,
    Status status
) {
    public DadosListagemEquipamento(Equipamento equipamento) {
        this(
            equipamento.getId(),
            equipamento.getNome(),
            equipamento.getCodigo(),
            equipamento.getStatus()
        );
    }
}
```

### 2. **DadosDetalhamentoEquipamento**
Utilizado ao visualizar detalhes de um equipamento (se implementado)

```json
{
  "id": 1,
  "nome": "Bomba de Água",
  "codigo": "EQ-001",
  "status": "ATIVO",
  "dataCriacao": "2024-01-15T10:30:00"
}
```

**Backend:** Classe `DadosDetalhamentoEquipamento.java`

```java
public record DadosDetalhamentoEquipamento(
    Long id,
    String nome,
    String codigo,
    Status status,
    LocalDateTime dataCriacao
) {
    public DadosDetalhamentoEquipamento(Equipamento equipamento) {
        this(
            equipamento.getId(),
            equipamento.getNome(),
            equipamento.getCodigo(),
            equipamento.getStatus(),
            equipamento.getDataCriacao()
        );
    }
}
```

### 3. **Status (Enum)**
Valores possíveis para o status de um equipamento

```java
public enum Status {
    ATIVO,
    INATIVO
}
```

**Representação JSON:** `"ATIVO"` ou `"INATIVO"`

---

## 🔄 Fluxo de Requisição - Exemplo Prático

### Cenário: Listar Equipamentos

**1. Frontend Requisita**
```javascript
// equipamentoService.js
const response = await api.get('/equipamento', {
  params: {
    page: 0,
    size: 10,
    sort: 'nome'
  }
})
```

**2. URL Gerada**
```
GET http://localhost:8080/equipamento?page=0&size=10&sort=nome
```

**3. Backend Processa**
```java
@GetMapping
public ResponseEntity<Page<DadosListagemEquipamento>> listarEquipamentos(
    @PageableDefault(size = 10, sort = {"nome"}) Pageable paginacao) {
    
    var page = repository.findByStatus(Status.ATIVO, paginacao)
        .map(DadosListagemEquipamento::new);
    
    return ResponseEntity.ok(page);
}
```

**4. Backend Retorna**
```json
{
  "content": [...],
  "totalPages": 5,
  "totalElements": 50,
  "number": 0,
  "size": 10
}
```

**5. Frontend Processa**
```jsx
// Hook useFetch captura a resposta
const { loading, data, error } = useFetch(
  () => equipamentoService.listar(page, size, sort),
  [page]
)

// data contém o objeto com "content", "totalPages", etc.
const equipamentos = data?.content || []
const totalPages = data?.totalPages || 1
```

**6. Frontend Renderiza**
```jsx
<Table 
  columns={columns} 
  data={equipamentos}
/>
<Pagination 
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

---

## 📦 Estrutura de Paginação

Spring Data JPA retorna um objeto `Page<T>` que contém:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `content` | `List<T>` | Lista de items da página atual |
| `totalElements` | `long` | Total de items em todas as páginas |
| `totalPages` | `int` | Total de páginas |
| `number` | `int` | Número da página atual (começa em 0) |
| `size` | `int` | Tamanho da página (items por página) |
| `numberOfElements` | `int` | Número de items nesta página |
| `first` | `boolean` | É a primeira página? |
| `last` | `boolean` | É a última página? |
| `empty` | `boolean` | A página está vazia? |
| `pageable` | `Pageable` | Informações de paginação |
| `sort` | `Sort` | Informações de ordenação |

---

## 🔍 Parâmetros de Paginação

### Page (Página)
- **Padrão:** 0
- **Tipo:** `int`
- **Descrição:** Número da página (começa em 0)
- **Exemplo:** `page=0` (primeira página), `page=2` (terceira página)

### Size (Tamanho)
- **Padrão:** 10
- **Tipo:** `int`
- **Descrição:** Quantidade de items por página
- **Exemplo:** `size=20` (20 items por página)

### Sort (Ordenação)
- **Padrão:** "nome"
- **Tipo:** `string`
- **Descrição:** Campo para ordenação
- **Exemplo:** `sort=nome` ou `sort=id` ou `sort=dataCriacao`
- **Múltiplos:** `sort=nome,asc&sort=id,desc`

---

## ✅ Validação de Dados

### Status Permit Valores
- ✅ `ATIVO` - Equipamento está em funcionamento
- ✅ `INATIVO` - Equipamento não está em funcionamento

Qualquer outro valor retornará erro 400 Bad Request.

### Campo `nome`
- **Tipo:** String
- **Máximo:** 255 caracteres
- **Validação:** @NotBlank (não pode ser vazio)

### Campo `codigo`
- **Tipo:** String
- **Máximo:** 50 caracteres
- **Validação:** @NotBlank
- **Padrão:** "EQ-001", "EQ-002", etc.

---

## 🚨 Respostas de Erro

### 400 Bad Request
```json
{
  "timestamp": "2024-04-16T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid request parameters",
  "path": "/equipamento"
}
```

### 404 Not Found
```json
{
  "timestamp": "2024-04-16T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Equipamento não encontrado",
  "path": "/equipamento/999"
}
```

### 500 Internal Server Error
```json
{
  "timestamp": "2024-04-16T10:30:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Erro ao processar sua solicitação",
  "path": "/equipamento"
}
```

---

## 📝 Como Frontend Interpreta Respostas

### No `equipamentoService.js`

```javascript
async listar(page = 0, size = 10, sort = 'nome') {
  try {
    const response = await api.get('/equipamento', {
      params: { page, size, sort }
    })
    
    // ✅ Sucesso (200-299)
    return response.data  // Retorna objeto com "content", "totalPages", etc.
    
  } catch (error) {
    // ❌ Erro (400, 404, 500, etc.)
    if (error.response) {
      // Backend respondeu com código de erro
      throw {
        status: error.response.status,
        message: error.response.data.message || 'Erro desconhecido'
      }
    } else if (error.request) {
      // Requisição foi feita mas sem resposta
      throw { message: 'Sem conexão com servidor' }
    } else {
      // Erro na configuração
      throw { message: error.message }
    }
  }
}
```

### No Componente

```jsx
const { loading, data, error } = useFetch(
  () => equipamentoService.listar(page, size),
  [page]
)

if (loading) return <Loading />
if (error) return <Error message={error.message} onRetry={refetch} />

const equipamentos = data?.content || []
return <Table data={equipamentos} />
```

---

## 🔗 Exemplos de URLs Completas

### Listar primeira página
```
GET http://localhost:8080/equipamento?page=0&size=10&sort=nome
```

### Listar segunda página com 20 items
```
GET http://localhost:8080/equipamento?page=1&size=20&sort=nome
```

### Listar ordenado por ID decrescente
```
GET http://localhost:8080/equipamento?page=0&size=10&sort=id,desc
```

### Múltiplas ordenações
```
GET http://localhost:8080/equipamento?page=0&size=10&sort=status&sort=nome
```

---

## 📚 Referências

- **Spring Data JPA Docs:** https://spring.io/projects/spring-data-jpa
- **Pagination Guide:** https://www.baeldung.com/spring-data-jpa-pagination-sorting
- **REST Best Practices:** https://restfulapi.net/http-status-codes/
