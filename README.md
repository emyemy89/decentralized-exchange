# Decentralized Exchange (DEX) - Frontend Integration

This project integrates a React frontend with Hardhat smart contracts for a decentralized exchange.

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

## Setup Instructions

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Deploy Contracts to Local Network

```bash
# Start local Hardhat network
npx hardhat node

# In another terminal, deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Update Frontend Configuration

After deployment, update the contract addresses in the frontend:

1. Copy the DEX contract address from the deployment output
2. Update `frontend/src/utils/contractConfig.js`:
   ```javascript
   export const DEX_CONTRACT_ADDRESS = "YOUR_DEX_ADDRESS_HERE";
   ```

3. Update `frontend/src/App.jsx` with the token addresses:
   ```javascript
   setTokenAAddress('YOUR_TOKEN_A_ADDRESS');
   setTokenBAddress('YOUR_TOKEN_B_ADDRESS');
   ```

### 4. Start the Frontend

```bash
cd frontend
npm run dev
```

### 5. Connect MetaMask

1. Open MetaMask
2. Add the local Hardhat network:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

3. Import the Hardhat test account:
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - This account has 10,000 ETH for testing

## Features

### Frontend Features
- ✅ MetaMask wallet connection
- ✅ Display wallet and DEX balances
- ✅ Deposit tokens into DEX
- ✅ Create buy orders
- ✅ Real-time balance updates
- ✅ Transaction status messages

### Smart Contract Features
- ✅ ERC-20 token contracts (AssetToken)
- ✅ DEX contract with order book
- ✅ Deposit/withdraw functionality
- ✅ Buy/sell order creation
- ✅ Order matching and execution
- ✅ Event emission for tracking

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to connect MetaMask
2. **Configure Tokens**: Set the token addresses (pre-filled after deployment)
3. **View Balances**: See your wallet and DEX balances for both tokens
4. **Deposit Tokens**: Deposit Token A into the DEX for trading
5. **Create Orders**: Create buy orders for Token A using Token B as payment

## Testing

Run the Solidity tests:
```bash
npx hardhat test --config hardhat.config.cjs
```

## Development Notes

- The frontend connects to `localhost:8545` (Hardhat local network)
- All amounts are handled in wei (1 ETH = 10^18 wei)
- The DEX uses a simple order book model
- Orders are matched when `buy.price >= sell.price`
- The frontend automatically refreshes balances after transactions

## Next Steps

- Add sell order creation
- Implement order book display
- Add order matching functionality
- Improve UI/UX design
- Add more comprehensive error handling
- Implement order cancellation