# Inflowa Labs Core

A comprehensive monorepo for a decentralized finance platform built with modern web technologies.

## Architecture

This monorepo uses **pnpm workspaces** and **Turborepo** for efficient package management and build orchestration.

### Tech Stack

- **Monorepo Management**: pnpm workspaces, Turborepo
- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts
- **Backend**: Next.js API routes with Node.js
- **Blockchain**: Stellar Soroban (Mock Implementation)
- **Development**: TypeScript, ESLint, Prettier

### Package Structure

```
inflowa-labs-core/
apps/
  web/                 # Next.js frontend application
  api/                 # Backend API server (port 3001)
  blockchain/          # Blockchain services (port 3002)
packages/
  ui/                  # Shared UI components (shadcn/ui)
  types/               # TypeScript type definitions
  config/              # Shared configuration
```

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development servers
pnpm dev
```

### Development

The development command starts all applications:

- **Web App**: http://localhost:3000
- **API Server**: http://localhost:3001
- **Blockchain Service**: http://localhost:3002

## Applications

### Web App (`apps/web`)

The main frontend application featuring:

- **Dashboard**: Portfolio overview with charts and analytics
- **State Management**: React Query for server state
- **UI Components**: shadcn/ui component library
- **Charts**: Recharts for data visualization
- **Responsive Design**: TailwindCSS with mobile-first approach

### API Server (`apps/api`)

RESTful API providing:

- `/api/health` - Health check endpoint
- `/api/users` - User management
- `/api/transactions` - Transaction handling
- `/api/portfolio` - Portfolio data

### Blockchain Service (`apps/blockchain`)

Mock Stellar Soroban integration:

- `/api/contracts` - Smart contract management
- `/api/transactions` - Blockchain transactions
- `/api/balance/[address]` - Account balance queries
- Mock contract implementations for testing

## Shared Packages

### UI Components (`packages/ui`)

Reusable shadcn/ui components:

- Button, Card, Input, Label
- Utility functions (cn utility)
- TailwindCSS configuration

### Types (`packages/types`)

TypeScript type definitions for:

- User, Transaction, Portfolio types
- API response types
- Chart data types
- Blockchain types

### Config (`packages/config`)

Shared configuration:

- API endpoints
- Feature flags
- Chart settings
- Blockchain configuration

## Development Workflow

### Available Scripts

```bash
# Development
pnpm dev              # Start all apps in development mode
pnpm dev:web          # Start only web app
pnpm dev:api          # Start only API server
pnpm dev:blockchain   # Start only blockchain service

# Building
pnpm build            # Build all packages
pnpm build:web        # Build only web app
pnpm build:api        # Build only API server

# Linting & Formatting
pnpm lint             # Lint all packages
pnpm format           # Format all code with Prettier

# Testing
pnpm test             # Run all tests
pnpm clean            # Clean build artifacts
```

### Adding New Packages

1. Create package directory in `packages/` or `apps/`
2. Add `package.json` with workspace configuration
3. Update `pnpm-workspace.yaml` if needed
4. Configure TypeScript and build scripts

### Environment Variables

Create `.env.local` files in respective apps:

```bash
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ENABLE_BLOCKCHAIN=true

# apps/api/.env.local
DATABASE_URL=your_database_url

# apps/blockchain/.env.local
SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
TOKEN_CONTRACT_ID=your_contract_id
```

## API Documentation

### Users API

- `GET /api/users` - Retrieve all users
- `POST /api/users` - Create new user

### Transactions API

- `GET /api/transactions` - Retrieve all transactions
- `POST /api/transactions` - Create new transaction

### Portfolio API

- `GET /api/portfolio` - Retrieve user portfolio

### Blockchain API

- `GET /api/contracts` - List smart contracts
- `GET /api/transactions` - List blockchain transactions
- `POST /api/transactions` - Create blockchain transaction
- `GET /api/balance/[address]` - Get account balance

## Deployment

### Production Build

```bash
# Build all applications
pnpm build

# Start production servers
pnpm start
```

### Environment Setup

Ensure all environment variables are properly configured for production deployment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, contact the Inflowa Labs team.
