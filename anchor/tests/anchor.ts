import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Solcache } from "../target/types/solcache";
import { assert, expect } from "chai";
import fs from "fs";
import crypto from "crypto";
import path from "path";
import { parse } from "uuid";


describe("anchor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Solcache as Program<Solcache>;

  it("Is initialized!", async () => {
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });

  it("Register Website", async () => {
    const dappUUID = "123e4567-e89b-12d3-a456-426614174000";
    const dappId = parse(dappUUID);

    const websiteAccount = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("Dapp"), dappId],
      program.programId
    );

    const tx = await program.methods
      .registerWebsite([...dappId])
      .accounts({
        signer: anchor.getProvider().wallet.publicKey,
        websiteAccount: websiteAccount,
        systemProgram: anchor.web3.SystemProgram.programId  
      })
      .rpc();

    console.log("Your transaction signature", tx);  
    const data = await program.account.dappAccount.fetch(websiteAccount[0]);
    expect(data.websiteId).to.deep.equal([...dappId]);
    assert.equal(data.assetsRegistered, 0);
  
  });



  it("Add Asset", async () => {
    const assetUUID = "1ce31670-e40e-42e3-abbf-75b5ebcb6352";
    const assetId = parse(assetUUID);
    const dappUUID = "123e4567-e89b-12d3-a456-426614174000";
    const dappId = parse(dappUUID);

    let hash;
    try {
      const filePath = path.join(__dirname, 'a.js');
      const fileBuffer = fs.readFileSync(filePath);
      hash = crypto.createHash("sha256").update(fileBuffer).digest();
      console.log(hash);

      const [assetAccount, _] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("Asset"), assetId],
        program.programId
      );

      const [dappAccount, __] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("Dapp"), dappId],
        program.programId
      );

      console.log(hash);

      const tx = await program.methods
        .addAsset([...assetId], [...dappId], [...hash])
        .accounts({
          signer: anchor.getProvider().wallet.publicKey,
          assetAccount: assetAccount,
          dappAccount: dappAccount,
          systemProgram: anchor.web3.SystemProgram.programId
        })
        .rpc();

      console.log("passed tx");
      console.log("Your transaction signature", tx);

      const assetData = await program.account.assetAccount.fetch(assetAccount);
      const dappData = await program.account.dappAccount.fetch(dappAccount);
      expect(assetData.fileHash).to.deep.equal([...hash]);
      assert.equal(dappData.assetsRegistered, 1);
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }   
    
  });
});