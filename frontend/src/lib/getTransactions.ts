// Fetches transaction history (ledger) for a given wallet address

import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com");

export const getTransactionHistory = async (wallet: string) => {
  const pubKey = new PublicKey(wallet);

  const signatures = await connection.getSignaturesForAddress(pubKey);

  const txs = await Promise.all(
    signatures.slice(0, 10).map((sig) =>
      connection.getTransaction(sig.signature)
    )
  );

  return txs;
};