# Guia de Testes - Funcionalidade de UPDATE (PUT)

## 📋 Resumo

Este guia demonstra como usar os endpoints PUT (UPDATE) implementados para **Técnicos** e **Ordens de Serviço**.

---

## 🔧 BACKEND - Endpoints HTTP

### 1. Atualizar Técnico

#### Endpoint:
```
PUT /tecnico/{id}
```

#### Exemplos de Requisições:

**Exemplo 1: Atualizar apenas o nome do técnico**
```http
PUT http://localhost:8080/tecnico/1
Content-Type: application/json

{
  "nome": "João Silva Atualizado",
  "email": null,
  "telefone": null,
  "especialidade": null,
  "status": null,
  "setor": null
}
```

**Exemplo 2: Atualizar vários campos**
```http
PUT http://localhost:8080/tecnico/1
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao.silva@company.com",
  "telefone": "11987654321",
  "especialidade": "Elétrica",
  "status": "DISPONIVEL",
  "setor": "Manutenção"
}
```

#### Resposta (200 OK):
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao.silva@company.com",
  "telefone": "11987654321",
  "especialidade": "Elétrica",
  "status": "DISPONIVEL",
  "setor": "Manutenção",
  "dataCadastro": "2024-01-15",
  "ativo": true
}
```

#### Respostas de Erro:
- **404 Not Found**: Técnico não encontrado
- **400 Bad Request**: Dados inválidos

---

### 2. Atualizar Ordem de Serviço

#### Endpoint:
```
PUT /ordens-servico/{id}
```

#### Exemplos de Requisições:

**Exemplo 1: Atualizar apenas a descrição**
```http
PUT http://localhost:8080/ordens-servico/5
Content-Type: application/json

{
  "descricao": "Manutenção preventiva do compressor principal",
  "status": null,
  "tecnicoId": null,
  "observacoes": null
}
```

**Exemplo 2: Atualizar status e descrição**
```http
PUT http://localhost:8080/ordens-servico/5
Content-Type: application/json

{
  "descricao": "Manutenção realizada com sucesso",
  "status": "CONCLUIDA",
  "tecnicoId": null,
  "observacoes": "Compressor funcionando perfeitamente"
}
```

**Exemplo 3: Atualizar técnico responsável**
```http
PUT http://localhost:8080/ordens-servico/5
Content-Type: application/json

{
  "descricao": null,
  "status": null,
  "tecnicoId": 2,
  "observacoes": "Transferência de técnico"
}
```

**Exemplo 4: Atualizar todos os campos**
```http
PUT http://localhost:8080/ordens-servico/5
Content-Type: application/json

{
  "descricao": "Manutenção completa do equipamento X",
  "status": "EM_ANDAMENTO",
  "tecnicoId": 3,
  "observacoes": "Iniciado agora, previsão 4 horas"
}
```

#### Resposta (200 OK):
```json
{
  "id": 5,
  "tipo": "CORRETIVA",
  "equipamentoId": 2,
  "tecnicoId": 3,
  "descricao": "Manutenção completa do equipamento X",
  "status": "EM_ANDAMENTO",
  "dataAbertura": "2024-04-20T10:30:00",
  "dataConclusao": null,
  "setor": "Produção"
}
```

#### Respostas de Erro:
- **404 Not Found**: Ordem não encontrada
- **400 Bad Request**: Técnico não disponível ou dados inválidos

---

## 🌐 FRONTEND - Usando a Interface

### 1. Editar Técnico

#### No arquivo `pages/tecnicos/tecnicos.html`:
- Clique no botão **✏️ Editar** em um cartão de técnico
- Um modal se abrirá com os campos:
  - ID (somente leitura)
  - Nome
  - Email
  - Telefone
  - Especialidade
  - Setor
  - Status (dropdown)
- Modifique os campos desejados
- Clique em **💾 Salvar**

#### Função JavaScript correspondente:
```javascript
// Em pages/tecnicos/tecnicos.js
export async function atualizarTecnico(tecnicoId, dados) {
    return await fazerRequisicao(
        `/tecnico/${tecnicoId}`,
        'PUT',
        dados
    );
}
```

---

### 2. Editar Ordem de Serviço

#### No arquivo `pages/ordens/ordens.html`:
- Clique no botão **✏️ Editar** em um cartão de ordem
- Um modal se abrirá com os campos:
  - ID (somente leitura)
  - Status (dropdown)
  - Prioridade (dropdown)
  - Descrição (texto longo)
  - Data Abertura (somente leitura)
  - Data Fechamento (data)
- Modifique os campos desejados
- Clique em **💾 Salvar**

#### Função JavaScript correspondente:
```javascript
// Em pages/ordens/ordens.js
export async function atualizarOS(ordemId, dados) {
    return await fazerRequisicao(
        `/ordens-servico/${ordemId}`,
        'PUT',
        dados
    );
}
```

---

## 📝 Exemplos com cURL

### Técnico:
```bash
# Atualizar técnico com ID 1
curl -X PUT http://localhost:8080/tecnico/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Novo Nome",
    "email": "novo@email.com",
    "telefone": "11987654321",
    "especialidade": "Hidráulica",
    "status": "DISPONIVEL",
    "setor": "Manutenção"
  }'
```

### Ordem de Serviço:
```bash
# Atualizar OS com ID 5
curl -X PUT http://localhost:8080/ordens-servico/5 \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Manutenção concluída com sucesso",
    "status": "CONCLUIDA",
    "tecnicoId": 2,
    "observacoes": "Tudo funcionando perfeitamente"
  }'
```

---

## ✅ Validações Implementadas

### Backend:
- ✅ **Técnico não encontrado**: Retorna 404
- ✅ **Técnico indisponível**: Retorna 400 ao atribuir OS a técnico inativo
- ✅ **Ordem não encontrada**: Retorna 404
- ✅ **Status atualizado**: Registra no histórico automaticamente
- ✅ **Histórico de mudanças**: Todas as alterações de status são registradas

### Frontend:
- ✅ **Validação de campos vazios**: Aviso ao usuário
- ✅ **Tratamento de erros**: Mensagens de toast
- ✅ **Recarregamento automático**: Lista atualiza após sucesso
- ✅ **Modais com confirmação**: Confirma ação antes de salvar

---

## 🧪 Passos para Testar

### Teste 1: Atualizar Técnico via Frontend
1. Abra o sistema em `http://localhost:8080/frontend/index.html`
2. Vá para a aba **Técnicos**
3. Clique em **✏️ Editar** de um técnico
4. Mude o nome para "Técnico Teste"
5. Clique em **💾 Salvar**
6. Verifique se a lista foi atualizada

### Teste 2: Atualizar OS via Frontend
1. Vá para a aba **Ordens de Serviço**
2. Clique em **✏️ Editar** de uma ordem
3. Mude o status para "EM_ANDAMENTO"
4. Mude a descrição
5. Clique em **💾 Salvar**
6. Verifique se a lista foi atualizada

### Teste 3: Atualizar via API (cURL/Postman)
1. Abra Postman
2. Crie uma requisição PUT para `http://localhost:8080/tecnico/1`
3. No body (raw JSON), envie:
```json
{
  "nome": "João Teste",
  "email": "joao@teste.com",
  "especialidade": "Testes",
  "status": "DISPONIVEL"
}
```
4. Envie e verifique o resultado

### Teste 4: Testar Validações
1. Tente atualizar uma OS com um técnico que não existe
2. Esperado: Erro 404
3. Tente atualizar uma OS que não existe
4. Esperado: Erro 404

---

## 📚 Arquivos Modificados/Criados

### Backend:
- ✅ `DadosAtualizacaoOrdemServico.java` - Novo DTO para atualização
- ✅ `OrdemServico.java` - Adicionado método `atualizarInformacoes()`
- ✅ `OrdemServicoService.java` - Adicionado método `atualizarInformacoes()`
- ✅ `OrdemServicoController.java` - Adicionado endpoint `PUT /ordens-servico/{id}`
- ✅ `TecnicoController.java` - Adicionado endpoint `PUT /tecnico/{id}`

### Frontend:
- ✅ `api.js` - Já contém `atualizarTecnico()` e `atualizarOS()`
- ✅ `pages/tecnicos/tecnicos.js` - Funções de edição já implementadas
- ✅ `pages/ordens/ordens.js` - Funções de edição já implementadas
- ✅ `modal.js` - Gerenciamento de modais funcionando
- ✅ `utils.js` - Utilitários gerais

---

## 🔐 Segurança

- ✅ Validação de ID obrigatório
- ✅ Tratamento de erros com try-catch
- ✅ Verificação de disponibilidade de técnico
- ✅ Registro de histórico de mudanças
- ✅ Transações ACID garantidas

---

## 🐛 Troubleshooting

### Problema: "Técnico não encontrado"
**Solução**: Verifique se o ID existe no banco de dados

### Problema: "Técnico não está disponível"
**Solução**: O técnico tem status INDISPONÍVEL. Atualize o status antes.

### Problema: Modal não fecha após salvar
**Solução**: Verifique se `fecharModal()` está sendo chamado

### Problema: Página não recarrega após atualização
**Solução**: Verifique se `recarregarTecnicos()` ou `recarregarOrdens()` está sendo chamado

---

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- Backend: Classes Service e Controller
- Frontend: `pages/*/**.js` e `js/api.js`
- Banco de Dados: `db/migration/init_database.sql`
