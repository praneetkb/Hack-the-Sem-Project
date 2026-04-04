// Phantom Wallet for frontend 

import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com");

// Get provider (Phantom Wallet)
export const getProvider = () => { 
  if ("solana" in window) {
    const provider = (window as any).solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  return null;
};

// Connect wallet and return publicKey
export const connectWallet = async () => {
    const provider = getProvider();
  
    if (!provider) {
      alert("Please install Phantom Wallet");
      return null;
    }
  
    try {
      const response = await provider.connect({
        onlyIfTrusted: false, // IMPORTANT - forces popup
      });
  
      return response.publicKey.toString();
    } catch (err) {
      console.error("Wallet connection failed", err);
      return null;
    }
  };

// Get SOL balance
export const getWalletBalance = async (wallet: string) => {
  const pubKey = new PublicKey(wallet);
  const balance = await connection.getBalance(pubKey);
  return balance / 1e9; // convert lamports to SOL
};

// Get last 10 transactions
export const getTransactionHistory = async (wallet: string) => {
  const pubKey = new PublicKey(wallet);
  const signatures = await connection.getSignaturesForAddress(pubKey, { limit: 10 });

  const txs = await Promise.all(
    signatures.map((sig) => connection.getTransaction(sig.signature))
  );

  return txs;
};