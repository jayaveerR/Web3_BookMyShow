module BookMyShow::Refund {
    use std::signer;
    use std::string::{Self, String};
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_token::token;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::timestamp;

    /// Error codes
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_TOKEN_NOT_FOUND: u64 = 2;
    const E_INSUFFICIENT_FUNDS: u64 = 3;

    struct RefundEvents has key {
        refund_events: event::EventHandle<RefundEvent>,
    }

    struct RefundEvent has drop, store {
        user: address,
        token_name: String,
        amount: u64,
        timestamp: u64,
    }

    struct ModuleData has key {
        signer_cap: account::SignerCapability,
    }

    const SEED: vector<u8> = b"Refund";

    fun init_module(resource_signer: &signer) {
        let (resource_account_signer, signer_cap) = account::create_resource_account(resource_signer, SEED);
        move_to(resource_signer, ModuleData { signer_cap });
        
        // Register for AptosCoin so it can hold funds
        coin::register<AptosCoin>(&resource_account_signer);
    }

    /// Admin can deposit funds into the refund contract
    public entry fun deposit_funds(admin: &signer, amount: u64) acquires ModuleData {
        let module_data = borrow_global<ModuleData>(@BookMyShow);
        let resource_signer = account::create_signer_with_capability(&module_data.signer_cap);
        let resource_addr = signer::address_of(&resource_signer);
        
        coin::transfer<AptosCoin>(admin, resource_addr, amount);
    }

    /// User requests a refund
    public entry fun refund_ticket(
        user: &signer,
        movie_name: String,
        seats: String,
        amount: u64
    ) acquires ModuleData, RefundEvents {
        let user_addr = signer::address_of(user);
        
        // 1. Construct Token Name: "Movie Name - Seats"
        let name_builder = string::utf8(b"");
        string::append(&mut name_builder, movie_name);
        string::append_utf8(&mut name_builder, b" - ");
        string::append(&mut name_builder, seats);
        let token_name = name_builder;

        // 2. Define Creator Address (Hardcoded as per user request)
        let creator_addr = @0x2e00b89861208db9a393d5ea0def213dd55fa17f4c4c668258a7d7b00cceb38a;
        let collection_name = string::utf8(b"BookMyShow NFT Tickets");

        // 3. Burn the Token
        token::burn(
            user,
            creator_addr,
            collection_name,
            token_name,
            0, // property_version
            1  // amount
        );

        // 4. Transfer Refund
        let module_data = borrow_global<ModuleData>(@BookMyShow);
        let resource_signer = account::create_signer_with_capability(&module_data.signer_cap);
        let resource_addr = signer::address_of(&resource_signer);
        
        // Ensure contract has funds
        assert!(coin::balance<AptosCoin>(resource_addr) >= amount, E_INSUFFICIENT_FUNDS);
        
        coin::transfer<AptosCoin>(&resource_signer, user_addr, amount);

        // 5. Emit Event
        if (!exists<RefundEvents>(user_addr)) {
            move_to(user, RefundEvents {
                refund_events: account::new_event_handle<RefundEvent>(user),
            });
        };
        
        let refund_events = borrow_global_mut<RefundEvents>(user_addr);
        event::emit_event(&mut refund_events.refund_events, RefundEvent {
            user: user_addr,
            token_name,
            amount,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Deprecated: Use refund_ticket instead
    public entry fun refund_and_burn(
        user: &signer,
        _creator_addr: address,
        _collection_name: String,
        _token_name: String,
        _amount: u64
    ) {
        abort 0 // Deprecated
    }
}
