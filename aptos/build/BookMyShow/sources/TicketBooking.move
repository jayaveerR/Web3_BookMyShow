module BookMyShow::TicketBooking {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event;
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use std::string::String;

    /// Error codes
    const E_INSUFFICIENT_BALANCE: u64 = 1;

    struct BookingEvents has key {
        ticket_booked_events: event::EventHandle<TicketBookedEvent>,
    }

    struct TicketBookedEvent has drop, store {
        buyer: address,
        movie_id: vector<u8>,
        seat_number: vector<u8>,
        price: u64,
        timestamp: u64,
    }

    struct TicketBookedEventV2 has drop, store {
        buyer: address,
        movie_id: vector<u8>,
        movie_name: vector<u8>,
        location: vector<u8>,
        date: vector<u8>,
        seat_number: vector<u8>,
        price: u64,
        timestamp: u64,
    }

    struct BookingEventsV3 has key {
        ticket_booked_events_v3: event::EventHandle<TicketBookedEventV3>,
    }

    struct TicketBookedEventV3 has drop, store {
        buyer: address,
        movie_id: String,
        movie_name: String,
        location: String,
        date: String,
        seat_number: String,
        price: u64,
        timestamp: u64,
    }

    struct BookingEventsV4 has key {
        ticket_booked_events_v4: event::EventHandle<TicketBookedEventV4>,
    }

    struct TicketBookedEventV4 has drop, store {
        buyer: address,
        movie_name: String,
        location: String,
        date: String,
        seat_number: String,
        timestamp: u64,
    }

    /// Original book_ticket function
    public entry fun book_ticket(
        buyer: &signer,
        treasury_address: address,
        movie_id: vector<u8>,
        seat_number: vector<u8>,
        price: u64
    ) acquires BookingEvents {
        let buyer_addr = signer::address_of(buyer);
        coin::transfer<AptosCoin>(buyer, treasury_address, price);
        if (!exists<BookingEvents>(buyer_addr)) {
            move_to(buyer, BookingEvents {
                ticket_booked_events: account::new_event_handle<TicketBookedEvent>(buyer),
            });
        };
        let booking_events = borrow_global_mut<BookingEvents>(buyer_addr);
        event::emit_event(&mut booking_events.ticket_booked_events, TicketBookedEvent {
            buyer: buyer_addr,
            movie_id,
            seat_number,
            price,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// V2 book_ticket function
    public entry fun book_ticket_v2(
        buyer: &signer,
        treasury_address: address,
        movie_id: vector<u8>,
        movie_name: vector<u8>,
        location: vector<u8>,
        date: vector<u8>,
        seat_number: vector<u8>,
        price: u64
    ) acquires BookingEventsV2 { // Changed to V2
        let buyer_addr = signer::address_of(buyer);
        coin::transfer<AptosCoin>(buyer, treasury_address, price);
        
        // Note: In previous steps we might have missed defining BookingEventsV2 properly in the deployed version? 
        // To be safe, we define it now.
        if (!exists<BookingEventsV2>(buyer_addr)) {
            move_to(buyer, BookingEventsV2 {
                ticket_booked_events_v2: account::new_event_handle<TicketBookedEventV2>(buyer),
            });
        };

        let booking_events = borrow_global_mut<BookingEventsV2>(buyer_addr);
        event::emit_event(&mut booking_events.ticket_booked_events_v2, TicketBookedEventV2 {
            buyer: buyer_addr,
            movie_id,
            movie_name,
            location,
            date,
            seat_number,
            price,
            timestamp: timestamp::now_seconds(),
        });
    }

    struct BookingEventsV2 has key {
        ticket_booked_events_v2: event::EventHandle<TicketBookedEventV2>,
    }

    /// V3 book_ticket function
    public entry fun book_ticket_v3(
        buyer: &signer,
        treasury_address: address,
        movie_id: String,
        movie_name: String,
        location: String,
        date: String,
        seat_number: String,
        price: u64
    ) acquires BookingEventsV3 {
        let buyer_addr = signer::address_of(buyer);
        coin::transfer<AptosCoin>(buyer, treasury_address, price);
        
        if (!exists<BookingEventsV3>(buyer_addr)) {
            move_to(buyer, BookingEventsV3 {
                ticket_booked_events_v3: account::new_event_handle<TicketBookedEventV3>(buyer),
            });
        };

        let booking_events = borrow_global_mut<BookingEventsV3>(buyer_addr);
        event::emit_event(&mut booking_events.ticket_booked_events_v3, TicketBookedEventV3 {
            buyer: buyer_addr,
            movie_id,
            movie_name,
            location,
            date,
            seat_number,
            price,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// V4 book_ticket function (No Price, No Movie ID)
    public entry fun book_ticket_v4(
        buyer: &signer,
        movie_name: String,
        _treasury_address: address,
        location: String,
        date: String,
        seat_number: String
    ) acquires BookingEventsV4 {
        let buyer_addr = signer::address_of(buyer);
        
        // No coin transfer as price is not passed
        
        if (!exists<BookingEventsV4>(buyer_addr)) {
            move_to(buyer, BookingEventsV4 {
                ticket_booked_events_v4: account::new_event_handle<TicketBookedEventV4>(buyer),
            });
        };

        let booking_events = borrow_global_mut<BookingEventsV4>(buyer_addr);
        event::emit_event(&mut booking_events.ticket_booked_events_v4, TicketBookedEventV4 {
            buyer: buyer_addr,
            movie_name,
            location,
            date,
            seat_number,
            timestamp: timestamp::now_seconds(),
        });
    }
    /// V5 book_ticket function (With Price and Payment Logic)
    public entry fun book_ticket_v5(
        buyer: &signer,
        movie_name: String,
        treasury_address: address,
        location: String,
        date: String,
        seat_number: String,
        price: u64
    ) acquires BookingEventsV5 {
        let buyer_addr = signer::address_of(buyer);
        
        // Transfer APT
        coin::transfer<AptosCoin>(buyer, treasury_address, price);
        
        if (!exists<BookingEventsV5>(buyer_addr)) {
            move_to(buyer, BookingEventsV5 {
                ticket_booked_events_v5: account::new_event_handle<TicketBookedEventV5>(buyer),
            });
        };

        let booking_events = borrow_global_mut<BookingEventsV5>(buyer_addr);
        event::emit_event(&mut booking_events.ticket_booked_events_v5, TicketBookedEventV5 {
            buyer: buyer_addr,
            movie_name,
            location,
            date,
            seat_number,
            price,
            timestamp: timestamp::now_seconds(),
        });
    }

    struct BookingEventsV5 has key {
        ticket_booked_events_v5: event::EventHandle<TicketBookedEventV5>,
    }

    struct TicketBookedEventV5 has drop, store {
        buyer: address,
        movie_name: String,
        location: String,
        date: String,
        seat_number: String,
        price: u64,
        timestamp: u64,
    }
}
