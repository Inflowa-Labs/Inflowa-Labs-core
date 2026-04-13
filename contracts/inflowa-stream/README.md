# Inflowa Stream Contract

A Soroban smart contract for continuous income streaming on the Stellar network.

## Features

- **Continuous Streaming**: Money flows at a per-second rate
- **Pause/Resume**: Control stream flow
- **Withdrawals**: Withdraw accumulated funds
- **Multi-Asset Support**: Stream any Soroban token
- **Admin Controls**: Administrative functions for stream management

## Contract Functions

### Core Functions

- `init(admin: Address)` - Initialize contract with admin
- `create_stream(from: Address, to: Address, amount_per_second: i128, asset: Address) -> u32` - Create new income stream
- `pause_stream(stream_id: u32, admin: Address)` - Pause active stream
- `resume_stream(stream_id: u32, admin: Address)` - Resume paused stream
- `withdraw(stream_id: u32, amount: i128, recipient: Address)` - Withdraw available funds

### Query Functions

- `calculate_available(stream_id: u32) -> i128` - Calculate withdrawable amount
- `get_stream(stream_id: u32) -> Map` - Get stream details
- `get_user_streams(user: Address) -> Vec<u32>` - Get all user streams

## Usage Example

```rust
// Create a salary stream paying $0.01 per second (~$315/year)
let stream_id = contract.create_stream(
    employer_address,
    employee_address,
    10000, // amount in smallest units
    usd_token_address
);

// Calculate available amount after some time
let available = contract.calculate_available(stream_id);

// Withdraw accumulated funds
contract.withdraw(stream_id, available, employee_address);
```

## Development

```bash
# Build contract
cargo build --target wasm32-unknown-unknown

# Run tests
cargo test

# Deploy to testnet
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/inflowa_stream.wasm
```

## Integration

This contract is designed to work with the Inflowa Labs frontend dashboard for real-time income stream visualization.
