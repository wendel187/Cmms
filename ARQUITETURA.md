# Arquitetura do Projeto CMMS

## Estrutura de Pacotes

```
com.example.Cmms/
├── CmmsApplication.java          # Classe principal do Spring Boot
│
├── controller/                   # Camada de Apresentação (REST)
│   └── EquipamentoController.java
│
├── service/                      # Camada de Serviço (Lógica de Negócios)
│   └── EquipamentoService.java
│
└── domain/                       # Camada de Domínio (Entidades e Repositórios)
    ├── equipamento/
    │   ├── Equipamento.java               # Entidade JPA
    │   ├── Status.java                    # Enum de Status
    │   ├── EquipamentoRepository.java     # Interface do Repositório
    │   ├── DadosCadastroEquipamento.java  # DTO para cadastro
    │   └── DadosDetalhamentoEquipamento.java # DTO para resposta
    │
    └── tecnico/
        └── Tecnico.java
```

## Camadas da Aplicação

### 1. **Controller** (Camada de Apresentação)
- Recebe requisições HTTP
- Valida entradas com `@Valid`
- Chama a service
- Retorna respostas HTTP

**Padrão:** `@RestController`, `@RequestMapping`, `@PostMapping`, `@GetMapping`, etc.

### 2. **Service** (Camada de Lógica de Negócios)
- Contém a lógica de negócio
- Chamada pelo controller
- Interage com o repository
- Controlada com `@Transactional`

**Padrão:** `@Service`, `@Autowired`

### 3. **Domain** (Camada de Domínio)
- **Entidade:** Representa a tabela no banco (Equipamento.java)
- **Enum:** Define valores constantes (Status.java)
- **Repository:** Interface JPA para acesso a dados
- **DTOs:** Classes para transferência de dados (Request/Response)

**Padrão:** `@Entity`, `@Repository` (extends JpaRepository), `record` para DTOs

## Fluxo de uma Requisição

```
HTTP POST /equipamentos
    ↓
@PostMapping em EquipamentoController
    ↓
@Valid DadosCadastroEquipamento (validação)
    ↓
EquipamentoService.cadastrarEquipamento()
    ↓
EquipamentoRepository.save(equipamento)
    ↓
Banco de Dados (INSERT)
    ↓
ResponseEntity com DadosDetalhamentoEquipamento
    ↓
HTTP 201 Created
```

## DTOs Utilizados

### DadosCadastroEquipamento (Request)
```json
{
  "nome": "string",
  "codigo": "string",
  "status": "ATIVO|INATIVO|QUEBRADO|MANUTENCAO"
}
```

### DadosDetalhamentoEquipamento (Response)
```json
{
  "id": 1,
  "nome": "string",
  "codigo": "string",
  "status": "ATIVO",
  "dataAquisicao": "2026-04-16"
}
```

## Boas Práticas Aplicadas

✅ **Separação de responsabilidades** - Cada camada tem um propósito
✅ **DTOs** - Não expõe entidades diretamente
✅ **Validação** - Usa `@Valid` e `@NotBlank`
✅ **Transação** - `@Transactional` apenas na service
✅ **Injeção de Dependências** - Usa `@Autowired`
✅ **REST** - Segue padrões HTTP (201 Created com URI)
✅ **Timestamps** - `@CreationTimestamp` preence data automaticamente

