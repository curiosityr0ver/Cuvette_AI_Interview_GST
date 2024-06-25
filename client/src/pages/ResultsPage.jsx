import React, { useEffect, useState } from "react";
import { sendResults } from "../api/quizApi";

const ResultsPage = ({ questions, transcriptions, audioURLs }) => {
	const [serverResponses, setServerResponses] = useState([]);

	useEffect(() => {
		const fetchResults = async () => {
			const results = questions.map((question, index) => ({
				question,
				answer:
					transcriptions[index] === "Skipped"
						? "Skipped"
						: transcriptions[index],
			}));

			try {
				const data = await sendResults(results);
				setServerResponses(data);
				console.log("Response from server:", data);
			} catch (error) {
				console.error("Error sending results:", error);
			}
		};

		fetchResults();
	}, [questions, transcriptions]);

	return (
		<div>
			<h2>Results</h2>
			{questions.map((question, index) => (
				<div key={index}>
					<h3>
						Question {index + 1}: {question}
					</h3>
					{transcriptions[index] === "Skipped" ? (
						<p>
							<strong>Answer:</strong> Skipped
						</p>
					) : (
						<>
							<p>
								<strong>Answer:</strong> {transcriptions[index]}
							</p>
							<audio controls src={audioURLs[index]}></audio>
						</>
					)}
					{serverResponses[index] && (
						<div>
							<p>
								<strong>Rating:</strong> {serverResponses[index].rating}
							</p>
							<p>
								<strong>Remark:</strong> {serverResponses[index].remark}
							</p>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default ResultsPage;
