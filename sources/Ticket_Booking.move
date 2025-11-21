module BookMyShow::TicketBookingV3 {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event;
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use std::string::{Self, String};

    /// Error codes
    const E_INSUFFICIENT_BALANCE: u64 = 1;

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

    /// New book_ticket function with String arguments
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
}
