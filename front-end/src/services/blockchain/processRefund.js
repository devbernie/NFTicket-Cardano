import { Lucid } from 'lucid-cardano';
import axios from 'axios';

// Function to check if the ticket is valid
const isTicketValid = async (ticketId) => {
    try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/tickets/${ticketId}`);
        return response.data.valid; // true if valid, false otherwise
    } catch (error) {
        console.error('Error checking ticket validity:', error);
        return false; // Return false if there's an error
    }
};

// Refund processing function
export const processRefund = async (ticketId, walletAddress) => {
    // Check if the ticket is valid
    const isValid = await isTicketValid(ticketId);
    if (!isValid) {
        throw new Error('Invalid ticket');
    }

    // Initialize Lucid
    const lucid = await Lucid.new();

    // Create a transaction builder
    const tx = lucid.newTx();

    // Handle refund in tADA
    tx.payToAddress(walletAddress, { lovelace: BigInt(1000000) }); // Example amount

    // Complete the transaction
    const completedTx = await tx.complete();

    // Sign the transaction
    const signedTx = await completedTx.sign().complete();

    // Submit the transaction
    const txHash = await signedTx.submit();

    console.log('Refund successful:', txHash);
    return txHash;
};
