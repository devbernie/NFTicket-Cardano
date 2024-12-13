import axios from 'axios';

// Function to check if the ticket is valid
export const isTicketValid = async (ticketId) => {
    try {
        const response = await axios.get(`https://your-api-endpoint.com/tickets/${ticketId}`);
        return response.data.valid; // true if valid, false otherwise
    } catch (error) {
        console.error('Error checking ticket validity:', error);
        return false; // Return false if there's an error
    }
};
