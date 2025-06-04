# Guia de Configuração do FinançasPro

Este guia fornece instruções detalhadas para configurar o FinançasPro em ambiente de desenvolvimento e produção.

## Índice

1. [Configuração do Repositório GitHub](#configuração-do-repositório-github)
2. [Configuração do MongoDB Atlas](#configuração-do-mongodb-atlas)
3. [Configuração do Vercel](#configuração-do-vercel)
4. [Configuração do Mercado Pago](#configuração-do-mercado-pago)
5. [Variáveis de Ambiente](#variáveis-de-ambiente)
6. [Execução Local](#execução-local)
7. [Implantação em Produção](#implantação-em-produção)

## Configuração do Repositório GitHub

### Passo 1: Criar o Repositório

1. Acesse sua conta GitHub (https://github.com/karladaiany)
2. Clique no botão "New" para criar um novo repositório
3. Nome do repositório: `financas-pro`
4. Descrição: `Plataforma de Gestão Financeira Familiar`
5. Visibilidade: Privado (recomendado para dados sensíveis)
6. Inicialize com um README: Não (vamos fazer upload dos arquivos)
7. Clique em "Create repository"

### Passo 2: Upload dos Arquivos

**Método 1: Usando a Interface Web do GitHub**

1. No repositório recém-criado, clique no botão "Add file" > "Upload files"
2. Arraste todos os arquivos e pastas do projeto ou selecione-os do seu computador
3. Adicione uma mensagem de commit: "Configuração inicial do projeto"
4. Clique em "Commit changes"

**Método 2: Usando Git na Linha de Comando (Recomendado)**

```bash
# Clone o repositório vazio
git clone https://github.com/karladaiany/financas-pro.git

# Entre no diretório do repositório
cd financas-pro

# Copie todos os arquivos do projeto para este diretório

# Adicione os arquivos ao Git
git add .

# Faça o commit inicial
git commit -m "Configuração inicial do projeto"

# Envie para o GitHub
git push origin main
```

## Configuração do MongoDB Atlas

### Passo 1: Criar uma Conta e Cluster

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Registre-se com o e-mail: karllinhadeoliveira@live.com
3. Escolha "Create a Free Cluster" (plano M0, gratuito)
4. Selecione um provedor de nuvem (AWS recomendado) e uma região próxima ao Brasil
5. Clique em "Create Cluster" (a criação pode levar alguns minutos)

### Passo 2: Configurar Segurança

1. No menu lateral, vá para "Database Access"
2. Clique em "Add New Database User"
3. Username: `financas_admin` (ou outro de sua preferência)
4. Password: Gere uma senha forte e segura
5. Database User Privileges: "Read and Write to any database"
6. Clique em "Add User"

### Passo 3: Configurar Acesso à Rede

1. No menu lateral, vá para "Network Access"
2. Clique em "Add IP Address"
3. Para desenvolvimento, você pode selecionar "Allow Access from Anywhere" (0.0.0.0/0)
4. Para produção, restrinja aos IPs do Vercel (será configurado automaticamente)
5. Clique em "Confirm"

### Passo 4: Obter a String de Conexão

1. No dashboard, clique em "Connect"
2. Selecione "Connect your application"
3. Escolha "Node.js" como driver e a versão mais recente
4. Copie a string de conexão (será usada nas variáveis de ambiente)
5. Substitua `<password>` pela senha do usuário criado

## Configuração do Vercel

### Passo 1: Conectar ao GitHub

1. Acesse [Vercel](https://vercel.com/) e faça login
2. Vá para "Add New..." > "Project"
3. Selecione o repositório `financas-pro`
4. Configure o projeto:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Passo 2: Configurar Variáveis de Ambiente

1. Na seção "Environment Variables", adicione todas as variáveis listadas na seção [Variáveis de Ambiente](#variáveis-de-ambiente) deste documento
2. Certifique-se de usar os valores de produção, especialmente para as chaves de API e strings de conexão

### Passo 3: Configurar Domínio Personalizado

1. Após a implantação, vá para "Settings" > "Domains"
2. O subdomínio padrão será algo como `financas-pro-xxxx.vercel.app`
3. Você pode personalizar para `kfinancepro.vercel.app` se estiver disponível

## Configuração do Mercado Pago

### Passo 1: Criar uma Conta de Desenvolvedor

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Crie uma conta ou faça login com sua conta existente
3. Vá para o [Dashboard de Desenvolvedores](https://www.mercadopago.com.br/developers/panel)

### Passo 2: Criar uma Aplicação

1. No Dashboard, clique em "Criar aplicação"
2. Nome da aplicação: "FinançasPro"
3. Selecione os produtos: "Checkout Pro" e "API de Assinaturas"
4. URL de redirecionamento: `https://kfinancepro.vercel.app/api/payment/callback`
5. Clique em "Criar aplicação"

### Passo 3: Obter Credenciais

1. Na página da aplicação criada, vá para a aba "Credenciais"
2. Copie o "Access Token" e o "Public Key"
3. Estas credenciais serão usadas nas variáveis de ambiente

### Passo 4: Configurar Webhook

1. Na página da aplicação, vá para a aba "Webhooks"
2. Adicione uma URL de notificação: `https://kfinancepro.vercel.app/api/payment/webhook`
3. Selecione os tópicos: "merchant_order", "payment" e "subscription"

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
# Ambiente
NODE_ENV=development # ou production

# Servidor
PORT=3000
API_URL=http://localhost:3000 # Em produção: https://kfinancepro.vercel.app

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/financas-pro?retryWrites=true&w=majority

# JWT (Autenticação)
JWT_SECRET=sua_chave_secreta_muito_segura_e_longa
JWT_EXPIRATION=7d
REFRESH_TOKEN_SECRET=outra_chave_secreta_muito_segura_e_longa
REFRESH_TOKEN_EXPIRATION=30d

# Criptografia
ENCRYPTION_KEY=chave_de_32_caracteres_para_aes256

# Mercado Pago
MP_ACCESS_TOKEN=TEST-0000000000000000-000000-00000000000000000000000000000000-000000000
MP_PUBLIC_KEY=TEST-00000000-0000-0000-0000-000000000000

# Email (para convites e notificações)
EMAIL_SERVICE=gmail # ou outro serviço
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_de_app_do_gmail

# Configurações de Negócio
TRIAL_DAYS=7
SUBSCRIPTION_PRICE=30.00
DATA_RETENTION_DAYS=90
```

Para produção, crie um arquivo `.env.production` com as variáveis adequadas ao ambiente de produção.

## Execução Local

### Backend

```bash
# Entre no diretório do backend
cd backend

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

### Frontend

```bash
# Entre no diretório do frontend
cd frontend

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3001`.

## Implantação em Produção

A implantação em produção é automatizada pelo Vercel. Sempre que você fizer um push para a branch `main` do repositório GitHub, o Vercel detectará as alterações e implantará automaticamente.

### Verificação Pós-Implantação

Após a implantação, verifique:

1. Se a aplicação está acessível pelo domínio configurado
2. Se a conexão com o MongoDB está funcionando
3. Se o sistema de autenticação está operacional
4. Se a integração com o Mercado Pago está correta

### Monitoramento

O Vercel fornece ferramentas de monitoramento integradas. Além disso, configure alertas no MongoDB Atlas para monitorar o uso do banco de dados e possíveis problemas.

---

Para qualquer dúvida ou problema durante a configuração, consulte a documentação adicional em [docs/](../README.md) ou entre em contato com o suporte.
