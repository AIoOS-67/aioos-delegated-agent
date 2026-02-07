// AIoOS License Program - Update PTAS State Instruction
// AI-Generated for Colosseum Agent Hackathon 2026
// Implements Patent 3: 5-state PTAS lifecycle transitions on-chain

use anchor_lang::prelude::*;
use crate::state::{LicenseAccount, PtasState};
use crate::error::AioosError;

#[derive(Accounts)]
pub struct UpdatePtasState<'info> {
    #[account(
        mut,
        seeds = [b"license", license.agent_id.as_bytes()],
        bump = license.bump,
        has_one = owner @ AioosError::Unauthorized
    )]
    pub license: Account<'info, LicenseAccount>,

    pub owner: Signer<'info>,
}

/// Transition the PTAS state machine for an agent license
/// Enforces valid state transitions:
///   Dormant -> Activating -> Active -> Executing -> Active (cycle)
///   Active -> Hibernating -> Activating (hibernate/wake cycle)
///   Revoked is terminal (set only by revoke_license instruction)
pub fn handler(ctx: Context<UpdatePtasState>, new_state: PtasState) -> Result<()> {
    let license = &mut ctx.accounts.license;

    // Cannot modify a revoked license
    require!(!license.revoked, AioosError::LicenseRevoked);

    // Cannot transition TO Revoked via this instruction (use revoke_license)
    require!(new_state != PtasState::Revoked, AioosError::InvalidStateTransition);

    // Validate the state transition
    require!(
        license.ptas_state.can_transition_to(&new_state),
        AioosError::InvalidStateTransition
    );

    let old_state = license.ptas_state;
    license.ptas_state = new_state;

    msg!(
        "PTAS state transition: agent={}, {:?} -> {:?}",
        license.agent_id,
        old_state,
        new_state
    );

    // Emit event for frontend / indexers
    emit!(PtasStateChanged {
        agent_id: license.agent_id.clone(),
        old_state,
        new_state,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}

#[event]
pub struct PtasStateChanged {
    pub agent_id: String,
    pub old_state: PtasState,
    pub new_state: PtasState,
    pub timestamp: i64,
}
