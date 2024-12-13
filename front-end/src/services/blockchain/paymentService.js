import { Lucid } from 'lucid-cardano';

// Payment interface
// In JavaScript, we don't explicitly define types

export const processPayment = async (paymentInfo) => {
  try {
    // Initialize Lucid
    const lucid = await Lucid.new();

    // Create a transaction builder
    const tx = lucid.newTx();

    // Handle tADA payments (assuming you have the policy ID and asset name)
    const policyId = '8d18d786e92776c824607fd8e193ec535c79dc61ea2405ddf3b09fe3';
    const assetName = '';
    tx.payToAddress(
      paymentInfo.walletAddress,
      {
        lovelace: BigInt(0), // No ADA required
        [policyId + assetName]: BigInt(paymentInfo.amount)
      }
    );

    // Complete the transaction
    const completedTx = await tx.complete();

    // Sign the transaction
    const signedTx = await completedTx.sign().complete();

    // Submit the transaction
    const txHash = await signedTx.submit();

    console.log('Transaction successful:', txHash);
    return txHash;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};
