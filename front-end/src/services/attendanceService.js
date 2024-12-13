import axios from 'axios';

// Define the attendance interface
// In JavaScript, we don't explicitly define types

export const checkIn = async (qrCodeData) => {
  try {
    const attendanceInfo = JSON.parse(qrCodeData);
    attendanceInfo.checkInTime = new Date().toISOString();

    // Send check-in data to the API
    await axios.post(`${process.env.VUE_APP_API_BASE_URL}/checkin`, attendanceInfo);
    console.log('Check-in successful:', attendanceInfo);
  } catch (error) {
    console.error('Error during check-in:', error);
    throw error;
  }
};

export const checkOut = async (qrCodeData) => {
  try {
    const attendanceInfo = JSON.parse(qrCodeData);
    attendanceInfo.checkOutTime = new Date().toISOString();

    // Send check-out data to the API
    await axios.post(`${process.env.VUE_APP_API_BASE_URL}/checkout`, attendanceInfo);
    console.log('Check-out successful:', attendanceInfo);
  } catch (error) {
    console.error('Error during check-out:', error);
    throw error;
  }
};
