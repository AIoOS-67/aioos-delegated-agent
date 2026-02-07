// AIoOS Wallet Connect Button - Solana Theme
// AI-Generated for Colosseum Agent Hackathon 2026

'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function WalletButton() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="flex items-center gap-3">
      <WalletMultiButton
        style={{
          background: 'linear-gradient(135deg, #9945FF, #14F195)',
          borderRadius: '12px',
          fontFamily: 'inherit',
          fontSize: '14px',
          height: '48px',
          padding: '0 24px',
        }}
      />
      {connected && publicKey && (
        <span className="text-xs text-gray-400 font-mono">
          {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
        </span>
      )}
    </div>
  );
}
