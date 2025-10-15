# Travel Time Tracker

Sistema moderno de monitoramento de tempos de viagem com interface elegante e suporte a dark mode.

## Características

- 🗺️ **Múltiplas Rotas**: Gerencie e monitore várias rotas simultaneamente
- 📊 **Visualização de Dados**: Gráficos interativos com histórico de tempos de viagem
- 🌓 **Dark Mode**: Alternância entre modo claro e escuro
- 💾 **PostgreSQL Local**: Armazenamento em banco de dados PostgreSQL
- 🎨 **Interface Moderna**: UI responsiva e intuitiva com Tailwind CSS
- ⚡ **Tempo Real**: Monitoramento em tempo real usando Google Maps API

## Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL instalado e rodando em localhost
- Chave de API do Google Maps (Distance Matrix API)

## Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

O arquivo `.env` já está configurado com as credenciais do PostgreSQL local:

```env
VITE_DATABASE_HOST=localhost
VITE_DATABASE_PORT=5432
VITE_DATABASE_NAME=postgres
VITE_DATABASE_USER=postgres
VITE_DATABASE_PASSWORD=postgres
VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

**Importante**: Atualize a chave da API do Google Maps no arquivo `.env`

### 3. Criar Banco de Dados

O banco de dados será criado automaticamente ao iniciar o servidor. Certifique-se de que o PostgreSQL está rodando.

## Executar o Projeto

### Iniciar o Servidor Backend

```bash
npm run server
```

O servidor estará rodando em `http://localhost:3001`

### Iniciar o Frontend (em outro terminal)

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## Como Usar

### 1. Criar uma Rota

- Clique no botão "Nova Rota"
- Preencha o nome, origem e destino
- Clique em "Criar Rota"

### 2. Monitorar uma Rota

- Selecione uma rota da lista
- Clique no botão "Monitorar" para iniciar o monitoramento
- Os dados serão coletados automaticamente a cada 5 minutos

### 3. Visualizar Dados

- Veja o gráfico com o histórico de tempos
- Analise as estatísticas: tempo médio, mínimo e máximo
- Explore o histórico detalhado abaixo do gráfico

### 4. Configurações

- Clique no ícone de engrenagem no cabeçalho
- Ajuste o tempo de preparação
- Configure a frequência de consultas
- Defina os intervalos de monitoramento

### 5. Dark Mode

- Clique no ícone de lua/sol no cabeçalho para alternar entre modos

## Estrutura do Projeto

```
project/
├── server/           # Servidor Express (backend)
│   └── index.ts     # API REST
├── src/
│   ├── components/  # Componentes React
│   ├── contexts/    # Contextos (Theme)
│   ├── services/    # Serviços de API
│   ├── types/       # TypeScript types
│   └── App.tsx      # Componente principal
├── .env             # Variáveis de ambiente
└── package.json     # Dependências
```

## Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Vite
- **Estilo**: Tailwind CSS 4
- **Gráficos**: Recharts
- **Backend**: Express, Node.js
- **Banco de Dados**: PostgreSQL (pg)
- **API Externa**: Google Maps Distance Matrix API

## Scripts Disponíveis

- `npm run dev` - Inicia o frontend em modo desenvolvimento
- `npm run server` - Inicia o servidor backend
- `npm run build` - Compila o projeto para produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## Solução de Problemas

### Erro de Conexão com o Banco de Dados

Verifique se:
- PostgreSQL está rodando
- As credenciais no `.env` estão corretas
- O usuário tem permissões para criar tabelas

### Erro na API do Google Maps

- Verifique se a chave da API está configurada no `.env`
- Confirme que a API Distance Matrix está ativa no Google Cloud Console
- Verifique se há créditos disponíveis na conta

### Porta em Uso

Se as portas 3001 ou 5173 estiverem em uso:
- Backend: Mude a porta no `server/index.ts`
- Frontend: Vite escolherá automaticamente outra porta

## Licença

MIT
