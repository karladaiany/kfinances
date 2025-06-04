# FinançasPro - Plataforma de Gestão Financeira Familiar

![FinançasPro Logo](frontend/src/assets/logo.png)

## Sobre o Projeto

FinançasPro é uma plataforma completa de gestão financeira familiar que permite controlar despesas, receitas, cartões de crédito, contas bancárias e investimentos em um único lugar. Com recursos avançados de importação de extratos bancários e faturas de cartão, visualizações detalhadas e sistema de conciliação automática, o FinançasPro torna o controle financeiro familiar simples e eficiente.

### Principais Funcionalidades

- **Dashboard Financeiro Avançado**: Visualizações personalizadas de gastos, receitas e saldos
- **Importação de Dados**: Suporte para importação de Excel e PDF (extratos bancários e faturas)
- **Conciliação Automática**: Sistema inteligente para conciliar lançamentos importados
- **Gestão Familiar**: Compartilhe o controle financeiro com membros da família
- **Temas Claro/Escuro**: Interface moderna com suporte a tema Dracula
- **Segurança Avançada**: Autenticação 2FA, criptografia e backups automáticos

## Estrutura do Projeto

```
financas-pro/
├── backend/               # API e lógica de negócios
│   ├── config/            # Configurações do servidor
│   └── src/
│       ├── controllers/   # Controladores da API
│       ├── models/        # Modelos de dados
│       ├── routes/        # Rotas da API
│       ├── services/      # Serviços de negócios
│       ├── middlewares/   # Middlewares da aplicação
│       └── utils/         # Utilitários e helpers
├── frontend/              # Interface de usuário
│   └── src/
│       ├── components/    # Componentes React
│       ├── pages/         # Páginas da aplicação
│       ├── styles/        # Estilos e temas
│       ├── assets/        # Imagens e recursos estáticos
│       ├── hooks/         # React hooks personalizados
│       ├── context/       # Contextos React
│       └── utils/         # Utilitários e helpers
├── docs/                  # Documentação
│   ├── setup/             # Guias de configuração
│   ├── usage/             # Guias de uso
│   └── api/               # Documentação da API
└── config/                # Configurações de implantação
    └── examples/          # Exemplos de arquivos de configuração
```

## Requisitos Técnicos

- Node.js 18.x ou superior
- MongoDB 5.x ou superior
- Navegador moderno (Chrome, Firefox, Edge, Safari)

## Configuração Inicial

Consulte o guia detalhado de configuração em [docs/setup/SETUP.md](docs/setup/SETUP.md) para instruções passo a passo sobre como configurar o ambiente de desenvolvimento e produção.

## Modelo de Negócio

FinançasPro opera em um modelo freemium:
- **Teste Gratuito**: 7 dias com acesso completo
- **Assinatura**: R$30,00/mês após o período de teste
- **Pagamentos**: Integração com Mercado Pago

## Segurança e Privacidade

- Todos os dados financeiros são criptografados
- Autenticação de dois fatores (2FA)
- Conexão segura via HTTPS
- Backups regulares e criptografados
- Política de retenção de dados clara

## Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados.

---

Desenvolvido com ❤️ para facilitar o controle financeiro familiar.
