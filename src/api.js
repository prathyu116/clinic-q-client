import axios from 'axios';

// Use relative path due to Vite proxy '/api'
const API_URL = 'http://localhost:5000/api'; // Proxied to http://localhost:5000/api

export const bookSlot = async (patientName) => {
    try {
        const response = await axios.post(`${API_URL}/bookings`, { patientName });
        return response.data; // { message, bookingId, patientName }
    } catch (error) {
        console.error("API Error (bookSlot):", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to book slot.');
    }
};

export const getQueueStatus = async () => {
    try {
        const response = await axios.get(`${API_URL}/queue`);
        return response.data; // { queue: [{ position }], currentPatient, nextPatient, totalWaiting }
    } catch (error) {
        console.error("API Error (getQueueStatus):", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch queue status.');
    }
};

export const getBookingDetails = async (bookingId) => {
    if (!bookingId) throw new Error("Booking ID is required.");
    try {
        const response = await axios.get(`${API_URL}/bookings/${bookingId}`);
        return response.data; // { patientName, status, position, bookingTime }
    } catch (error) {
        console.error("API Error (getBookingDetails):", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch booking details.');
    }
};

export const cancelBooking = async (bookingId) => {
    if (!bookingId) throw new Error("Booking ID is required.");
    try {
        const response = await axios.delete(`${API_URL}/bookings/${bookingId}`);
        return response.data; // { message }
    } catch (error) {
        console.error("API Error (cancelBooking):", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to cancel booking.');
    }
};

// --- Admin API Calls ---

export const getAdminQueue = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/queue`);
        return response.data; // Array of { _id, patientName, bookingTime, bookingId }
    } catch (error) {
        console.error("API Error (getAdminQueue):", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch admin queue.');
    }
};

export const markPatientDone = async (mongoId) => {
    if (!mongoId) throw new Error("Internal Booking ID is required.");
    try {
        // Note: uses the MongoDB _id, not the patient-facing bookingId
        const response = await axios.patch(`${API_URL}/admin/bookings/${mongoId}/done`);
        return response.data; // { message }
    } catch (error) {
        console.error("API Error (markPatientDone):", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to mark patient as done.');
    }
};