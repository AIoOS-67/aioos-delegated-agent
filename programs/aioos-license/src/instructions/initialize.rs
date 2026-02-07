// AIoOS License Program - Initialize Instruction
// AI-Generated for Colosseum Agent Hackathon 2026
// One-time setup: creates the ProgramConfig PDA

use anchor_lang::prelude::*;
use crate::state::ProgramConfig;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = ProgramConfig::SIZE,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, ProgramConfig>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// Initialize the program configuration
/// Sets the deployer as the program authority who can revoke any license
pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    let config = &mut ctx.accounts.config;
    config.authority = ctx.accounts.authority.key();
    config.total_licenses = 0;
    config.bump = ctx.bumps.config;

    msg!("AIoOS License Program initialized. Authority: {}", config.authority);
    Ok(())
}
