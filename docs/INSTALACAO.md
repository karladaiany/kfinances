# Guia de Instalação e Uso - FinançasPro

Este documento fornece instruções detalhadas para fazer o upload do projeto FinançasPro para o GitHub e configurar o ambiente de produção no Vercel com MongoDB Atlas.

## Índice

1. [Preparação do Ambiente](#preparação-do-ambiente)
2. [Upload para o GitHub](#upload-para-o-github)
3. [Configuração do MongoDB Atlas](#configuração-do-mongodb-atlas)
4. [Implantação no Vercel](#implantação-no-vercel)
5. [Configuração do Mercado Pago](#configuração-do-mercado-pago)
6. [Primeiros Passos após Implantação](#primeiros-passos-após-implantação)

## Preparação do Ambiente

Antes de começar, certifique-se de ter:

- Uma conta no GitHub (você já tem: karladaiany)
- Uma conta no Vercel (você mencionou que já tem)
- Uma conta de e-mail para receber notificações (karllinhadeoliveira@live.com)

## Upload para o GitHub

### Método 1: Usando a Interface Web do GitHub

1. Acesse sua conta GitHub em [github.com](https://github.com)
2. Clique no botão "+" no canto superior direito e selecione "New repository"
3. Preencha as informações:
   - Nome do repositório: `financas-pro`
   - Descrição: `Plataforma de Gestão Financeira Familiar`
   - Visibilidade: Privado (recomendado para dados sensíveis)
   - Não inicialize com README
4. Clique em "Create repository"
5. Na página do repositório vazio, clique em "uploading an existing file"
6. Arraste todos os arquivos e pastas do projeto ou selecione-os do seu computador
7. Adicione uma mensagem de commit: "Configuração inicial do projeto"
8. Clique em "Commit changes"

### Método 2: Usando Git na Linha de Comando (Alternativa)

Se você estiver familiarizada com Git, pode usar estes comandos:

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

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Registre-se com o e-mail: karllinhadeoliveira@live.com
3. Após o login, clique em "Create" para criar um novo cluster
4. Selecione o plano gratuito (M0)
5. Escolha um provedor de nuvem (AWS recomendado) e uma região próxima ao Brasil
6. Clique em "Create Cluster" (a criação pode levar alguns minutos)
7. Configure a segurança:
   - Em "Database Access", crie um usuário com permissões de leitura e escrita
   - Em "Network Access", adicione seu IP atual ou permita acesso de qualquer lugar (0.0.0.0/0)
8. Obtenha a string de conexão:
   - Clique em "Connect" no seu cluster
   - Selecione "Connect your application"
   - Copie a string de conexão (será usada nas variáveis de ambiente do Vercel)

## Implantação no Vercel

1. Acesse [Vercel](https://vercel.com/) e faça login
2. Clique em "Add New..." e selecione "Project"
3. Conecte sua conta GitHub se ainda não estiver conectada
4. Selecione o repositório `financas-pro`
5. Configure o projeto:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Adicione as variáveis de ambiente:
   - `MONGODB_URI`: Cole a string de conexão do MongoDB Atlas
   - `JWT_SECRET`: Gere uma string aleatória segura
   - `REFRESH_TOKEN_SECRET`: Gere outra string aleatória segura
   - `ENCRYPTION_KEY`: Gere uma chave de 32 caracteres
   - `MP_ACCESS_TOKEN`: Será obtido na configuração do Mercado Pago
   - `MP_PUBLIC_KEY`: Será obtido na configuração do Mercado Pago
   - `EMAIL_SERVICE`: "gmail" (ou outro serviço de e-mail)
   - `EMAIL_USER`: Seu e-mail para envio de notificações
   - `EMAIL_PASSWORD`: Senha do e-mail (ou senha de app)
   - `TRIAL_DAYS`: "7"
   - `SUBSCRIPTION_PRICE`: "30.00"
   - `DATA_RETENTION_DAYS`: "90"
7. Clique em "Deploy" e aguarde a conclusão

## Configuração do Mercado Pago

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Crie uma conta ou faça login
3. Vá para o [Dashboard de Desenvolvedores](https://www.mercadopago.com.br/developers/panel)
4. Crie uma aplicação:
   - Nome: "FinançasPro"
   - Selecione os produtos: "Checkout Pro" e "API de Assinaturas"
   - URL de redirecionamento: `https://kfinancepro.vercel.app/api/payment/callback`
5. Obtenha as credenciais:
   - Copie o "Access Token" e o "Public Key"
   - Adicione estas credenciais nas variáveis de ambiente do Vercel
6. Configure o webhook:
   - URL: `https://kfinancepro.vercel.app/api/payment/webhook`
   - Tópicos: "merchant_order", "payment" e "subscription"

## Primeiros Passos após Implantação

1. Acesse sua aplicação no domínio fornecido pelo Vercel (ex: kfinancepro.vercel.app)
2. Crie sua conta de administrador:
   - Esta será a conta principal com acesso total
   - Use o e-mail karllinhadeoliveira@live.com
3. Configure suas categorias, contas bancárias e cartões de crédito
4. Teste o sistema de convites enviando um convite para um membro da família
5. Verifique se o sistema de assinaturas está funcionando corretamente

## Suporte e Manutenção

Para qualquer dúvida ou problema durante a configuração, consulte a documentação detalhada em:
- [docs/setup/SETUP.md](docs/setup/SETUP.md)
- [docs/usage/](docs/usage/)

Lembre-se de fazer backups regulares do seu banco de dados e manter as dependências atualizadas para garantir a segurança e o bom funcionamento da plataforma.
