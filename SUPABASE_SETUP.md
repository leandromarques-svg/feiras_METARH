# 🔧 Configuração do Supabase - IMPORTANTE

## ⚠️ Ação Necessária: Adicionar Coluna `area`

Para que o campo **"Área"** dos participantes seja salvo corretamente no banco de dados, você precisa executar o script SQL no Supabase.

### Passos:

1. **Acesse o Supabase Dashboard**
   - Vá para: https://supabase.com
   - Faça login no seu projeto

2. **Abra o SQL Editor**
   - No menu lateral, clique em **"SQL Editor"**

3. **Execute o Script**
   - Copie e cole o conteúdo do arquivo `add_area_column.sql`
   - Ou copie este comando:

```sql
ALTER TABLE participantes 
ADD COLUMN IF NOT EXISTS area TEXT;
```

4. **Clique em "Run"** para executar

### Verificação

Após executar o script, você pode verificar se funcionou:

```sql
SELECT * FROM participantes LIMIT 1;
```

A coluna `area` deve aparecer na lista de colunas.

### O que acontece se não executar?

- ❌ A área dos participantes **não será salva** no banco de dados
- ✅ A interface continuará funcionando, mas os dados serão perdidos ao recarregar a página
- ✅ Após executar o script, tudo funcionará perfeitamente

---

## Status Atual

- ✅ Interface preparada para campo "Área"
- ✅ Código atualizado para enviar/receber área
- ⏳ **Aguardando execução do script SQL no Supabase**

---

**Arquivo do script:** `add_area_column.sql`
