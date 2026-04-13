use soroban_sdk::{contractimpl, Address, Env, Map, String, Symbol, Vec};

// Contract structure for income streaming
pub struct InflowaStream;

#[contractimpl]
impl InflowaStream {
    // Initialize the contract
    pub fn init(env: Env, admin: Address) {
        env.storage().instance().set(&Symbol::new(&env, "admin"), &admin);
    }

    // Create a new income stream - matches core Stream data model
    pub fn create_stream(
        env: Env,
        sender: Address,
        recipient: Address,
        rate_per_second: i128,
        start_time: Option<u64>,
        end_time: Option<u64>,
    ) -> u32 {
        let stream_id = Self::get_next_stream_id(&env);
        
        let stream_data = Map::new(&env);
        stream_data.set(Symbol::new(&env, "id"), stream_id);
        stream_data.set(Symbol::new(&env, "sender"), sender);
        stream_data.set(Symbol::new(&env, "recipient"), recipient);
        stream_data.set(Symbol::new(&env, "rate_per_second"), rate_per_second);
        stream_data.set(Symbol::new(&env, "start_time"), start_time.unwrap_or(env.ledger().timestamp()));
        stream_data.set(Symbol::new(&env, "end_time"), end_time);
        stream_data.set(Symbol::new(&env, "paused"), false);
        stream_data.set(Symbol::new(&env, "paused_at"), None::<u64>);
        stream_data.set(Symbol::new(&env, "resumed_at"), None::<u64>);
        stream_data.set(Symbol::new(&env, "total_withdrawn"), 0i128);
        stream_data.set(Symbol::new(&env, "created_at"), env.ledger().timestamp());
        
        env.storage()
            .instance()
            .set(&Symbol::new(&env, &stream_id), &stream_data);
        
        stream_id
    }

    // Pause a stream
    pub fn pause_stream(env: Env, stream_id: u32, admin: Address) {
        Self::require_admin(&env, admin);
        
        let mut stream_data = Self::get_stream_data(&env, stream_id);
        stream_data.set(Symbol::new(&env, "paused"), true);
        stream_data.set(Symbol::new(&env, "paused_at"), Some(env.ledger().timestamp()));
        env.storage()
            .instance()
            .set(&Symbol::new(&env, &stream_id), &stream_data);
    }

    // Resume a stream
    pub fn resume_stream(env: Env, stream_id: u32, admin: Address) {
        Self::require_admin(&env, admin);
        
        let mut stream_data = Self::get_stream_data(&env, stream_id);
        stream_data.set(Symbol::new(&env, "paused"), false);
        stream_data.set(Symbol::new(&env, "resumed_at"), Some(env.ledger().timestamp()));
        env.storage()
            .instance()
            .set(&Symbol::new(&env, &stream_id), &stream_data);
    }

    // Calculate available amount for withdrawal
    pub fn calculate_available(env: Env, stream_id: u32) -> i128 {
        let stream_data = Self::get_stream_data(&env, stream_id);
        let rate_per_second: i128 = stream_data
            .get(Symbol::new(&env, "rate_per_second"))
            .unwrap();
        let start_time: u64 = stream_data
            .get(Symbol::new(&env, "start_time"))
            .unwrap();
        let end_time: Option<u64> = stream_data
            .get(Symbol::new(&env, "end_time"));
        let total_withdrawn: i128 = stream_data
            .get(Symbol::new(&env, "total_withdrawn"))
            .unwrap();
        let paused: bool = stream_data.get(Symbol::new(&env, "paused")).unwrap();
        
        if paused {
            return 0;
        }
        
        let current_time = env.ledger().timestamp();
        
        // Check if stream has ended
        if let Some(end) = end_time {
            if current_time >= end {
                let elapsed_seconds = end.saturating_sub(start_time);
                let total_owed = rate_per_second * elapsed_seconds as i128;
                return total_owed.saturating_sub(total_withdrawn);
            }
        }
        
        // Check if stream has started
        if current_time <= start_time {
            return 0;
        }
        
        let elapsed_seconds = current_time.saturating_sub(start_time);
        let total_owed = rate_per_second * elapsed_seconds as i128;
        
        total_owed.saturating_sub(total_withdrawn)
    }

    // Withdraw from a stream
    pub fn withdraw(env: Env, stream_id: u32, amount: i128, recipient: Address) {
        let available = Self::calculate_available(&env, stream_id);
        require!(amount <= available, "Insufficient available amount");
        
        let mut stream_data = Self::get_stream_data(&env, stream_id);
        let total_withdrawn: i128 = stream_data
            .get(Symbol::new(&env, "total_withdrawn"))
            .unwrap();
        
        stream_data.set(Symbol::new(&env, "total_withdrawn"), total_withdrawn + amount);
        env.storage()
            .instance()
            .set(&Symbol::new(&env, &stream_id), &stream_data);
        
        // In a real implementation, this would transfer tokens
        // For now, we just update the accounting
    }

    // Get stream information
    pub fn get_stream(env: Env, stream_id: u32) -> Map<Symbol, soroban_sdk::Val> {
        Self::get_stream_data(&env, stream_id)
    }

    // Get all streams for a user
    pub fn get_user_streams(env: Env, user: Address) -> Vec<u32> {
        let mut user_streams = Vec::new(&env);
        let mut stream_id = 0u32;
        
        // In a real implementation, we'd iterate through all streams
        // For now, return empty vector as placeholder
        user_streams
    }

    // Helper functions
    fn get_next_stream_id(env: &Env) -> u32 {
        let current_id = env
            .storage()
            .instance()
            .get(&Symbol::new(env, "next_stream_id"))
            .unwrap_or(0u32);
        let next_id = current_id + 1;
        env.storage()
            .instance()
            .set(&Symbol::new(env, "next_stream_id"), &next_id);
        next_id
    }

    fn get_stream_data(env: &Env, stream_id: u32) -> Map<Symbol, soroban_sdk::Val> {
        env.storage()
            .instance()
            .get(&Symbol::new(env, &stream_id))
            .unwrap_or_else(|| panic!("Stream not found"))
    }

    fn require_admin(env: &Env, admin: Address) {
        let contract_admin: Address = env
            .storage()
            .instance()
            .get(&Symbol::new(env, "admin"))
            .unwrap();
        require!(admin == contract_admin, "Not authorized");
    }
}
