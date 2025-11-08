import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { DEX_CONTRACT_ADDRESS, DEX_ABI, ERC20_ABI, ASSET_TOKEN_ABI, ASSET_TOKEN_BYTECODE } from '../utils/contractConfig';

export const useDEX = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [dexContract, setDexContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
    }
  }, []);

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

  const deposit = useCallback(async (tokenAddress, amount) => {
    if (!signer || !dexContract) {
      throw new Error('Wallet not connected');
    }

    try {
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      const approveTx = await tokenContract.approve(DEX_CONTRACT_ADDRESS, amount);
      await approveTx.wait();

      const depositTx = await dexContract.deposit(tokenAddress, amount);
      await depositTx.wait();

      return depositTx.hash;
    } catch (error) {
      console.error('Error depositing:', error);
      throw error;
    }
  }, [signer, dexContract]);

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

  const cancelOrder = useCallback(async (tokenAddress, orderId) => {
    if (!dexContract) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await dexContract.cancelOrder(tokenAddress, orderId);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  }, [dexContract]);

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

  const getOrderBook = useCallback(async (tokenAddress) => {
    if (!dexContract) return [];
    
    try {
      const nextOrderId = await dexContract.nextOrderId();
      const orders = [];
      
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
          break;
        }
      }
      
      return orders;
    } catch (error) {
      console.error('Error getting order book:', error);
      return [];
    }
  }, [dexContract]);

  const formatTokenAmount = useCallback((amount, decimals = 18) => {
    return ethers.formatUnits(amount, decimals);
  }, []);

  const parseTokenAmount = useCallback((amount, decimals = 18) => {
    return ethers.parseUnits(amount, decimals);
  }, []);

  // Token issuance function
  const issueToken = useCallback(async (name, symbol, initialSupply) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const factory = new ethers.ContractFactory(ASSET_TOKEN_ABI, ASSET_TOKEN_BYTECODE, signer);
      const parsedSupply = parseTokenAmount(initialSupply);
      const tokenContract = await factory.deploy(name, symbol, parsedSupply);
      await tokenContract.waitForDeployment();
      const tokenAddress = await tokenContract.getAddress();
      return tokenAddress;
    } catch (error) {
      console.error('Error issuing token:', error);
      throw error;
    }
  }, [signer, parseTokenAmount]);

  // Get token info (name, symbol)
  const getTokenInfo = useCallback(async (tokenAddress) => {
    if (!provider) return null;
    
    try {
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      const [name, symbol] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol()
      ]);
      return { name, symbol, address: tokenAddress };
    } catch (error) {
      console.error('Error getting token info:', error);
      return null;
    }
  }, [provider]);

  // Fund address with tokens (transfer from issuer)
  const fundToken = useCallback(async (tokenAddress, recipientAddress, amount) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const tokenContract = new ethers.Contract(tokenAddress, ASSET_TOKEN_ABI, signer);
      
      // Check if caller is owner
      const owner = await tokenContract.owner();
      const caller = await signer.getAddress();
      if (owner.toLowerCase() !== caller.toLowerCase()) {
        // If not owner, try transfer instead of mint
        const parsedAmount = parseTokenAmount(amount);
        const tx = await tokenContract.transfer(recipientAddress, parsedAmount);
        await tx.wait();
        return tx.hash;
      } else {
        // If owner, can mint directly
        const parsedAmount = parseTokenAmount(amount);
        const tx = await tokenContract.mint(recipientAddress, parsedAmount);
        await tx.wait();
        return tx.hash;
      }
    } catch (error) {
      console.error('Error funding token:', error);
      throw error;
    }
  }, [signer, parseTokenAmount]);

  return {
    // connection state
    isConnected,
    account,
    provider,
    signer,
    dexContract,
    
    // connection functions
    connectWallet,
    // balance functions
    getBalance,
    getTokenBalance,
    // DEX functions
    deposit,
    withdraw,
    createBuyOrder,
    createSellOrder,
    matchOrders,
    getOrderBook,
    cancelOrder,
    // token issuance functions
    issueToken,
    getTokenInfo,
    fundToken,
    // util functions
    formatTokenAmount,
    parseTokenAmount
  };
};
