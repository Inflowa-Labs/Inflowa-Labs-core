# Contributing to Inflowa Labs Core

Thank you for your interest in contributing to Inflowa Labs Core! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Rust toolchain (for contract development)
- Soroban CLI (for contract deployment)

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/Inflowa-Labs-core.git
   cd Inflowa-Labs-core
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Project Structure

```
inflowa-labs-core/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # Backend API
│   └── blockchain/   # Blockchain services
├── packages/
│   ├── ui/           # Shared UI components
│   ├── types/        # TypeScript types
│   └── config/       # Shared configuration
└── contracts/
    └── inflowa-stream/  # Soroban smart contract
```

### Running the Project

```bash
# Start all services in development mode
pnpm dev

# Start specific services
pnpm dev:web
pnpm dev:api
pnpm dev:blockchain

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

## Testing

### Frontend Testing

```bash
# Run web app tests
cd apps/web
pnpm test
```

### Smart Contract Testing

```bash
# Run contract tests
cd contracts/inflowa-stream
cargo test
```

### Test Coverage

We aim for:
- Frontend: >80% coverage
- Smart Contracts: >90% coverage

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
- `feat: add stream pause functionality`
- `fix: resolve withdrawal calculation bug`
- `docs: update API documentation`

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Write descriptive commit messages
3. Update documentation if needed
4. Add tests for new features
5. Ensure all tests pass
6. Update the CHANGELOG if applicable
7. Submit a pull request with a clear description

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
```

## Development Guidelines

### Frontend (React/Next.js)

- Use TypeScript for type safety
- Follow React best practices
- Use shadcn/ui components when possible
- Implement responsive design
- Add error boundaries

### Smart Contracts (Soroban/Rust)

- Follow Rust best practices
- Use proper error handling
- Add comprehensive tests
- Document public functions
- Consider gas optimization

### API Development

- Use TypeScript for type definitions
- Implement proper error handling
- Add API documentation
- Use environment variables for configuration
- Implement rate limiting

## Questions?

Feel free to open an issue for questions or discussion.
