import { Lucid } from 'lucid-cardano';
import fs from 'fs';
import path from 'path';

const lucid = await Lucid.new(); // Initialize Lucid for Cardano Testnet

// Function to mint NFT using Aiken
export const mintNFT = async (metadata) => {
  try {
    const mintPolicyPath = path.resolve(__dirname, '../../contracts/validators/mint_policy.ak');
    const mintPolicy = fs.readFileSync(mintPolicyPath, 'utf8');

    const tx = await lucid.newTx()
      .mintAssets({ [mintPolicy]: BigInt(1) })
      .attachMetadata(721, metadata) // Attach metadata to the NFT
      .complete();

    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();

    return txHash; // Return transaction hash
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
};

// Function to validate ticket using Aiken
export const validateTicket = async (ticketId) => {
  try {
    const validatePolicyPath = path.resolve(__dirname, '../../contracts/validators/validate_policy.ak');
    const validatePolicy = fs.readFileSync(validatePolicyPath, 'utf8');

    const tx = await lucid.newTx()
      .callContract(validatePolicy, { ticketId }) // Call validate policy with ticketId
      .complete();

    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();

    return txHash; // Return transaction hash
  } catch (error) {
    console.error('Error validating ticket:', error);
    throw error;
  }
};

// Function to refund ticket using Aiken
export const refundTicket = async (ticketId) => {
  try {
    const refundPolicyPath = path.resolve(__dirname, '../../contracts/validators/refund_policy.ak');
    const refundPolicy = fs.readFileSync(refundPolicyPath, 'utf8');

    const tx = await lucid.newTx()
      .burnAssets({ [refundPolicy]: BigInt(1) }) // Burn the NFT for refund
      .complete();

    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();

    return txHash; // Return transaction hash
  } catch (error) {
    console.error('Error refunding ticket:', error);
    throw error;
  }
};