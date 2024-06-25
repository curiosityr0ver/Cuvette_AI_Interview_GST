import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./ResultsPage.module.css";
import { sendResults } from "../api/quizApi";

const ResultsPage = ({ questions, transcriptions, timeSpent }) => {
	const [feedback, setFeedback] = useState([]);

	useEffect(() => {
		const questionAnswerPairs = questions.map((question, index) => ({
			question,
			answer: transcriptions[index],
			timeSpent: timeSpent[index],
		}));

		const sendAndLogResults = async () => {
			try {
				const response = await sendResults(questionAnswerPairs);
				console.log("Results sent successfully:", response);
				setFeedback(response.data);
			} catch (error) {
				console.error("Error sending results:", error);
			}
		};

		sendAndLogResults();
	}, [questions, transcriptions, timeSpent]);

	const formatTime = (milliseconds) => {
		const seconds = Math.floor((milliseconds / 1000) % 60);
		const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
		const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

		return `${hours > 0 ? `${hours}h ` : ""}${
			minutes > 0 ? `${minutes}m ` : ""
		}${seconds}s`;
	};

	const getRatingClass = (rating) => {
		if (rating >= 7) {
			return styles.goodRating;
		} else if (rating >= 5) {
			return styles.satisfactoryRating;
		} else {
			return styles.poorRating;
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Results</h2>
			<ul className={styles.resultsList}>
				{questions.map((question, index) => (
					<li key={index} className={styles.resultItem}>
						<h3 className={styles.question}>{`Question ${
							index + 1
						}: ${question}`}</h3>
						<p className={styles.timeSpent}>
							<strong>Time Spent:</strong> {formatTime(timeSpent[index])}
						</p>
						<p className={styles.transcription}>
							<strong>Transcription:</strong> {transcriptions[index]}
						</p>
						{feedback[index] && (
							<>
								<p
									className={`${styles.rating} ${getRatingClass(
										feedback[index].rating
									)}`}
								>
									<strong>Rating:</strong> {feedback[index].rating}
								</p>
								<p className={styles.remark}>
									<strong>Remark:</strong> {feedback[index].remark}
								</p>
							</>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

ResultsPage.propTypes = {
	questions: PropTypes.arrayOf(PropTypes.string).isRequired,
	transcriptions: PropTypes.arrayOf(PropTypes.string).isRequired,
	timeSpent: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default ResultsPage;
