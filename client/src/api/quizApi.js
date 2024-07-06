import axios from 'axios';

export const sendResults = async (results) => {
    const SERVER_ORIGIN = import.meta.env.VITE_API_BASE_URL || '';

    try {
        const response = await axios.post(`${SERVER_ORIGIN}/quiz/dev`, { payload: results });
        return response;
    } catch (error) {
        console.error('Error sending results:', error);
        return error;
    }
};
