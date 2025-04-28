use anchor_lang::prelude::*;

declare_id!("Fp7kSeYMVBU9ZdQ4Xy8KLFt6GrLXB9BahKX9qSYufLuQ");

#[program]
pub mod solcache {
    use super::*;

    
    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        msg!("Hello from Solcache");
        
        Ok(())
    }
    
    pub fn register_website(ctx: Context<RegisterDapp>, dapp_id: [u8; 16]) -> Result<()> {
        ctx.accounts.website_account.website_id = dapp_id;
        ctx.accounts.website_account.assets_registered = 0;
        Ok(())
    }

    pub fn add_asset(ctx: Context<AddAsset>, _asset_id: [u8; 16], _dapp_id: [u8; 16], file_hash: [u8; 32]) -> Result<()> {
        ctx.accounts.dapp_account.assets_registered += 1;
        ctx.accounts.asset_account.file_hash = file_hash;
        Ok(())
    }

 }

#[derive(Accounts)]
pub struct Initialize {}


#[derive(Accounts)]
#[instruction(dapp_id: [u8;16])]
pub struct RegisterDapp<'info> {
    
    #[account(mut)]
    pub signer: Signer<'info>,


    #[account(
        init_if_needed,
        payer = signer,
        space = 8 + DappAccount::INIT_SPACE,
        seeds = [b"Dapp".as_ref(), &dapp_id],
        bump
    )]
    pub website_account: Account<'info, DappAccount>,

    pub system_program: Program<'info, System>
}


#[derive(Accounts)]
#[instruction(asset_id: [u8; 16], dapp_id: [u8; 16])]
pub struct AddAsset<'info> {
    
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init_if_needed,
        payer = signer,
        space = 8 + AssetAccount::INIT_SPACE,
        seeds = [b"Asset".as_ref(), &asset_id],
        bump
    )]
    pub asset_account: Account<'info, AssetAccount>,

    
    #[account(
        mut,
        seeds = [b"Dapp".as_ref(), &dapp_id],
        bump
    )]
    pub dapp_account: Account<'info, DappAccount>,

    pub system_program: Program<'info, System>
}


#[account]
#[derive(InitSpace)]
pub struct DappAccount {
    pub website_id: [u8; 16],
    pub assets_registered: u32,
}

#[account]
#[derive(InitSpace)]
pub struct AssetAccount {
    pub file_hash: [u8; 32]
}