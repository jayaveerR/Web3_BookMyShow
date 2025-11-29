module BookMyShow::TicketTrade {
    use std::signer;
    use std::string::String;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_token::token;
    use aptos_framework::account;
    use std::vector;

    /// Error codes
    const E_TRADE_ALREADY_EXISTS: u64 = 1;
    const E_TRADE_NOT_FOUND: u64 = 2;
    const E_NOT_AUTHORIZED: u64 = 3;
    const E_INSUFFICIENT_BALANCE: u64 = 4;

    /// The owner address for commission (5%)
    const OWNER_ADDRESS: address = @0x7d467845ae28ea6b0adf38546c6fd0a1ba70733ed825a10c32d5a456bedb7d46;
    const COMMISSION_PERCENTAGE: u64 = 5; 

    /// Resource Account Seed
    const SEED: vector<u8> = b"TicketTradeV1";

    struct ModuleData has key {
        signer_cap: account::SignerCapability,
    }

    struct TradeOffer has store, drop {
        seller: address,
        buyer: address, // Specific buyer
        token_id: token::TokenId,
        price: u64,
        locked: bool,
    }

    struct TradeStore has key {
        trades: vector<TradeOffer>,
    }

    /// Initialize the module and resource account for escrow
    fun init_module(resource_signer: &signer) {
        let (resource_account_signer, signer_cap) = account::create_resource_account(resource_signer, SEED);
        move_to(resource_signer, ModuleData { signer_cap });
        
        // Initialize TradeStore in the Resource Account
        move_to(&resource_account_signer, TradeStore {
            trades: vector::empty<TradeOffer>(),
        });
    }

    /// Create a Trade: Seller locks token in Escrow
    public entry fun create_trade(
        seller: &signer,
        buyer: address,
        creator: address,
        collection_name: String,
        token_name: String,
        property_version: u64,
        price: u64
    ) acquires ModuleData, TradeStore {
        let seller_addr = signer::address_of(seller);
        let token_id = token::create_token_id_raw(creator, collection_name, token_name, property_version);

        // 1. Get Resource Account Signer
        let module_data = borrow_global<ModuleData>(@BookMyShow);
        let resource_signer = account::create_signer_with_capability(&module_data.signer_cap);
        let resource_addr = signer::address_of(&resource_signer);

        // 2. Transfer Token to Resource Account (Escrow)
        // Seller must have opted in or approved. 
        // For simplicity, we assume direct_transfer is enabled or we use transfer with opt-in.
        // Here we use `token::transfer` assuming the resource account is opted in (it can opt itself in).
        if (!token::check_collection_exists(resource_addr, collection_name)) {
             // Resource account might need to opt-in to direct transfer if not already
             token::opt_in_direct_transfer(&resource_signer, true);
        };
        
        token::transfer(seller, token_id, resource_addr, 1);

        // 3. Store Trade Offer
        let trade_store = borrow_global_mut<TradeStore>(resource_addr);
        let offer = TradeOffer {
            seller: seller_addr,
            buyer,
            token_id,
            price,
            locked: true,
        };
        vector::push_back(&mut trade_store.trades, offer);
    }

    /// Execute Trade: Buyer pays, Token transferred to Buyer
    public entry fun execute_trade(
        buyer: &signer,
        seller_addr: address,
        creator: address,
        collection_name: String,
        token_name: String,
        property_version: u64
    ) acquires ModuleData, TradeStore {
        let buyer_addr = signer::address_of(buyer);
        let token_id = token::create_token_id_raw(creator, collection_name, token_name, property_version);

        // 1. Get Resource Account
        let module_data = borrow_global<ModuleData>(@BookMyShow);
        let resource_signer = account::create_signer_with_capability(&module_data.signer_cap);
        let resource_addr = signer::address_of(&resource_signer);

        // 2. Find the Trade
        let trade_store = borrow_global_mut<TradeStore>(resource_addr);
        let trades_len = vector::length(&trade_store.trades);
        let i = 0;
        let found = false;
        let trade_index = 0;

        while (i < trades_len) {
            let offer = vector::borrow(&trade_store.trades, i);
            if (offer.seller == seller_addr && offer.token_id == token_id && offer.buyer == buyer_addr) {
                found = true;
                trade_index = i;
                break
            };
            i = i + 1;
        };

        assert!(found, E_TRADE_NOT_FOUND);

        // 3. Remove Trade (Pop swap)
        let offer = vector::remove(&mut trade_store.trades, trade_index);

        // 4. Payment Logic
        let price = offer.price;
        let commission = (price * COMMISSION_PERCENTAGE) / 100;
        let seller_amount = price - commission;

        // Pay Owner (Commission)
        coin::transfer<AptosCoin>(buyer, OWNER_ADDRESS, commission);
        // Pay Seller
        coin::transfer<AptosCoin>(buyer, seller_addr, seller_amount);

        // 5. Transfer Token from Escrow to Buyer
        token::transfer(&resource_signer, token_id, buyer_addr, 1);
    }

    /// Cancel Trade: Seller retrieves token
    public entry fun cancel_trade(
        seller: &signer,
        creator: address,
        collection_name: String,
        token_name: String,
        property_version: u64
    ) acquires ModuleData, TradeStore {
        let seller_addr = signer::address_of(seller);
        let token_id = token::create_token_id_raw(creator, collection_name, token_name, property_version);

        let module_data = borrow_global<ModuleData>(@BookMyShow);
        let resource_signer = account::create_signer_with_capability(&module_data.signer_cap);
        let resource_addr = signer::address_of(&resource_signer);

        let trade_store = borrow_global_mut<TradeStore>(resource_addr);
        let trades_len = vector::length(&trade_store.trades);
        let i = 0;
        let found = false;
        let trade_index = 0;

        while (i < trades_len) {
            let offer = vector::borrow(&trade_store.trades, i);
            if (offer.seller == seller_addr && offer.token_id == token_id) {
                found = true;
                trade_index = i;
                break
            };
            i = i + 1;
        };

        assert!(found, E_TRADE_NOT_FOUND);

        // Remove and Refund
        let _offer = vector::remove(&mut trade_store.trades, trade_index);
        
        // Transfer back to Seller
        token::transfer(&resource_signer, token_id, seller_addr, 1);
    }
}
