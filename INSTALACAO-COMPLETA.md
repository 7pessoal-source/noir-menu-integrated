# 🚀 GUIA DE INSTALAÇÃO - SANITY CMS

## ✨ O que foi feito

Seu projeto **Noir Menu** agora está integrado com o **Sanity CMS**!

**O QUE MUDOU:**
- ✅ Clientes podem editar produtos, preços e fotos pelo painel Sanity
- ✅ Seu design permanece 100% igual
- ✅ Dados vêm do Sanity automaticamente
- ✅ Fallback para `menuConfig.ts` caso Sanity não esteja disponível

**O QUE NÃO MUDOU:**
- ✅ Todo o código dos componentes está intacto
- ✅ Carrinho de compras funciona igual
- ✅ Checkout via WhatsApp funciona igual
- ✅ Design, cores, layout - tudo igual!

---

## 📦 INSTALAÇÃO

### 1. Instalar Dependências

```bash
cd noir-menu-integrado
npm install
```

Isso instalará:
- `@sanity/client` - Cliente para buscar dados
- `@sanity/image-url` - Helper para otimizar imagens
- `sanity` - Sanity Studio
- `@sanity/vision` - Ferramenta de queries

---

### 2. Configurar Sanity CLI

```bash
# Instalar CLI globalmente
npm install -g @sanity/cli

# Fazer login
sanity login
```

Uma janela do navegador abrirá. Faça login com:
- Google
- GitHub
- ou Email

---

### 3. Inicializar Projeto Sanity

```bash
# Na raiz do projeto
sanity init

# Quando perguntar:
✅ Create new project
✅ Nome do projeto: "noir-menu-[nome-do-cliente]"
✅ Use default dataset configuration? Yes
✅ Output path: ./sanity (confirmar)
✅ Schema template: Clean project
```

**ANOTE O PROJECT_ID QUE APARECER!** 📝

---

### 4. Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz:

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione seu PROJECT_ID:

```env
VITE_SANITY_PROJECT_ID=abc123xyz  ← seu project id aqui
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-02-05

SANITY_STUDIO_PROJECT_ID=abc123xyz  ← mesmo project id
SANITY_STUDIO_DATASET=production
```

---

### 5. Ativar CORS no Sanity

```bash
# No dashboard do Sanity
# https://www.sanity.io/manage

1. Selecione seu projeto
2. Vá em "API" > "CORS Origins"
3. Clique em "Add CORS origin"
4. Adicione:
   - http://localhost:5173 (desenvolvimento)
   - https://seu-dominio.vercel.app (produção)
5. Marque "Allow credentials"
6. Salve
```

---

### 6. Migrar Dados Existentes (Opcional)

Se você já tem produtos em `menuConfig.ts`, pode migrá-los para o Sanity:

```bash
# Edite o arquivo migrate-data.ts com seus dados
# Depois rode:
node --loader tsx migrate-data.ts
```

Ou adicione manualmente pelo Sanity Studio (próximo passo).

---

### 7. Rodar o Projeto

```bash
# Terminal 1 - Sanity Studio
npm run sanity:dev

# Terminal 2 - Site
npm run dev
```

**Sanity Studio:** http://localhost:3333  
**Site:** http://localhost:5173

---

### 8. Adicionar Dados no Sanity Studio

Acesse http://localhost:3333 e:

1. **⚙️ Configurações**
   - Nome do restaurante
   - Slogan
   - WhatsApp
   - Horários
   - Pedido mínimo

2. **📂 Categorias**
   - lanches
   - pizzas
   - porcoes
   - bebidas

3. **🍽️ Produtos**
   - Nome, descrição, preço
   - Upload de foto
   - Selecione categoria
   - Marque como disponível

4. **🏘️ Bairros**
   - Nome do bairro
   - Taxa de entrega

5. **💳 Formas de Pagamento**
   - Dinheiro, PIX, Cartão

---

## 🌐 DEPLOY

### Deploy do Sanity Studio

```bash
cd sanity
sanity deploy
```

Escolha um nome único:
```
noir-menu-cliente1
```

URL do Studio:
```
https://noir-menu-cliente1.sanity.studio
```

---

### Deploy do Site (Vercel)

1. **Adicione variáveis de ambiente na Vercel:**
   - Settings > Environment Variables
   - Adicione todas as variáveis do `.env.local`

2. **Deploy:**
```bash
git add .
git commit -m "Integração com Sanity CMS"
git push
```

Vercel fará deploy automático!

---

## 🎯 FLUXO DE TRABALHO

### Para CADA Novo Cliente:

```bash
# 1. Criar novo projeto Sanity
sanity init --project-name "noir-menu-cliente-nome"

# 2. Anotar o novo PROJECT_ID

# 3. Deploy do Studio
cd sanity
sanity deploy
# Nome: noir-menu-cliente-nome

# 4. Adicionar cliente como Editor
# No dashboard: https://www.sanity.io/manage
# Members > Invite > email@cliente.com > Role: Editor

# 5. Fazer fork ou novo deploy na Vercel
# Com o novo PROJECT_ID nas env vars

# 6. Enviar para o cliente:
# - URL do site
# - URL do Sanity Studio
# - Login e senha
```

**Tempo:** ~15 minutos por cliente!

---

## 📝 ESTRUTURA DE ARQUIVOS

```
noir-menu-integrado/
├── sanity/                        ← NOVO
│   ├── schemas/
│   │   ├── settings.ts           ← Configurações
│   │   ├── category.ts           ← Categorias
│   │   ├── product.ts            ← Produtos
│   │   ├── neighborhood.ts       ← Bairros
│   │   ├── paymentMethod.ts      ← Pagamentos
│   │   └── index.ts
│   ├── sanity.config.ts
│   └── sanity.cli.ts
│
├── src/
│   ├── lib/
│   │   └── sanity.ts             ← NOVO - Cliente + Types
│   ├── hooks/
│   │   └── useSanityMenu.ts      ← NOVO - Hook principal
│   ├── pages/
│   │   ├── Index.tsx             ← ORIGINAL (não foi tocado)
│   │   └── IndexSanity.tsx       ← NOVO - Versão com Sanity
│   └── config/
│       └── menuConfig.ts         ← Agora é FALLBACK
│
├── .env.example                   ← NOVO
└── package.json                   ← Atualizado com deps
```

---

## 🔄 ATIVAR SANITY NO PROJETO

### Opção 1: Substituir Index.tsx (Recomendado)

```bash
# Backup do original
mv src/pages/Index.tsx src/pages/Index.backup.tsx

# Usar versão com Sanity
mv src/pages/IndexSanity.tsx src/pages/Index.tsx
```

### Opção 2: Usar as duas versões

Mantenha ambas e escolha qual usar editando `App.tsx`:

```typescript
// Use IndexSanity para versão com CMS
import Index from "./pages/IndexSanity";

// Ou use Index original para versão hardcoded
import Index from "./pages/Index";
```

---

## 💡 FALLBACK AUTOMÁTICO

Se o Sanity falhar por qualquer motivo:
- ✅ O site NÃO quebra
- ✅ Usa dados de `menuConfig.ts` automaticamente
- ✅ Tudo continua funcionando

Isso garante que o cliente nunca vê erro!

---

## 🎨 MANTENDO SEU DESIGN

**IMPORTANTE:** Nenhum componente visual foi alterado!

Os componentes originais continuam funcionando:
- `Header.tsx` ✅
- `ProductGrid.tsx` ✅
- `Cart.tsx` ✅
- `Checkout.tsx` ✅
- `CategoryFilter.tsx` ✅

O Sanity apenas **fornece os dados** para esses componentes.

---

## 🆘 PROBLEMAS COMUNS

### Erro: "Project ID not found"
**Solução:** Verifique se o `.env.local` existe e tem o PROJECT_ID correto

### Erro: "CORS error"
**Solução:** Adicione seu domínio nas configurações de CORS do Sanity

### Imagens não aparecem
**Solução:** Verifique se fez upload das imagens no Sanity Studio

### Site mostra dados do menuConfig.ts
**Solução:** 
1. Verifique se o .env.local está configurado
2. Verifique se rodou `npm install`
3. Reinicie o servidor (`npm run dev`)

---

## 📞 TEMPLATE PARA O CLIENTE

```
Olá [Nome]!

Seu cardápio digital está pronto! 🎉

🌐 SEU SITE: https://[seu-site].vercel.app
📝 PAINEL ADMIN: https://noir-menu-[nome].sanity.studio

COMO ACESSAR:
1. Clique no link do Painel Admin
2. Faça login com seu email
3. Você pode editar:
   - Produtos (nome, preço, foto)
   - Bairros que atende
   - Horários de funcionamento
   - E muito mais!

As mudanças aparecem no site INSTANTANEAMENTE! ⚡

Qualquer dúvida, me chame!
```

---

## ✅ CHECKLIST FINAL

- [ ] `npm install` executado
- [ ] `sanity login` feito
- [ ] `sanity init` executado
- [ ] `.env.local` criado e configurado
- [ ] CORS configurado no dashboard Sanity
- [ ] Dados adicionados no Sanity Studio
- [ ] Site rodando em localhost:5173
- [ ] Studio rodando em localhost:3333
- [ ] Deploy do Studio feito
- [ ] Deploy do site na Vercel
- [ ] Variáveis de ambiente configuradas na Vercel

---

**🎉 Pronto! Seu cardápio agora é 100% editável pelo cliente!**

Qualquer dúvida, consulte os arquivos:
- `WORKFLOW-VENDAS.md` - Como vender para clientes
- `README.md` - Documentação geral
- `GUIA-VISUAL.md` - Interface do Sanity
