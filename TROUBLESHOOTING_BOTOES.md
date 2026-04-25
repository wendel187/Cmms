# 🔧 TROUBLESHOOTING - Botões de Editar e Deletar

## 🆘 Problemas Comuns e Soluções

---

### ❌ Problema 1: Botões não aparecem nos cards

**Sintomas:**
- Os cards aparecem mas sem os botões ✏️ e 🗑️
- Apenas os textos de detalhes aparecem

**Possíveis Causas:**
1. Arquivo `app.js` não foi atualizado
2. Navegador em cache (precisa limpar)
3. Erro JavaScript que impede renderização

**Soluções:**

✅ **Solução 1: Limpar Cache do Navegador**
```
1. Pressione Ctrl+Shift+Delete (ou Cmd+Shift+Delete no Mac)
2. Selecione "Arquivos em cache" ou "Imagens e arquivos em cache"
3. Clique "Limpar dados"
4. Recarregue a página (Ctrl+R)
```

✅ **Solução 2: Recarregar com bypass de cache**
```
Pressione: Ctrl+Shift+R (ou Cmd+Shift+R no Mac)
```

✅ **Solução 3: Verificar se o arquivo foi salvo**
```
1. Abra DevTools (F12)
2. Vá para "Sources" ou "Fontes"
3. Procure por "app.js"
4. Procure por "abrirEditarTecnico" (Ctrl+F)
5. Deve aparecer a função definida
```

**Se o problema persiste:**
```
1. Verifique se frontend/js/app.js realmente contém as funções
2. Verifique a console do DevTools (F12 > Console)
3. Procure por erros em vermelho
```

---

### ❌ Problema 2: Botões aparecem mas não funcionam ao clicar

**Sintomas:**
- Os botões estão visíveis
- Ao clicar, nada acontece
- Sem mensagem de erro

**Possíveis Causas:**
1. Funções não foram definidas globalmente
2. ID do técnico/ordem não está sendo passado
3. Erro JavaScript silencioso

**Soluções:**

✅ **Solução 1: Verificar se as funções existem**
```
1. Abra DevTools (F12)
2. Vá para a aba Console
3. Digite: abrirEditarTecnico
4. Pressione Enter
5. Deve aparecer: ƒ abrirEditarTecnico(tecnicoId) { ... }
6. Se aparecer "undefined", a função não foi carregada
```

✅ **Solução 2: Verificar se o onclick está correto**
```
1. Clique com botão direito no botão "✏️ Editar"
2. Selecione "Inspecionar" ou "Inspect"
3. Procure por: onclick="abrirEditarTecnico(..."
4. O número deve estar ali: abrirEditarTecnico(1) ou abrirEditarTecnico(5)
```

✅ **Solução 3: Testar manualmente no console**
```
1. Abra DevTools (F12)
2. Console
3. Digite: abrirEditarTecnico(1)
4. Pressione Enter
5. Deve navegar para "Atualizar Técnico"
```

**Se continuar sem funcionar:**
```
1. Recarregue a página completamente (Ctrl+F5)
2. Verifique se há erros no console (abas vermelhas)
3. Se houver erro, copie e compartilhe
```

---

### ❌ Problema 3: Ao clicar em "Editar", não leva à aba correta

**Sintomas:**
- Clica em "✏️ Editar"
- Aba não muda
- Fica na mesma página

**Possíveis Causas:**
1. Função `mudarAba()` não existe
2. ID da aba está errado
3. Erro no javascript

**Soluções:**

✅ **Verificar a função mudarAba**
```
1. DevTools > Console
2. Digite: mudarAba('atualizar-tecnico')
3. Pressione Enter
4. Deve navegar para a aba "Atualizar Técnico"
```

✅ **Verificar se a aba existe**
```
1. DevTools > Inspector/Elements
2. Procure por: id="atualizar-tecnico-tab"
3. Deve estar visível no HTML
```

✅ **Se não funcionar, teste o fluxo manual**
```
1. Clique manualmente na aba "✏️ Atualizar Técnico"
2. Clique no dropdown "Selecionar Técnico"
3. Escolha um técnico
4. O formulário deve preencher
5. Se funcionar manualmente, o problema é na navegação automática
```

---

### ❌ Problema 4: Formulário não preenche com os dados

**Sintomas:**
- Clica em "✏️ Editar"
- Vai para a aba correta
- Técnico selecionado
- Mas os campos (Nome, Email, etc) estão vazios

**Possíveis Causas:**
1. Função `carregarDadosTecnico()` com erro
2. API retorna erro ou dados vazios
3. Tecnologia CORS ou rede bloqueada

**Soluções:**

✅ **Verificar se a API responde**
```
1. DevTools > Network
2. Clique em "✏️ Editar" de um técnico
3. Procure por uma requisição GET para /tecnico/...
4. Clique nela
5. Vá para "Response"
6. Deve aparecer os dados do técnico em JSON
```

✅ **Se a requisição não aparece**
```
1. Verifique se o backend está rodando
2. Tente acessar: http://localhost:8080/tecnico/1
3. Deve retornar dados JSON com informações do técnico
4. Se der erro, o backend não está respondendo
```

✅ **Se retorna dados mas não preenche**
```
1. DevTools > Console
2. Digite: carregarDadosTecnico(1)
3. Pressione Enter
4. Verifique se aparece erro
5. Se houver erro, significa que o ID dos campos está errado
```

---

### ❌ Problema 5: Deletar não pede confirmação

**Sintomas:**
- Clica em "🗑️ Deletar"
- Nenhum dialog de confirmação aparece
- Técnico é deletado direto (ou nada acontece)

**Possíveis Causas:**
1. Função `abrirDeletarTecnico()` não foi carregada
2. Função `confirm()` está desativada no navegador

**Soluções:**

✅ **Solução 1: Verificar se a função existe**
```
1. DevTools > Console
2. Digite: abrirDeletarTecnico
3. Deve aparecer a função
4. Se aparecer "undefined", não foi carregada
```

✅ **Solução 2: Testar confirm() manualmente**
```
1. DevTools > Console
2. Digite: confirm('Teste')
3. Pressione Enter
4. Deve aparecer um dialog
5. Se não aparecer, o navegador bloqueou confirm()
```

✅ **Solução 3: Verificar se há bloqueador de popup**
```
1. Verifique se tem extensão bloqueando popups
2. Desabilite temporariamente
3. Tente novamente
```

---

### ❌ Problema 6: Deletar dá erro "técnico não encontrado"

**Sintomas:**
- Clica em "🗑️ Deletar"
- Confirma
- Aparece erro: "❌ Erro ao desativar técnico"

**Possíveis Causas:**
1. Técnico já foi deletado
2. Intervalo de rede ou servidor
3. ID incorreto sendo passado

**Soluções:**

✅ **Solução 1: Recarregar a página**
```
1. Pressione F5 ou Ctrl+R
2. Tente deletar de novo
```

✅ **Solução 2: Verificar se o backend está respondendo**
```
1. DevTools > Network
2. Clique em "🗑️ Deletar"
3. Procure por requisição DELETE
4. Verifique o status (200 = sucesso, 404 = não encontrado)
```

✅ **Solução 3: Verificar logs do backend**
```
Terminal onde está rodando:
mvn spring-boot:run

Procure por erro com o ID do técnico
```

---

### ❌ Problema 7: Aparecem múltiplos botões em cada card

**Sintomas:**
- Vários [✏️ Editar] [🗑️ Deletar] em um único card
- Cards muito grandes

**Possíveis Causas:**
1. Renderização duplicada
2. Cache não foi limpo
3. Função chamada múltiplas vezes

**Soluções:**

✅ **Solução 1: Limpar cache**
```
Ctrl+Shift+Delete > Limpar dados > Recarregar (Ctrl+R)
```

✅ **Solução 2: Reiniciar o frontend**
```
1. Pare o servidor (Ctrl+C no terminal)
2. Aguarde 5 segundos
3. Reinicie: python server.py
4. Acesse novamente
```

---

### ❌ Problema 8: Ao clicar em editar, diz "Selecione um técnico"

**Sintomas:**
- Clica em "✏️ Editar"
- Vai para "Atualizar Técnico"
- Tentativa de editar retorna erro: "Selecione um técnico primeiro"

**Possíveis Causas:**
1. Dropdown de técnicos está vazio
2. Técnico não foi selecionado automaticamente
3. Índice do select está errado

**Soluções:**

✅ **Solução 1: Verificar se o dropdown tem técnicos**
```
1. Vá manualmente para "Atualizar Técnico"
2. Clique no dropdown "Selecionar Técnico"
3. Deve aparecer lista de técnicos
4. Se vazio, problema é no carregamento de técnicos
```

✅ **Solução 2: Carregar técnicos manualmente**
```
1. DevTools > Console
2. Digite: carregarTecnicos()
3. Pressione Enter
4. Aguarde alguns segundos
5. Recarregue a página
```

✅ **Solução 3: Verificar se a API de técnicos funciona**
```
1. Abra em nova aba: http://localhost:8080/tecnico?page=0&size=100
2. Deve aparecer JSON com lista de técnicos
3. Se vazio ou erro, problema é no backend
```

---

## 📊 Diagnóstico Rápido

### Checklist de Debug:

```
□ Botões aparecem?
  └─ NÃO → Limpar cache (Ctrl+Shift+Delete)
  └─ SIM → Próximo

□ Ao clicar, algo acontece?
  └─ NÃO → DevTools > Console > abrirEditarTecnico
  └─ SIM → Próximo

□ Leva à aba correta?
  └─ NÃO → Verificar mudarAba() em Console
  └─ SIM → Próximo

□ Formulário preenche?
  └─ NÃO → DevTools > Network > Verificar GET /tecnico/{id}
  └─ SIM → Próximo

□ Consegue salvar?
  └─ NÃO → Verificar PUT em Network
  └─ SIM → ✅ TUDO FUNCIONA!
```

---

## 🆘 Se Nada Disso Funcionar

**Passos de último recurso:**

```bash
# 1. Recarregar tudo
Ctrl+Shift+Delete (limpar cache)
Ctrl+F5 (recarregar forçado)

# 2. Reiniciar servidor
Ctrl+C (no terminal do backend)
mvn spring-boot:run (no diretório Cmms/)

# 3. Reiniciar frontend
Ctrl+C (no terminal do frontend)
python server.py (ou npm start)

# 4. Abrir em outro navegador
Firefox, Chrome, Edge, Safari - tente um diferente

# 5. Verificar arquivo foi salvo
cat frontend/js/app.js | grep "abrirEditarTecnico"
Deve aparecer a função

# 6. Procurar erros no console
DevTools > F12 > Console
Copie qualquer erro em vermelho
```

---

## 📞 Informações para Suporte

Se precisar reportar um erro, forneça:

```
1. Navegador: Chrome/Firefox/Safari/Edge
2. Versão: Ex: Chrome 90.0
3. OS: Windows/Mac/Linux
4. Erro exato (copie do console)
5. Passos para reproduzir
6. Print da tela (se possível)
```

---

## ✅ Tudo Funcionando?

Se conseguiu completar todos os testes sem erros, parabéns! 🎉

A implementação está funcionando corretamente!

**Próximos passos:**
- Use a funcionalidade no seu dia a dia
- Reporte qualquer bug encontrado
- Sugira melhorias se necessário

---

**Documento de Troubleshooting**
**Data:** 25 de abril de 2026
**Versão:** 1.0
