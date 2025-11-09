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
    parseTokenAmount,
    issueToken,
    getTokenInfo
  } = useDEX();

  // Token registry-list of all tokens
  const [tokens, setTokens] = useState([]);
  const [tokenBalances, setTokenBalances] = useState({}); // { address: { wallet: '0', dex: '0' } }
  
  //  Selected tokens for trading
  const [selectedBuyToken, setSelectedBuyToken] = useState(null);
  const [selectedSellToken, setSelectedSellToken] = useState(null);
  const [selectedOrderBookToken, setSelectedOrderBookToken] = useState(null);
  
  // Token issuance
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenSymbol, setNewTokenSymbol] = useState('');
  const [newTokenSupply, setNewTokenSupply] = useState('1000000');
  
  // Deposit and withdraw
  const [selectedDepositToken, setSelectedDepositToken] = useState(null);
  const [depositAmount, setDepositAmount] = useState('100');
  const [selectedWithdrawToken, setSelectedWithdrawToken] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState('0');
  
  // Orders
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

  useEffect(() => {
    const initialTokens = [
      { address: '0x5FbDB2315678afecb367f032d93F642f64180aa3', name: 'Token A', symbol: 'TKA' },
      { address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', name: 'Token B', symbol: 'TKB' }
    ];
    setTokens(initialTokens);
    setSelectedBuyToken(initialTokens[0]);
    setSelectedSellToken(initialTokens[1]);
    setSelectedOrderBookToken(initialTokens[0]);
    setSelectedDepositToken(initialTokens[0]);
    setSelectedWithdrawToken(initialTokens[0]);
  }, []);

  useEffect(() => {
    if (isConnected && tokens.length > 0) {
      loadAllBalances();
      if (selectedOrderBookToken) {
        loadOrderBook(selectedOrderBookToken.address);
      }
    }
  }, [isConnected, tokens, selectedOrderBookToken]);

  const loadAllBalances = async () => {
    if (!account) return;
    const newBalances = {};
    for (const token of tokens) {
      try {
        const walletBal = await getTokenBalance(token.address);
        const dexBal = await getBalance(token.address);
        newBalances[token.address] = { wallet: walletBal, dex: dexBal };
      } catch (error) {
        console.error(`Error loading balance for ${token.address}:`, error);
        newBalances[token.address] = { wallet: '0', dex: '0' };
      }
    }
    setTokenBalances(newBalances);
  };

  const loadOrderBook = async (tokenAddress) => {
    if (!tokenAddress) return;
    try {
      const allOrders = await getOrderBook(tokenAddress);
      setOrders(allOrders);

      const buys = allOrders.filter(o => o.isBuyOrder && !o.isFilled);
      const sells = allOrders.filter(o => !o.isBuyOrder && !o.isFilled);

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

  const handleConnect = async () => {
    try {
      await connectWallet();
      setMessage('Wallet connected successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleIssueToken = async () => {
    if (!newTokenName || !newTokenSymbol || !newTokenSupply) {
      setMessage('Please fill in all token fields');
      return;
    }

    setIsLoading(true);
    try {
      const tokenAddress = await issueToken(newTokenName, newTokenSymbol, newTokenSupply);
      const newToken = { address: tokenAddress, name: newTokenName, symbol: newTokenSymbol };
      setTokens([...tokens, newToken]);
      setMessage(`Token ${newTokenSymbol} issued successfully! Address: ${tokenAddress}`);
      setNewTokenName('');
      setNewTokenSymbol('');
      setNewTokenSupply('1000000');
      await loadAllBalances();
    } catch (error) {
      setMessage(`Token issuance failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTokenByAddress = async () => {
    const addressInput = prompt('Enter token address:');
    if (!addressInput) return;

    try {
      const info = await getTokenInfo(addressInput);
      if (info) {
        const newToken = { address: info.address, name: info.name, symbol: info.symbol };
        if (!tokens.find(t => t.address.toLowerCase() === info.address.toLowerCase())) {
          setTokens([...tokens, newToken]);
          setMessage(`Token ${info.symbol} added successfully!`);
          await loadAllBalances();
        } else {
          setMessage('Token already in list');
        }
      } else {
        setMessage('Invalid token address or not an ERC20 token');
      }
    } catch (error) {
      setMessage(`Error adding token: ${error.message}`);
    }
  };

  const handleDeposit = async () => {
    if (!selectedDepositToken) {
      setMessage('Please select a token to deposit');
      return;
    }

    setIsLoading(true);
    try {
      const amount = parseTokenAmount(depositAmount);
      const txHash = await deposit(selectedDepositToken.address, amount);
      setMessage(`Deposit successful! TX: ${txHash}`);
      await loadAllBalances();
    } catch (error) {
      setMessage(`Deposit failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedWithdrawToken) {
      setMessage('Please select a token to withdraw');
      return;
    }

    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      setMessage('Please enter a valid withdraw amount');
      return;
    }

    setIsLoading(true);
    try {
      const amount = parseTokenAmount(withdrawAmount);
      const txHash = await withdraw(selectedWithdrawToken.address, amount);
      setMessage(`Withdraw successful! TX: ${txHash}`);
      await loadAllBalances();
    } catch (error) {
      setMessage(`Withdraw failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBuyOrder = async () => {
    if (!selectedBuyToken || !selectedSellToken) {
      setMessage('Please select both buy and sell tokens');
      return;
    }

    setIsLoading(true);
    try {
      const amount = parseTokenAmount(orderAmount);
      const price = parseTokenAmount(orderPrice);
      const txHash = await createBuyOrder(selectedBuyToken.address, selectedSellToken.address, amount, price);
      setMessage(`Buy order created successfully! TX: ${txHash}`);
      await loadAllBalances();
      await loadOrderBook(selectedBuyToken.address);
    } catch (error) {
      setMessage(`Order creation failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSellOrder = async () => {
    if (!selectedBuyToken || !selectedSellToken) {
      setMessage('Please select both buy and sell tokens');
      return;
    }

    setIsLoading(true);
    try {
      const amount = parseTokenAmount(sellOrderAmount);
      const price = parseTokenAmount(sellOrderPrice);
      const txHash = await createSellOrder(selectedSellToken.address, selectedBuyToken.address, amount, price);
      setMessage(`Sell order created successfully! TX: ${txHash}`);
      await loadAllBalances();
      await loadOrderBook(selectedSellToken.address);
    } catch (error) {
      setMessage(`Sell order creation failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!selectedOrderBookToken) return;
    setIsLoading(true);
    try {
      const txHash = await cancelOrder(selectedOrderBookToken.address, orderId);
      setMessage(`Order ${orderId} canceled. TX: ${txHash}`);
      await loadAllBalances();
      await loadOrderBook(selectedOrderBookToken.address);
    } catch (error) {
      setMessage(`Cancel failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getTokenDisplay = (token) => {
    if (!token) return 'Select...';
    return `${token.symbol} (${shortAddr(token.address)})`;
  };

  const getTokenByAddress = (address) => {
    return tokens.find(t => t.address.toLowerCase() === address?.toLowerCase());
  };

  const getTokenSymbol = (address) => {
    const token = getTokenByAddress(address);
    return token ? token.symbol : shortAddr(address);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>BridgePoint DEX</h1>
      
      {/* Connection */}
      <div style={{ marginBottom: 24, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        {isConnected ? (
          <div>
            <p style={{ color: 'green', margin: 0 }}>Connected Wallet: {account}</p>
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

      {/* Token Issuance */}
      {isConnected && (
        <div style={{ marginBottom: 24, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <h3>Token Issuance (Asset Issuer)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, marginBottom: 12 }}>
            <input
              type="text"
              value={newTokenName}
              onChange={(e) => setNewTokenName(e.target.value)}
              placeholder="Token Name"
              style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
            <input
              type="text"
              value={newTokenSymbol}
              onChange={(e) => setNewTokenSymbol(e.target.value)}
              placeholder="Token Symbol"
              style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
            <input
              type="text"
              value={newTokenSupply}
              onChange={(e) => setNewTokenSupply(e.target.value)}
              placeholder="Initial Supply"
              style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
            <button
              onClick={handleIssueToken}
              disabled={isLoading}
              style={{
                padding: '8px 16px',
                borderRadius: 4,
                border: '1px solid #111827',
                background: '#111827',
                color: 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              Issue Token
            </button>
          </div>
          <button
            onClick={handleAddTokenByAddress}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: '1px solid #111827',
              background: '#fff',
              color: '#111827',
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            + Add Token by Address
          </button>
        </div>
      )}

      {/* Token List */}
      <div style={{ marginBottom: 24, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <h3>Available Tokens ({tokens.length})</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
          {tokens.map((token) => {
            const balances = tokenBalances[token.address] || { wallet: '0', dex: '0' };
            return (
              <div key={token.address} style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{token.symbol}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{token.name}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>{shortAddr(token.address)}</div>
                {isConnected && (
                  <div style={{ fontSize: 12, marginTop: 8 }}>
                    <div>Wallet: {formatTokenAmount(balances.wallet)}</div>
                    <div>DEX: {formatTokenAmount(balances.dex)}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Balances & Actions */}
      {isConnected && (
        <div style={{ marginBottom: 24, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <h3>Deposit & Withdraw</h3>
          
          {/* Deposit */}
          <div style={{ marginBottom: 16, padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, background: '#ffffff' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                value={selectedDepositToken?.address || ''}
                onChange={(e) => {
                  const token = tokens.find(t => t.address === e.target.value);
                  setSelectedDepositToken(token);
                }}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 200 }}
              >
                <option value="">Select Token...</option>
                {tokens.map(t => (
                  <option key={t.address} value={t.address}>{getTokenDisplay(t)}</option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                step="any"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 140 }}
                placeholder="Amount"
              />
              <button 
                onClick={handleDeposit}
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
                {isLoading ? 'Depositing...' : 'Deposit'}
              </button>
              <span style={{ color: '#6b7280', fontSize: 12 }}>Approve then deposit.</span>
            </div>
          </div>

          {/* Withdraw */}
          <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, background: '#ffffff' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                value={selectedWithdrawToken?.address || ''}
                onChange={(e) => {
                  const token = tokens.find(t => t.address === e.target.value);
                  setSelectedWithdrawToken(token);
                }}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 200 }}
              >
                <option value="">Select Token...</option>
                {tokens.map(t => (
                  <option key={t.address} value={t.address}>{getTokenDisplay(t)}</option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                step="any"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 140 }}
                placeholder="Amount"
              />
              <button 
                onClick={handleWithdraw}
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
                {isLoading ? 'Withdrawing...' : 'Withdraw'}
              </button>
              {selectedWithdrawToken && (
                <span style={{ color: '#6b7280', fontSize: 12 }}>
                  Available: {formatTokenAmount(tokenBalances[selectedWithdrawToken.address]?.dex || '0')}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Creation */}
      {isConnected && (
        <div style={{ marginBottom: 24, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <h3>Create Orders</h3>
          <div style={{ marginBottom: 16, padding: 12, background: '#eff6ff', borderRadius: 6, fontSize: 13, color: '#1e40af' }}>
            <strong>Understanding Buy vs Sell Orders:</strong>
            <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
              <li><strong>Buy Order:</strong> You want to BUY a token. You need the PAYMENT token deposited in DEX.</li>
              <li><strong>Sell Order:</strong> You want to SELL a token. You need the TOKEN YOU'RE SELLING deposited in DEX.</li>
              <li>Example: To buy Token A with Token B, create a Buy Order (need Token B deposited).</li>
              <li>Example: To sell Token A for Token B, create a Sell Order (need Token A deposited).</li>
            </ul>
          </div>

          {/* Buy Order */}
          <div style={{ marginBottom: 16 }}>
            <h4>Create Buy Order</h4>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <select
                value={selectedBuyToken?.address || ''}
                onChange={(e) => {
                  const token = tokens.find(t => t.address === e.target.value);
                  setSelectedBuyToken(token);
                }}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 180 }}
              >
                <option value="">Buy Token...</option>
                {tokens.map(t => (
                  <option key={t.address} value={t.address}>{getTokenDisplay(t)}</option>
                ))}
              </select>
              <span style={{ alignSelf: 'center' }}>with</span>
              <select
                value={selectedSellToken?.address || ''}
                onChange={(e) => {
                  const token = tokens.find(t => t.address === e.target.value);
                  setSelectedSellToken(token);
                }}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 180 }}
              >
                <option value="">Sell Token...</option>
                {tokens.map(t => (
                  <option key={t.address} value={t.address}>{getTokenDisplay(t)}</option>
                ))}
              </select>
              <input
                type="number"
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 100 }}
                placeholder="Amount"
              />
              <input
                type="number"
                value={orderPrice}
                onChange={(e) => setOrderPrice(e.target.value)}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 100 }}
                placeholder="Price"
              />
              <button 
                onClick={handleCreateBuyOrder}
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
            <p style={{ marginTop: -4, color: '#6b7280', fontSize: 12 }}>
              Requires {selectedSellToken?.symbol || 'sell token'} deposited. Price is {selectedSellToken?.symbol || 'sell token'} per 1 {selectedBuyToken?.symbol || 'buy token'}.
            </p>
          </div>

          {/* Sell Order */}
          <div>
            <h4>Create Sell Order</h4>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <select
                value={selectedSellToken?.address || ''}
                onChange={(e) => {
                  const token = tokens.find(t => t.address === e.target.value);
                  setSelectedSellToken(token);
                }}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 180 }}
              >
                <option value="">Sell Token...</option>
                {tokens.map(t => (
                  <option key={t.address} value={t.address}>{getTokenDisplay(t)}</option>
                ))}
              </select>
              <span style={{ alignSelf: 'center' }}>for</span>
              <select
                value={selectedBuyToken?.address || ''}
                onChange={(e) => {
                  const token = tokens.find(t => t.address === e.target.value);
                  setSelectedBuyToken(token);
                }}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 180 }}
              >
                <option value="">Buy Token...</option>
                {tokens.map(t => (
                  <option key={t.address} value={t.address}>{getTokenDisplay(t)}</option>
                ))}
              </select>
              <input
                type="number"
                value={sellOrderAmount}
                onChange={(e) => setSellOrderAmount(e.target.value)}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 100 }}
                placeholder="Amount"
              />
              <input
                type="number"
                value={sellOrderPrice}
                onChange={(e) => setSellOrderPrice(e.target.value)}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 100 }}
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
            <p style={{ marginTop: -4, color: '#6b7280', fontSize: 12 }}>
              Requires {selectedSellToken?.symbol || 'sell token'} deposited. Price is {selectedBuyToken?.symbol || 'buy token'} per 1 {selectedSellToken?.symbol || 'sell token'}.
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      {message && (
        <div style={{ 
          padding: 12, 
          borderRadius: 8, 
          background: message.includes('Error') || message.includes('failed') ? '#fee2e2' : '#d1fae5',
          color: message.includes('Error') || message.includes('failed') ? '#dc2626' : '#059669',
          marginBottom: 16
        }}>
          {message}
        </div>
      )}

      {/* Order Book */}
      {isConnected && (
        <div className="order-book">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Order Book</h3>
              <select
                value={selectedOrderBookToken?.address || ''}
                onChange={(e) => {
                  const token = tokens.find(t => t.address === e.target.value);
                  setSelectedOrderBookToken(token);
                  if (token) {
                    loadOrderBook(token.address);
                  }
                }}
                style={{ padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
              >
                <option value="">Select Token...</option>
                {tokens.map(t => (
                  <option key={t.address} value={t.address}>{getTokenDisplay(t)}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => selectedOrderBookToken && loadOrderBook(selectedOrderBookToken.address)}
              style={{
                padding: '6px 12px',
                borderRadius: 4,
                border: '1px solid #111827',
                background: '#fff',
                color: '#111827',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Refresh
            </button>
          </div>

          {selectedOrderBookToken && (
            <>
              {/* Show what pair we're viewing */}
              <div style={{ marginBottom: 16, padding: 12, background: '#f3f4f6', borderRadius: 6 }}>
                <strong>Viewing orders for: {selectedOrderBookToken.symbol}</strong>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                  This shows all orders where {selectedOrderBookToken.symbol} is either being bought or sold
                </div>
              </div>

              {/* Conversion rates */}
              <div className="conversion">
                <div className="conversion__items">
                  <div>
                    <strong>Best Bid</strong>
                    <div>{bestBid ? `${formatTokenAmount(bestBid)}` : '-'}</div>
                  </div>
                  <div>
                    <strong>Best Ask</strong>
                    <div>{bestAsk ? `${formatTokenAmount(bestAsk)}` : '-'}</div>
                  </div>
                  <div>
                    <strong>Mid</strong>
                    <div>
                      {bestBid && bestAsk
                        ? `${formatTokenAmount((BigInt(bestBid) + BigInt(bestAsk)) / 2n)}`
                        : '-'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Books */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                {/* Buy Orders */}
                <div>
                  <h4 style={{ marginTop: 0 }}>
                    Buy Orders 
                    <span style={{ fontSize: 14, fontWeight: 'normal', color: '#6b7280', marginLeft: 8 }}>
                      (Want to buy {selectedOrderBookToken.symbol})
                    </span>
                  </h4>
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: 6 }}>
                    <div className="order-book__header-row">
                      <div>Price</div>
                      <div>Buy Amount</div>
                      <div>Paying With</div>
                      <div>Trader</div>
                      <div></div>
                    </div>
                    <div>
                      {buyOrders.length === 0 && (
                        <div style={{ padding: 12, color: '#6b7280' }}>No buy orders</div>
                      )}
                      {buyOrders.map((o) => {
                        const isMine = account && o.trader && account.toLowerCase() === o.trader.toLowerCase();
                        const buyToken = getTokenByAddress(o.buyToken);
                        const sellToken = getTokenByAddress(o.sellToken);
                        return (
                          <div key={o.id} className="order-book__row">
                            <div>
                              {formatTokenAmount(o.price)} {sellToken?.symbol || '?'} / {buyToken?.symbol || '?'}
                            </div>
                            <div>{formatTokenAmount(o.amount)} {buyToken?.symbol || '?'}</div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>
                              {sellToken?.symbol || shortAddr(o.sellToken)}
                            </div>
                            <div>
                              {shortAddr(o.trader)} {isMine && <span className="me-tag">(Me)</span>}
                            </div>
                            <div>
                              {isMine && (
                                <button
                                  onClick={() => handleCancelOrder(o.id)}
                                  disabled={isLoading}
                                  className="btn-cancel"
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
                  <h4 style={{ marginTop: 0 }}>
                    Sell Orders
                    <span style={{ fontSize: 14, fontWeight: 'normal', color: '#6b7280', marginLeft: 8 }}>
                      (Want to sell {selectedOrderBookToken.symbol})
                    </span>
                  </h4>
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: 6 }}>
                    <div className="order-book__header-row">
                      <div>Price</div>
                      <div>Sell Amount</div>
                      <div>Receiving</div>
                      <div>Trader</div>
                      <div></div>
                    </div>
                    <div>
                      {sellOrders.length === 0 && (
                        <div style={{ padding: 12, color: '#6b7280' }}>No sell orders</div>
                      )}
                      {sellOrders.map((o) => {
                        const isMine = account && o.trader && account.toLowerCase() === o.trader.toLowerCase();
                        const buyToken = getTokenByAddress(o.buyToken);
                        const sellToken = getTokenByAddress(o.sellToken);
                        return (
                          <div key={o.id} className="order-book__row">
                            <div>
                              {formatTokenAmount(o.price)} {buyToken?.symbol || '?'} / {sellToken?.symbol || '?'}
                            </div>
                            <div>{formatTokenAmount(o.amount)} {sellToken?.symbol || '?'}</div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>
                              {buyToken?.symbol || shortAddr(o.buyToken)}
                            </div>
                            <div>
                              {shortAddr(o.trader)} {isMine && <span className="me-tag">(Me)</span>}
                            </div>
                            <div>
                              {isMine && (
                                <button
                                  onClick={() => handleCancelOrder(o.id)}
                                  disabled={isLoading}
                                  className="btn-cancel"
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
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default App
