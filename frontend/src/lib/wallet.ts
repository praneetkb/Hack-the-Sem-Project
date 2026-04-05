// Phantom Wallet for frontend
// @solana/web3.js is dynamically imported to avoid Node.js built-in conflicts at build time

export const getProvider = () => {
  if (typeof window !== "undefined" && "solana" in window) {
    const provider = (window as any).solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  return null;
};

export const connectWallet = async (): Promise<string | null> => {
  const provider = getProvider();

  if (!provider) {
    alert("Please install Phantom Wallet");
    return null;
  }

  try {
    const response = await provider.connect({ onlyIfTrusted: false });
    return response.publicKey.toString();
  } catch (err) {
    console.error("Wallet connection failed", err);
    return null;
  }
};

export const getWalletBalance = async (wallet: string): Promise<number> => {
  const { Connection, PublicKey } = await import("@solana/web3.js");
  const connection = new Connection("https://api.devnet.solana.com");
  const pubKey = new PublicKey(wallet);
  const balance = await connection.getBalance(pubKey);
  return balance / 1e9;
};

export const getTransactionHistory = async (wallet: string): Promise<any[]> => {
  const { Connection, PublicKey } = await import("@solana/web3.js");
  const connection = new Connection("https://api.devnet.solana.com");
  const pubKey = new PublicKey(wallet);
  const signatures = await connection.getSignaturesForAddress(pubKey, { limit: 10 });
  const txs = await Promise.all(
    signatures.map((sig) => connection.getTransaction(sig.signature))
  );
  return txs;
};
