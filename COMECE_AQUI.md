# 🎯 COMEÇAR AQUI - Primeiro Acesso

Bem-vindo! Este guia te ajuda a rodar a aplicação CMMS em menos de 5 minutos.

## ⚡ Forma Mais Rápida (Windows)

### 1. Abra o terminal na pasta do projeto
```
cd "c:\Users\ta020\OneDrive\Área de Trabalho\Prog_Objetos\Cmms"
```

### 2. Execute o script de inicialização
```
start.cmd
```

### 3. Aguarde a aplicação iniciar
- Terminal 1 abrirá o Backend (Spring Boot)
- Terminal 2 abrirá o Frontend (React)

### 4. Acesse no navegador
```
http://localhost:3000
```

✅ **Pronto!** Você verá o Dashboard com estatísticas de equipamentos.

---

## 🐧 Para Linux/Mac

```bash
cd ~/Downloads/Prog_Objetos/Cmms
bash start.sh
```

---

## 🛠️ Se o Script Não Funcionar - Abra Manualmente

### Terminal 1 - Backend

```bash
cd Cmms
./mvnw.cmd spring-boot:run
```

Você deve ver no terminal:
```
Started CmmsApplication in 5.2 seconds
```

### Terminal 2 - Frontend

```bash
cd frontend
npm install  # Só primeira vez
npm run dev
```

Você deve ver:
```
VITE v5.0.0  ready in XX ms

Local:    http://localhost:3000/
```

---

## 🌐 O Que Você Verá

### Dashboard (http://localhost:3000/)
Estatísticas de equipamentos:
- Total de equipamentos
- Equipamentos ativos
- Equipamentos inativos

### Equipamentos (http://localhost:3000/equipamentos)
Tabela com:
- ID
- Nome
- Código
- Status (verde=ativo, vermelho=inativo)
- Paginação

---

## ❓ Problemas Comuns

### "npm: command not found"
**Instale Node.js:** https://nodejs.org/ (escolha LTS)

### Backend não conecta
1. Abra segundo terminal
2. Execute: `cd Cmms && ./mvnw.cmd spring-boot:run`
3. Aguarde "Started CmmsApplication"

### CORS Error
Verifique se `CorsConfig.java` está em:
```
Cmms/src/main/java/com/example/Cmms/config/CorsConfig.java
```

### Tabela vazia
Seus equipamentos devem ter `status = 'ATIVO'`

---

## 📚 Documentação Completa

Leia após conseguir rodar:

| Arquivo | Propósito |
|---------|-----------|
| [QUICK_START.md](./QUICK_START.md) | Visão geral com diagramas |
| [ARCHITECTURE_OVERVIEW.md](./ARCHITECTURE_OVERVIEW.md) | Arquitetura completa |
| [GUIA_INTEGRACAO.md](./GUIA_INTEGRACAO.md) | Como integrar |
| [DTOS_E_RESPOSTAS.md](./DTOS_E_RESPOSTAS.md) | Estrutura de dados |
| [CHECKLIST_IMPLEMENTACAO.md](./CHECKLIST_IMPLEMENTACAO.md) | Checklist |

---

## 🎨 Estrutura do Projeto

```
├── Cmms/                    Backend (Spring Boot)
│   └── src/main/java/.../   Código-fonte Java
│
├── frontend/                Frontend (React)
│   ├── src/                 Código-fonte React
│   ├── package.json         Dependências
│   └── vite.config.js       Configuração
│
├── QUICK_START.md          👈 Leia agora
├── GUIA_INTEGRACAO.md
└── ... (mais docs)
```

---

## ✨ Funcionalidades

- ✅ Listar equipamentos com paginação
- ✅ Ver estatísticas no dashboard
- ✅ Interface responsiva e bonita
- ✅ Tratamento de erros
- ✅ Loading states

---

## 🚀 Próximos Passos

1. **Rode a aplicação** (veja acima)
2. **Explore os menus** (Dashboard e Equipamentos)
3. **Leia a documentação** (quando tiver dúvidas)
4. **Aproveite!** 🎉

---

**Tudo funcionando? Ótimo!**

Se tiver dúvidas: leia [QUICK_START.md](./QUICK_START.md) ou check Dev Tools (F12).
