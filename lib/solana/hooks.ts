// AIoOS Solana React Hooks
// AI-Generated for Colosseum Agent Hackathon 2026
// Custom hooks for program interactions from React components

'use client';

import { useCallback, useState, useEffect } from 'react';
import { useConnection, useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { getProgram } from './program';
import * as ix from './instructions';
import { PtasStateEnum } from './instructions';
import { mintLicenseNft } from './umi';
import type { PtasState } from './constants';

interface TxResult {
  signature: string;
  success: boolean;
  error?: string;
}

/**
 * Hook to get the Anchor program instance
 */
export function useSolanaProgram() {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();

  if (!anchorWallet) return null;
  return getProgram(connection, anchorWallet);
}

/**
 * Hook to mint an NFT license and register it on-chain
 */
export function useMintLicense() {
  const wallet = useWallet();
  const program = useSolanaProgram();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    mintAddress?: string;
    mintTx?: string;
    registerTx?: string;
    error?: string;
  } | null>(null);

  const mint = useCallback(async (params: {
    agentId: string;
    agentName: string;
    licenseType: string;
    permissionLevel: string;
    jurisdiction: string;
  }) => {
    if (!program || !wallet.connected) {
      setResult({ error: 'Wallet not connected' });
      return null;
    }

    setLoading(true);
    setResult(null);

    try {
      // Step 1: Mint NFT via Metaplex Umi
      const nftResult = await mintLicenseNft(wallet, {
        agentName: params.agentName,
        licenseType: params.licenseType,
        permissionLevel: params.permissionLevel,
        jurisdiction: params.jurisdiction,
        agentId: params.agentId,
      });

      // Step 2: Register the license on our custom program
      const registerTx = await ix.registerLicense(
        program,
        params.agentId,
        new PublicKey(nftResult.mintAddress),
        params.licenseType,
        params.permissionLevel,
        params.jurisdiction
      );

      const res = {
        mintAddress: nftResult.mintAddress,
        mintTx: nftResult.signature,
        registerTx,
      };
      setResult(res);
      return res;
    } catch (err: any) {
      const error = err.message || 'Failed to mint license';
      setResult({ error });
      return null;
    } finally {
      setLoading(false);
    }
  }, [program, wallet]);

  return { mint, loading, result };
}

/**
 * Hook to update PTAS state
 */
export function useUpdatePtasState() {
  const program = useSolanaProgram();
  const [loading, setLoading] = useState(false);

  const updateState = useCallback(async (
    agentId: string,
    newState: PtasState
  ): Promise<TxResult> => {
    if (!program) return { signature: '', success: false, error: 'Wallet not connected' };

    setLoading(true);
    try {
      const stateEnum = PtasStateEnum[newState];
      const signature = await ix.updatePtasState(program, agentId, stateEnum);
      return { signature, success: true };
    } catch (err: any) {
      return { signature: '', success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [program]);

  return { updateState, loading };
}

/**
 * Hook to revoke a license
 */
export function useRevokeLicense() {
  const program = useSolanaProgram();
  const [loading, setLoading] = useState(false);

  const revoke = useCallback(async (agentId: string): Promise<TxResult> => {
    if (!program) return { signature: '', success: false, error: 'Wallet not connected' };

    setLoading(true);
    try {
      const signature = await ix.revokeLicense(program, agentId);
      return { signature, success: true };
    } catch (err: any) {
      return { signature: '', success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [program]);

  return { revoke, loading };
}

/**
 * Hook to log an action on-chain
 */
export function useLogAction() {
  const program = useSolanaProgram();
  const [loading, setLoading] = useState(false);

  const log = useCallback(async (
    agentId: string,
    action: string,
    details: string
  ): Promise<TxResult> => {
    if (!program) return { signature: '', success: false, error: 'Wallet not connected' };

    setLoading(true);
    try {
      const signature = await ix.logAction(program, agentId, action, details);
      return { signature, success: true };
    } catch (err: any) {
      return { signature: '', success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [program]);

  return { log, loading };
}

/**
 * Hook to fetch license data from chain
 */
export function useLicenseAccount(agentId: string | null) {
  const program = useSolanaProgram();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    if (!program || !agentId) return;
    setLoading(true);
    try {
      const account = await ix.fetchLicense(program, agentId);
      setData(account);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [program, agentId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, refetch };
}

/**
 * Hook to fetch audit trail entries
 */
export function useAuditEntries(agentId: string | null) {
  const program = useSolanaProgram();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    if (!program || !agentId) return;
    setLoading(true);
    try {
      const result = await ix.fetchAuditEntries(program, agentId);
      setEntries(result);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [program, agentId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { entries, loading, refetch };
}
