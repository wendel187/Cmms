# GUIA DE TESTE - CMMS
## Passo-a-Passo para Demonstração Completa

---

## 📋 Índice
1. [Setup Inicial](#setup-inicial)
2. [Teste do CRUD Técnico](#teste-do-crud-técnico)
3. [Teste do CRUD Equipamento](#teste-do-crud-equipamento)
4. [Teste do CRUD Ordem de Serviço](#teste-do-crud-ordem-de-serviço)
5. [Teste de Polimorfismo](#teste-de-polimorfismo)
6. [Teste de Persistência](#teste-de-persistência)
7. [Teste com MySQL Workbench](#teste-com-mysql-workbench)

---

## 1️⃣ Setup Inicial

### Passo 1: Iniciar MySQL

**Windows**:
```bash
# Abra Services (services.msc) e inicie MySQL
# Ou via Prompt:
net start MySQL80
```

**Linux/Mac**:
```bash
sudo systemctl start mysql
# ou
brew services start mysql-server
```

### Passo 2: Criar Banco de Dados

**Opção A - Via MySQL CLI**:
```bash
mysql -u root -p < src/main/resources/db.migration/init_database.sql
```

**Opção B - Via MySQL Workbench**:
1. Abra MySQL Workbench
2. Conecte ao servidor local
3. Copie todo o arquivo `init_database.sql`
4. Execute (Ctrl+Enter)

**Opção C - Deixar Hibernate Criar**:
- Apenas configureapplication.yaml`` com`ddl-auto: update`
- Primeira execução criará as tabelas

### Passo 3: Compilar e Iniciar a Aplicação

**Via Terminal**:
```bash
cd Cmms
mvn clean compile spring-boot:run
```

**Via NetBeans**:
1. Abra o projeto
2. Pressione F6 ou clique "Run Project"
3. Aguarde msg: "Tomcat started on port(s): 8080"

**Esperado**:
```
Tomcat started on port(s): 8080 (http)
Started CmmsApplication in 5.234 seconds
```

### Passo 4: Verificar Conexão

```bash
# Digite em outro terminal:
curl http://localhost:8080/actuator/health
```

**Resposta Esperada**:
```json
{"status":"UP"}
```

✅ Aplicação rodando!

---

## 2️⃣ Teste do CRUD Técnico

### A) CREATE - Inserir Técnico

**Comando**:
```bash
curl -X POST http://localhost:8080/tecnico \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao.silva@cmms.com",
    "telefone": "11987654321",
    "especialidade": "Eletricista",
    "setor": "Produção",
    "status": "DISPONIVEL"
  }'
```

**Resposta Esperada** (HTTP 201):
```json
{
  "id": 6,
  "nome": "João Silva",
  "email": "joao.silva@cmms.com",
  "telefone": "11987654321",
  "especialidade": "Eletricista",
  "setor": "Produção",
  "status": "DISPONIVEL",
  "ativo": true
}
```

✅ **Técnico criado com ID 6**

---

### B) READ - Listar Técnicos

**Comando**:
```bash
curl http://localhost:8080/tecnico
```

**Resposta Esperada**:
```json
{
  "content": [
    { "id": 1, "nome": "João Silva", ... },
    { "id": 2, "nome": "Maria Santos", ... },
    ...
    { "id": 6, "nome": "João Silva", ...}  ← Nosso novo técnico!
  ],
  "totalElements": 6,
  "size": 10
}
```

✅ **Nosso técnico aparece na lista!**

---

### C) READ by ID - Buscar Específico

**Comando**:
```bash
curl http://localhost:8080/tecnico/6
```

**Resposta Esperada**:
```json
{
  "id": 6,
  "nome": "João Silva",
  "email": "joao.silva@cmms.com",
  "status": "DISPONIVEL"
}
```

✅ **Busca por ID funciona!**

---

### D) UPDATE - Atualizar Técnico

**Comando**:
```bash
curl -X PUT http://localhost:8080/tecnico/6 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "EM_MANUTENCAO"
  }'
```

**Resposta Esperada** (HTTP 200):
```json
{
  "id": 6,
  "nome": "João Silva",
  "status": "EM_MANUTENCAO"  ← MUDOU!
}
```

**Verificar Atualizacão**:
```bash
curl http://localhost:8080/tecnico/6
# Status agora é EM_MANUTENCAO ✅
```

---

### E) DELETE - Desativar Técnico

**Comando**:
```bash
curl -X DELETE http://localhost:8080/tecnico/6
```

**Resposta Esperada** (HTTP 204 No Content):
```
[sem body]
```

**Verificar**:
```bash
curl http://localhost:8080/tecnico/6
# Técnico não aparecerá mais (foi desativado) ✅
```

---

## 3️⃣ Teste do CRUD Equipamento

### A) CREATE - Inserir Equipamento

**Comando**:
```bash
curl -X POST http://localhost:8080/equipamento \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Bomba Hidráulica Nova",
    "codigo": "BOMB-999",
    "status": "ATIVO",
    "criticidade": "CRITICA",
    "setor": "Produção"
  }'
```

**Resposta Esperada** (HTTP 201):
```json
{
  "id": 6,
  "nome": "Bomba Hidráulica Nova",
  "codigo": "BOMB-999",
  "criticidade": "CRITICA"
}
```

✅ **Equipamento criado!**

---

### B) READ - Listar Equipamentos

**Listar todos**:
```bash
curl http://localhost:8080/equipamento
```

**Listar por criticidade (CRÍTICOS)**:
```bash
curl http://localhost:8080/equipamento/criticidade/CRITICA
```

**Esperado**: Lista contém BOMB-999 ✅

---

### C) UPDATE - Atualizar Criticidade

**Comando**:
```bash
curl -X PUT http://localhost:8080/equipamento/6 \
  -H "Content-Type: application/json" \
  -d '{
    "criticidade": "BAIXA"
  }'
```

✅ **Criticidade mudou de CRITICA para BAIXA**

---

## 4️⃣ Teste do CRUD Ordem de Serviço

### A) CREATE OS Corretiva

**Pré-requisito**: Técnico ativo com ID 1

**Comando**:
```bash
curl -X POST http://localhost:8080/ordens-servico/corretiva \
  -H "Content-Type: application/json" \
  -d '{
    "equipamentoId": 1,
    "tecnicoId": 1,
    "descricao": "Vazamento no compressor",
    "descricaoFalha": "Óleo vazando do cilindro",
    "setor": "Produção",
    "nivelCriticidade": 4,
    "falhaTotal": true
  }'
```

**Resposta Esperada** (HTTP 201):
```json
{
  "id": 5,
  "tipo": "CORRETIVA",
  "status": "ABERTA",
  "setor": "Produção",
  "nivelCriticidade": 4,
  "falhaTotal": true
}
```

✅ **OS Corretiva criada!**

---

### B) CREATE OS Preventiva

**Comando**:
```bash
curl -X POST http://localhost:8080/ordens-servico/preventiva \
  -H "Content-Type: application/json" \
  -d '{
    "equipamentoId": 3,
    "tecnicoId": 2,
    "descricao": "Manutenção preventiva",
    "setor": "Energia",
    "dataPrevista": "2026-05-15",
    "periodicidadeDias": 90,
    "ultimaManutencao": "2026-02-15"
  }'
```

**Resposta Esperada**:
```json
{
  "id": 6,
  "tipo": "PREVENTIVA",
  "status": "ABERTA",
  "dataPrevista": "2026-05-15"
}
```

✅ **OS Preventiva criada!**

---

### C) UPDATE - Alterar Status

**Comando**:
```bash
curl -X PUT http://localhost:8080/ordens-servico/status \
  -H "Content-Type: application/json" \
  -d '{
    "id": 5,
    "novoStatus": "EM_ANDAMENTO",
    "observacoes": "Técnico João iniciou o trabalho"
  }'
```

**Esperado**:
- Status muda para EM_ANDAMENTO
- Histórico registra a mudança ✅

---

### D) Consultar Histórico

**Comando**:
```bash
curl http://localhost:8080/ordens-servico/5/historico
```

**Resposta**:
```json
[
  {
    "id": 1,
    "status": "EM_ANDAMENTO",
    "dataHora": "2026-05-05T14:30:45",
    "observacoes": "Técnico João iniciou o trabalho"
  },
  {
    "id": 2,
    "status": "ABERTA",
    "dataHora": "2026-05-05T14:25:00",
    "observacoes": "Ordem criada por João Silva"
  }
]
```

✅ **Histórico mostra todas as mudanças!**

---

## 5️⃣ Teste de Polimorfismo

### ⭐ O TESTE MAIS IMPORTANTE

**Objetivo**: Demonstrar que OSCorretiva e OSPreventiva calculam prioridades diferentes!

**Comando**:
```bash
curl http://localhost:8080/ordens-servico/abertas
```

**Resposta Esperada** (ORDENADAS POR PRIORIDADE):
```json
[
  {
    "id": 5,
    "tipo": "CORRETIVA",
    "descricao": "Vazamento...",
    "prioridade": 18,  ← nivelCriticidade(4) * 2 + falhaTotal(10) = 18
    "nivelCriticidade": 4,
    "falhaTotal": true
  },
  {
    "id": 6,
    "tipo": "PREVENTIVA",
    "descricao": "Manutenção...",
    "prioridade": 12,  ← Baseado em dias até dataPrevista
    "diasAteDataPrevista": 10
  }
]
```

✅ **POLIMORFISMO FUNCIONANDO!**
- Cada subclasse calcula prioridade diferente
- Lista as contém juntas
- Sorting funciona corretamente

---

## 6️⃣ Teste de Persistência

### ⭐ PROVA DEFINITIVA DE QUE DADOS PERSISTEM

**Passo 1**: Listar OS abertas
```bash
curl http://localhost:8080/ordens-servico/abertas
```
Anote o IDs: **5, 6**

**Passo 2**: **PARAR A APLICAÇÃO**

**Terminal**: Pressione **Ctrl+C**

```
^C
[INFO] BUILD SUCCESS
Application stopped
```

**Aguarde 3 segundos**

**Passo 3**: Verificar no MySQL Workbench

```sql
-- MySQL Workbench
SELECT * FROM ordens_servico WHERE id IN (5, 6);
```

**Esperado**:
```
id | tipo       | status      | descricao     | ...
5  | CORRETIVA  | ABERTA      | Vazamento...  | ...
6  | PREVENTIVA | ABERTA      | Manutenção... | ...
```

✅ **Dados estão no banco de dados MySQL!**

---

**Passo 4**: Reiniciar a Aplicação

**Terminal**:
```bash
mvn spring-boot:run
```

Aguarde até aparecer:
```
Tomcat started on port(s): 8080
Started CmmsApplication in 5.234 seconds
```

**Passo 5**: Listar novamente

```bash
curl http://localhost:8080/ordens-servico/abertas
```

**Esperado**: **OS 5 e 6 CONTINUAM LÁ!**

```json
[
  {
    "id": 5,
    "tipo": "CORRETIVA",
    ...
  },
  {
    "id": 6,
    "tipo": "PREVENTIVA",
    ...
  }
]
```

✅ **PERSISTÊNCIA COMPROVADA!**

---

**Passo 6**: Verificar histórico também persiste

```bash
curl http://localhost:8080/ordens-servico/5/historico
```

**Esperado**: Histórico completo está lá! ✅

---

## 7️⃣ Teste com MySQL Workbench

### Verificação Visual Completa

#### 1) Conectar o Workbench

1. Abra MySQL Workbench
2. Clique na conexão "Local instance"
3. Digite senha (deixar em branco se não tem)

#### 2) Expandir Database

```
• cmms_db
  ├— Tables
  │  ├— tecnicos
  │  ├— equipamentos
  │  ├— ordens_servico
  │  └— historico_status
  └— Views
```

#### 3) Executar SELECTs

**Técnicos**:
```sql
SELECT * FROM cmms_db.tecnicos;
```
Esperado: 6 técnicos (os 5 padrão + nosso novo)

**Equipamentos**:
```sql
SELECT * FROM cmms_db.equipamentos;
```
Esperado: 6 equipamentos

**Ordens de Serviço**:
```sql
SELECT id, tipo_os, status, nivel_criticidade, falha_total 
FROM cmms_db.ordens_servico;
```
Esperado:
```
id | tipo_os    | status | nivel_criticidade | falha_total
1  | CORRETIVA  | ABERTA | 4                 | 1
2  | CORRETIVA  | EM_... | 3                 | 0
3  | PREVENTIVA | ABERTA | NULL              | NULL
...
5  | CORRETIVA  | ABERTA | 4                 | 1
6  | PREVENTIVA | ABERTA | NULL              | NULL
```

**Histórico específico**:
```sql
SELECT * FROM cmms_db.historico_status 
WHERE ordem_servico_id = 5
ORDER BY data_hora DESC;
```
Esperado: Mostra todas as mudanças de status

#### 4) Verificar Constraints

```sql
-- Verificar Foreign Keys
SHOW CREATE TABLE cmms_db.ordens_servico\G

-- Deve mostrar:
CONSTRAINT `ordens_servico_ibfk_1` 
FOREIGN KEY (`tecnico_id`) 
REFERENCES `tecnicos` (`id`) ON DELETE CASCADE
```

#### 5) Verificar Índices

```sql
-- Ver Índices
SHOW INDEX FROM cmms_db.ordens_servico;
```

Esperado: Índices em status, tecnico_id, equipamento_id, etc.

---

## 🎓 Conclusão da Demonstração

### Checklist Final

Após completar todos os testes acima:

- [ ] **CRUD Técnico** - INSERT, SELECT, UPDATE, DELETE ✅
- [ ] **CRUD Equipamento** - INSERT, SELECT, UPDATE, DELETE ✅
- [ ] **CRUD OS** - INSERT (Corretiva e Preventiva), SELECT, UPDATE ✅
- [ ] **Histórico** - Registra mudanças automáticamente ✅
- [ ] **Polimorfismo** - Subclasses calculam prioridades diferentes ✅
- [ ] **Persistência** - Dados no MySQL após restart ✅
- [ ] **API REST** - Todos endpoints funcionam ✅
- [ ] **Banco MySQL** - Visível e verificável no Workbench ✅

**VOCÊ CONSEGUIU DEMONSTRAR TODOS OS CRITÉRIOS ACADÊMICOS!** 🎉

---

## 📸 Prints Esperados para Relatório

Recomendamos capturar screenshots de:

1. Terminal com `mvn spring-boot:run` iniciando ✅
2. Resposta JSON de criação de técnico (POST 201)
3. Lista de técnicos (GET com 6 registros)
4. Atualização de status (PUT 200)
5. **Endpoint `/ordens-servico/abertas` mostrando polimorfismo** ⭐
6. Histórico de uma OS (GET /historico)
7. **MySQL Workbench com SELECT de ordens_servico**
8. Parar a aplicação (Ctrl+C)
9. Reiniciar a aplicação (**restart**)
10. **Listar novamente e confirmar dados persistem**

---

## 🔧 Troubleshooting

### "Connection refused"
```bash
# Verifique se MySQL está rodando
mysql -u root -p
# se conectar = OK
```

### "Table doesn't exist"
```bash
# Verifique se banco foi criado
mysql -u root -p cmms_db -e "SHOW TABLES;"
# Se vazio, execute init_database.sql
```

### "Técnico não está disponível"
```bash
# Certifique que o técnico tem status DISPONIVEL
SELECT status FROM tecnicos WHERE id = 1;
# Se EM_MANUTENCAO ou INDISPONIVEL, atualize:
UPDATE tecnicos SET status = 'DISPONIVEL' WHERE id = 1;
```

### Porta 8080 já em uso
```bash
# Mude a porta em application.yaml:
server:
  port: 8081
```

---

**Versão**: 1.0  
**Data**: Maio de 2026  
**Status**: ✅ Guia Completo e Testado

