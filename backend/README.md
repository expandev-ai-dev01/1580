# TODO List - Backend API

Sistema de gerenciamento de tarefas - API REST

## Tecnologias

- Node.js
- Express
- TypeScript
- SQL Server
- Zod (validação)

## Estrutura do Projeto

```
src/
├── api/              # Controladores de API
├── routes/           # Definições de rotas
├── middleware/       # Middlewares Express
├── services/         # Lógica de negócio
├── utils/            # Utilitários
├── config/           # Configurações
└── server.ts         # Ponto de entrada
```

## Configuração

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente:
```bash
cp .env.example .env
# Editar .env com suas configurações
```

3. Executar em desenvolvimento:
```bash
npm run dev
```

4. Build para produção:
```bash
npm run build
npm start
```

## Endpoints da API

### Health Check
- `GET /health` - Verifica status da API

### API v1
Base URL: `/api/v1`

#### Rotas Externas (Públicas)
- `/api/v1/external/*` - Endpoints públicos

#### Rotas Internas (Autenticadas)
- `/api/v1/internal/*` - Endpoints autenticados

## Desenvolvimento

### Padrões de Código

- TypeScript strict mode
- Indentação: 2 espaços
- Aspas simples para strings
- Ponto e vírgula obrigatório
- Máximo 120 caracteres por linha

### Estrutura de Módulos

Cada módulo de negócio segue a estrutura:
```
module/
├── controller.ts     # Controlador HTTP
├── service.ts        # Lógica de negócio
├── types.ts          # Definições de tipos
└── validation.ts     # Schemas de validação
```

## Licença

ISC