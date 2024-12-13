import { Lucid } from 'lucid-cardano';

// Define the metadata interface
// In JavaScript, we don't explicitly define types

export const mintNFT = async (userAddress, metadata) => {
  // Initialize Lucid
  const lucid = await Lucid.new();

  // Define policy ID and asset name
  const policyId = '8d18d786e92776c824607fd8e193ec535c79dc61ea2405ddf3b09fe3';
  const assetName = '';

  // Create the transaction
  const tx = await lucid
    .newTx()
    .mintAssets({
      [policyId + assetName]: BigInt(1)
    })
    .payToAddress(userAddress, {
      lovelace: BigInt(2000000), // Min ADA requirement
      [policyId + assetName]: BigInt(1)
    })
    .complete();

  // Sign and submit the transaction
  const signedTx = await tx.sign().complete();
  const txHash = await signedTx.submit();

  return txHash;
};