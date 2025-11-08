# Comprehensive Testing Guide

This guide provides step-by-step instructions to test all functionalities of the DEX.

## Prerequisites

1. **Start Hardhat Node:**
   ```bash
   npx hardhat node
   ```
   Keep this terminal open. You'll see 20 test accounts with addresses and private keys.

2. **Deploy Contracts:**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
   Copy the DEX contract address and update `frontend/src/utils/contractConfig.js`

3. **Extract Bytecode:**
   ```bash
   node scripts/extract-bytecode.js
   ```

4. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Connect MetaMask:**
   - Add Hardhat Local network (Chain ID: 31337, RPC: http://127.0.0.1:8545)
   - Import Account 0 (first account from Hardhat node output)
   - Connect wallet in frontend

---

## Test Suite

### **Test 1: Initial State Verification**

**Actions:**
1. Open the frontend
2. Connect your wallet
3. Check the "Available Tokens" section

**Expected Results:**
- ✅ You should see 2 tokens: Token A (TKA) and Token B (TKB)
- ✅ Each token shows: Name, Symbol, Address, Wallet Balance, DEX Balance
- ✅ Wallet balances should show some amount (from deploy script)
- ✅ DEX balances should be 0 initially

**Verification:**
- Token A address: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- Token B address: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- Check that balances are displayed correctly

---

### **Test 2: Token Issuance**

**Actions:**
1. Scroll to "Token Issuance (Asset Issuer)" section
2. Fill in:
   - Token Name: `Token C`
   - Token Symbol: `TKC`
   - Initial Supply: `1000000`
3. Click "Issue Token"
4. Approve transaction in MetaMask
5. Wait for confirmation

**Expected Results:**
- ✅ Transaction succeeds
- ✅ Success message: "Token TKC issued successfully! Address: 0x..."
- ✅ Token C appears in "Available Tokens" list
- ✅ Your wallet balance for TKC shows 1,000,000 tokens
- ✅ DEX balance for TKC shows 0

**Verification:**
- Check the token list - should now have 3 tokens
- Token C should have name "Token C", symbol "TKC"
- Your wallet should have the full initial supply

---

### **Test 3: Deposit Tokens**

**Actions:**
1. In "Deposit & Withdraw" section
2. Select "Token A" from dropdown
3. Enter amount: `100`
4. Click "Deposit"
5. **First:** Approve the token transfer (MetaMask popup)
6. **Second:** Confirm the deposit transaction

**Expected Results:**
- ✅ Approval transaction succeeds
- ✅ Deposit transaction succeeds
- ✅ Success message: "Deposit successful! TX: 0x..."
- ✅ Token A wallet balance decreases by 100
- ✅ Token A DEX balance increases by 100
- ✅ Other token balances unchanged

**Verification:**
- Before: Wallet = X, DEX = 0
- After: Wallet = X - 100, DEX = 100

**Repeat for Token B:**
- Deposit 200 Token B
- Verify balances update correctly

---

### **Test 4: Create Buy Order**

**Prerequisites:**
- You have Token B deposited in DEX (from Test 3)

**Actions:**
1. Scroll to "Create Orders" section
2. In "Create Buy Order":
   - Select "Buy Token": Token A
   - Select "Sell Token": Token B (payment token)
   - Amount: `10` (want to buy 10 Token A)
   - Price: `2` (2 Token B per 1 Token A)
3. Click "Create Buy Order"
4. Approve transaction in MetaMask

**Expected Results:**
- Transaction succeeds
- ✅ Success message: "Buy order created successfully! TX: 0x..."
- ✅ Your Token B DEX balance decreases by 20 (10 × 2 = 20 Token B locked)
- ✅ Order appears in Order Book
- ✅ In Order Book, select Token A
- ✅ You should see your buy order in "Buy Orders" column
- ✅ Shows: "Buying TKA with TKB", Amount: 10 TKA, Paying With: TKB

**Verification:**
- DEX balance: Token B should be 200 - 20 = 180
- Order Book: Your order should show with your address and "(Me)" tag
- Price column shows: "2.0 TKB / TKA"

---

### **Test 5: Create Sell Order (Matching Scenario)**

**Prerequisites:**
- You have Token A deposited in DEX

**Actions:**
1. First, deposit 50 Token A to DEX (if not already done)
2. In "Create Sell Order":
   - Select "Sell Token": Token A
   - Select "Buy Token": Token B
   - Amount: `10` (want to sell 10 Token A)
   - Price: `2` (2 Token B per 1 Token A)
3. Click "Create Sell Order"
4. Approve transaction

**Expected Results:**
- ✅ Transaction succeeds
- ✅ **IMPORTANT:** If a matching buy order exists, the trade should execute automatically!
- ✅ Success message appears
- ✅ If matched:
  - Your Token A DEX balance decreases by 10
  - Your Token B DEX balance increases by 20
  - The buy order is filled/removed from order book
  - Your sell order is filled/removed
- ✅ If not matched:
  - Your Token A DEX balance decreases by 10 (locked in order)
  - Sell order appears in Order Book

**Verification:**
- Check Order Book for Token A
- If matched: Orders should be gone, balances updated
- If not matched: Both orders visible, balances locked

---

### **Test 6: Order Matching (Manual Test)**

**Setup:**
- Use two different accounts (Account 0 and Account 1)

**Actions:**
1. **Account 0:** Create a Buy Order
   - Buy: Token A, Pay with: Token B
   - Amount: 10 Token A, Price: 2 TKB/TKA
   - Deposit 20 Token B first

2. **Account 1:** Create a Sell Order
   - Sell: Token A, Receive: Token B
   - Amount: 10 Token A, Price: 1.5 TKB/TKA (lower price = will match)
   - Deposit 10 Token A first

**Expected Results:**
- ✅ Sell order should match with buy order
- ✅ Trade executes at buy order price (2 TKB/TKA)
- ✅ Account 0: Receives 10 Token A, Pays 20 Token B
- ✅ Account 1: Receives 20 Token B, Pays 10 Token A
- ✅ Both orders removed from order book
- ✅ Balances updated for both accounts

**Verification:**
- Account 0 DEX balance: +10 TKA, -20 TKB
- Account 1 DEX balance: -10 TKA, +20 TKB
- Order book should be empty (orders filled)

---

### **Test 7: Partial Order Fulfillment**

**Actions:**
1. **Account 0:** Create Buy Order
   - Buy: 10 Token A, Price: 2 TKB/TKA
   - Need: 20 Token B deposited

2. **Account 1:** Create Sell Order
   - Sell: 5 Token A (less than buy order), Price: 1.5 TKB/TKA
   - Need: 5 Token A deposited

**Expected Results:**
- ✅ Partial match occurs
- ✅ Account 0: Receives 5 Token A, Pays 10 Token B
- ✅ Account 1: Receives 10 Token B, Pays 5 Token A
- ✅ Account 0's buy order: Remaining 5 Token A, 10 Token B still locked
- ✅ Account 1's sell order: Fully filled, removed
- ✅ Account 0's buy order still visible in order book

**Verification:**
- Account 0: DEX balance shows +5 TKA, -10 TKB
- Account 1: DEX balance shows -5 TKA, +10 TKB
- Order book: Account 0's buy order shows amount = 5 (remaining)

---

### **Test 8: Order Cancellation**

**Actions:**
1. Create a Buy Order (that won't match)
   - Buy: Token A, Pay: Token B
   - Amount: 10, Price: 1 TKB/TKA
   - Deposit 10 Token B

2. In Order Book, find your order (marked with "(Me)")
3. Click "Cancel" button
4. Approve transaction

**Expected Results:**
- ✅ Transaction succeeds
- ✅ Success message: "Order X canceled. TX: 0x..."
- ✅ Order removed from order book
- ✅ Your Token B DEX balance increases by 10 (refunded)
- ✅ You can now withdraw the refunded tokens

**Verification:**
- Before cancel: DEX balance = X, Order visible
- After cancel: DEX balance = X + 10, Order gone
- You can withdraw the refunded amount

---

### **Test 9: Multiple Token Pairs**

**Actions:**
1. Issue Token D (TKD) with supply 1000000
2. Deposit tokens:
   - 100 Token A
   - 100 Token B
   - 100 Token C
   - 100 Token D

3. Create orders for different pairs:
   - **Pair 1:** Buy Token A with Token B (10 TKA @ 2 TKB/TKA)
   - **Pair 2:** Buy Token C with Token A (5 TKC @ 3 TKA/TKC)
   - **Pair 3:** Sell Token D for Token B (20 TKD @ 0.5 TKB/TKD)

**Expected Results:**
- ✅ All orders created successfully
- ✅ Each token has its own order book
- ✅ Select Token A → See orders involving Token A
- ✅ Select Token C → See orders involving Token C
- ✅ Select Token D → See orders involving Token D
- ✅ Each order book shows correct token pairs

**Verification:**
- Order Book for Token A: Shows buy order (TKA/TKB) and sell order (TKC/TKA)
- Order Book for Token C: Shows buy order (TKC/TKA)
- Order Book for Token D: Shows sell order (TKD/TKB)
- All show correct "Buying X with Y" or "Selling X for Y"

---

### **Test 10: Withdraw Tokens**

**Actions:**
1. Ensure you have tokens in DEX (from previous tests)
2. In "Deposit & Withdraw" section
3. Select "Token B" from withdraw dropdown
4. Enter amount: `50`
5. Click "Withdraw"
6. Approve transaction

**Expected Results:**
- ✅ Transaction succeeds
- ✅ Success message: "Withdraw successful! TX: 0x..."
- ✅ Token B DEX balance decreases by 50
- ✅ Token B wallet balance increases by 50
- ✅ Other balances unchanged

**Verification:**
- Before: DEX = X, Wallet = Y
- After: DEX = X - 50, Wallet = Y + 50

---

### **Test 11: Add Token by Address**

**Actions:**
1. Click "+ Add Token by Address" button
2. Enter Token A's address: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
3. Click OK/Confirm

**Expected Results:**
- ✅ Message: "Token already in list" (since it's already there)
- ✅ If you enter a new valid token address, it should add it
- ✅ Token appears in list with correct name and symbol

**Test with invalid address:**
- Enter: `0x0000000000000000000000000000000000000000`
- Expected: Error message about invalid token

---

### **Test 12: Price Matching Logic**

**Test Case 1: Buy Price > Sell Price (Should Match)**
- Buy Order: 10 TKA @ 3 TKB/TKA
- Sell Order: 10 TKA @ 2 TKB/TKA
- **Expected:** ✅ Should match at sell price (2 TKB/TKA)

**Test Case 2: Buy Price = Sell Price (Should Match)**
- Buy Order: 10 TKA @ 2 TKB/TKA
- Sell Order: 10 TKA @ 2 TKB/TKA
- **Expected:** ✅ Should match at 2 TKB/TKA

**Test Case 3: Buy Price < Sell Price (Should NOT Match)**
- Buy Order: 10 TKA @ 1 TKB/TKA
- Sell Order: 10 TKA @ 2 TKB/TKA
- **Expected:** ❌ Should NOT match, both orders remain

---

### **Test 13: Insufficient Balance Scenarios**

**Test Case 1: Insufficient Deposit for Buy Order**
- Try to create buy order for 100 TKA @ 2 TKB/TKA
- But only have 10 TKB deposited
- **Expected:** ❌ Transaction fails with "Insufficient sell token balance"

**Test Case 2: Insufficient Deposit for Sell Order**
- Try to create sell order for 100 TKA
- But only have 10 TKA deposited
- **Expected:** ❌ Transaction fails with "Insufficient sell token balance"

**Test Case 3: Insufficient Balance for Withdraw**
- Try to withdraw 1000 Token A
- But only have 100 in DEX
- **Expected:** ❌ Transaction fails with "Insufficient balance"

---

### **Test 14: Order Book Display**

**Actions:**
1. Create multiple orders:
   - Buy: 10 TKA @ 2 TKB/TKA
   - Buy: 5 TKA @ 1.5 TKB/TKA
   - Sell: 8 TKA @ 2.5 TKB/TKA
   - Sell: 12 TKA @ 3 TKB/TKA

2. View Order Book for Token A

**Expected Results:**
- ✅ Buy Orders sorted by price (highest first): 2.0, then 1.5
- ✅ Sell Orders sorted by price (lowest first): 2.5, then 3.0
- ✅ Each order shows:
  - Price with token symbols
  - Amount with token symbol
  - Payment/Receiving token
  - Trader address
  - Cancel button (if it's your order)

**Verification:**
- Buy orders: Highest price at top
- Sell orders: Lowest price at top
- All information clearly displayed

---

### **Test 15: Best Bid/Ask Display**

**Actions:**
1. Create orders with different prices
2. Check the "Best Bid" and "Best Ask" values

**Expected Results:**
- ✅ Best Bid = Highest buy order price
- ✅ Best Ask = Lowest sell order price
- ✅ Mid = Average of Best Bid and Best Ask
- ✅ Updates automatically when orders are added/removed

---

## Expected Final State

After completing all tests, you should have:
- ✅ Multiple tokens issued (A, B, C, D)
- ✅ Various orders created and some matched
- ✅ Balances updated correctly
- ✅ Order book showing different token pairs
- ✅ Understanding of buy vs sell orders
- ✅ Experience with deposits, withdrawals, and cancellations

---

## Troubleshooting

**If orders don't match:**
- Check that prices are compatible (buy price >= sell price)
- Verify tokens are deposited in DEX
- Ensure you're looking at the correct token's order book

**If balances don't update:**
- Click "Refresh" button
- Check MetaMask for transaction confirmations
- Verify transactions succeeded (green checkmark)

**If token doesn't appear:**
- Check browser console for errors
- Verify token address is correct
- Try refreshing the page

---

## Quick Test Checklist

- [ ] Token A and B visible on startup
- [ ] Can issue new token (Token C)
- [ ] Can deposit tokens to DEX
- [ ] Can create buy order
- [ ] Can create sell order
- [ ] Orders match automatically when compatible
- [ ] Can cancel orders
- [ ] Can withdraw tokens
- [ ] Order book shows correct information
- [ ] Multiple token pairs work independently
- [ ] Best bid/ask display correctly
- [ ] Partial order fulfillment works
- [ ] Error handling works (insufficient balance, etc.)

---

Good luck with testing! 🚀

