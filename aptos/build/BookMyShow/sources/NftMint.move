module BookMyShow::NftMintV3 {
    use std::string::{Self, String};
    use std::signer;
    use aptos_token::token;

    use aptos_framework::account;

    struct ModuleData has key {
        signer_cap: account::SignerCapability,
    }

    /// Error codes
    const E_NOT_AUTHORIZED: u64 = 1;

    /// Constants
    const COLLECTION_NAME: vector<u8> = b"BookMyShow NFT Tickets";
    const COLLECTION_DESCRIPTION: vector<u8> = b"NFT Tickets for BookMyShow bookings";
    const COLLECTION_URI: vector<u8> = b"https://bookmyshow.com/collection.png";
    const SEED: vector<u8> = b"NftMintV3";

    fun init_module(resource_signer: &signer) {
        // 1. Create Resource Account
        let (resource_account_signer, signer_cap) = account::create_resource_account(resource_signer, SEED);
        
        // 2. Store Cap in the Publisher's account (resource_signer is the publisher)
        move_to(resource_signer, ModuleData { signer_cap });

        // 3. Create Collection under Resource Account
        let collection_name = string::utf8(COLLECTION_NAME);
        let description = string::utf8(COLLECTION_DESCRIPTION);
        let collection_uri = string::utf8(COLLECTION_URI);
        let maximum_supply = 0; // Unlimited supply
        let mutate_setting = vector<bool>[ false, false, false ];

        token::create_collection(
            &resource_account_signer,
            collection_name,
            description,
            collection_uri,
            maximum_supply,
            mutate_setting
        );
    }

    public entry fun mint_ticket(
        buyer: &signer,
        movie_name: String,
        location: String,
        date: String,
        time: String,
        seats: String,
        poster_url: String
    ) acquires ModuleData {
        let buyer_addr = signer::address_of(buyer);
        
        // 1. Get Resource Account Signer
        // We borrow from the module owner (BookMyShow address)
        let module_data = borrow_global<ModuleData>(@BookMyShow);
        let resource_signer = account::create_signer_with_capability(&module_data.signer_cap);
        
        // 2. Opt-in Buyer for direct transfer (Token V1 requirement)
        token::opt_in_direct_transfer(buyer, true);

        // 3. Create Token Data
        let collection_name = string::utf8(COLLECTION_NAME);
        
        // Construct Token Name: "Movie Name - Seats"
        let name_builder = string::utf8(b"");
        string::append(&mut name_builder, movie_name);
        string::append_utf8(&mut name_builder, b" - ");
        string::append(&mut name_builder, seats);
        let final_token_name = name_builder;

        // Construct Description: "Movie at Location on Date Time. Seats: Seats"
        let description = string::utf8(b"");
        string::append(&mut description, movie_name);
        string::append_utf8(&mut description, b" at ");
        string::append(&mut description, location);
        string::append_utf8(&mut description, b" on ");
        string::append(&mut description, date);
        string::append_utf8(&mut description, b" ");
        string::append(&mut description, time);
        string::append_utf8(&mut description, b". Seats: ");
        string::append(&mut description, seats);

        let token_data_id = token::create_tokendata(
            &resource_signer, // Creator is Resource Account
            collection_name,
            final_token_name,
            description, // Updated description
            0, // maximum
            poster_url,
            buyer_addr, // royalty payee
            0, // royalty points
            0, // maximum
            token::create_token_mutability_config(&vector<bool>[ false, false, false, false, true ]),
            vector<String>[ string::utf8(b"TOKEN_BURNABLE_BY_OWNER") ],
            vector<vector<u8>>[ x"01" ], // true
            vector<String>[ string::utf8(b"bool") ],
        );

        // 4. Mint Token
        let token_id = token::mint_token(
            &resource_signer,
            token_data_id,
            1, // amount
        );

        // 5. Transfer to Buyer
        token::transfer(
            &resource_signer,
            token_id,
            buyer_addr,
            1
        );
    }
}

module BookMyShow::NftMintV2 {
    struct ModuleData has key {
        dummy: bool
    }
}

module BookMyShow::NftMint {
    use std::string::{Self, String};
    use std::signer;
    use aptos_token::token;

    use aptos_framework::account;

    struct ModuleData has key {
        signer_cap: account::SignerCapability,
    }

    const COLLECTION_NAME: vector<u8> = b"BookMyShow NFT Tickets";
    const COLLECTION_DESCRIPTION: vector<u8> = b"NFT Tickets for BookMyShow bookings";
    const COLLECTION_URI: vector<u8> = b"https://bookmyshow.com/collection.png";

    fun init_module(resource_signer: &signer) {
        let collection_name = string::utf8(COLLECTION_NAME);
        let description = string::utf8(COLLECTION_DESCRIPTION);
        let collection_uri = string::utf8(COLLECTION_URI);
        let maximum_supply = 0; 
        let mutate_setting = vector<bool>[ false, false, false ];

        token::create_collection(
            resource_signer,
            collection_name,
            description,
            collection_uri,
            maximum_supply,
            mutate_setting
        );
    }

    public entry fun mint_ticket(
        buyer: &signer,
        movie_name: String,
        location: String,
        date: String,
        time: String,
        seats: String,
        poster_url: String
    ) {
        let buyer_addr = signer::address_of(buyer);
        let collection_name = string::utf8(COLLECTION_NAME);
        let creator = buyer;

        if (!token::check_collection_exists(buyer_addr, collection_name)) {
             token::create_collection(
                creator,
                collection_name,
                string::utf8(COLLECTION_DESCRIPTION),
                string::utf8(COLLECTION_URI),
                0,
                vector<bool>[ false, false, false ]
            );
        };

        let name_builder = string::utf8(b"");
        string::append(&mut name_builder, movie_name);
        string::append_utf8(&mut name_builder, b" - ");
        string::append(&mut name_builder, seats);
        let final_token_name = name_builder;

        let token_data_id = token::create_tokendata(
            creator,
            collection_name,
            final_token_name,
            string::utf8(b"BookMyShow NFT Ticket"),
            0, 
            poster_url,
            buyer_addr, 
            0, 
            0, 
            token::create_token_mutability_config(&vector<bool>[ false, false, false, false, true ]),
            vector<String>[ string::utf8(b"Location"), string::utf8(b"Date"), string::utf8(b"Time"), string::utf8(b"Seats") ],
            vector<vector<u8>>[ *string::bytes(&location), *string::bytes(&date), *string::bytes(&time), *string::bytes(&seats) ],
            vector<String>[ string::utf8(b"string"), string::utf8(b"string"), string::utf8(b"string"), string::utf8(b"string") ],
        );

        token::mint_token(
            creator,
            token_data_id,
            1, 
        );
    }
}
