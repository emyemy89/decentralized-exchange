import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { DEX_CONTRACT_ADDRESS, DEX_ABI, ERC20_ABI } from '../utils/contractConfig';

export const useDEX = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [dexContract, setDexContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize provider and signer
  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
    }
  }, []);

  // Connect to MetaMask and ensure we're on Hardhat (31337)
  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not detected');
      }

      const HARDHAT_PARAMS = {
        chainId: '0x7A69', // 31337
        chainName: 'Hardhat Local',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['http://127.0.0.1:8545'],
        blockExplorerUrls: []
      };

      // Try to switch to Hardhat; if not added, add it
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: HARDHAT_PARAMS.chainId }],
        });
      } catch (switchErr) {
        if (switchErr?.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [HARDHAT_PARAMS],
          });
        } else {
          throw switchErr;
        }
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        // "any" avoids network caching issues when chain changes
        const provider = new ethers.BrowserProvider(window.ethereum, 'any');
        const signer = await provider.getSigner();
        const dexContract = new ethers.Contract(DEX_CONTRACT_ADDRESS, DEX_ABI, signer);

        setSigner(signer);
        setDexContract(dexContract);
        setAccount(accounts[0]);
        setIsConnected(true);

        return accounts[0];
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }, []);

  // Get user's balance for a specific token in the DEX
  const getBalance = useCallback(async (tokenAddress) => {
    if (!dexContract || !account) return '0';
    
    try {
      const balance = await dexContract.balances(tokenAddress, account);
      return balance.toString();
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }, [dexContract, account]);

  // Get user's token balance from the token contract
  const getTokenBalance = useCallback(async (tokenAddress) => {
    if (!provider || !account) return '0';
    
    try {
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      const balance = await tokenContract.balanceOf(account);
      return balance.toString();
    } catch (error) {
      console.error('Error getting token balance:', error);
      return '0';
    }
  }, [provider, account]);

  // Deposit tokens into the DEX
  const deposit = useCallback(async (tokenAddress, amount) => {
    if (!signer || !dexContract) {
      throw new Error('Wallet not connected');
    }

    try {
      // First approve the DEX to spend tokens
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      const approveTx = await tokenContract.approve(DEX_CONTRACT_ADDRESS, amount);
      await approveTx.wait();

      // Then deposit
      const depositTx = await dexContract.deposit(tokenAddress, amount);
      await depositTx.wait();

      return depositTx.hash;
    } catch (error) {
      console.error('Error depositing:', error);
      throw error;
    }
  }, [signer, dexContract]);

  // Withdraw tokens from the DEX
  const withdraw = useCallback(async (tokenAddress, amount) => {
    if (!dexContract) {
      throw new Error('Wallet not connected');
    }

    try {
      const withdrawTx = await dexContract.withdraw(tokenAddress, amount);
      await withdrawTx.wait();
      return withdrawTx.hash;
    } catch (error) {
      console.error('Error withdrawing:', error);
      throw error;
    }
  }, [dexContract]);

  // Create a buy order
  const createBuyOrder = useCallback(async (buyToken, sellToken, amount, price) => {
    if (!dexContract) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await dexContract.createBuyOrder(buyToken, sellToken, amount, price);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error creating buy order:', error);
      throw error;
    }
  }, [dexContract]);

  // Create a sell order
  const createSellOrder = useCallback(async (sellToken, buyToken, amount, price) => {
    if (!dexContract) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await dexContract.createSellOrder(sellToken, buyToken, amount, price);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error creating sell order:', error);
      throw error;
    }
  }, [dexContract]);

  // Match orders for a token
  const matchOrders = useCallback(async (tokenAddress) => {
    if (!dexContract) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await dexContract.matchOrders(tokenAddress);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error matching orders:', error);
      throw error;
    }
  }, [dexContract]);

  // Get order book for a token
  const getOrderBook = useCallback(async (tokenAddress) => {
    if (!dexContract) return [];
    
    try {
      // Get the next order ID to know how many orders exist
      const nextOrderId = await dexContract.nextOrderId();
      const orders = [];
      
      // Fetch all orders (this is a simplified approach)
      for (let i = 0; i < nextOrderId; i++) {
        try {
          const order = await dexContract.orderBook(tokenAddress, i);
          orders.push({
            id: order.id.toString(),
            trader: order.trader,
            isBuyOrder: order.isBuyOrder,
            buyToken: order.buyToken,
            sellToken: order.sellToken,
            amount: order.amount.toString(),
            price: order.price.toString(),
            isFilled: order.isFilled
          });
        } catch (error) {
          // Order doesn't exist at this index, continue
          break;
        }
      }
      
      return orders;
    } catch (error) {
      console.error('Error getting order book:', error);
      return [];
    }
  }, [dexContract]);

  // Format token amount for display
  const formatTokenAmount = useCallback((amount, decimals = 18) => {
    return ethers.formatUnits(amount, decimals);
  }, []);

  // Parse token amount for contract calls
  const parseTokenAmount = useCallback((amount, decimals = 18) => {
    return ethers.parseUnits(amount, decimals);
  }, []);

  return {
    // Connection state
    isConnected,
    account,
    provider,
    signer,
    dexContract,
    
    // Connection functions
    connectWallet,
    
    // Balance functions
    getBalance,
    getTokenBalance,
    
    // DEX functions
    deposit,
    withdraw,
    createBuyOrder,
    createSellOrder,
    matchOrders,
    getOrderBook,
    
    // Utility functions
    formatTokenAmount,
    parseTokenAmount
  };
};
