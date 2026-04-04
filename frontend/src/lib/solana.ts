// Send payments on Solana blockchain

import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    TransactionInstruction,
  } from "@solana/web3.js";
  
  const connection = new Connection("https://api.devnet.solana.com");
  
  export const sendEnergyPayment = async (
    provider: any,
    toAddress: string,
    amount: number,
    metadata: any
  ) => {
    const transaction = new Transaction();

    // set recent blockhash + fee payer for phantom
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = provider.publicKey;
  
    // SOL transfer
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: new PublicKey(toAddress),
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );
  
    // ledger data 
    const memoInstruction = new TransactionInstruction({
      keys: [],
      programId: new PublicKey(
        "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
      ),
      data: Buffer.from(JSON.stringify(metadata)),
    });
  
    transaction.add(memoInstruction);
  
    // send
    const { signature } = await provider.signAndSendTransaction(transaction);
  
    await connection.confirmTransaction(signature);
  
    return signature;
  };