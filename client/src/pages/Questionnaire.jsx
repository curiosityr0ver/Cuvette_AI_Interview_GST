import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import questions from "../data/questions";
import { sendResults } from "../api/quizApi";
import Question from "../components/Question";
import styles from "./Questionnaire.module.css";
import spinnerStyles from "../components/Spinner.module.css";

const Questionnaire = () => {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState([]);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleNextQuestion = async (answerData) => {
		const updatedAnswers = [...answers, answerData];
		setAnswers(updatedAnswers);
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			// Prepare the question-answer pairs
			const results = updatedAnswers.map((answer, index) => ({
				question: questions[index],
				...answer,
			}));

			// Submit the quiz
			setLoading(true);
			try {
				const response = await sendResults(results);
				console.log("Quiz submission response:", response);

				// Navigate to the Result page with answers and feedback
				navigate("/result", { state: { results, feedback: response.data } });
			} catch (error) {
				console.error("Error submitting quiz:", error);
			} finally {
				setLoading(false);
			}
		}
	};

	const handleSkipQuestion = () => {
		const answerData = {
			question: questions[currentQuestionIndex],
			transcript: "skipped",
			elapsedTime: 0,
			recordingDuration: 0,
		};
		handleNextQuestion(answerData);
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.header}>Questionnaire</h1>
			{loading ? (
				<div className={spinnerStyles.spinner}></div>
			) : (
				questions.length > 0 && (
					<Question
						key={currentQuestionIndex} // Add key to force re-mount on question change
						question={questions[currentQuestionIndex]}
						onNext={handleNextQuestion}
						onSkip={handleSkipQuestion}
					/>
				)
			)}
		</div>
	);
};

export default Questionnaire;
