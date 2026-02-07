// AIoOS License Program - Revoke License Instruction
// AI-Generated for Colosseum Agent Hackathon 2026
// Implements ECVP (Emergency Capability Verification Protocol)
// Sets license to terminal Revoked state - irreversible

use anchor_lang::prelude::*;
use crate::state::{LicenseAccount, ProgramConfig, PtasState};
use crate::error::AioosError;

#[derive(Accounts)]
pub struct RevokeLicense<'info> {
    #[account(
        mut,
        seeds = [b"license", license.agent_id.as_bytes()],
        bump = license.bump
    )]
    pub license: Account<'info, LicenseAccount>,

    #[account(
        seeds = [b"config"],
        bump = config.bump
    )]
    pub config: Account<'info, ProgramConfig>,

    /// Either the license owner or the program authority can revoke
    pub authority: Signer<'info>,
}

/// Revoke an agent license - terminal state, irreversible
/// Can be called by the license owner OR the program authority (ECVP)
/// This is the "kill switch" for autonomous agents
pub fn handler(ctx: Context<RevokeLicense>) -> Result<()> {
    let license = &mut ctx.accounts.license;
    let config = &ctx.accounts.config;
    let authority = &ctx.accounts.authority;

    // Already revoked - no-op but not an error
    if license.revoked {
        return Ok(());
    }

    // Authorization: owner OR program authority
    require!(
        authority.key() == license.owner || authority.key() == config.authority,
        AioosError::Unauthorized
    );

    let old_state = license.ptas_state;
    license.ptas_state = PtasState::Revoked;
    license.revoked = true;

    msg!(
        "LICENSE REVOKED: agent={}, previous_state={:?}, revoked_by={}",
        license.agent_id,
        old_state,
        authority.key()
    );

    // Emit revocation event - critical for monitoring
    emit!(LicenseRevoked {
        agent_id: license.agent_id.clone(),
        revoked_by: authority.key(),
        previous_state: old_state,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}

#[event]
pub struct LicenseRevoked {
    pub agent_id: String,
    pub revoked_by: Pubkey,
    pub previous_state: PtasState,
    pub timestamp: i64,
}
