// Initialize AIoOS License Program on Devnet
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { readFileSync } from 'fs';

const PROGRAM_ID = new PublicKey('AXUBfrQmmkNSHm1A32QbCzwtuWg9L8SqQ8rZwbNNnXHg');
const DEVNET_RPC = 'https://api.devnet.solana.com';

// Read deployer keypair from WSL2 path via Windows mount
const keypairPath = process.argv[2];
if (!keypairPath) {
  console.error('Usage: node initialize-devnet.mjs <keypair-path>');
  process.exit(1);
}
const secretKey = Uint8Array.from(JSON.parse(readFileSync(keypairPath, 'utf-8')));
const authority = Keypair.fromSecretKey(secretKey);

// Derive config PDA
const [configPda] = PublicKey.findProgramAddressSync(
  [Buffer.from('config')],
  PROGRAM_ID
);

// Initialize instruction discriminator from IDL
const discriminator = Buffer.from([175, 175, 109, 31, 13, 152, 155, 237]);

const connection = new Connection(DEVNET_RPC, 'confirmed');

async function main() {
  console.log('Authority:', authority.publicKey.toBase58());
  console.log('Config PDA:', configPda.toBase58());
  console.log('Program ID:', PROGRAM_ID.toBase58());

  const balance = await connection.getBalance(authority.publicKey);
  console.log('Balance:', balance / 1e9, 'SOL');

  // Build the initialize instruction
  const ix = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: configPda, isSigner: false, isWritable: true },
      { pubkey: authority.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data: discriminator,
  });

  const tx = new Transaction().add(ix);
  tx.feePayer = authority.publicKey;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  tx.sign(authority);

  console.log('Sending initialize transaction...');
  const signature = await connection.sendRawTransaction(tx.serialize());
  console.log('Signature:', signature);

  await connection.confirmTransaction(signature, 'confirmed');
  console.log('Confirmed!');
  console.log('Explorer:', `https://explorer.solana.com/tx/${signature}?cluster=devnet`);
}

main().catch(err => {
  console.error('Error:', err.message || err);
  process.exit(1);
});
