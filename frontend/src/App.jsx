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
    createBuyOrder,
    createSellOrder,
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
  const [orderAmount, setOrderAmount] = useState('10');
  const [orderPrice, setOrderPrice] = useState('2');
  const [sellOrderAmount, setSellOrderAmount] = useState('10');
  const [sellOrderPrice, setSellOrderPrice] = useState('2');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

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
          
          {/* Deposit Token A */}
          <div style={{ marginBottom: 16 }}>
            <h4>Deposit Token A</h4>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', flex: 1 }}
                placeholder="Amount"
              />
              <button 
                onClick={handleDeposit}
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
                {isLoading ? 'Depositing...' : 'Deposit Token A'}
              </button>
            </div>
            <p style={{ marginTop: -4, color: '#6b7280' }}>
              Approves then deposits Token A into the DEX. Needed for sell orders.
            </p>
          </div>

          {/* Deposit Token B */}
          <div style={{ marginBottom: 16 }}>
            <h4>Deposit Token B</h4>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                type="number"
                value={depositAmountB}
                onChange={(e) => setDepositAmountB(e.target.value)}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', flex: 1 }}
                placeholder="Amount"
              />
              <button 
                onClick={handleDepositB}
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
                {isLoading ? 'Depositing...' : 'Deposit Token B'}
              </button>
            </div>
            <p style={{ marginTop: -4, color: '#6b7280' }}>
              Approves then deposits Token B into the DEX. Needed for buy orders.
            </p>
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
    </div>
  )
}

export default App
