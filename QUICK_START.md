# Quick Start Guide - Testing the DEX

## Complete Setup Steps

### Step 1: Compile Contracts
```bash
npx hardhat compile
```
**Why:** Compiles Solidity contracts and generates artifacts.

---

### Step 2: Extract Bytecode (Only if AssetToken.sol changed)
```bash
node scripts/extract-bytecode.js
```
**Why:** Extracts AssetToken bytecode to frontend config. **Only needed:**
- First time setup
- After modifying `AssetToken.sol` contract
- **NOT needed** if you only changed `DEX.sol` or are just testing

---

### Step 3: Start Hardhat Node
```bash
npx hardhat node
```
**Keep this terminal open!** This starts a local blockchain on `http://localhost:8545` with 20 test accounts.

---

### Step 4: Deploy Contracts
**Open a NEW terminal:**
```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Copy the DEX contract address** from the output and update:
- `frontend/src/utils/contractConfig.js` → Update `DEX_CONTRACT_ADDRESS`

---

### Step 5: Start Frontend
**Open another terminal:**
```bash
cd frontend
npm run dev
```

---

### Step 6: Connect MetaMask
1. Open MetaMask
2. Add network:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: `ETH`
3. Import Account 0 (private key from Hardhat node output)
4. Connect wallet in frontend

---

## Quick Checklist

**First Time Setup:**
- [ ] `npx hardhat compile`
- [ ] `node scripts/extract-bytecode.js` (only needed once, or if AssetToken.sol changes)
- [ ] `npx hardhat node` (Terminal 1 - keep running)
- [ ] `npx hardhat run scripts/deploy.js --network localhost` (Terminal 2)
- [ ] Update `DEX_CONTRACT_ADDRESS` in `frontend/src/utils/contractConfig.js`
- [ ] `cd frontend && npm run dev` (Terminal 3)
- [ ] Connect MetaMask to Hardhat Local
- [ ] Test the DEX!

**Subsequent Runs (if contracts unchanged):**
- [ ] `npx hardhat node` (Terminal 1)
- [ ] `npx hardhat run scripts/deploy.js --network localhost` (Terminal 2)
- [ ] Update `DEX_CONTRACT_ADDRESS` if it changed
- [ ] `cd frontend && npm run dev` (Terminal 3)

---

## If You Make Contract Changes

**If you modify `DEX.sol` only:**
1. `npx hardhat compile`
2. Redeploy: `npx hardhat run scripts/deploy.js --network localhost`
3. Update `DEX_CONTRACT_ADDRESS` if it changed
4. Refresh frontend
5. **No need to extract bytecode** (AssetToken didn't change)

**If you modify `AssetToken.sol`:**
1. `npx hardhat compile`
2. `node scripts/extract-bytecode.js` (bytecode changed, must update frontend)
3. Redeploy: `npx hardhat run scripts/deploy.js --network localhost`
4. Update `DEX_CONTRACT_ADDRESS` if it changed
5. Refresh frontend

---

## Troubleshooting

**"Bytecode not found" error:**
→ Run `node scripts/extract-bytecode.js`

**"Contract not deployed" error:**
→ Check `DEX_CONTRACT_ADDRESS` is correct in `contractConfig.js`

**MetaMask connection issues:**
→ Make sure Hardhat node is running and network is configured correctly

---

That's it! You're ready to test! 🚀

