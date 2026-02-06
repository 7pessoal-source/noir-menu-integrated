# ⚡ ATIVAÇÃO RÁPIDA - 5 MINUTOS

## 🎯 O que você precisa fazer

Siga estes passos para ativar o Sanity CMS no seu projeto:

---

## ✅ CHECKLIST RÁPIDO

### 1. Instalar Dependências (1 min)

```bash
npm install
```

### 2. Login no Sanity (1 min)

```bash
npm install -g @sanity/cli
sanity login
```

Uma janela abrirá. Faça login com Google/GitHub.

### 3. Inicializar Sanity (2 min)

```bash
sanity init
```

Escolha:
- ✅ Create new project
- ✅ Nome: "noir-menu-teste" (ou nome do cliente)
- ✅ Use default dataset: Yes
- ✅ Output path: ./sanity

**COPIE O PROJECT_ID QUE APARECER!** 📝

### 4. Configurar .env.local (30 seg)

```bash
cp .env.example .env.local
```

Edite `.env.local` e cole seu PROJECT_ID:

```env
VITE_SANITY_PROJECT_ID=abc123xyz  ← cole aqui
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-02-05

SANITY_STUDIO_PROJECT_ID=abc123xyz  ← cole aqui também
SANITY_STUDIO_DATASET=production
```

### 5. Ativar CORS (30 seg)

1. Acesse: https://www.sanity.io/manage
2. Selecione seu projeto
3. API > CORS Origins > Add CORS origin
4. Adicione: `http://localhost:5173`
5. Marque "Allow credentials"
6. Save

### 6. Ativar Sanity no Código (10 seg)

```bash
# Backup do Index.tsx original
mv src/pages/Index.tsx src/pages/Index.backup.tsx

# Usar versão com Sanity
mv src/pages/IndexSanity.tsx src/pages/Index.tsx
```

### 7. Rodar! (imediato)

```bash
# Terminal 1
npm run sanity:dev

# Terminal 2
npm run dev
```

**Sanity Studio:** http://localhost:3333  
**Site:** http://localhost:5173

---

## 🎨 Adicionar Dados

1. Abra http://localhost:3333
2. Clique em "⚙️ Configurações"
3. Preencha:
   - Nome do restaurante
   - WhatsApp: 5511999999999
   - Pedido mínimo: 30

4. Vá em "📂 Categorias" e crie:
   - lanches (order: 0)
   - pizzas (order: 1)
   - porcoes (order: 2)
   - bebidas (order: 3)

5. Vá em "🍽️ Produtos" e adicione alguns produtos!

---

## 🚀 Deploy

### Sanity Studio:

```bash
cd sanity
sanity deploy
# Nome: noir-menu-teste
```

URL: https://noir-menu-teste.sanity.studio

### Site (Vercel):

1. Vá em: https://vercel.com
2. New Project
3. Import Git Repository
4. Add Environment Variables:
   - `VITE_SANITY_PROJECT_ID`
   - `VITE_SANITY_DATASET`
   - `VITE_SANITY_API_VERSION`
5. Deploy!

---

## ⚠️ Se algo der errado

### Site não carrega dados do Sanity?

1. Verifique se `.env.local` existe
2. Verifique se PROJECT_ID está correto
3. Reinicie o servidor (Ctrl+C e `npm run dev`)

### Imagens não aparecem?

1. Configure CORS (passo 5)
2. Adicione também seu domínio da Vercel no CORS

### Erro "Project not found"?

1. Verifique se fez login: `sanity login`
2. Liste projetos: `sanity projects list`
3. Use o ID correto no `.env.local`

---

## 🎁 BÔNUS: Voltar para versão antiga

Se quiser voltar para usar `menuConfig.ts`:

```bash
# Restaurar Index.tsx original
mv src/pages/Index.backup.tsx src/pages/Index.tsx
```

Pronto! O site volta a usar dados hardcoded.

---

## 📞 Para Cada Cliente

```bash
# 1. Novo projeto Sanity
sanity init --project-name "noir-menu-cliente-nome"

# 2. Novo PROJECT_ID → novo .env.local

# 3. Deploy Studio
cd sanity && sanity deploy

# 4. Adicionar cliente no dashboard Sanity
# https://www.sanity.io/manage > Members > Invite

# 5. Deploy site na Vercel com novo PROJECT_ID
```

**Tempo:** 15 minutos por cliente

---

## ✨ Pronto!

Seu cardápio agora é 100% editável!

📖 Documentação completa: [INSTALACAO-COMPLETA.md](./INSTALACAO-COMPLETA.md)
