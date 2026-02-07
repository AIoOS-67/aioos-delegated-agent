// AIoOS Transaction Link Component
// AI-Generated for Colosseum Agent Hackathon 2026
// Renders a clickable Solana Explorer link for a Devnet transaction

'use client';

import { getExplorerTxUrl, getExplorerAddressUrl } from '@/lib/solana/constants';

interface TxLinkProps {
  signature: string;
  label?: string;
  className?: string;
}

export function TxLink({ signature, label, className }: TxLinkProps) {
  const shortSig = `${signature.slice(0, 8)}...${signature.slice(-8)}`;
  const url = getExplorerTxUrl(signature);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-[#14F195] hover:text-[#9945FF] transition-colors font-mono text-sm ${className || ''}`}
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      {label || shortSig}
    </a>
  );
}

interface AddressLinkProps {
  address: string;
  label?: string;
  className?: string;
}

export function AddressLink({ address, label, className }: AddressLinkProps) {
  const shortAddr = `${address.slice(0, 4)}...${address.slice(-4)}`;
  const url = getExplorerAddressUrl(address);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-[#9945FF] hover:text-[#14F195] transition-colors font-mono text-sm ${className || ''}`}
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      {label || shortAddr}
    </a>
  );
}
