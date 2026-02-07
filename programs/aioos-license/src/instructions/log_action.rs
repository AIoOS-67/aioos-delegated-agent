// AIoOS License Program - Log Action Instruction
// AI-Generated for Colosseum Agent Hackathon 2026
// Records agent execution audit trail on-chain for compliance

use anchor_lang::prelude::*;
use crate::state::{AuditEntry, LicenseAccount};
use crate::error::AioosError;

#[derive(Accounts)]
#[instruction(action: String, details: String)]
pub struct LogAction<'info> {
    #[account(
        init,
        payer = actor,
        space = AuditEntry::SIZE,
        seeds = [
            b"audit",
            license.key().as_ref(),
            &license.audit_count.to_le_bytes()
        ],
        bump
    )]
    pub audit_entry: Account<'info, AuditEntry>,

    #[account(
        mut,
        seeds = [b"license", license.agent_id.as_bytes()],
        bump = license.bump,
        has_one = owner @ AioosError::Unauthorized
    )]
    pub license: Account<'info, LicenseAccount>,

    pub owner: Signer<'info>,

    #[account(mut)]
    pub actor: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// Log an agent action to the on-chain audit trail
/// Creates a new AuditEntry PDA indexed by the license's audit_count
pub fn handler(ctx: Context<LogAction>, action: String, details: String) -> Result<()> {
    // Validate string lengths
    require!(action.len() <= AuditEntry::MAX_ACTION_LEN, AioosError::ActionTooLong);
    require!(details.len() <= AuditEntry::MAX_DETAILS_LEN, AioosError::DetailsTooLong);

    // Cannot log actions for revoked licenses
    require!(!ctx.accounts.license.revoked, AioosError::LicenseRevoked);

    let audit_entry = &mut ctx.accounts.audit_entry;
    audit_entry.license = ctx.accounts.license.key();
    audit_entry.action = action;
    audit_entry.details = details;
    audit_entry.timestamp = Clock::get()?.unix_timestamp;
    audit_entry.actor = ctx.accounts.actor.key();
    audit_entry.bump = ctx.bumps.audit_entry;

    // Increment the license audit counter
    let license = &mut ctx.accounts.license;
    license.audit_count = license.audit_count.checked_add(1).unwrap();

    msg!(
        "Audit logged: agent={}, action={}, entry #{}",
        license.agent_id,
        audit_entry.action,
        license.audit_count
    );

    // Emit event
    emit!(ActionLogged {
        agent_id: license.agent_id.clone(),
        action: audit_entry.action.clone(),
        details: audit_entry.details.clone(),
        timestamp: audit_entry.timestamp,
        actor: audit_entry.actor,
        audit_index: license.audit_count - 1,
    });

    Ok(())
}

#[event]
pub struct ActionLogged {
    pub agent_id: String,
    pub action: String,
    pub details: String,
    pub timestamp: i64,
    pub actor: Pubkey,
    pub audit_index: u64,
}
