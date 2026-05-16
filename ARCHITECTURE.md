# Architecture Documentation

## System Overview

Inflowa Labs Core is a full-stack decentralized finance platform built on the Stellar network. The system consists of three main layers:

1. **Smart Contract Layer** (Soroban)
2. **Backend Services** (Node.js/Next.js API)
3. **Frontend Application** (Next.js/React)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend Layer                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js 14 App (apps/web)                           │  │
│  │  - Dashboard UI                                      │  │
│  │  - Real-time Stream Visualization                    │  │
│  │  - Stream Management Interface                      │  │
│  │  - Analytics & Charts                                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       API Layer                              │
│  ┌──────────────────────┐  ┌──────────────────────────────┐ │
│  │  API Server          │  │  Blockchain Service          │ │
│  │  (apps/api)          │  │  (apps/blockchain)           │ │
│  │  - User Management   │  │  - Contract Interactions    │ │
│  │  - Portfolio Data    │  │  - Transaction Monitoring    │ │
│  │  - Stream Metadata   │  │  - Balance Queries           │ │
│  └──────────────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Smart Contract Layer                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Soroban Contract (contracts/inflowa-stream)        │  │
│  │  - Stream Creation & Management                      │  │
│  │  - Pause/Resume Logic                                │  │
│  │  - Withdrawal Processing                            │  │
│  │  - Available Amount Calculation                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Stellar Network│
                    │  - Soroban RPC  │
                    │  - Ledger       │
                    └─────────────────┘
```

## Core Data Models

### Stream (Smart Contract)

```rust
pub struct Stream {
    id: u32,
    sender: Address,
    recipient: Address,
    rate_per_second: i128,
    start_time: u64,
    end_time: Option<u64>,
    paused: bool,
    paused_at: Option<u64>,
    resumed_at: Option<u64>,
    total_withdrawn: i128,
    created_at: u64,
}
```

### Stream (Frontend/TypeScript)

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

## Component Details

### Smart Contract (Soroban)

**Location**: `contracts/inflowa-stream/src/lib.rs`

**Key Functions**:
- `init(admin: Address)` - Initialize contract with admin
- `create_stream(...)` - Create new income stream
- `pause_stream(stream_id, admin)` - Pause active stream
- `resume_stream(stream_id, admin)` - Resume paused stream
- `withdraw(stream_id, amount, recipient)` - Withdraw available funds
- `calculate_available(stream_id)` - Calculate withdrawable amount
- `get_stream(stream_id)` - Get stream details
- `get_user_streams(user)` - Get all user streams

**Storage Model**:
- Instance storage for contract admin and stream counter
- Each stream stored as a Map with stream_id as key
- Streams contain all metadata and accounting data

### API Server

**Location**: `apps/api`

**Endpoints**:
- `GET /api/health` - Health check
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `GET /api/portfolio` - Get user portfolio

**Responsibilities**:
- User authentication and management
- Portfolio aggregation
- Transaction history
- Business logic layer

### Blockchain Service

**Location**: `apps/blockchain`

**Endpoints**:
- `GET /api/contracts` - List smart contracts
- `GET /api/transactions` - List blockchain transactions
- `POST /api/transactions` - Create blockchain transaction
- `GET /api/balance/[address]` - Get account balance

**Responsibilities**:
- Smart contract interaction
- Blockchain transaction monitoring
- Real-time balance updates
- Stream state synchronization

### Frontend Application

**Location**: `apps/web`

**Key Components**:
- Dashboard with real-time stream visualization
- Stream creation and management UI
- Analytics and charts (Recharts)
- Responsive design (TailwindCSS)

**State Management**:
- React Query (TanStack Query) for server state
- Local React state for UI state
- Real-time updates via polling/websockets

## Data Flow

### Stream Creation Flow

1. User initiates stream creation in frontend
2. Frontend calls API server to validate and prepare
3. API server calls blockchain service
4. Blockchain service invokes Soroban contract
5. Contract creates stream and returns stream_id
6. Response propagates back through layers
7. Frontend updates UI with new stream

### Withdrawal Flow

1. User requests withdrawal in frontend
2. Frontend calculates available amount via contract query
3. User confirms withdrawal amount
4. Frontend calls blockchain service
5. Blockchain service invokes contract withdraw function
6. Contract validates and processes withdrawal
7. Tokens transferred to recipient
8. Frontend updates with new balance

### Real-time Updates

1. Blockchain service polls contract for state changes
2. Changes pushed to API server via WebSocket
3. Frontend receives updates via React Query
4. UI re-renders with new data

## Security Considerations

### Smart Contract Security

- Admin-only functions protected by address check
- Withdrawal amount validated against available balance
- Overflow/underflow protection using saturating arithmetic
- Stream state validation before operations

### API Security

- Environment variables for sensitive configuration
- Rate limiting on endpoints
- Input validation on all endpoints
- CORS configuration for frontend access

### Frontend Security

- Environment variables for API endpoints
- No private keys stored in frontend
- All sensitive operations require backend interaction

## Deployment Architecture

### Development

```
localhost:3000 - Web App
localhost:3001 - API Server
localhost:3002 - Blockchain Service
```

### Production

```
Frontend: Vercel/Netlify (Next.js optimized)
API Server: Railway/Heroku (Node.js)
Blockchain Service: Railway/Heroku (Node.js)
Smart Contract: Stellar Testnet/Mainnet
```

## Scalability Considerations

### Smart Contract

- Stream data stored efficiently in contract storage
- Pagination support for get_user_streams (future)
- Batch operations for multiple streams (future)

### API Layer

- Horizontal scaling via containerization
- Database connection pooling
- Caching layer for frequently accessed data
- Queue system for async operations

### Frontend

- Static generation where possible
- Code splitting for performance
- Lazy loading of components
- Optimistic UI updates

## Testing Strategy

### Smart Contract Tests

- Unit tests for each contract function
- Integration tests for complete workflows
- Edge case testing (boundary conditions)
- Gas optimization testing

### API Tests

- Endpoint testing with various inputs
- Authentication/authorization testing
- Error handling validation
- Load testing for performance

### Frontend Tests

- Component unit tests
- Integration tests for user flows
- E2E tests with Playwright (future)
- Accessibility testing

## Future Enhancements

1. **Multi-signature Support**: Require multiple approvals for large streams
2. **Conditional Streaming**: Stream based on milestones or KPIs
3. **Stream Splitting**: Split income streams to multiple recipients
4. **Cross-chain Support**: Stream assets across different blockchains
5. **Advanced Analytics**: Machine learning for income prediction
6. **Mobile App**: React Native for iOS/Android
7. **Browser Extension**: Quick stream management from browser
