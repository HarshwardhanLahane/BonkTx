import { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

import ethereumLogo from './assets/ethereum.svg';
import solanaLogo from './assets/solana.svg';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [ethAddress, setEthAddress] = useState('');
  const [solAddress, setSolAddress] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');
  const [ethBalance, setEthBalance] = useState(null);
  const [solBalance, setSolBalance] = useState(null);
  const [showPrivateKeys, setShowPrivateKeys] = useState(false);
  const [privateKeys, setPrivateKeys] = useState({ eth: '', sol: '' });
  const [transactions, setTransactions] = useState([]);

  // Utility Functions
  const fetchEthBalance = async (address) => {
    try {
      console.log("Fetching ETH balance for:", address);
      const cleanUrl = import.meta.env.VITE_ALCHEMY_ETH_URL.replace('https://https://', 'https://');
      const provider = new ethers.JsonRpcProvider(cleanUrl);
      const balance = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);
      console.log("ETH balance:", balanceInEth);
      setEthBalance(parseFloat(balanceInEth).toFixed(4));
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
      setEthBalance('Error');
    }
  };

  const fetchSolBalance = async (address) => {
    try {
      console.log("Fetching SOL balance for:", address);
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);
      const balanceInSol = balance / LAMPORTS_PER_SOL;
      console.log("SOL balance:", balanceInSol);
      setSolBalance(balanceInSol.toFixed(4));
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
      setSolBalance('Error');
    }
  };

  const refreshBalances = async () => {
    if (ethAddress) await fetchEthBalance(ethAddress);
    if (solAddress) await fetchSolBalance(solAddress);
  };

  // Authentication Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/users/login', { username, password });
      setEthAddress(response.data.ethAddress);
      setSolAddress(response.data.solAddress);
      await refreshBalances();
      alert('Login successful!');
    } catch (error) {
      console.error(error);
      alert('Login failed.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/users/register', { username, password });
      alert('User registered successfully!');
    } catch (error) {
      console.error(error);
      alert('Registration failed.');
    }
  };

  const handleEthTransaction = async (e) => {
    e.preventDefault();
    const toAddress = prompt('Enter Ethereum address to send to:');
    const amount = prompt('Enter amount of ETH to send:');
    
    if (!toAddress || !amount) return;

    try {
      const response = await axios.post('http://localhost:3000/api/users/send-eth', { 
        username, 
        toAddress, 
        amount 
      });
      
      if (response.data.newBalance) {
        setEthBalance(parseFloat(response.data.newBalance).toFixed(4));
      }

      const newTransaction = {
        type: 'ETH',
        hash: response.data.transactionHash,
        amount,
        to: toAddress,
        timestamp: new Date().toLocaleString(),
        status: 'success'
      };
      setTransactions(prev => [newTransaction, ...prev]);
      
      setTransactionStatus(`ETH Transaction sent: ${response.data.transactionHash}`);
      
      setTimeout(refreshBalances, 1000);
    } catch (error) {
      console.error(error);
      setTransactionStatus('ETH transaction failed.');
      const failedTransaction = {
        type: 'ETH',
        amount,
        to: toAddress,
        timestamp: new Date().toLocaleString(),
        status: 'failed',
        error: error.response?.data?.message || error.message
      };
      setTransactions(prev => [failedTransaction, ...prev]);
    }
  };

  const handleSolTransaction = async (e) => {
    e.preventDefault();
    const toAddress = prompt('Enter Solana address to send to:');
    const amount = prompt('Enter amount of SOL to send:');
    
    if (!toAddress || !amount) return;

    try {
      const response = await axios.post('http://localhost:3000/api/users/send-sol', { 
        username, 
        toAddress, 
        amount 
      });
      
      if (response.data.newBalance) {
        setSolBalance(parseFloat(response.data.newBalance).toFixed(4));
      }

      const newTransaction = {
        type: 'SOL',
        signature: response.data.transactionSignature,
        amount,
        to: toAddress,
        timestamp: new Date().toLocaleString(),
        status: 'success'
      };
      setTransactions(prev => [newTransaction, ...prev]);
      
      setTransactionStatus(`SOL Transaction sent: ${response.data.transactionSignature}`);
      
      setTimeout(refreshBalances, 1000);
    } catch (error) {
      console.error(error);
      setTransactionStatus('SOL transaction failed.');
      const failedTransaction = {
        type: 'SOL',
        amount,
        to: toAddress,
        timestamp: new Date().toLocaleString(),
        status: 'failed',
        error: error.response?.data?.message || error.message
      };
      setTransactions(prev => [failedTransaction, ...prev]);
    }
  };

  const handleShowPrivateKeys = async () => {
    try {
      if (showPrivateKeys) {
        setShowPrivateKeys(false);
        return;
      }
  
      console.log("Fetching private keys for user:", username);
      const response = await axios.post('http://localhost:3000/api/users/private-keys', { 
        username,
        password
      });
      
      console.log("Private keys response received");
      
      if (response.data.ethPrivateKey && response.data.solPrivateKey) {
        setPrivateKeys({
          eth: response.data.ethPrivateKey,
          sol: response.data.solPrivateKey
        });
        setShowPrivateKeys(true);
      } else {
        console.error("Invalid response format:", response.data);
        alert('Failed to fetch private keys: Invalid response format');
      }
    } catch (error) {
      console.error('Private key fetch error:', error);
      alert(`Failed to fetch private keys: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEjectUser = async () => {
    if (window.confirm('Are you sure you want to delete your account? This will remove your data from our database but preserve your wallet keys.')) {
      const confirmPassword = prompt('Please enter your password to confirm deletion:');
      
      if (!confirmPassword) {
        alert('Password required for account deletion.');
        return;
      }

      try {
        const response = await axios.post('http://localhost:3000/api/users/eject', {
          username: username,
          password: confirmPassword
        });
        
        setPrivateKeys({
          eth: response.data.ethPrivateKey,
          sol: response.data.solPrivateKey
        });
        setShowPrivateKeys(true);
        alert('Account deleted. SAVE YOUR PRIVATE KEYS NOW!');
        
        setUsername('');
        setPassword('');
        setEthAddress('');
        setSolAddress('');
        setTransactions([]);
        
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || 'Failed to delete account.');
      }
    }
  };

  useEffect(() => {
    if (ethAddress || solAddress) {
      refreshBalances();
      const intervalId = setInterval(refreshBalances, 30000);
      return () => clearInterval(intervalId);
    }
  }, [ethAddress, solAddress]);

  return (
    <div className="min-h-screen bg-[#0F172A] bg-gradient-to-br from-violet-900/20 via-slate-900 to-purple-900/20">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] -top-48 -left-48 bg-purple-500/30 rounded-full blur-[120px]" />
        <div className="absolute w-[500px] h-[500px] -bottom-48 -right-48 bg-blue-500/30 rounded-full blur-[120px]" />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
            </div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
              BonkTx
            </h1>
            <p className="text-slate-400 mt-2">Seamless & Safe Crypto Wallet Control
            </p>
          </div>

          {!ethAddress ? (
            // Login/Register Form
            <div className="glass-morphism rounded-2xl p-8 max-w-md mx-auto">
              <div className="space-y-6">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleLogin}
                    className="py-3 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-xl text-white font-medium hover:opacity-90 transition-all animate-glow"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleRegister}
                    className="py-3 bg-slate-700 rounded-xl text-white font-medium hover:bg-slate-600 transition-all"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Dashboard
            <div className="space-y-6">
              {/* Wallet Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card-shine glass-morphism rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img src={ethereumLogo} alt="ETH" className="w-8 h-8" />
                      <span className="text-slate-200 font-medium">Ethereum</span>
                    </div>
                    <span className="text-2xl font-bold text-violet-400">{ethBalance} ETH</span>
                  </div>
                  <p className="text-slate-400 text-sm break-all">{ethAddress}</p>
                </div>

                <div className="card-shine glass-morphism rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img src={solanaLogo} alt="SOL" className="w-8 h-8" />
                      <span className="text-slate-200 font-medium">Solana</span>
                    </div>
                    <span className="text-2xl font-bold text-indigo-400">{solBalance} SOL</span>
                  </div>
                  <p className="text-slate-400 text-sm break-all">{solAddress}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleEthTransaction}
                  className="p-4 glass-morphism rounded-xl text-violet-400 font-medium hover:bg-violet-500/10 transition-all border border-violet-500/20"
                >
                  Send ETH
                </button>
                <button
                  onClick={handleSolTransaction}
                  className="p-4 glass-morphism rounded-xl text-indigo-400 font-medium hover:bg-indigo-500/10 transition-all border border-indigo-500/20"
                >
                  Send SOL
                </button>
              </div>

              {/* Private Keys Section */}
              <div className="flex space-x-4">
                <button
                  onClick={handleShowPrivateKeys}
                  className="flex-1 p-4 glass-morphism rounded-xl text-slate-300 font-medium hover:bg-slate-700/30 transition-all border border-slate-700/50"
                >
                  {showPrivateKeys ? 'Hide Private Keys' : 'Show Private Keys'}
                </button>
                <button
                  onClick={handleEjectUser}
                  className="flex-1 p-4 glass-morphism rounded-xl text-red-400 font-medium hover:bg-red-500/10 transition-all border border-red-500/20"
                >
                  Eject User
                </button>
              </div>

              {showPrivateKeys && (
                <div className="glass-morphism rounded-xl p-6 space-y-4 border border-slate-700/50">
                  <div>
                    <p className="text-violet-400 text-sm mb-1">ETH Private Key:</p>
                    <p className="text-slate-300 break-all text-sm font-mono">{privateKeys.eth}</p>
                  </div>
                  <div>
                    <p className="text-indigo-400 text-sm mb-1">SOL Private Key:</p>
                    <p className="text-slate-300 break-all text-sm font-mono">{privateKeys.sol}</p>
                  </div>
                </div>
              )}

              {/* Transaction Status */}
              {transactionStatus && (
                <div className="glass-morphism rounded-xl p-4 border border-slate-700/50">
                  <p className="text-slate-300 text-center text-sm break-all">
                    {transactionStatus}
                  </p>
                </div>
              )}

              {/* Transaction History */}
              {transactions.length > 0 && (
                <div className="glass-morphism rounded-xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 mb-4">
                    Transaction History
                  </h3>
                  <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                    {transactions.map((tx, index) => (
                      <div 
                        key={index}
                        className={`glass-morphism rounded-lg p-4 transition-all hover:scale-[1.02] ${
                          tx.status === 'success'
                            ? 'border border-slate-700/50'
                            : 'border border-red-500/20'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-2">
                            <span className={tx.type === 'ETH' ? 'text-violet-400' : 'text-indigo-400'}>
                              {tx.type}
                            </span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-300">{tx.amount} {tx.type}</span>
                          </div>
                          <span className="text-xs text-slate-500">{tx.timestamp}</span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-slate-400 truncate">To: {tx.to}</p>
                          {tx.status === 'success' ? (
                            <a
                              href={tx.type === 'ETH'
                                ? `https://sepolia.etherscan.io/tx/${tx.hash}`
                                : `https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-violet-400 hover:text-violet-300 transition-colors mt-1 block"
                            >
                              View Transaction
                            </a>
                          ) : (
                            <p className="text-xs text-red-400 mt-1">
                              Error: {tx.error}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
