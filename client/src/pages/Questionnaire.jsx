import { useState, useEffect, useRef } from "react";
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
	const [totalTime, setTotalTime] = useState(0);
	const [timeline, setTimeline] = useState(
		Array(questions.length).fill("unvisited")
	);
	const navigate = useNavigate();
	const timerRef = useRef(null);

	useEffect(() => {
		timerRef.current = setInterval(() => {
			setTotalTime((prevTime) => prevTime + 1);
		}, 1000);

		return () => clearInterval(timerRef.current);
	}, []);

	const handleNextQuestion = async (answerData) => {
		const updatedAnswers = [...answers, answerData];
		setAnswers(updatedAnswers);
		updateTimeline(
			currentQuestionIndex,
			answerData.transcript === "skipped" ? "skipped" : "answered"
		);
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			clearInterval(timerRef.current);
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
				// Navigate to the Result page with answers, feedback, and total time
				navigate("/result", {
					state: { results, feedback: response.data, totalTime },
				});
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

	const handleSkipAll = async () => {
		clearInterval(timerRef.current);
		const skippedAnswers = questions
			.slice(currentQuestionIndex)
			.map((question) => ({
				question,
				transcript: "skipped",
				elapsedTime: 0,
				recordingDuration: 0,
			}));
		const updatedAnswers = [...answers, ...skippedAnswers];
		setAnswers(updatedAnswers);

		// Submit the skipped quiz
		setLoading(true);
		try {
			const response = await sendResults(updatedAnswers);
			console.log("Quiz submission response:", response);

			// Navigate to the Result page with answers, feedback, and total time
			navigate("/result", {
				state: { results: updatedAnswers, feedback: response.data, totalTime },
			});
		} catch (error) {
			console.error("Error submitting quiz:", error);
		} finally {
			setLoading(false);
		}
	};

	const updateTimeline = (index, status) => {
		setTimeline((prevTimeline) => {
			const newTimeline = [...prevTimeline];
			newTimeline[index] = status;
			return newTimeline;
		});
	};

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.header}>Questionnaire</h1>
			<div className={styles.timer}>
				<p>Total Time Elapsed: {formatTime(totalTime)}</p>
			</div>
			<div className={styles.timeline}>
				{timeline.map((status, index) => (
					<div
						key={index}
						className={`${styles.timelineItem} ${styles[status]}`}
					></div>
				))}
			</div>
			{loading ? (
				<div className={spinnerStyles.spinner}></div>
			) : (
				questions.length > 0 && (
					<Question
						key={currentQuestionIndex} // Add key to force re-mount on question change
						question={questions[currentQuestionIndex]}
						onNext={handleNextQuestion}
						onSkip={handleSkipQuestion}
						onSkipAll={handleSkipAll} // Pass the handleSkipAll function to Question component
					/>
				)
			)}
		</div>
	);
};

export default Questionnaire;
