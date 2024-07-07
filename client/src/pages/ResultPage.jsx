import { useLocation } from "react-router-dom";
import styles from "./ResultPage.module.css";

const ResultPage = () => {
	const location = useLocation();
	const { results, feedback, totalTime } = location.state || {
		results: [],
		feedback: [],
		totalTime: 0,
	};

	const getRatingClass = (rating) => {
		if (rating <= 3) return styles.ratingLow;
		if (rating <= 7) return styles.ratingMedium;
		return styles.ratingHigh;
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.header}>Quiz Results</h1>
			<p>
				<strong>Total Time Taken:</strong> {formatTime(totalTime)}
			</p>
			{results.length > 0 ? (
				results.map((result, index) => (
					<div key={index} className={styles.resultItem}>
						<h2>Question {index + 1}</h2>
						<p>
							<strong>Question:</strong> {result.question}
						</p>
						<p>
							<strong>Transcript:</strong> {result.transcript}
						</p>
						<p>
							<strong>Time taken to answer:</strong>{" "}
							{formatTime(result.elapsedTime)}
						</p>
						<p>
							<strong>Recording duration:</strong>{" "}
							{formatTime(result.recordingDuration)}
						</p>
						{feedback && feedback[index] && (
							<>
								<p className={getRatingClass(feedback[index].rating)}>
									<strong>Rating:</strong> {feedback[index].rating}
								</p>
								<p>
									<strong>Remark:</strong> {feedback[index].remark}
								</p>
							</>
						)}
					</div>
				))
			) : (
				<p>No results to display.</p>
			)}
		</div>
	);
};

const formatTime = (seconds) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export default ResultPage;
