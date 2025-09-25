# Guia de Inicialização Local - FinançasPro

Este guia fornece instruções detalhadas para configurar e executar o FinançasPro em ambiente de desenvolvimento local.

## 📋 Visão Geral do Projeto

O **FinançasPro** é uma plataforma completa de gestão financeira familiar com as seguintes características:

**Arquitetura:**
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: Next.js + React
- **Autenticação**: JWT com 2FA
- **Pagamentos**: Integração com Mercado Pago
- **Email**: Nodemailer para notificações
- **Segurança**: Criptografia de dados sensíveis

## 🏗️ Estrutura do Projeto

```
financas-pro/
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── controllers/     # Controladores da API
│   │   ├── models/         # Modelos MongoDB (User, Family, Transaction, etc.)
│   │   ├── routes/          # Rotas da API
│   │   ├── middlewares/     # Middlewares (auth, validação)
│   │   └── utils/          # Utilitários (logger, email, payment)
│   └── package.json
├── frontend/                # Interface Next.js/React
│   ├── src/
│   │   ├── context/         # Contextos React (AuthContext)
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── styles/          # Estilos e temas
│   │   └── utils/          # Utilitários (api.js)
│   └── package.json
└── docs/                    # Documentação
```

## 🔧 Requisitos Técnicos

- **Node.js**: 18.x ou superior
- **MongoDB**: 5.x ou superior (ou MongoDB Atlas)
- **Navegador**: Chrome, Firefox, Edge, Safari

## 📦 Dependências Principais

### Backend:
- Express.js (servidor web)
- Mongoose (ODM para MongoDB)
- JWT (autenticação)
- Bcrypt (hash de senhas)
- Mercado Pago (pagamentos)
- Nodemailer (emails)
- Winston (logs)

### Frontend:
- Next.js 13 (framework React)
- React 18
- Axios (requisições HTTP)
- Chart.js (gráficos)
- React Icons
- Styled Components

## 🚀 Guia de Inicialização Local

### 1. Configuração do Ambiente

```bash
# 1. Clone o repositório (se necessário)
git clone <url-do-repositorio>
cd financas-pro

# 2. Instale as dependências do projeto principal
npm install

# 3. Instale dependências do backend
cd backend
npm install

# 4. Instale dependências do frontend
cd ../frontend
npm install

# 5. Volte para o diretório raiz
cd ..
```

### 2. Configuração do Banco de Dados

#### Opção A: MongoDB Local

**Windows:**
1. Acesse [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Baixe a versão para Windows
3. Execute o instalador e siga as instruções
4. Adicione o MongoDB ao PATH do sistema
5. Inicie o serviço MongoDB:
```bash
# Iniciar MongoDB como serviço
net start MongoDB

# OU iniciar manualmente
mongod
```

**macOS:**
```bash
# Usando Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
# Importar chave pública
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Adicionar repositório
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Atualizar e instalar
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Opção B: MongoDB Atlas (Recomendado)

1. **Criar conta no MongoDB Atlas:**
   - Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Clique em "Try Free"
   - Crie uma conta gratuita

2. **Criar cluster:**
   - Escolha "Build a Database"
   - Selecione "M0 Sandbox" (gratuito)
   - Escolha a região mais próxima
   - Nomeie seu cluster (ex: "financas-pro")

3. **Configurar acesso:**
   - Crie um usuário de banco de dados
   - Configure o acesso de rede (0.0.0.0/0 para desenvolvimento)
   - Obtenha a string de conexão

4. **String de conexão:**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/financas-pro?retryWrites=true&w=majority
```

### 3. Configuração das Variáveis de Ambiente

**IMPORTANTE:** O projeto já possui um arquivo de configuração em `backend/config.env`. Você pode:

**Opção A: Usar o arquivo existente (Recomendado)**
- O arquivo `backend/config.env` já está configurado
- Apenas atualize a `MONGODB_URI` se necessário

**Opção B: Criar arquivo `.env` na raiz (se preferir)**
```env
# Ambiente
NODE_ENV=development

# Servidor
PORT=3000
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001

# MongoDB Local
MONGODB_URI=mongodb://localhost:27017/financas-pro

# MongoDB Atlas (substitua pela sua string de conexão)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/financas-pro?retryWrites=true&w=majority

# JWT (Autenticação)
JWT_SECRET=chave_secreta_muito_segura_para_jwt_em_desenvolvimento_123456789
JWT_EXPIRATION=7d
REFRESH_TOKEN_SECRET=outra_chave_secreta_muito_segura_para_refresh_token_987654321
REFRESH_TOKEN_EXPIRATION=30d

# Criptografia
ENCRYPTION_KEY=chave_de_32_caracteres_para_aes256_criptografia_12345678901234567890123456789012

# Mercado Pago (credenciais de teste)
MP_ACCESS_TOKEN=TEST-0000000000000000-000000-00000000000000000000000000000000-000000000
MP_PUBLIC_KEY=TEST-00000000-0000-0000-0000-000000000000

# Email (opcional para desenvolvimento)
EMAIL_SERVICE=gmail
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_de_app_do_gmail

# Configurações de Negócio
TRIAL_DAYS=7
SUBSCRIPTION_PRICE=30.00
ALLOW_OPEN_REGISTRATION=true
```

**Para MongoDB Atlas, atualize a MONGODB_URI:**
1. Acesse seu cluster no MongoDB Atlas
2. Clique em "Connect" → "Connect your application"
3. Copie a string de conexão
4. Substitua `<password>` pela senha do usuário
5. Substitua `<dbname>` por `financas-pro`

### 4. Execução do Projeto

**IMPORTANTE:** Certifique-se de que o MongoDB está rodando antes de executar o backend!

#### Verificar se MongoDB está rodando:
```bash
# Windows
net start MongoDB

# macOS/Linux
brew services start mongodb/brew/mongodb-community
# OU
sudo systemctl start mongod
```

#### Método 1: Executar separadamente (Recomendado para debugging)

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

#### Método 2: Executar simultaneamente

```bash
# Na raiz do projeto (certifique-se de estar no diretório correto)
npm run dev
```

**⚠️ Problema comum:** Se receber erro "Could not read package.json", certifique-se de estar no diretório raiz do projeto (`/d/kfinances`).

### 5. Verificar Status dos Serviços

#### Verificar se os serviços estão rodando:
```bash
# Verificar portas em uso
netstat -an | findstr "3000\|3001"

# Testar backend
curl http://localhost:3000

# Testar frontend
curl http://localhost:3001
```

#### Logs para debugging:
```bash
# Logs do backend
tail -f backend/logs/combined.log
tail -f backend/logs/error.log

# Logs do frontend (no terminal onde está rodando)
# Os logs aparecem diretamente no terminal
```

### 6. Acessar a Aplicação

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Documentação da API**: http://localhost:3000/api

#### Páginas disponíveis:
- **Página inicial**: http://localhost:3001 (redireciona automaticamente)
- **Login**: http://localhost:3001/login
- **Registro**: http://localhost:3001/register
- **Dashboard**: http://localhost:3001/dashboard (após login)

## 🎯 Funcionalidades Principais

### Autenticação:
- Registro e login de usuários
- Verificação de email
- Autenticação de dois fatores (2FA)
- Recuperação de senha

### Gestão Financeira:
- Dashboard com resumos financeiros
- Contas bancárias e cartões de crédito
- Transações (receitas, despesas, transferências)
- Categorias personalizáveis
- Relatórios e gráficos

### Gestão Familiar:
- Criação e gerenciamento de famílias
- Convites para membros
- Controle de permissões
- Compartilhamento de transações

### Importação de Dados:
- Importação de extratos Excel
- Importação de PDFs (faturas)
- Conciliação automática

### Pagamentos:
- Integração com Mercado Pago
- Assinaturas recorrentes
- Período de teste gratuito

## 🛠️ Configurações Adicionais

### Para desenvolvimento com email:
1. Configure uma conta Gmail
2. Ative a autenticação de 2 fatores
3. Gere uma senha de aplicativo
4. Use essas credenciais no arquivo `.env`

### Para desenvolvimento com pagamentos:
1. Crie uma conta no Mercado Pago
2. Obtenha as credenciais de teste
3. Configure as variáveis `MP_ACCESS_TOKEN` e `MP_PUBLIC_KEY`

## ⚡ Configuração Rápida para Desenvolvimento

### Para começar rapidamente:

1. **Instalar MongoDB Atlas (Recomendado):**
   - Crie conta gratuita em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Crie cluster M0 (gratuito)
   - Configure acesso de rede (0.0.0.0/0)
   - Copie a string de conexão

2. **Atualizar configuração:**
   ```bash
   # Editar backend/config.env
   # Substituir MONGODB_URI pela string do Atlas
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/financas-pro
   ```

3. **Executar projeto:**
   ```bash
   # Na raiz do projeto
   npm run dev
   ```

4. **Acessar:** http://localhost:3001

## 📝 Próximos Passos

1. **Configurar o ambiente** seguindo os passos acima
2. **Testar a aplicação** acessando http://localhost:3001
3. **Criar um usuário** através do registro
4. **Explorar as funcionalidades** do dashboard
5. **Configurar integrações** (email, pagamentos) conforme necessário

## ⚠️ Observações Importantes

- O projeto usa **workspaces** do npm para gerenciar dependências
- O frontend usa **Next.js 13** com App Router
- O backend usa **Babel** para transpilação ES6+
- Todos os dados sensíveis são **criptografados** no banco
- O sistema possui **logs detalhados** para debugging

## 🔍 Solução de Problemas

### ❌ Erro: "connect ECONNREFUSED ::1:27017"
**Problema:** MongoDB não está rodando
**Solução:**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb/brew/mongodb-community

# Linux
sudo systemctl start mongod
```

### ❌ Erro: "Could not read package.json"
**Problema:** Executando comando no diretório errado
**Solução:**
```bash
# Certifique-se de estar no diretório raiz
cd /d/kfinances
# OU
cd D:\kfinances
```

### ❌ Erro: "Global CSS cannot be imported"
**Problema:** Importação de CSS em páginas individuais
**Solução:** O arquivo `_app.js` já foi criado para resolver isso

### ❌ Frontend não carrega (404)
**Problema:** Páginas não encontradas
**Solução:** As páginas básicas (index, login, register) já foram criadas

### ❌ Backend não responde
**Problema:** MongoDB não conectado ou erro de configuração
**Solução:**
1. Verifique se MongoDB está rodando
2. Confirme a string de conexão em `backend/config.env`
3. Para MongoDB Atlas, verifique as configurações de rede

### ❌ Erro de dependências
**Problema:** Pacotes não instalados
**Solução:**
```bash
# Instalar dependências em cada diretório
npm install
cd backend && npm install
cd ../frontend && npm install
```

### ❌ Erro de porta em uso
**Problema:** Portas 3000/3001 já estão em uso
**Solução:**
```bash
# Verificar processos usando as portas
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Matar processo (Windows)
taskkill /PID <PID_NUMBER> /F

# OU alterar portas no arquivo de configuração
```

### ❌ Problemas com MongoDB Atlas
**Problema:** Não consegue conectar ao Atlas
**Solução:**
1. Verifique se o IP está na whitelist (0.0.0.0/0 para desenvolvimento)
2. Confirme usuário e senha
3. Teste a conexão no MongoDB Compass
4. Verifique se o cluster está ativo

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do backend em `backend/logs/`
2. Consulte a documentação da API
3. Verifique as configurações do `.env`

---

**Desenvolvido com ❤️ para facilitar o controle financeiro familiar.**
