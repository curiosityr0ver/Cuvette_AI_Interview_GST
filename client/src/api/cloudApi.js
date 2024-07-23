import axios from 'axios';

export const transcribeAudio = async (formData) => {
    const SERVER_ORIGIN = import.meta.env.VITE_API_BASE_URL || '';
    try {
        const response = await axios.post(`${SERVER_ORIGIN}/cloud`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error transcribing audio:', error);
        return error;
    }
};