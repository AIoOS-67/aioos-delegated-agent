// AIoOS Solana Program Instance Factory
// AI-Generated for Colosseum Agent Hackathon 2026

import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { IDL } from './idl';

/**
 * Create an Anchor Program instance for the AIoOS License Program
 * Anchor v0.32+ uses new Program(idl, provider) with address in the IDL
 */
export function getProgram(connection: Connection, wallet: AnchorWallet) {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
    preflightCommitment: 'confirmed',
  });

  return new Program(IDL as any, provider);
}

/**
 * Create a read-only program instance (no wallet needed)
 */
export function getReadOnlyProgram(connection: Connection) {
  const dummyWallet = {
    publicKey: PublicKey.default,
    signTransaction: async (tx: any) => tx,
    signAllTransactions: async (txs: any[]) => txs,
  };

  const provider = new AnchorProvider(connection, dummyWallet as any, {
    commitment: 'confirmed',
  });

  return new Program(IDL as any, provider);
}
