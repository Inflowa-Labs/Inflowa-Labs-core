# Development Guide

This guide provides comprehensive information for developers working on the Inflowa Labs platform.

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/Inflowa-Labs-core.git
cd Inflowa-Labs-core

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development servers
pnpm dev
```

## Project Structure

```
inflowa-labs-core/
├── apps/
│   └── web/                 # Next.js frontend application
├── packages/
│   ├── config/              # Shared configuration
│   ├── sdk/                 # Core SDK with stream services
│   └── ui/                  # Shared UI components
├── contracts/
│   └── inflowa-stream/      # Stellar Soroban smart contracts
└── turbo.json              # Turborepo configuration
```

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
pnpm typecheck        # Type check all packages

# Testing
pnpm test             # Run all tests
pnpm clean            # Clean build artifacts

# Security
pnpm audit            # Run security audit
pnpm audit:fix        # Fix security vulnerabilities
```

## Architecture

### Monorepo Structure
This project uses **pnpm workspaces** and **Turborepo** for efficient package management and build orchestration.

### Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts
- **Backend**: Next.js API routes with Node.js
- **Blockchain**: Stellar Soroban Smart Contracts
- **Development**: TypeScript, ESLint, Prettier

### Core Concepts

#### Stream Model
The core data model for income streams:
```typescript
export type Stream = {
  id: string;
  sender: string;
  recipient: string;
  ratePerSecond: number;
  startTime: number;
  endTime?: number;
  paused: boolean;
};
```

#### SDK Services
The SDK provides various services for stream management:
- `StreamService`: Core stream operations
- `StreamEngine`: Business logic for stream calculations
- `StreamCalculator`: Stream calculations and projections
- `StreamControlService`: Stream control operations
- `NotificationService`: Notification management
- `AuditLogService`: Audit logging
- `ExportService`: Data export functionality
- `GoalTrackingService`: Goal tracking
- `ProjectionCalculator`: Income projections

## Library Utilities

The web app includes a comprehensive library of utilities in `apps/web/src/lib/`:

### Security
- `security.ts`: Input validation, rate limiting, CSP
- `encryption.ts`: Data encryption utilities
- `auth.ts`: Authentication and session management
- `cors.ts`: CORS configuration

### Core
- `error-handler.ts`: Centralized error handling
- `logger.ts`: Logging utilities
- `validation.ts`: Input validation schemas
- `storage.ts`: Secure storage utilities
- `api-client.ts`: API client with error handling
- `constants.ts`: Application constants
- `middleware.ts`: Request/response middleware
- `format.ts`: Formatting utilities
- `environment.ts`: Environment validation
- `performance.ts`: Performance monitoring
- `testing.ts`: Testing utilities
- `hooks.ts`: Custom React hooks

## Adding New Features

### Adding a New UI Component
1. Create component in `apps/web/src/components/`
2. Follow existing component patterns
3. Use TypeScript for type safety
4. Add proper error handling
5. Test thoroughly

### Adding a New SDK Service
1. Create service in `packages/sdk/src/`
2. Export from `packages/sdk/src/index.ts`
3. Add proper TypeScript types
4. Include input validation
5. Add unit tests
6. Update documentation

### Adding a New API Route
1. Create route in `apps/web/src/app/api/`
2. Use middleware for authentication and rate limiting
3. Validate all inputs
4. Handle errors properly
5. Return consistent response format

## Code Style

### TypeScript
- Use strict mode
- Provide explicit types
- Avoid `any` types
- Use interfaces for object shapes
- Use type aliases for union types

### React
- Use functional components
- Use hooks for state management
- Follow React best practices
- Use TypeScript for props
- Implement proper error boundaries

### General
- Use meaningful variable names
- Write self-documenting code
- Add comments for complex logic
- Follow existing code style
- Run linter before committing

## Testing

### Unit Tests
```bash
pnpm test
```

### Integration Tests
```bash
pnpm test:integration
```

### E2E Tests
```bash
pnpm test:e2e
```

## Deployment

### Production Build
```bash
# Build all applications
pnpm build

# Start production servers
pnpm start
```

### Environment Setup
Ensure all environment variables are properly configured for production deployment. See `apps/web/.env.example` for required variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Troubleshooting

### Common Issues

#### Build Failures
- Clear build artifacts: `pnpm clean`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`
- Check Node.js version: `node --version`

#### Type Errors
- Run typecheck: `pnpm typecheck`
- Ensure all dependencies are installed
- Check TypeScript configuration

#### Linting Errors
- Run format: `pnpm format`
- Fix specific lint errors manually
- Check ESLint configuration

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Stellar Documentation](https://developers.stellar.org/docs)
- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Documentation](https://pnpm.io)

## Support

For support and questions:
- GitHub Issues: https://github.com/your-org/Inflowa-Labs-core/issues
- Email: support@inflowalabs.com
