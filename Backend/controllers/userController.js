const { ethers } = require("ethers");
const User = require("../models/user");
const bcrypt = require("bcrypt");
require('dotenv').config();
const { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  Keypair,
  LAMPORTS_PER_SOL 
} = require("@solana/web3.js");

// User Authentication Controllers
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const ethWallet = ethers.Wallet.createRandom();
    const ethKeyPair = {
      address: ethWallet.address,
      privateKey: ethWallet.privateKey,
    };

    const solWallet = Keypair.generate();
    const solKeyPair = {
      address: solWallet.publicKey.toString(),
      privateKey: solWallet.secretKey.toString(),
    };

    const newUser = new User({
      username,
      password: hashedPassword,
      ethKeyPair,
      solKeyPair,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      ethAddress: user.ethKeyPair.address,
      solAddress: user.solKeyPair.address,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getPrivateKeys = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("Fetching private keys for user:", username);
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found:", username);
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password if provided
    if (password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }

    // Return private keys
    res.status(200).json({
      ethPrivateKey: user.ethKeyPair.privateKey,
      solPrivateKey: user.solKeyPair.privateKey
    });
    
    console.log("Private keys sent successfully");
  } catch (error) {
    console.error('Error fetching private keys:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const signAndSendEthTransaction = async (req, res) => {
  const { username, toAddress, amount } = req.body;

  try {
    console.log("\n=== Transaction Request ===");
    console.log({ username, toAddress, amount });

    // 1. Validate user and wallet data
    const user = await User.findOne({ username });
    if (!user || !user.ethKeyPair || !user.ethKeyPair.privateKey) {
      console.log("User data validation failed");
      return res.status(400).json({ message: "Invalid user data" });
    }

    // 2. Validate private key format
    const privateKey = user.ethKeyPair.privateKey;
    if (!privateKey.startsWith('0x')) {
      console.log("Invalid private key format");
      return res.status(400).json({ message: "Invalid private key format" });
    }

    // 3. Setup provider connection
    const cleanUrl = process.env.VITE_ALCHEMY_ETH_URL.replace('https://https://', 'https://');
    const provider = new ethers.JsonRpcProvider(cleanUrl);
    const network = await provider.getNetwork();
    console.log("Network connected:", network.name);

    // 4. Create wallet and send transaction
    const wallet = new ethers.Wallet(privateKey, provider);
    const transaction = await wallet.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(amount.toString()),
    });
    console.log("Transaction sent:", transaction.hash);

    // 5. Wait for confirmation
    const receipt = await transaction.wait();
    console.log("Transaction confirmed:", receipt);

    // 6. Get updated balance
    const newBalance = await provider.getBalance(wallet.address);
    const balanceInEth = ethers.formatEther(newBalance);

    res.status(200).json({
      message: "ETH Transaction sent successfully",
      transactionHash: transaction.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      newBalance: balanceInEth
    });

  } catch (error) {
    console.error("\n=== Transaction Error ===");
    console.error({
      message: error.message,
      code: error.code,
      reason: error.reason,
      stack: error.stack
    });

    return res.status(500).json({
      message: "Transaction failed",
      error: error.message,
      details: {
        code: error.code,
        reason: error.reason
      }
    });
  }
};

const signAndSendSolTransaction = async (req, res) => {
  const { username, toAddress, amount } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const secretKey = Uint8Array.from(user.solKeyPair.privateKey.split(",").map(Number));
    const solWallet = Keypair.fromSecretKey(secretKey);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: solWallet.publicKey,
        toPubkey: new PublicKey(toAddress),
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    const signature = await connection.sendTransaction(transaction, [solWallet]);
    
    // Get updated balance
    const newBalance = await connection.getBalance(solWallet.publicKey);
    const balanceInSol = newBalance / LAMPORTS_PER_SOL;

    res.status(200).json({
      message: "SOL Transaction sent successfully",
      transactionSignature: signature,
      newBalance: balanceInSol
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const ejectUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Eject request received for user:', username);
    console.log('Password provided:', !!password);
    
    // Find the user
    const user = await User.findOne({ username });
    console.log('User found:', !!user);
    console.log('Stored password hash:', !!user?.password);
    
    if (!user) {
      console.log('User not found:', username);
      return res.status(404).json({ message: "User not found" });
    }

    // Validate inputs before comparison
    if (!password || !user.password) {
      console.log('Missing password data:', { 
        hasPassword: !!password, 
        hasStoredPassword: !!user.password 
      });
      return res.status(400).json({ 
        message: "Missing password data",
        hasPassword: !!password,
        hasStoredPassword: !!user.password
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    
    // Get private keys before deletion
    const privateKeys = {
      ethPrivateKey: user.ethKeyPair.privateKey,
      solPrivateKey: user.solKeyPair.privateKey,
    };

    // Delete the user
    const result = await User.deleteOne({ username });
    console.log('Delete result:', result);

    if (result.deletedCount === 0) {
      console.log('Failed to delete user:', username);
      return res.status(500).json({ message: "Failed to delete user" });
    }

    console.log('User successfully ejected:', username);
    res.status(200).json({
      message: "User successfully ejected",
      ...privateKeys
    });
  } catch (error) {
    console.error('Error ejecting user:', error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message,
      stack: error.stack 
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  signAndSendSolTransaction,
  signAndSendEthTransaction,
  getPrivateKeys,
  ejectUser
};