import { useState, useEffect } from 'react'
import { useDEX } from './hooks/useDEX'
import './App.css'

function App() {
  const {
    isConnected,
    account,
    connectWallet,
    getBalance,
    getTokenBalance,
    deposit,
    withdraw,
    createBuyOrder,
    createSellOrder,
    getOrderBook,
    cancelOrder,
    formatTokenAmount,
    parseTokenAmount
  } = useDEX();

  const [tokenAAddress, setTokenAAddress] = useState('');
  const [tokenBAddress, setTokenBAddress] = useState('');
  const [tokenABalance, setTokenABalance] = useState('0');
  const [tokenBBalance, setTokenBBalance] = useState('0');
  const [dexTokenABalance, setDexTokenABalance] = useState('0');
  const [dexTokenBBalance, setDexTokenBBalance] = useState('0');
  const [depositAmount, setDepositAmount] = useState('100');
  const [depositAmountB, setDepositAmountB] = useState('100');
  const [withdrawAmountA, setWithdrawAmountA] = useState('0');
  const [withdrawAmountB, setWithdrawAmountB] = useState('0');
  const [orderAmount, setOrderAmount] = useState('10');
  const [orderPrice, setOrderPrice] = useState('2');
  const [sellOrderAmount, setSellOrderAmount] = useState('10');
  const [sellOrderPrice, setSellOrderPrice] = useState('2');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]);
  const [buyOrders, setBuyOrders] = useState([]);
  const [sellOrders, setSellOrders] = useState([]);
  const [bestBid, setBestBid] = useState(null);
  const [bestAsk, setBestAsk] = useState(null);
  const [selectedDepositToken, setSelectedDepositToken] = useState('A');
  const [selectedWithdrawToken, setSelectedWithdrawToken] = useState('A');

  // Sample token addresses (you'll need to deploy these and update)
  useEffect(() => {
    // These are the actual deployed token addresses
    setTokenAAddress('0x5FbDB2315678afecb367f032d93F642f64180aa3');
    setTokenBAddress('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512');
  }, []);

  // Load balances when connected
  useEffect(() => {
    if (isConnected && tokenAAddress && tokenBAddress) {
      loadBalances();
      loadOrderBook();
    }
  }, [isConnected, tokenAAddress, tokenBAddress]);

  const loadBalances = async () => {
    try {
      const tokenABal = await getTokenBalance(tokenAAddress);
      const tokenBBal = await getTokenBalance(tokenBAddress);
      const dexABal = await getBalance(tokenAAddress);
      const dexBBal = await getBalance(tokenBAddress);

      setTokenABalance(tokenABal);
      setTokenBBalance(tokenBBal);
      setDexTokenABalance(dexABal);
      setDexTokenBBalance(dexBBal);
    } catch (error) {
      console.error('Error loading balances:', error);
    }
  };

  const loadOrderBook = async () => {
    if (!tokenAAddress) return;
    try {
      const allOrders = await getOrderBook(tokenAAddress);
      setOrders(allOrders);

      // Split into buy/sell
      const buys = allOrders.filter(o => o.isBuyOrder && !o.isFilled);
      const sells = allOrders.filter(o => !o.isBuyOrder && !o.isFilled);

      // Sort: buys by price desc, sells by price asc
      buys.sort((a, b) => (BigInt(b.price) > BigInt(a.price) ? 1 : BigInt(b.price) < BigInt(a.price) ? -1 : 0));
      sells.sort((a, b) => (BigInt(a.price) > BigInt(b.price) ? 1 : BigInt(a.price) < BigInt(b.price) ? -1 : 0));

      setBuyOrders(buys);
      setSellOrders(sells);

      const bid = buys.length ? buys[0].price : null;
      const ask = sells.length ? sells[0].price : null;
      setBestBid(bid);
      setBestAsk(ask);
    } catch (error) {
      console.error('Error loading order book:', error);
    }
  };

  const shortAddr = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  const handleCancelOrder = async (orderId) => {
    if (!tokenAAddress) return;
    setIsLoading(true);
    try {
      const txHash = await cancelOrder(tokenAAddress, orderId);
      setMessage(`Order ${orderId} canceled. TX: ${txHash}`);
      await loadBalances();
      await loadOrderBook();
    } catch (error) {
      setMessage(`Cancel failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedTokenAddress = (key) => (key === 'A' ? tokenAAddress : tokenBAddress);
  const getDepositAmountByKey = (key) => (key === 'A' ? depositAmount : depositAmountB);
  const setDepositAmountByKey = (key, v) => (key === 'A' ? setDepositAmount(v) : setDepositAmountB(v));
  const getWithdrawAmountByKey = (key) => (key === 'A' ? withdrawAmountA : withdrawAmountB);
  const setWithdrawAmountByKey = (key, v) => (key === 'A' ? setWithdrawAmountA(v) : setWithdrawAmountB(v));

  const handleDepositUnified = async () => {
    const tokenKey = selectedDepositToken;
    const tokenAddr = getSelectedTokenAddress(tokenKey);
    if (!tokenAddr) {
      setMessage(`Please set Token ${tokenKey} address`);
      return;
    }
    setIsLoading(true);
    try {
      const amount = parseTokenAmount(getDepositAmountByKey(tokenKey));
      const txHash = await deposit(tokenAddr, amount);
      setMessage(`Deposit (Token ${tokenKey}) successful! TX: ${txHash}`);
      await loadBalances();
    } catch (error) {
      setMessage(`Deposit (Token ${tokenKey}) failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawUnified = async () => {
    const tokenKey = selectedWithdrawToken;
    const tokenAddr = getSelectedTokenAddress(tokenKey);
    if (!tokenAddr) {
      setMessage(`Please set Token ${tokenKey} address`);
      return;
    }
    const raw = getWithdrawAmountByKey(tokenKey);
    if (!raw || parseFloat(raw) <= 0) {
      setMessage('Please enter a valid withdraw amount');
      return;
    }
    setIsLoading(true);
    try {
      const amount = parseTokenAmount(raw);
      const txHash = await withdraw(tokenAddr, amount);
      setMessage(`Withdraw (Token ${tokenKey}) successful! TX: ${txHash}`);
      await loadBalances();
    } catch (error) {
      setMessage(`Withdraw (Token ${tokenKey}) failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      await connectWallet();
      setMessage('Wallet connected successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleDeposit = async () => {
    if (!tokenAAddress) {
      setMessage('Please set Token A address');
      return;
    }

    setIsLoading(true);
    try {
      const amount = parseTokenAmount(depositAmount);
      const txHash = await deposit(tokenAAddress, amount);
      setMessage(`Deposit successful! TX: ${txHash}`);
      await loadBalances(); // Refresh balances
    } catch (error) {
      setMessage(`Deposit failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDepositB = async () => {
    if (!tokenBAddress) {
      setMessage('Please set Token B address');
      return;
    }

    setIsLoading(true);
    try {
      const amount = parseTokenAmount(depositAmountB);
      const txHash = await deposit(tokenBAddress, amount);
      setMessage(`Deposit (Token B) successful! TX: ${txHash}`);
      await loadBalances();
    } catch (error) {
      setMessage(`Deposit (Token B) failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawA = async () => {
    if (!tokenAAddress) {
      setMessage('Please set Token A address');
      return;
    }

    if (!withdrawAmountA || parseFloat(withdrawAmountA) <= 0) {
      setMessage('Please enter a valid withdraw amount');
      return;
    }

    setIsLoading(true);
    try {
      const amount = parseTokenAmount(withdrawAmountA);
      const txHash = await withdraw(tokenAAddress, amount);
      setMessage(`Withdraw (Token A) successful! TX: ${txHash}`);
      await loadBalances(); // Refresh balances
    } catch (error) {
      setMessage(`Withdraw (Token A) failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawB = async () => {
    if (!tokenBAddress) {
      setMessage('Please set Token B address');
      return;
    }

    if (!withdrawAmountB || parseFloat(withdrawAmountB) <= 0) {
      setMessage('Please enter a valid withdraw amount');
      return;
    }

    setIsLoading(true);
    try {
      const amount = parseTokenAmount(withdrawAmountB);
      const txHash = await withdraw(tokenBAddress, amount);
      setMessage(`Withdraw (Token B) successful! TX: ${txHash}`);
      await loadBalances(); // Refresh balances
    } catch (error) {
      setMessage(`Withdraw (Token B) failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!tokenAAddress || !tokenBAddress) {
      setMessage('Please set both token addresses');
      return;
    }

    setIsLoading(true);
    try {
      const amount = parseTokenAmount(orderAmount);
      const price = parseTokenAmount(orderPrice);
      const txHash = await createBuyOrder(tokenAAddress, tokenBAddress, amount, price);
      setMessage(`Order created successfully! TX: ${txHash}`);
      await loadBalances(); // Refresh balances
      await loadOrderBook();
    } catch (error) {
      setMessage(`Order creation failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSellOrder = async () => {
    if (!tokenAAddress || !tokenBAddress) {
      setMessage('Please set both token addresses');
      return;
    }

    setIsLoading(true);
    try {
      const amount = parseTokenAmount(sellOrderAmount);
      const price = parseTokenAmount(sellOrderPrice);
      // Selling A to get B
      const txHash = await createSellOrder(tokenAAddress, tokenBAddress, amount, price);
      setMessage(`Sell order created successfully! TX: ${txHash}`);
      await loadBalances();
      await loadOrderBook();
    } catch (error) {
      setMessage(`Sell order creation failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Decentralized Exchange – MVP Setup</h1>
      
      {/* Connection Status */}
      <div style={{ marginBottom: 24, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        {isConnected ? (
          <div>
            <p style={{ color: 'green', margin: 0 }}>✅ Connected Wallet: {account}</p>
          </div>
        ) : (
          <button 
            onClick={handleConnect}
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              border: '1px solid #111827',
              background: '#111827',
              color: 'white',
              cursor: 'pointer',
              fontSize: 16
            }}
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* Token Configuration */}
      <div style={{ marginBottom: 24, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <h3>Token Configuration</h3>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Token A Address:</label>
          <input
            type="text"
            value={tokenAAddress}
            onChange={(e) => setTokenAAddress(e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            placeholder="0x..."
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Token B Address:</label>
          <input
            type="text"
            value={tokenBAddress}
            onChange={(e) => setTokenBAddress(e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            placeholder="0x..."
          />
        </div>
        <button 
          onClick={loadBalances}
          style={{
            padding: '8px 16px',
            borderRadius: 4,
            border: '1px solid #111827',
            background: '#111827',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Refresh Balances
        </button>
      </div>

      {/* Balances */}
      {isConnected && (
        <div style={{ marginBottom: 24, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <h3>Balances</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <h4>Token A</h4>
              <p>Wallet: {formatTokenAmount(tokenABalance)}</p>
              <p>DEX: {formatTokenAmount(dexTokenABalance)}</p>
            </div>
            <div>
              <h4>Token B</h4>
              <p>Wallet: {formatTokenAmount(tokenBBalance)}</p>
              <p>DEX: {formatTokenAmount(dexTokenBBalance)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {isConnected && (
        <div style={{ marginBottom: 24, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <h3>Actions</h3>

          {/* Deposit (concise) */}
          <div style={{ marginBottom: 16, padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h4 style={{ margin: 0 }}>
                <span style={{ background: '#f3f4f6', color: '#111827', padding: '4px 8px', borderRadius: 6 }}>Deposit</span>
              </h4>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setSelectedDepositToken('A')}
                  style={{ padding: '6px 12px', borderRadius: 6, border: selectedDepositToken==='A' ? '1px solid #111827' : '1px solid #d1d5db', background: selectedDepositToken==='A' ? '#111827' : '#fff', color: selectedDepositToken==='A' ? '#fff' : '#111827', cursor: 'pointer' }}
                >Token A</button>
                <button
                  onClick={() => setSelectedDepositToken('B')}
                  style={{ padding: '6px 12px', borderRadius: 6, border: selectedDepositToken==='B' ? '1px solid #111827' : '1px solid #d1d5db', background: selectedDepositToken==='B' ? '#111827' : '#fff', color: selectedDepositToken==='B' ? '#fff' : '#111827', cursor: 'pointer' }}
                >Token B</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="number"
                min="0"
                step="any"
                value={getDepositAmountByKey(selectedDepositToken)}
                onChange={(e) => setDepositAmountByKey(selectedDepositToken, e.target.value)}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 140 }}
                placeholder={`Amount`}
              />
              <button 
                onClick={handleDepositUnified}
                disabled={isLoading}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid #111827',
                  background: '#111827',
                  color: '#ffffff',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.8 : 1
                }}
              >
                {isLoading ? 'Depositing...' : `Deposit ${selectedDepositToken}`}
              </button>
              <span style={{ color: '#6b7280', fontSize: 12 }}>Approve then deposit.</span>
            </div>
          </div>

          {/* Withdraw (concise) */}
          <div style={{ marginBottom: 16, padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h4 style={{ margin: 0 }}>
                <span style={{ background: '#f3f4f6', color: '#111827', padding: '4px 8px', borderRadius: 6 }}>Withdraw</span>
              </h4>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setSelectedWithdrawToken('A')}
                  style={{ padding: '6px 12px', borderRadius: 6, border: selectedWithdrawToken==='A' ? '1px solid #111827' : '1px solid #d1d5db', background: selectedWithdrawToken==='A' ? '#111827' : '#fff', color: selectedWithdrawToken==='A' ? '#fff' : '#111827', cursor: 'pointer' }}
                >Token A</button>
                <button
                  onClick={() => setSelectedWithdrawToken('B')}
                  style={{ padding: '6px 12px', borderRadius: 6, border: selectedWithdrawToken==='B' ? '1px solid #111827' : '1px solid #d1d5db', background: selectedWithdrawToken==='B' ? '#111827' : '#fff', color: selectedWithdrawToken==='B' ? '#fff' : '#111827', cursor: 'pointer' }}
                >Token B</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="number"
                min="0"
                step="any"
                value={getWithdrawAmountByKey(selectedWithdrawToken)}
                onChange={(e) => setWithdrawAmountByKey(selectedWithdrawToken, e.target.value)}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 140 }}
                placeholder={`Amount`}
              />
              <button 
                onClick={handleWithdrawUnified}
                disabled={isLoading}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid #111827',
                  background: '#111827',
                  color: '#ffffff',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.8 : 1
                }}
              >
                {isLoading ? 'Withdrawing...' : `Withdraw ${selectedWithdrawToken}`}
              </button>
              <span style={{ color: '#6b7280', fontSize: 12 }}>
                Available: {selectedWithdrawToken==='A' ? formatTokenAmount(dexTokenABalance) : formatTokenAmount(dexTokenBBalance)}
              </span>
            </div>
          </div>

          {/* Create Buy Order */}
          <div>
            <h4>Create Buy Order (Buy A, pay B)</h4>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                type="number"
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                placeholder="Amount"
              />
              <input
                type="number"
                value={orderPrice}
                onChange={(e) => setOrderPrice(e.target.value)}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                placeholder="Price"
              />
              <button 
                onClick={handleCreateOrder}
                disabled={isLoading}
                style={{
                  padding: '8px 16px',
                  borderRadius: 4,
                  border: '1px solid #111827',
                  background: '#111827',
                  color: 'white',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                {isLoading ? 'Creating...' : 'Create Buy Order'}
              </button>
            </div>
            <p style={{ marginTop: -4, color: '#6b7280' }}>
              Requires Token B deposited. Required B = amountA × price (18 decimals). Price is quoted as Token B per 1 Token A (i.e., 1 A = price B).
            </p>
          </div>

          {/* Create Sell Order */}
          <div>
            <h4>Create Sell Order (Sell A, receive B)</h4>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                type="number"
                value={sellOrderAmount}
                onChange={(e) => setSellOrderAmount(e.target.value)}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                placeholder="Amount"
              />
              <input
                type="number"
                value={sellOrderPrice}
                onChange={(e) => setSellOrderPrice(e.target.value)}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                placeholder="Price"
              />
              <button 
                onClick={handleCreateSellOrder}
                disabled={isLoading}
                style={{
                  padding: '8px 16px',
                  borderRadius: 4,
                  border: '1px solid #111827',
                  background: '#111827',
                  color: 'white',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                {isLoading ? 'Creating...' : 'Create Sell Order'}
              </button>
            </div>
            <p style={{ marginTop: -4, color: '#6b7280' }}>
              Requires Token A deposited. Required A = amountA (18 decimals). Price is Token B per 1 Token A (i.e., 1 A = price B).
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      {message && (
        <div style={{ 
          padding: 12, 
          borderRadius: 8, 
          background: message.includes('Error') ? '#fee2e2' : '#d1fae5',
          color: message.includes('Error') ? '#dc2626' : '#059669',
          marginTop: 16
        }}>
          {message}
        </div>
      )}

      {/* Order Book & Conversion Rates */}
      {isConnected && (
        <div style={{ marginTop: 24, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Order Book (Token A / Token B)</h3>
            <button 
              onClick={loadOrderBook}
              style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #111827', background: '#fff', cursor: 'pointer' }}
            >
              Refresh
            </button>
          </div>

          {/* Conversion rates */}
          <div style={{ marginTop: 12, padding: 12, background: '#f9fafb', borderRadius: 6 }}>
            <div style={{ display: 'flex', gap: 24 }}>
              <div>
                <strong>Best Bid</strong>
                <div>{bestBid ? `${formatTokenAmount(bestBid)} B per 1 A` : '-'}</div>
              </div>
              <div>
                <strong>Best Ask</strong>
                <div>{bestAsk ? `${formatTokenAmount(bestAsk)} B per 1 A` : '-'}</div>
              </div>
              <div>
                <strong>Mid</strong>
                <div>
                  {bestBid && bestAsk
                    ? `${formatTokenAmount((BigInt(bestBid) + BigInt(bestAsk)) / 2n)} B per 1 A`
                    : '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Books */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
            {/* Buy Orders */}
            <div>
              <h4 style={{ marginTop: 0 }}>Buy Orders</h4>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 6 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 0.6fr', padding: '8px 12px', background: '#f3f4f6', fontWeight: 600 }}>
                  <div>Price (B/A)</div>
                  <div>Amount (A)</div>
                  <div>Trader</div>
                  <div></div>
                </div>
                <div>
                  {buyOrders.length === 0 && (
                    <div style={{ padding: 12, color: '#6b7280' }}>No buy orders</div>
                  )}
                  {buyOrders.map((o) => {
                    const isMine = account && o.trader && account.toLowerCase() === o.trader.toLowerCase();
                    return (
                      <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 0.6fr', alignItems: 'center', padding: '8px 12px', borderTop: '1px solid #f3f4f6' }}>
                        <div>{formatTokenAmount(o.price)}</div>
                        <div>{formatTokenAmount(o.amount)}</div>
                        <div>
                          {shortAddr(o.trader)} {isMine && <span style={{ marginLeft: 6, fontSize: 12, color: '#059669' }}>(Me)</span>}
                        </div>
                        <div>
                          {isMine && (
                            <button
                              onClick={() => handleCancelOrder(o.id)}
                              disabled={isLoading}
                              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #dc2626', background: '#fff', color: '#dc2626', cursor: isLoading ? 'not-allowed' : 'pointer' }}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sell Orders */}
            <div>
              <h4 style={{ marginTop: 0 }}>Sell Orders</h4>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 6 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 0.6fr', padding: '8px 12px', background: '#f3f4f6', fontWeight: 600 }}>
                  <div>Price (B/A)</div>
                  <div>Amount (A)</div>
                  <div>Trader</div>
                  <div></div>
                </div>
                <div>
                  {sellOrders.length === 0 && (
                    <div style={{ padding: 12, color: '#6b7280' }}>No sell orders</div>
                  )}
                  {sellOrders.map((o) => {
                    const isMine = account && o.trader && account.toLowerCase() === o.trader.toLowerCase();
                    return (
                      <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 0.6fr', alignItems: 'center', padding: '8px 12px', borderTop: '1px solid #f3f4f6' }}>
                        <div>{formatTokenAmount(o.price)}</div>
                        <div>{formatTokenAmount(o.amount)}</div>
                        <div>
                          {shortAddr(o.trader)} {isMine && <span style={{ marginLeft: 6, fontSize: 12, color: '#059669' }}>(Me)</span>}
                        </div>
                        <div>
                          {isMine && (
                            <button
                              onClick={() => handleCancelOrder(o.id)}
                              disabled={isLoading}
                              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #dc2626', background: '#fff', color: '#dc2626', cursor: isLoading ? 'not-allowed' : 'pointer' }}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
