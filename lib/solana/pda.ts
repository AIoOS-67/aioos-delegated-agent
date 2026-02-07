// AIoOS Solana PDA Derivation Helpers
// AI-Generated for Colosseum Agent Hackathon 2026

import { PublicKey } from '@solana/web3.js';
import { PROGRAM_ID, SEEDS } from './constants';

/**
 * Derive the ProgramConfig PDA
 */
export function getConfigPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.CONFIG)],
    PROGRAM_ID
  );
}

/**
 * Derive a LicenseAccount PDA for a given agent_id
 */
export function getLicensePda(agentId: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.LICENSE), Buffer.from(agentId)],
    PROGRAM_ID
  );
}

/**
 * Derive an AuditEntry PDA for a given license and audit index
 */
export function getAuditPda(licenseKey: PublicKey, auditIndex: number): [PublicKey, number] {
  const indexBuffer = Buffer.alloc(8);
  indexBuffer.writeBigUInt64LE(BigInt(auditIndex));

  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.AUDIT), licenseKey.toBuffer(), indexBuffer],
    PROGRAM_ID
  );
}
