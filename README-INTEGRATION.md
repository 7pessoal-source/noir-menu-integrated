# Integração Noir Menu + Supabase

Este projeto integra o cardápio digital com um painel administrativo usando Supabase.

## Estrutura do Banco de Dados (Supabase)

Para que o projeto funcione corretamente, você deve criar as seguintes tabelas no seu projeto Supabase:

### 1. Categorias (`categories`)
- `id`: uuid (primary key, default: gen_random_uuid())
- `name`: text
- `order`: int4
- `created_at`: timestamptz (default: now())

### 2. Produtos (`products`)
- `id`: uuid (primary key, default: gen_random_uuid())
- `name`: text
- `description`: text
- `price`: float8
- `category_id`: uuid (foreign key para `categories.id`)
- `image_url`: text
- `available`: bool (default: true)
- `created_at`: timestamptz (default: now())

### 3. Configurações (`settings`)
- `id`: uuid (primary key, default: gen_random_uuid())
- `restaurant_name`: text
- `tagline`: text
- `whatsapp_number`: text
- `minimum_order`: float8
- `is_open`: bool (default: true)
- `open_time`: text
- `close_time`: text
- `working_days`: text
- `closed_message`: text
- `estimated_time`: text
- `updated_at`: timestamptz (default: now())

### 4. Bairros (`neighborhoods`)
- `id`: uuid (primary key, default: gen_random_uuid())
- `name`: text
- `delivery_fee`: float8
- `created_at`: timestamptz (default: now())

### 5. Storage
Crie um bucket público chamado `product-images` para armazenar as fotos dos produtos.

## Acesso ao Painel
- URL: `/admin`
- Login: Requer criação de conta em `/admin/signup` (ou use o sistema de Auth do Supabase).

## Sincronização em Tempo Real
O cardápio utiliza o recurso de Realtime do Supabase. Certifique-se de habilitar o "Realtime" para as tabelas `products`, `categories` e `settings` no painel do Supabase (Database -> Replication -> Enable Realtime).
