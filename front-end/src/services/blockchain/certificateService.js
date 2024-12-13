import { Lucid } from 'lucid-cardano';
import fs from 'fs';
import pdfParse from 'pdf-parse';

// Function to mint NFT certificate
export const mintCertificate = async (pdfFilePath) => {
    try {
        // Read and parse the PDF file
        const pdfData = await fs.promises.readFile(pdfFilePath);
        const parsedData = await pdfParse(pdfData);
        const students = parsedData.text.split('\n'); // Assuming each student is on a new line

        // Initialize Lucid
        const lucid = await Lucid.new();

        // Define policy ID and asset name
        const policyId = '8d18d786e92776c824607fd8e193ec535c79dc61ea2405ddf3b09fe3';
        const assetName = 'Certificate';

        for (const student of students) {
            const [studentId, className] = student.split(','); // Assuming format: studentId,className

            // Create metadata for the NFT
            const metadata = {
                [policyId + assetName]: {
                    name: `Certificate for ${studentId}`,
                    description: `This certifies that ${studentId} has completed the course in ${className}.`,
                    attributes: [{ trait_type: 'Class', value: className }],
                }
            };

            // Mint the NFT with metadata
            const tx = await lucid
                .newTx()
                .mintAssets({ [policyId + assetName]: BigInt(1) })
                .attachMetadata(721, metadata)  // 721 is the metadata label for NFTs
                .payToAddress('recipient_address', { lovelace: BigInt(2000000) }) // Replace with actual recipient address
                .complete();

            // Sign and submit the transaction
            const signedTx = await tx.sign().complete();
            const txHash = await signedTx.submit();

            console.log(`Certificate minted for ${studentId}: ${txHash}`);
        }
    } catch (error) {
        console.error('Error minting certificate:', error);
        throw error;
    }
};
