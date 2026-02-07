// AIoOS License Program - Main Entry Point
// AI-Generated for Colosseum Agent Hackathon 2026
//
// Solana program for the AI Onchain Operating System (AIoOS)
// Implements on-chain agent licensing with:
//   - Metaplex NFT-backed licenses (Patent 2: Delegated Authority)
//   - PTAS 5-state lifecycle management (Patent 3: Part-Time Agent System)
//   - On-chain audit trail (ECVP compliance)
//   - Emergency license revocation
//
// Autonomous ≠ Unconstrained — AIoOS License System

use anchor_lang::prelude::*;

pub mod state;
pub mod error;
pub mod instructions;

use instructions::*;

// Program ID - updated after deployment to Devnet
declare_id!("AXUBfrQmmkNSHm1A32QbCzwtuWg9L8SqQ8rZwbNNnXHg");

#[program]
pub mod aioos_license {
    use super::*;

    /// Initialize the program configuration (one-time setup)
    /// Sets the deployer as the program authority
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize::handler(ctx)
    }

    /// Register an NFT mint as an AIoOS Agent License
    /// The NFT must already be minted via Metaplex
    /// Creates a LicenseAccount PDA with initial state = Dormant
    pub fn register_license(
        ctx: Context<RegisterLicense>,
        agent_id: String,
        license_type: String,
        permission_level: String,
        jurisdiction: String,
    ) -> Result<()> {
        instructions::register_license::handler(ctx, agent_id, license_type, permission_level, jurisdiction)
    }

    /// Transition the PTAS state machine
    /// Valid transitions: Dormant->Activating->Active->Executing->Active
    ///                    Active->Hibernating->Activating
    pub fn update_ptas_state(ctx: Context<UpdatePtasState>, new_state: state::PtasState) -> Result<()> {
        instructions::update_ptas_state::handler(ctx, new_state)
    }

    /// Revoke an agent license (terminal state - irreversible)
    /// Can be called by license owner or program authority (ECVP kill switch)
    pub fn revoke_license(ctx: Context<RevokeLicense>) -> Result<()> {
        instructions::revoke_license::handler(ctx)
    }

    /// Log an agent action to the on-chain audit trail
    /// Creates an AuditEntry PDA for compliance tracking
    pub fn log_action(ctx: Context<LogAction>, action: String, details: String) -> Result<()> {
        instructions::log_action::handler(ctx, action, details)
    }
}
