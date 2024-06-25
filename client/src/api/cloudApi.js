export const transcribeAudio = async (formData) => {
    try {
        const response = await fetch('http://localhost:3000/cloud', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error transcribing audio:', error);
        throw error;
    }
};
