// AIoOS Solana Page Layout - Wraps with wallet providers
// AI-Generated for Colosseum Agent Hackathon 2026

import SolanaProvider from '@/components/solana/SolanaProvider';

export default function SolanaLayout({ children }: { children: React.ReactNode }) {
  return <SolanaProvider>{children}</SolanaProvider>;
}
