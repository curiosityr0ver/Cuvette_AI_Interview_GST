import axios from 'axios';

const submitResume = async (formData) => {
    const SERVER_ORIGIN = import.meta.env.VITE_API_BASE_URL || '';
    try {
        const response = await axios.post(`${SERVER_ORIGIN}/intro/parse`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error('Error submitting quiz:', error);
        return error;
    }
};

const submitIntro = async (formData) => {
    const SERVER_ORIGIN = import.meta.env.VITE_API_BASE_URL || '';
    try {
        const response = await axios.post(`${SERVER_ORIGIN}/intro/register`, formData);
        return response;
    } catch (error) {
        console.error('Error submitting intro:', error);
        return error;
    }
};


export { submitResume, submitIntro };