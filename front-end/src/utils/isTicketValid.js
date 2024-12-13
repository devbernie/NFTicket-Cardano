import axios from 'axios';

// Function to check if the ticket is valid
export const isTicketValid = async (ticketId) => {
    try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/tickets/${ticketId}`);
        return response.data.valid; // true if valid, false otherwise
    } catch (error) {
        console.error('Error checking ticket validity:', error);
        return false; // Return false if there's an error
    }
};
