# BridgePoint DEX Project 

## Introduction

This is a **Decentralized Exchange (DEX)** capable of doing the following:
- Users can deposit tokens (like Token A and Token B)
- Users can create buy/sell orders (e.g., "I want to buy 10 Token A for 2 Token B each")
- The system matches compatible orders and executes trades automatically
- Everything is stored on the blockchain (transparent and secure)

---

## Project Structure 

```
decentralized-exchange/
├── contracts/           # Solidity smart contracts
│   ├── AssetToken.sol   # ERC-20 token contract
│   └── DEX.sol          # Main DEX contract
├── frontend/            # React + Vite frontend
│   ├── src/
│   │   ├── hooks/
│   │   │   └── useDEX.js        # Custom hook for DEX interactions
│   │   ├── utils/
│   │   │   └── contractConfig.js # Contract addresses and ABIs
│   │   └── App.jsx             # Main React component
│   └── package.json
├── scripts/
│   └── deploy.js        # Deployment script
└── hardhat.config.cjs   # Hardhat configuration
```

### **Backend (Smart Contracts)** - `/contracts`

**1. `AssetToken.sol`** - Your Cryptocurrency Token
- This creates a basic token (like Ethereum's ERC-20 standard)
- You can mint tokens, transfer them, etc.
- Think of it as "coins" people can trade

**2. `DEX.sol`** - The Exchange Logic
- This is the **brain** of your exchange
- Handles deposits, withdrawals, order creation, and order matching
- Stores all orders in an "order book" (like a stock exchange board)

**Key Functions:**
- `deposit()` - Put tokens into the exchange
- `withdraw()` - Take tokens out
- `createBuyOrder()` - "I want to buy X tokens"
- `createSellOrder()` - "I want to sell X tokens"
- `matchOrders()` - Automatically matches buy/sell orders

### **Frontend in React** - `/frontend`

**What it does:**
- Beautiful web interface to interact with your smart contracts
- Users can connect their MetaMask wallet
- View balances, create orders, see the order book
- Everything happens through a web browser

**Key Files:**
- `App.jsx` - Main UI component
- `hooks/useDEX.js` - Connects frontend to blockchain
- `utils/contractConfig.js` - Contract addresses and ABIs (the "interface")

### **Deployment** - `/scripts`

**`deploy.js`** - Deploys your contracts to the blockchain
- Creates Token A and Token B
- Deploys the DEX contract
- Gives you addresses to use in the frontend

### **Configuration** - Root Directory

**`hardhat.config.cjs`** - Configures Hardhat (development tool)
- Sets Solidity version
- Configures networks (local testnet, Sepolia testnet, etc.)
- Most important config file!

---

## How it all works together

```
User Opens Browser
       ↓
Connects MetaMask Wallet
       ↓
Frontend (React) loads contract addresses
       ↓
User clicks "Deposit" or "Create Order"
       ↓
Frontend calls smart contract function via ethers.js
       ↓
Smart contract executes on blockchain
       ↓
Transaction confirmed → Frontend updates UI
```

**Example Flow:**
1. User wants to buy 10 Token A for 2 Token B each
2. User fills form in frontend → clicks "Create Buy Order"
3. Frontend sends transaction to `DEX.sol` → `createBuyOrder()`
4. Smart contract checks: Does user have enough Token B? (they need 20 Token B)
5. If yes: Creates order, deducts 20 Token B from user's balance
6. Order appears in order book
7. Another user can create a matching sell order
8. `matchOrders()` function executes the trade automatically

---


## How to test (Simple Steps)

### **Step 1: Make Sure Everything Is Installed**

```bash
#  in root
npm install

# cd to the frontend folder
cd frontend
npm install
cd ..
```


### **Step 2: Start Local Blockchain**

Open Terminal 1:
```bash
# in root
npx hardhat node
```

This creates the local Ethereum network

### **Step 3: Deploy Contracts**

Open Terminal 2 (new terminal window):
```bash
# in root
npx hardhat run scripts/deploy.js --network localhost
```

**Copy the contract addresses** it gives you (Token A, Token B, DEX address)

### **Step 4: Update Frontend Config**

Update `frontend/src/utils/contractConfig.js`:
- Replace `DEX_CONTRACT_ADDRESS` with the address from Step 4

Update `frontend/src/App.jsx`:
- Replace the token addresses in the `useEffect` with addresses from Step 4

### **Step 5: Configure MetaMask**

1. Open MetaMask browser extension
2. Click network dropdown → "Add Network" → "Add a network manually"
3. Fill in:
   - **Network Name:** Hardhat Local
   - **RPC URL:** http://127.0.0.1:8545
   - **Chain ID:** 31337
   - **Currency Symbol:** ETH
4. Click "Save"

5. Import a test account:
   - Click your account icon → “Import Account”
   - Import Address 1 or Address 2 from your `npx hardhat node` output
   - These are the two funded accounts used by the deploy script for Token A and Token B
   - You may import one or both of them into MetaMask to test deposits, orders, and trades


### **Step 6: Start Frontend**

Open Terminal 3:
```bash
cd frontend
npm run dev
```

### **Step 8: Test**

1. Open browser to localhost
2. Click "Connect Wallet" in MetaMask
3. You should see your balances
4. Try depositing some tokens
5. Create a buy or sell order

---
