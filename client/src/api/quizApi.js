import axios from 'axios';

export const sendResults = async (results) => {
    try {
        const response = await axios.post('http://localhost:3000/quiz/dev', { payload: results });
        return response.data;
    } catch (error) {
        console.error('Error sending results:', error);
        throw error;
    }
};
