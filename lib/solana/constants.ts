// AIoOS Solana License Program Constants
// AI-Generated for Colosseum Agent Hackathon 2026

import { PublicKey } from '@solana/web3.js';

// Program ID - updated after Devnet deployment
export const PROGRAM_ID = new PublicKey('AXUBfrQmmkNSHm1A32QbCzwtuWg9L8SqQ8rZwbNNnXHg');

// Solana Devnet RPC endpoint
export const DEVNET_RPC = 'https://api.devnet.solana.com';

// PDA Seeds
export const SEEDS = {
  CONFIG: 'config',
  LICENSE: 'license',
  AUDIT: 'audit',
} as const;

// Solana Explorer base URL (Devnet)
export const EXPLORER_URL = 'https://explorer.solana.com';

export function getExplorerTxUrl(signature: string): string {
  return `${EXPLORER_URL}/tx/${signature}?cluster=devnet`;
}

export function getExplorerAddressUrl(address: string): string {
  return `${EXPLORER_URL}/address/${address}?cluster=devnet`;
}

// PTAS States matching on-chain enum
export const PTAS_STATES = {
  Dormant: 'Dormant',
  Activating: 'Activating',
  Active: 'Active',
  Executing: 'Executing',
  Hibernating: 'Hibernating',
  Revoked: 'Revoked',
} as const;

export type PtasState = keyof typeof PTAS_STATES;
