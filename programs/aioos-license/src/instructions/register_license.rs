// AIoOS License Program - Register License Instruction
// AI-Generated for Colosseum Agent Hackathon 2026
// Creates a LicenseAccount PDA linking an NFT mint to the AIoOS license system

use anchor_lang::prelude::*;
use crate::state::{LicenseAccount, ProgramConfig, PtasState};
use crate::error::AioosError;

#[derive(Accounts)]
#[instruction(agent_id: String)]
pub struct RegisterLicense<'info> {
    #[account(
        init,
        payer = owner,
        space = LicenseAccount::SIZE,
        seeds = [b"license", agent_id.as_bytes()],
        bump
    )]
    pub license: Account<'info, LicenseAccount>,

    #[account(
        mut,
        seeds = [b"config"],
        bump = config.bump
    )]
    pub config: Account<'info, ProgramConfig>,

    /// The NFT mint address (already minted via Metaplex on the frontend)
    /// CHECK: We only store this pubkey as a reference, no CPI needed
    pub nft_mint: UncheckedAccount<'info>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// Register an existing NFT mint as an AIoOS Agent License
/// The NFT should already be minted via Metaplex Umi on the frontend
pub fn handler(
    ctx: Context<RegisterLicense>,
    agent_id: String,
    license_type: String,
    permission_level: String,
    jurisdiction: String,
) -> Result<()> {
    // Validate string lengths
    require!(agent_id.len() <= LicenseAccount::MAX_AGENT_ID_LEN, AioosError::AgentIdTooLong);
    require!(license_type.len() <= LicenseAccount::MAX_LICENSE_TYPE_LEN, AioosError::LicenseTypeTooLong);
    require!(permission_level.len() <= LicenseAccount::MAX_PERMISSION_LEVEL_LEN, AioosError::PermissionLevelTooLong);
    require!(jurisdiction.len() <= LicenseAccount::MAX_JURISDICTION_LEN, AioosError::JurisdictionTooLong);

    let license = &mut ctx.accounts.license;
    license.agent_id = agent_id;
    license.owner = ctx.accounts.owner.key();
    license.nft_mint = ctx.accounts.nft_mint.key();
    license.ptas_state = PtasState::Dormant;
    license.license_type = license_type;
    license.permission_level = permission_level;
    license.jurisdiction = jurisdiction;
    license.created_at = Clock::get()?.unix_timestamp;
    license.revoked = false;
    license.audit_count = 0;
    license.bump = ctx.bumps.license;

    // Increment global license counter
    let config = &mut ctx.accounts.config;
    config.total_licenses = config.total_licenses.checked_add(1).unwrap();

    msg!(
        "AIoOS License registered: agent={}, mint={}, type={}, state=Dormant",
        license.agent_id,
        license.nft_mint,
        license.license_type
    );

    // Emit event for indexers
    emit!(LicenseRegistered {
        agent_id: license.agent_id.clone(),
        owner: license.owner,
        nft_mint: license.nft_mint,
        license_type: license.license_type.clone(),
        permission_level: license.permission_level.clone(),
    });

    Ok(())
}

#[event]
pub struct LicenseRegistered {
    pub agent_id: String,
    pub owner: Pubkey,
    pub nft_mint: Pubkey,
    pub license_type: String,
    pub permission_level: String,
}
