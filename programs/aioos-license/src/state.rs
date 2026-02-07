// AIoOS License Program - Account State Definitions
// AI-Generated for Colosseum Agent Hackathon 2026
// Implements Patent 2 (Delegated Authority Framework) on-chain state

use anchor_lang::prelude::*;

/// PTAS (Part-Time Agent System) lifecycle states
/// Patent 3: 5-state lifecycle with terminal Revoked state
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Debug)]
pub enum PtasState {
    Dormant,      // Low-power idle state
    Activating,   // Transitioning to active
    Active,       // Ready to execute tasks
    Executing,    // Currently processing a task
    Hibernating,  // Extended low-power state
    Revoked,      // Terminal state - license invalidated (ECVP)
}

impl PtasState {
    /// Validate state transition according to PTAS lifecycle rules
    /// Returns true if transition from self -> new_state is valid
    pub fn can_transition_to(&self, new_state: &PtasState) -> bool {
        matches!(
            (self, new_state),
            (PtasState::Dormant, PtasState::Activating)
                | (PtasState::Activating, PtasState::Active)
                | (PtasState::Active, PtasState::Executing)
                | (PtasState::Active, PtasState::Hibernating)
                | (PtasState::Executing, PtasState::Active)
                | (PtasState::Hibernating, PtasState::Activating)
        )
    }
}

/// Global program configuration - single PDA per deployment
#[account]
pub struct ProgramConfig {
    /// Program authority (deployer) - can revoke any license
    pub authority: Pubkey,
    /// Total licenses minted (counter)
    pub total_licenses: u64,
    /// PDA bump seed
    pub bump: u8,
}

impl ProgramConfig {
    pub const SIZE: usize = 8  // discriminator
        + 32  // authority
        + 8   // total_licenses
        + 1;  // bump
}

/// Agent License Account - one PDA per agent_id
/// Links an NFT mint to the AIoOS license system with PTAS state
#[account]
pub struct LicenseAccount {
    /// Unique agent identifier (matches frontend agent UUID)
    pub agent_id: String,         // max 64 chars
    /// License owner wallet pubkey
    pub owner: Pubkey,
    /// Metaplex NFT mint address for this license
    pub nft_mint: Pubkey,
    /// Current PTAS lifecycle state
    pub ptas_state: PtasState,
    /// License classification (e.g., "financial_advisor", "legal_agent")
    pub license_type: String,     // max 64 chars
    /// Permission level: advisory_only, execute_with_human, autonomous
    pub permission_level: String, // max 32 chars
    /// Jurisdiction (comma-separated, e.g., "US,EU")
    pub jurisdiction: String,     // max 64 chars
    /// Unix timestamp of license creation
    pub created_at: i64,
    /// Whether license has been revoked (terminal)
    pub revoked: bool,
    /// Counter for audit entries (used in AuditEntry PDA seeds)
    pub audit_count: u64,
    /// PDA bump seed
    pub bump: u8,
}

impl LicenseAccount {
    pub const MAX_AGENT_ID_LEN: usize = 64;
    pub const MAX_LICENSE_TYPE_LEN: usize = 64;
    pub const MAX_PERMISSION_LEVEL_LEN: usize = 32;
    pub const MAX_JURISDICTION_LEN: usize = 64;

    pub const SIZE: usize = 8  // discriminator
        + 4 + Self::MAX_AGENT_ID_LEN         // agent_id (String = 4 bytes len + data)
        + 32  // owner
        + 32  // nft_mint
        + 1   // ptas_state (enum variant)
        + 4 + Self::MAX_LICENSE_TYPE_LEN      // license_type
        + 4 + Self::MAX_PERMISSION_LEVEL_LEN  // permission_level
        + 4 + Self::MAX_JURISDICTION_LEN      // jurisdiction
        + 8   // created_at
        + 1   // revoked
        + 8   // audit_count
        + 1;  // bump
}

/// Audit trail entry - one PDA per action logged against a license
/// Implements on-chain audit logging for ECVP compliance
#[account]
pub struct AuditEntry {
    /// Reference to the parent LicenseAccount PDA
    pub license: Pubkey,
    /// Action type (e.g., "task_executed", "state_changed", "risk_assessed")
    pub action: String,           // max 64 chars
    /// Action details / description
    pub details: String,          // max 256 chars
    /// Unix timestamp of the action
    pub timestamp: i64,
    /// Wallet that performed the action
    pub actor: Pubkey,
    /// PDA bump seed
    pub bump: u8,
}

impl AuditEntry {
    pub const MAX_ACTION_LEN: usize = 64;
    pub const MAX_DETAILS_LEN: usize = 256;

    pub const SIZE: usize = 8  // discriminator
        + 32  // license
        + 4 + Self::MAX_ACTION_LEN    // action
        + 4 + Self::MAX_DETAILS_LEN   // details
        + 8   // timestamp
        + 32  // actor
        + 1;  // bump
}
