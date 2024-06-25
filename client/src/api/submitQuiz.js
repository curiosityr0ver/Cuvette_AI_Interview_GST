import axios from 'axios';

const SERVER_ORIGIN = "";
const SERVER_ORIGIN_DEV = "http://localhost:3000";

const submitQuiz = async (formData) => {
    try {
        console.log('Submitting quiz');
        const response = await axios.post(`${SERVER_ORIGIN_DEV}/quiz/dev`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('Submission successful:');
        return response;
    } catch (error) {
        console.error('Error submitting quiz:', error);
        return error;
    }
};

export default submitQuiz;
