import axios from 'axios';

export const sendResults = async (results) => {
    const SERVER_ORIGIN = "http://localhost:3000";

    try {
        const response = await axios.post(`/quiz/dev`, { payload: results });
        return response;
    } catch (error) {
        console.error('Error sending results:', error);
        return error;
    }
};
