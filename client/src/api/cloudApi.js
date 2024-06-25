import axios from 'axios';

export const transcribeAudio = async (formData) => {
    try {
        const response = await axios.post('/cloud', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error transcribing audio:', error);
        throw error;
    }
};