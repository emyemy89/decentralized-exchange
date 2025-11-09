# BridgePoint DEX Project 

## Introduction

This is a **Decentralized Exchange (DEX)** capable of doing the following:
- Users can deposit tokens, like Token A and B
- Users can create buy/sell orders (ex, 'I want to buy 10 Token A for 2 Token B each'
- The system matches orders and executes trades automatically

---

## How to test

### **Step 1: Ensure everything is installed**

```bash
#  in root
npm install

# cd to the frontend folder
cd frontend
npm install
cd ..
```


### **Step 2: Start local BC**

Open Terminal 1:
```bash
# in root
npx hardhat node
```

This creates the local Ethereum network

### **Step 3: Deploy contracts**

Open Terminal 2 (new terminal window):
```bash
# in root
npx hardhat run scripts/deploy.js --network localhost
```

**Copy the contract addresses** it gives Token A, Token B, DEX address


### **Step 4: Configure Metamask**

1. Open MetaMask browser extension
2. Click network dropdown → "Add Network" → "Add a network manually"
3. Fill in:
   - **Network Name:** Hardhat Local
   - **RPC URL:** http://127.0.0.1:8545
   - **Chain ID:** 31337
   - **Currency Symbol:** ETH
4. Click "Save"

5. Import a test account:
   - Click the account icon → “Import Account”
   - Import address 1 or address 2 from  `npx hardhat node` terminal output
   - The user may import one or both of them into MetaMask to test deposits, orders, and trades


### **Step 5: Start FE**

Open Terminal 3:
```bash
cd frontend
npm run dev
```

### **Step 6: Test**

1. Open browser to localhost
2. Click "Connect Wallet" in MetaMask
3. The user should see the balances
4. Try depositing some tokens
5. Create a buy or sell order

---

## How it all works together

```
User Opens Browser
       ↓
Connects MetaMask Wallet
       ↓
FE loads contract addresses
       ↓
User clicks "Deposit" or "Create order"
       ↓
FE calls smart contract function
       ↓
Smart contract executes on blockchain
       ↓
Transaction confirmed → FE updates UI
```
