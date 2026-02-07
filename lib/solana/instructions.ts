// AIoOS Solana Program Instruction Wrappers
// AI-Generated for Colosseum Agent Hackathon 2026
// TypeScript wrappers for all program instructions

import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { getConfigPda, getLicensePda, getAuditPda } from './pda';

/**
 * Initialize the program (one-time setup)
 */
export async function initialize(program: Program): Promise<string> {
  const [configPda] = getConfigPda();

  const tx = await program.methods
    .initialize()
    .accounts({
      config: configPda,
      authority: program.provider.publicKey!,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx;
}

/**
 * Register an NFT mint as an agent license
 */
export async function registerLicense(
  program: Program,
  agentId: string,
  nftMint: PublicKey,
  licenseType: string,
  permissionLevel: string,
  jurisdiction: string
): Promise<string> {
  const [licensePda] = getLicensePda(agentId);
  const [configPda] = getConfigPda();

  const tx = await program.methods
    .registerLicense(agentId, licenseType, permissionLevel, jurisdiction)
    .accounts({
      license: licensePda,
      config: configPda,
      nftMint: nftMint,
      owner: program.provider.publicKey!,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx;
}

/**
 * Update PTAS state for an agent license
 */
export async function updatePtasState(
  program: Program,
  agentId: string,
  newState: object // Anchor enum variant like { active: {} }
): Promise<string> {
  const [licensePda] = getLicensePda(agentId);

  const tx = await program.methods
    .updatePtasState(newState)
    .accounts({
      license: licensePda,
      owner: program.provider.publicKey!,
    })
    .rpc();

  return tx;
}

/**
 * Revoke an agent license (terminal state)
 */
export async function revokeLicense(
  program: Program,
  agentId: string
): Promise<string> {
  const [licensePda] = getLicensePda(agentId);
  const [configPda] = getConfigPda();

  const tx = await program.methods
    .revokeLicense()
    .accounts({
      license: licensePda,
      config: configPda,
      authority: program.provider.publicKey!,
    })
    .rpc();

  return tx;
}

/**
 * Log an action to the on-chain audit trail
 */
export async function logAction(
  program: Program,
  agentId: string,
  action: string,
  details: string
): Promise<string> {
  const [licensePda] = getLicensePda(agentId);

  // Fetch current audit count to derive the correct PDA
  const licenseAccount = await (program.account as any).licenseAccount.fetch(licensePda);
  const auditIndex = (licenseAccount as any).auditCount.toNumber();
  const [auditPda] = getAuditPda(licensePda, auditIndex);

  const tx = await program.methods
    .logAction(action, details)
    .accounts({
      auditEntry: auditPda,
      license: licensePda,
      owner: program.provider.publicKey!,
      actor: program.provider.publicKey!,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx;
}

/**
 * Fetch a license account from chain
 */
export async function fetchLicense(program: Program, agentId: string) {
  const [licensePda] = getLicensePda(agentId);
  try {
    const account = await (program.account as any).licenseAccount.fetch(licensePda);
    return account;
  } catch {
    return null;
  }
}

/**
 * Fetch all audit entries for a license
 */
export async function fetchAuditEntries(program: Program, agentId: string) {
  const [licensePda] = getLicensePda(agentId);
  try {
    const licenseAccount = await (program.account as any).licenseAccount.fetch(licensePda);
    const auditCount = (licenseAccount as any).auditCount.toNumber();

    const entries = [];
    for (let i = 0; i < auditCount; i++) {
      const [auditPda] = getAuditPda(licensePda, i);
      try {
        const entry = await (program.account as any).auditEntry.fetch(auditPda);
        entries.push(entry);
      } catch {
        // Entry might not exist if there was an error during creation
      }
    }
    return entries;
  } catch {
    return [];
  }
}

// Anchor enum helpers for PTAS states
export const PtasStateEnum = {
  Dormant: { dormant: {} },
  Activating: { activating: {} },
  Active: { active: {} },
  Executing: { executing: {} },
  Hibernating: { hibernating: {} },
  Revoked: { revoked: {} },
} as const;
