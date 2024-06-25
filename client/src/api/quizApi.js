import axios from 'axios';

export const sendResults = async (results) => {
    try {
        const response = await axios.post('/quiz/dev', { payload: results });
        return response;
    } catch (error) {
        console.error('Error sending results:', error);
        return error;
    }
};
