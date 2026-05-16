use soroban_sdk::{Address, Env, Symbol};
use soroban_sdk::testutils::{Address as _, Ledger as _};

#[test]
fn test_init() {
    let env = Env::default();
    let contract_id = env.register_contract(None, inflowa_stream::InflowaStream);
    let client = inflowa_stream::InflowaStreamClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    client.init(&admin);
    
    // Verify admin is set
    assert_eq!(client.get_admin(), admin);
}

#[test]
fn test_create_stream() {
    let env = Env::default();
    let contract_id = env.register_contract(None, inflowa_stream::InflowaStream);
    let client = inflowa_stream::InflowaStreamClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    client.init(&admin);
    
    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);
    let rate_per_second = 1000i128;
    
    let stream_id = client.create_stream(
        &sender,
        &recipient,
        &rate_per_second,
        &Some(100),
        &None
    );
    
    assert_eq!(stream_id, 1);
    
    // Verify stream data
    let stream = client.get_stream(&stream_id);
    assert_eq!(stream.get(Symbol::new(&env, "sender")), sender);
    assert_eq!(stream.get(Symbol::new(&env, "recipient")), recipient);
    assert_eq!(stream.get(Symbol::new(&env, "rate_per_second")), rate_per_second);
    assert_eq!(stream.get(Symbol::new(&env, "paused")), false);
}

#[test]
fn test_pause_stream() {
    let env = Env::default();
    let contract_id = env.register_contract(None, inflowa_stream::InflowaStream);
    let client = inflowa_stream::InflowaStreamClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    client.init(&admin);
    
    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);
    let stream_id = client.create_stream(&sender, &recipient, &1000i128, &Some(100), &None);
    
    // Pause the stream
    client.pause_stream(&stream_id, &admin);
    
    let stream = client.get_stream(&stream_id);
    assert_eq!(stream.get(Symbol::new(&env, "paused")), true);
}

#[test]
fn test_pause_stream_unauthorized() {
    let env = Env::default();
    let contract_id = env.register_contract(None, inflowa_stream::InflowaStream);
    let client = inflowa_stream::InflowaStreamClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    client.init(&admin);
    
    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);
    let unauthorized = Address::generate(&env);
    let stream_id = client.create_stream(&sender, &recipient, &1000i128, &Some(100), &None);
    
    // Try to pause with unauthorized address - should fail
    let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
        client.pause_stream(&stream_id, &unauthorized);
    }));
    
    assert!(result.is_err());
}

#[test]
fn test_resume_stream() {
    let env = Env::default();
    let contract_id = env.register_contract(None, inflowa_stream::InflowaStream);
    let client = inflowa_stream::InflowaStreamClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    client.init(&admin);
    
    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);
    let stream_id = client.create_stream(&sender, &recipient, &1000i128, &Some(100), &None);
    
    client.pause_stream(&stream_id, &admin);
    client.resume_stream(&stream_id, &admin);
    
    let stream = client.get_stream(&stream_id);
    assert_eq!(stream.get(Symbol::new(&env, "paused")), false);
}

#[test]
fn test_calculate_available() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, inflowa_stream::InflowaStream);
    let client = inflowa_stream::InflowaStreamClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    client.init(&admin);
    
    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);
    let rate_per_second = 100i128;
    let start_time = 100u64;
    
    let stream_id = client.create_stream(&sender, &recipient, &rate_per_second, &Some(start_time), &None);
    
    // Advance time by 10 seconds
    env.ledger().set_timestamp(start_time + 10);
    
    let available = client.calculate_available(&stream_id);
    assert_eq!(available, 1000i128); // 100 * 10
}

#[test]
fn test_calculate_available_paused() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, inflowa_stream::InflowaStream);
    let client = inflowa_stream::InflowaStreamClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    client.init(&admin);
    
    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);
    let rate_per_second = 100i128;
    let start_time = 100u64;
    
    let stream_id = client.create_stream(&sender, &recipient, &rate_per_second, &Some(start_time), &None);
    
    // Advance time
    env.ledger().set_timestamp(start_time + 10);
    
    // Pause the stream
    client.pause_stream(&stream_id, &admin);
    
    let available = client.calculate_available(&stream_id);
    assert_eq!(available, 0i128); // Paused streams return 0
}

#[test]
fn test_calculate_available_with_end_time() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, inflowa_stream::InflowaStream);
    let client = inflowa_stream::InflowaStreamClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    client.init(&admin);
    
    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);
    let rate_per_second = 100i128;
    let start_time = 100u64;
    let end_time = 200u64;
    
    let stream_id = client.create_stream(&sender, &recipient, &rate_per_second, &Some(start_time), &Some(end_time));
    
    // Advance time past end time
    env.ledger().set_timestamp(end_time + 50);
    
    let available = client.calculate_available(&stream_id);
    assert_eq!(available, 10000i128); // 100 * 100 seconds duration
}

#[test]
fn test_withdraw() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, inflowa_stream::InflowaStream);
    let client = inflowa_stream::InflowaStreamClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    client.init(&admin);
    
    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);
    let rate_per_second = 100i128;
    let start_time = 100u64;
    
    let stream_id = client.create_stream(&sender, &recipient, &rate_per_second, &Some(start_time), &None);
    
    // Advance time
    env.ledger().set_timestamp(start_time + 10);
    
    let available = client.calculate_available(&stream_id);
    client.withdraw(&stream_id, &available, &recipient);
    
    // Verify total_withdrawn updated
    let stream = client.get_stream(&stream_id);
    assert_eq!(stream.get(Symbol::new(&env, "total_withdrawn")), available);
    
    // Available should now be 0
    let new_available = client.calculate_available(&stream_id);
    assert_eq!(new_available, 0i128);
}

#[test]
fn test_withdraw_insufficient() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, inflowa_stream::InflowaStream);
    let client = inflowa_stream::InflowaStreamClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    client.init(&admin);
    
    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);
    let stream_id = client.create_stream(&sender, &recipient, &100i128, &Some(100), &None);
    
    // Try to withdraw more than available
    let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
        client.withdraw(&stream_id, &10000i128, &recipient);
    }));
    
    assert!(result.is_err());
}

#[test]
fn test_get_stream_not_found() {
    let env = Env::default();
    let contract_id = env.register_contract(None, inflowa_stream::InflowaStream);
    let client = inflowa_stream::InflowaStreamClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    client.init(&admin);
    
    // Try to get non-existent stream
    let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
        client.get_stream(&999);
    }));
    
    assert!(result.is_err());
}

#[test]
fn test_multiple_streams() {
    let env = Env::default();
    let contract_id = env.register_contract(None, inflowa_stream::InflowaStream);
    let client = inflowa_stream::InflowaStreamClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    client.init(&admin);
    
    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);
    
    let stream_id_1 = client.create_stream(&sender, &recipient, &100i128, &Some(100), &None);
    let stream_id_2 = client.create_stream(&sender, &recipient, &200i128, &Some(100), &None);
    let stream_id_3 = client.create_stream(&sender, &recipient, &300i128, &Some(100), &None);
    
    assert_eq!(stream_id_1, 1);
    assert_eq!(stream_id_2, 2);
    assert_eq!(stream_id_3, 3);
}
