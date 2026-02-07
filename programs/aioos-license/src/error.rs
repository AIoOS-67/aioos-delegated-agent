// AIoOS License Program - Custom Error Codes
// AI-Generated for Colosseum Agent Hackathon 2026

use anchor_lang::prelude::*;

#[error_code]
pub enum AioosError {
    #[msg("Invalid PTAS state transition")]
    InvalidStateTransition,

    #[msg("License has been revoked and cannot be modified")]
    LicenseRevoked,

    #[msg("Unauthorized: only the license owner or program authority can perform this action")]
    Unauthorized,

    #[msg("Agent ID exceeds maximum length of 64 characters")]
    AgentIdTooLong,

    #[msg("License type exceeds maximum length of 64 characters")]
    LicenseTypeTooLong,

    #[msg("Permission level exceeds maximum length of 32 characters")]
    PermissionLevelTooLong,

    #[msg("Jurisdiction exceeds maximum length of 64 characters")]
    JurisdictionTooLong,

    #[msg("Action string exceeds maximum length of 64 characters")]
    ActionTooLong,

    #[msg("Details string exceeds maximum length of 256 characters")]
    DetailsTooLong,
}
