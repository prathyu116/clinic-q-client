import axios from 'axios';

// Use relative path due to Vite proxy '/api'
const API_URL = 'http://localhost:5000/api'; // Proxied to http://localhost:5000/api
axios.defaults.withCredentials = true;

export const bookSlot = async (patientName) => {
    try {
        const response = await axios.post(`${API_URL}/bookings`, { patientName });
        return response.data; // { message, bookingId, patientName }
    } catch (error) {
        console.error("API Error (bookSlot):", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to book slot.');
    }
};

export const getQueueStatus = async () => { try { const response = await axios.get(`${API_URL}/queue`); return response.data; } catch (error) { console.error("API Error (getQueueStatus):", error.response?.data?.message || error.message); throw new Error(error.response?.data?.message || 'Failed to fetch queue status.'); } };
export const getBookingDetails = async (bookingId) => { if (!bookingId) throw new Error("Booking ID is required."); try { const response = await axios.get(`${API_URL}/bookings/${bookingId}`); return response.data; } catch (error) { console.error("API Error (getBookingDetails):", error.response?.data?.message || error.message); throw new Error(error.response?.data?.message || 'Failed to fetch booking details.'); } };
export const cancelBooking = async (bookingId) => { if (!bookingId) throw new Error("Booking ID is required."); try { const response = await axios.delete(`${API_URL}/bookings/${bookingId}`); return response.data; } catch (error) { console.error("API Error (cancelBooking):", error.response?.data?.message || error.message); throw new Error(error.response?.data?.message || 'Failed to cancel booking.'); } };


// --- Auth API Calls ---
export const loginAdmin = async (username, password) => {
    try {
        // Use the /api/auth prefix
        const response = await axios.post(`${API_URL}/auth/login`, { username, password });
        return response.data; // { message: 'Login successful' }
    } catch (error) {
        console.error("API Error (loginAdmin):", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Login failed.');
    }
};

export const logoutAdmin = async () => {
    try {
        // Use the /api/auth prefix
        const response = await axios.post(`${API_URL}/auth/logout`);
        return response.data; // { message: 'Logout successful' }
    } catch (error) {
        console.error("API Error (logoutAdmin):", error.response?.data?.message || error.message);
        // Don't necessarily throw an error here, logout should usually succeed locally
        console.warn('Logout API call failed, but proceeding with client-side logout.');
        return { message: 'Logout completed locally despite server error.' }; // Allow UI to proceed
    }
};

export const checkAuthStatus = async () => {
    try {
        const response = await axios.get(`${API_URL}/auth/status`);
        return response.data; // { isAuthenticated: true/false }
    } catch (error) {
        console.error("API Error (checkAuthStatus):", error.response?.data?.message || error.message);
        // Assume not authenticated if status check fails
        return { isAuthenticated: false };
    }
};


// --- Admin API Calls ---
// These should now work because axios is configured withCredentials=true
// and the backend middleware will check the cookie.
export const getAdminQueue = async () => {
    try {
        // No changes needed here, cookie is sent automatically
        const response = await axios.get(`${API_URL}/admin/queue`);
        return response.data;
    } catch (error) {
        console.error("API Error (getAdminQueue):", error.response?.data?.message || error.message);
        if (error.response?.status === 401) {
            throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error(error.response?.data?.message || 'Failed to fetch admin queue.');
    }
};

export const markPatientDone = async (mongoId) => {
    if (!mongoId) throw new Error("Internal Booking ID is required.");
    try {
        // No changes needed here
        const response = await axios.patch(`${API_URL}/admin/bookings/${mongoId}/done`);
        return response.data;
    } catch (error) {
        console.error("API Error (markPatientDone):", error.response?.data?.message || error.message);
        if (error.response?.status === 401) {
            throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error(error.response?.data?.message || 'Failed to mark patient as done.');
    }
};