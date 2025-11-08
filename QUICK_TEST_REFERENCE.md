# Quick Test Reference Card

## 🚀 Quick Start Tests (5 minutes)

### 1. **Basic Flow Test**
```
1. Connect Wallet
2. Deposit 100 Token A → ✅ DEX balance = 100
3. Create Buy Order: Buy 10 TKA with TKB @ 2 TKB/TKA
   → Need 20 TKB deposited first
   → ✅ Order appears in Order Book
4. Create Sell Order: Sell 10 TKA for TKB @ 2 TKB/TKA
   → Need 10 TKA deposited first
   → ✅ Orders match! Trade executes
5. Withdraw remaining tokens → ✅ Back to wallet
```

### 2. **Token Issuance Test**
```
1. Issue Token C: Name="Token C", Symbol="TKC", Supply=1000000
   → ✅ Token appears in list
   → ✅ Wallet has 1M TKC
2. Deposit 1000 TKC to DEX
   → ✅ DEX balance = 1000
```

### 3. **Order Cancellation Test**
```
1. Create buy order (won't match)
2. Click Cancel in Order Book
   → ✅ Order removed
   → ✅ Tokens refunded to DEX balance
```

---

## 📊 Expected Behaviors

### **Order Matching:**
- ✅ Buy @ 2.0 + Sell @ 1.5 = **MATCHES** (at 2.0)
- ✅ Buy @ 2.0 + Sell @ 2.0 = **MATCHES** (at 2.0)
- ❌ Buy @ 1.0 + Sell @ 2.0 = **NO MATCH**

### **Balance Changes:**
- **Deposit:** Wallet ↓, DEX ↑
- **Withdraw:** Wallet ↑, DEX ↓
- **Buy Order:** DEX (payment token) ↓ (locked)
- **Sell Order:** DEX (sell token) ↓ (locked)
- **Order Matched:** DEX balances swap
- **Order Canceled:** Locked tokens → DEX balance

### **Order Book:**
- Shows orders for selected token
- Buy Orders: Want to BUY that token
- Sell Orders: Want to SELL that token
- Sorted by price (best first)

---

## ⚠️ Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Insufficient balance" | Not enough tokens deposited | Deposit more tokens first |
| Orders don't match | Prices incompatible | Buy price must be ≥ Sell price |
| Token not showing | Not in registry | Add token by address or issue new |
| Balance not updating | Transaction pending | Wait for confirmation, then refresh |

---

## 🎯 Key Test Scenarios

1. **Happy Path:** Deposit → Create Order → Match → Withdraw
2. **Partial Fill:** Create orders with different amounts → Partial match
3. **Multiple Pairs:** Issue Token C → Trade A/B, A/C, B/C pairs
4. **Error Handling:** Try to create order without deposit → Should fail
5. **Order Book:** Create multiple orders → Verify sorting and display

---

## 📝 Test Data Examples

**Account Setup:**
- Account 0: Main testing account
- Account 1: Secondary account (for matching tests)

**Token Amounts:**
- Initial deposits: 100-200 tokens
- Order amounts: 10-20 tokens
- Prices: 1.0 - 3.0 (for easy calculation)

**Expected Calculations:**
- Buy 10 TKA @ 2 TKB/TKA = Need 20 TKB
- Sell 10 TKA @ 2 TKB/TKA = Need 10 TKA, Receive 20 TKB

---

Happy Testing! 🎉

