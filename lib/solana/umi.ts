// AIoOS Solana UMI Instance + NFT Minting
// AI-Generated for Colosseum Agent Hackathon 2026
// Uses Metaplex Umi SDK for NFT license minting

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createNft,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  generateSigner,
  percentAmount,
  publicKey as umiPublicKey,
} from '@metaplex-foundation/umi';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { DEVNET_RPC } from './constants';
import type { WalletContextState } from '@solana/wallet-adapter-react';

/**
 * Create a Umi instance connected to Devnet with wallet adapter
 */
export function createUmiInstance(wallet: WalletContextState) {
  const umi = createUmi(DEVNET_RPC)
    .use(mplTokenMetadata())
    .use(walletAdapterIdentity(wallet));

  return umi;
}

/**
 * Mint an AIoOS Agent License NFT via Metaplex
 * Returns the mint address and transaction signature
 */
export async function mintLicenseNft(
  wallet: WalletContextState,
  metadata: {
    agentName: string;
    licenseType: string;
    permissionLevel: string;
    jurisdiction: string;
    agentId: string;
  }
) {
  const umi = createUmiInstance(wallet);
  const mint = generateSigner(umi);

  // NFT metadata following Metaplex standard
  const nftName = `AIoOS License: ${metadata.agentName}`;
  const nftSymbol = 'AIOOS';

  // Create the NFT with on-chain metadata
  const tx = await createNft(umi, {
    mint,
    name: nftName.slice(0, 32), // Metaplex name limit
    symbol: nftSymbol,
    // Using a JSON URI for off-chain metadata
    // In production, this would be uploaded to Arweave/IPFS
    uri: `https://aioos-demo-976315563949.us-central1.run.app/api/nft-metadata/${metadata.agentId}`,
    sellerFeeBasisPoints: percentAmount(0),
    creators: [
      {
        address: umi.identity.publicKey,
        verified: true,
        share: 100,
      },
    ],
  }).sendAndConfirm(umi);

  return {
    mintAddress: mint.publicKey.toString(),
    signature: Buffer.from(tx.signature).toString('base64'),
  };
}
