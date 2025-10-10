import { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import './App.css'

function App() {
  const [walletAddress, setWalletAddress] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const connectWallet = useCallback(async () => {
    setErrorMessage('')
    try {
      if (!window.ethereum) {
        setErrorMessage('MetaMask not detected. Please install it to continue.')
        return
      }

      setIsConnecting(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      if (!accounts || accounts.length === 0) {
        setErrorMessage('No account authorized')
        return
      }
      setWalletAddress(ethers.getAddress(accounts[0]))
    } catch (err) {
      setErrorMessage(err?.message ?? 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }, [])

  useEffect(() => {
    if (!window.ethereum) return
    const handleAccountsChanged = (accounts) => {
      if (accounts && accounts.length > 0) {
        setWalletAddress(ethers.getAddress(accounts[0]))
      } else {
        setWalletAddress('')
      }
    }
    window.ethereum.on?.('accountsChanged', handleAccountsChanged)
    return () => {
      window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged)
    }
  }, [])

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Decentralized Exchange – MVP Setup</h1>
      {walletAddress ? (
        <div style={{
          padding: 12,
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          background: '#f9fafb',
          wordBreak: 'break-all'
        }}>
          Connected Wallet: {walletAddress}
        </div>
      ) : (
        <button onClick={connectWallet} disabled={isConnecting} style={{
          padding: '10px 16px',
          borderRadius: 8,
          border: '1px solid #111827',
          background: '#111827',
          color: 'white',
          cursor: 'pointer'
        }}>
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
      {errorMessage && (
        <p style={{ color: 'crimson', marginTop: 12 }}>{errorMessage}</p>
      )}
    </div>
  )
}

export default App
