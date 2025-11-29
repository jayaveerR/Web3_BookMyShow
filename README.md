# 🎬 Web3 BookMyShow

A decentralized movie ticketing platform built on the **Aptos Blockchain**. This application allows users to book movie tickets using cryptocurrency (APT), mint them as verifiable NFTs, and manage their bookings with a modern, user-friendly interface.

🔗 **Live Demo:** [https://web3-book-my-show1.vercel.app](https://web3-book-my-show1.vercel.app)

---

## 🚀 Key Features

*   **🔐 Wallet Authentication**: Secure login using **Petra Wallet**.
*   **🎟️ NFT Tickets**: Every booked ticket is minted as a unique **NFT** on the Aptos blockchain, ensuring authenticity and ownership.
*   **💺 Interactive Seat Booking**: Real-time seat selection with dynamic pricing tiers (Premium Balcony, Sofa, First Class).
*   **💰 Crypto Payments**: Seamless payments using **APT** tokens.
*   **🎁 Rewards System**: Earn APT rewards for every booking and redeem them for discounts.
*   **🔄 Refunds & Cancellations**: Request refunds for cancelled tickets (handled via smart contracts and backend verification).
*   **📂 IPFS Storage**: Ticket metadata and images are decentralized using **IPFS (Pinata)**.
*   **📜 Booking History**: View all past transactions and minted NFTs.
*   **📲 Ticket Transfer**: Easily transfer NFT tickets to friends.

---

## 🛠️ Tech Stack

### **Frontend**
*   **React.js** (Vite)
*   **Tailwind CSS** & **Shadcn UI** (Styling)
*   **Framer Motion** (Animations)
*   **Aptos SDK** (Blockchain Interaction)
*   **Lucide React** (Icons)

### **Backend**
*   **Node.js** & **Express.js**
*   **MongoDB** (Database for history & caching)
*   **Mongoose** (ODM)

### **Blockchain**
*   **Aptos** (Layer 1 Blockchain)
*   **Move Language** (Smart Contracts)
*   **Petra Wallet** (Wallet Provider)
*   **Pinata** (IPFS Provider)

---

## 📂 Project Structure

The project is organized into three main directories:

```
root/
├── 📁 frontend/      # React Application (UI & Logic)
├── 📁 backend/       # Express Server (API & Database)
└── 📁 aptos/         # Smart Contracts (Move Modules)
```

---

## ⚙️ Setup Instructions

### Prerequisites
*   Node.js (v16+)
*   MongoDB (Local or Atlas)
*   Aptos CLI (for smart contract deployment)
*   Petra Wallet Extension

### 1. Clone the Repository
```bash
git clone https://github.com/jayaveerR/Web3_BookMyShow.git
cd Web3_BookMyShow
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in `frontend/`:
```env
VITE_APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
VITE_APTOS_ADDRESS=0xeeccc2d73cad08f9be2e6b3c3d394b3677bdff0350b68ec45f95b3bcaec1f8b1
VITE_API_URL=http://localhost:5000
VITE_PINATA_JWT=your_pinata_jwt_here
```
Run the frontend:
```bash
npm run dev
```

### 3. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the **root** directory (or `backend/`):
```env
MANGO_DB=your_mongodb_connection_string
PORT=5000
```
Run the backend:
```bash
npm start
```

### 4. Smart Contract Deployment (Optional)
If you want to deploy your own contracts:
```bash
cd aptos
aptos init
aptos move publish --named-addresses TicketBooking=default
```

---

## 📡 API Endpoints

The backend provides the following REST API endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/bookings` | Save a new booking |
| `GET` | `/api/bookings/:walletAddress` | Get booking history for a wallet |
| `POST` | `/api/refund` | Request a refund |
| `GET` | `/api/refunds/:walletAddress` | Get refund history |
| `GET` | `/api/refund/check/:txHash` | Check refund status by transaction hash |
| `POST` | `/api/transaction-hash` | Save transaction details |
| `GET` | `/api/transaction-hash/:walletAddress` | Get all transactions |

---

## 🧩 Smart Contracts

*   **`Ticket_Booking.move`**: Handles the logic for booking tickets, verifying payments, and managing seat availability.
*   **`Nft_Mint.move`**: Manages the minting of NFT tickets, setting metadata (IPFS links), and transferring ownership to the user.

---

## 📸 Screenshots

*(Add screenshots of your Login Page, Movie Grid, and Seat Selection here)*

---

## 📄 License

This project is licensed under the MIT License.
