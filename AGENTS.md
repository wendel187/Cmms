# AGENTS.md - CMMS Codebase Guide

## Project Overview
**CMMS** (Computerized Maintenance Management System) is a full-stack application for managing equipment maintenance orders. It uses **Spring Boot 4.0.5** (Java 17, Maven) for the backend and **vanilla HTML/CSS/JavaScript** for the frontend, communicating via REST API.

---

## Architecture & Data Flow

### High-Level Architecture
```
Frontend (port 3000)
    ↓ REST API (fetch)
Spring Boot Backend (port 8080)
    ↓ JPA/Hibernate ORM
MySQL Database (localhost:3306/cmms_db)
```

### Key Domain Concepts
1. **Equipamento** - Equipment to be maintained (ATIVO/INATIVO, Criticidade: ALTA/MEDIA/BAIXA)
2. **OrdemServico** - Abstract base class for maintenance orders (Corretiva=corrective, Preventiva=preventive)
   - Uses **JPA Single Table Inheritance** (`@Inheritance(strategy = InheritanceType.SINGLE_TABLE)`)
   - Polymorphic priority calculation (`calcularPrioridade()` implemented differently in subclasses)
3. **Tecnico** - Tech who executes orders (status-aware: DISPONIVEL, EM_PAUSA, INDISPONIVEL)

### Critical Data Flows

**Creating a Service Order (OS):**
```java
OrdemServicoService.criarOSCorretiva/Preventiva()
  ↓ Validates tecnico.podeAbrirOS()
  ↓ Creates OSCorretiva/OSPreventiva entity
  ↓ Saves to repository
  ↓ Creates HistoricoStatus record (status audit trail)
  ↓ Returns to controller as ResponseEntity
```

**Status Changes:**
When updating OS status, always create a `HistoricoStatus` record for audit trail. Check `OrdemServicoService.atualizarStatus()`.

---

## Project-Specific Conventions

### DTO Pattern (NOT Standard CRUD DTOs)
Each entity has **4 specific DTO types** - do NOT create generic mappers:

| DTO Type | Purpose | Example |
|----------|---------|---------|
| **DadosCadastroX** | POST requests, input with @Valid annotations | `DadosCadastroEquipamento(nome, codigo, status, criticidade, setor)` |
| **DadosAtualizacaoX** | PUT requests, must include `id()` field | `DadosAtualizacaoEquipamento` |
| **DadosDetalhamentoX** | GET by ID, full details with calculations | Includes computed `prioridade` for OS |
| **DadosListagemX** | GET list, minimal fields with pagination | Used with `Page<DadosListagemEquipamento>` |

Constructor pattern: `new DadosListagem(entity)` - DTOs have constructors that extract data from entities.

### Domain-Driven Design Elements
- **Business logic in domain**: `equipamento.excluir()`, `tecnico.podeAbrirOS()`, `ordemServico.calcularPrioridade()` 
- **Enums with behavior**: `Status`, `Criticidade`, `StatusOrdemServico` are not just data - they drive validation logic
- **Entity update methods**: Use domain-specific update methods (`equipamento.atualizarInformacoes()`) instead of direct setters

### Inheritance & Polymorphism
`OrdemServico` is an abstract base class with two concrete implementations:
- `OSCorretiva` - Corrective maintenance (has `descricaoFalha`, `falhaTotal`)
- `OSPreventiva` - Preventive maintenance (has `dataPrevista`, `periodicidadeDias`, `ultimaManutencao`)

**When adding fields:**
- Common to both? Add to `OrdemServico` abstract base
- Specific to type? Add to `OSCorretiva` or `OSPreventiva`
- Update corresponding DTO constructors

### API Response Patterns
```java
// List with pagination (always Page<DTO>)
return ResponseEntity.ok(repository.findByStatus(status, pagination).map(DadosListagem::new));

// Single resource creation (201 Created with Location header)
return ResponseEntity.created(uri).body(new DadosDetalhamento(entity));

// Updates (200 OK with updated data)
return ResponseEntity.ok(new DadosDetalhamento(entity));

// Deletes (204 No Content)
return ResponseEntity.noContent().build();
```

---

## Build & Runtime Commands

### Backend
```bash
# Navigate to Cmms/ directory
cd Cmms

# Build
mvnw.cmd clean package  # Windows
./mvnw clean package    # Linux/Mac

# Run (development)
mvnw.cmd spring-boot:run   # Windows
./mvnw spring-boot:run     # Linux/Mac

# Run JAR
java -jar target/Cmms-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend

# Development server (port 3000)
python server.py       # Uses http-server
# OR
npm run dev           # If using npm scripts

# Build (static site, no bundler)
# Just commit HTML/CSS/JS files, no build needed
```

### Both at Once
```bash
# Windows
start.cmd

# Linux/Mac
chmod +x start.sh && ./start.sh
```

**Database Setup:**
```sql
-- Create MySQL database first
CREATE DATABASE cmms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- JPA ddl-auto: update will create/update tables on first run
-- DANGER: Don't use ddl-auto: create in production!
```

---

## Frontend-Backend Communication

### API Base Configuration
- **Base URL**: `http://localhost:8080`
- **Endpoints**: See `frontend/js/config.js`
- **CORS Allowed Origins**: localhost:3000, 5173, 4173 (dev servers)

### Frontend Service Layer
```javascript
// frontend/js/api.js - Generic HTTP layer
fazerRequisicao(endpoint, method, dados)  // Underlying fetch wrapper

// Exported functions follow entity pattern:
// - carregarX(), criarX(), atualizarX(), desativarX()
// Example: carregarEquipamentos() → Maps response.content (Page<DTO> payload)
```

### Pagination Handler
Frontend expects Spring `Page<T>` response structure:
```json
{
  "content": [...],      // Actual data (DTO array)
  "totalElements": 100,
  "totalPages": 10,
  "size": 10,
  "number": 0
}
```
Component extracts `response.content` to work with data arrays.

---

## Error Handling

### Exception Strategy
- **RecursoNaoEncontradoException** (404) - Use when entity not found: `repository.findById().orElseThrow()`
- **IllegalArgumentException** (400) - For validation failures: `if (!tecnico.podeAbrirOS()) throw new IllegalArgumentException(...)`
- **Global handler** (`GlobalExceptionHandler`) - Returns consistent `ErrorResponse` with timestamp, status, error type, message, path

### When Adding Validations
1. Use @Valid annotations on DTO fields (Jakarta validation)
2. Throw specific exceptions in service layer with meaningful messages
3. GlobalExceptionHandler ensures consistent error responses

---

## Database Concerns

### Current Configuration (application.yaml)
```yaml
spring.jpa.hibernate.ddl-auto: update  # UNSAFE for production!
spring.jpa.show-sql: true               # DEBUG - disable in production
spring.datasource.url: jdbc:mysql://localhost:3306/cmms_db
```

### Migrations
- **No Flyway/Liquibase** - Currently relying on Hibernate ddl-auto
- **For new columns**: Add field → Restart app → Hibernate updates schema
- **For environment setup**: See `db.migration/init_database.sql`

### Known Pattern Issues
- Direct access with `getReferenceById()` (lazy loading without proxy handling)
- No transaction/version checks for concurrent updates

---

## Common Tasks & Their Locations

| Task | File | Pattern |
|------|------|---------|
| Add REST endpoint | `controller/*Controller.java` | Add method, @PostMapping/@GetMapping, validate input DTO, return ResponseEntity |
| Add business logic | `service/*Service.java` or `domain/*/*.java` | Use @Service, @Transactional on mutation methods, create HistoricoStatus for auditable changes |
| Add persisted field | `domain/*/*.java` (entity) + corresponding DTOs | Update entity, then create new Dados*DTO record type |
| Add validation | DTOs (field-level) + service (logic-level) | Use @Valid annotations + custom exception in service |
| Fix CORS issue | `config/CorsConfig.java` | Add origin to `allowedOrigins()` if adding new frontend host |
| Query optimization | `domain/*/Repository.java` | Add @Query or custom finder method, watch for N+1 problems |

---

## Testing Considerations

- **Backend tests**: `CmmsApplicationTests.java` in test/ directory
- **Manual testing**: Use CMMS_Postman_Collection.json or POSTMAN_UPDATE_COLLECTION.json
- **Frontend debugging**: Check `console` (browser F12) and network tab for API failures
- **Health check**: `GET http://localhost:8080/actuator/health`

---

## Important Files Reference

### Backend Core
- `CmmsApplication.java` - Entry point with component scan
- `config/CorsConfig.java` - Cross-origin settings  
- `exception/GlobalExceptionHandler.java` - Centralized error responses
- `domain/*/Repository.java` - Spring Data JPA queries
- `service/*Service.java` - Business logic layer
- `controller/*Controller.java` - REST endpoints

### Frontend Core
- `js/config.js` - API base URL, endpoints, badges/status enums
- `js/api.js` - HTTP request wrapper, all API calls
- `js/app.js` - Main app initialization and navigation
- `pages/*/` - Each feature has its own HTML, CSS, JS file

### DevOps / DB
- `start.cmd` / `start.sh` - One-command startup scripts
- `application.yaml` - Spring Boot config (DB connection, JPA settings)
- `pom.xml` - Maven dependencies and build config
- `db.migration/` - Database init and schema reference

---

## Why THIS Project Is Structured This Way

1. **Multiple DTOs per entity** - Different views for different operations (creation, list, detail, update) keep API contracts stable and validation focused
2. **Service layer existence despite simple CRUD** - OrdemServicoService handles cross-entity validation (tecnico availability check) and audit trail (HistoricoStatus), justifying the indirection
3. **Inheritance in OrdemServico** - Business requirement: Corretiva and Preventiva have fundamentally different fields and priority calculations, hence not a single entity
4. **Direct repository access in controllers** - Lightweight controllers delegate to repositories or services based on complexity
5. **Frontend modularity by page** - Each page (equipamentos, ordens, tecnicos) is self-contained, allowing independent development

---

## Red Flags When Making Changes

- **Forgetting HistoricoStatus** - Any status change without audit record breaks business requirements
- **Direct entity setters bypassing domain logic** - Use `entity.atualizarInformacoes()` not `entity.setField()`
- **Adding fields without corresponding DTO** - Will break API contracts; add to Dados*DTO records
- **Calling `update()` on detached entities** - Use `getReferenceById()` within @Transactional context
- **Removing validation from DTOs** - @Valid + @NotNull are first-line defense; don't assume service layer will catch all

