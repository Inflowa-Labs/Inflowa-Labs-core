# Inflowa Labs Core

**A Personal Income Streams Dashboard built on Stellar Soroban**

Inflowa Labs Core is a revolutionary DeFi platform that transforms how individuals receive and manage income. Built on the Stellar network using Soroban smart contracts, it enables continuous, real-time money streaming - imagine seeing your salary, grants, and payments flow in every second, not just on payday.

## 🌟 Vision

We believe income should flow like water - continuous, transparent, and accessible. Inflowa Labs brings this vision to life by:

- **Real-time Income Visualization**: Watch your money streams flow in live on a beautiful dashboard
- **Continuous Streaming**: No more waiting for payday - income arrives per-second
- **Multi-Source Aggregation**: View salary, grants, payments, and investments in one place
- **Future Simulation**: Model and predict your income growth over time
- **Stream Control**: Pause/resume income streams with smart contract logic

## 🚀 Why This Matters

Traditional finance treats income as discrete events (monthly paychecks, quarterly grants). Inflowa Labs reimagines income as a continuous stream, enabled by blockchain technology. This is particularly valuable for:

- **Freelancers & Gig Workers**: Receive continuous payment for work
- **Grant Recipients**: Stream grant funding over project duration
- **Investors**: Monitor dividend/yield streams in real-time
- **Salary Streaming**: Employers can stream salary continuously
- **Universal Basic Income**: Enable efficient UBI distribution

## 🏗️ Architecture

This monorepo uses **pnpm workspaces** and **Turborepo** for efficient package management and build orchestration.

### Tech Stack

- **Monorepo Management**: pnpm workspaces, Turborepo
- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts
- **Backend**: Next.js API routes with Node.js
- **Blockchain**: Stellar Soroban Smart Contracts
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

Stellar Soroban smart contract integration:

- `/api/contracts` - Smart contract management
- `/api/transactions` - Blockchain transactions
- `/api/balance/[address]` - Account balance queries
- Real-time stream monitoring and updates

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

## 🌐 Stellar Ecosystem Integration

Inflowa Labs is built specifically for the Stellar ecosystem, leveraging:

- **Soroban Smart Contracts**: Our income streaming logic runs on-chain
- **Stellar Asset Integration**: Stream any Stellar asset (XLM, USDC, custom tokens)
- **Fast & Low-Cost**: Stellar's network enables efficient per-second streaming
- **Interoperability**: Designed to work with existing Stellar wallets and tools

### Smart Contract Features

Our Soroban contract (`contracts/inflowa-stream`) provides:

- **Continuous Streaming**: Money flows at configurable per-second rates
- **Pause/Resume**: Admin controls for stream management
- **Withdrawals**: On-demand fund withdrawals
- **Multi-Asset Support**: Stream any Soroban-compatible token
- **Query Functions**: Real-time stream status and calculations

## 📊 Roadmap

- [ ] Q1 2025: Mainnet deployment on Stellar
- [ ] Q2 2025: Mobile app (React Native)
- [ ] Q3 2025: Advanced analytics and forecasting
- [ ] Q4 2025: Integration with major payroll providers
- [ ] Q1 2026: Cross-chain streaming (Ethereum, Polygon)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, contact the Inflowa Labs team.
