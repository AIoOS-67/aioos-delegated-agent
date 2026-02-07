#!/bin/bash
# AIoOS License Program - Devnet Deployment Script
# Run from WSL2: bash /mnt/c/Users/Administrator/aloos-hackathon/scripts/deploy-devnet.sh
#
# Prerequisites:
#   1. Get devnet SOL first (need ~3 SOL for program deployment):
#      - Visit https://faucet.solana.com and sign in with GitHub for higher limits
#      - Or: solana airdrop 2 (when rate limit resets)
#   2. Anchor build must have completed (target/deploy/aioos_license.so exists)

set -e

export PATH=/root/.local/share/solana/install/active_release/bin:/root/.cargo/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

cd /mnt/c/Users/Administrator/aloos-hackathon

echo "=== AIoOS License Program - Devnet Deployment ==="
echo ""

# Verify config
solana config set --url devnet
echo ""

# Check balance
BALANCE=$(solana balance | awk '{print $1}')
echo "Current balance: $BALANCE SOL"

if (( $(echo "$BALANCE < 2" | bc -l) )); then
  echo "ERROR: Insufficient balance. Need at least 2 SOL for deployment."
  echo "Get SOL from: https://faucet.solana.com (sign in with GitHub)"
  echo "Or try: solana airdrop 2"
  exit 1
fi

# Verify build artifacts
if [ ! -f target/deploy/aioos_license.so ]; then
  echo "ERROR: Program not built. Run 'anchor build' first."
  exit 1
fi

echo ""
echo "Program ID: $(solana address -k target/deploy/aioos_license-keypair.json)"
echo "Program size: $(du -h target/deploy/aioos_license.so | awk '{print $1}')"
echo ""

# Deploy
echo "Deploying to Devnet..."
solana program deploy target/deploy/aioos_license.so

echo ""
echo "=== Deployment successful! ==="
echo "Program ID: $(solana address -k target/deploy/aioos_license-keypair.json)"
echo ""
echo "Next steps:"
echo "  1. Initialize the program: call 'initialize' instruction"
echo "  2. Verify on Solana Explorer: https://explorer.solana.com/address/$(solana address -k target/deploy/aioos_license-keypair.json)?cluster=devnet"
