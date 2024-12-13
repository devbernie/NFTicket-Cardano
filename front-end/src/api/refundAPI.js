import express from 'express';
import { processRefund } from '../services/blockchain/refundService.js';

const router = express.Router();

// Refund API endpoint
router.post('/refund', async (req, res) => {
    const { ticketId, walletAddress } = req.body;

    if (!ticketId || !walletAddress) {
        return res.status(400).json({ error: 'ticketId and walletAddress are required.' });
    }

    try {
        const refundInfo = { ticketId, walletAddress, currency: 'tADA' }; // Assuming tADA is the currency used
        const txHash = await processRefund(refundInfo);
        return res.status(200).json({ transactionHash: txHash });
    } catch (error) {
        console.error('Refund processing error:', error);
        return res.status(500).json({ error: error.message });
    }
});

export default router;
