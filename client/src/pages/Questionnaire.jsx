import React, { useState, useRef } from "react";
import ResultsPage from "./ResultsPage";
import questionsArray from "../data/questions";
import { transcribeAudio } from "../api/cloudApi";
import { ReactMic } from "react-mic";
import styles from "./Questionnaire.module.css";

const Questionnaire = () => {
	const [recording, setRecording] = useState(false);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [transcriptions, setTranscriptions] = useState(
		Array(questionsArray.length).fill("")
	);
	const [timeSpent, setTimeSpent] = useState(
		Array(questionsArray.length).fill(0)
	);
	const [showResults, setShowResults] = useState(false);
	const [loading, setLoading] = useState(false); // Loading state for transcription
	const audioChunksRef = useRef([]);
	const startTimeRef = useRef(null);

	const onStop = async (recordedBlob) => {
		audioChunksRef.current = recordedBlob.blob;
		setRecording(false);

		const formData = new FormData();
		formData.append("audio", recordedBlob.blob, "audio.webm");

		try {
			setLoading(true); // Set loading state before transcription
			const data = await transcribeAudio(formData);
			const updatedTranscriptions = [...transcriptions];
			updatedTranscriptions[currentQuestionIndex] = data.transcript;
			setTranscriptions(updatedTranscriptions);

			const newTimeSpent = [...timeSpent];
			newTimeSpent[currentQuestionIndex] += new Date() - startTimeRef.current;
			setTimeSpent(newTimeSpent);
		} catch (error) {
			console.error("Error during transcription:", error);
		} finally {
			setLoading(false); // Reset loading state after transcription
		}
	};

	const startRecording = () => {
		audioChunksRef.current = [];
		setRecording(true);
		startTimeRef.current = new Date();
	};

	const stopRecording = () => {
		setRecording(false);
	};

	const nextQuestion = () => {
		if (currentQuestionIndex + 1 < questionsArray.length) {
			setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
		} else {
			setShowResults(true);
		}
	};

	const reRecord = () => {
		startRecording();
	};

	const skipQuestion = () => {
		const updatedTranscriptions = [...transcriptions];
		updatedTranscriptions[currentQuestionIndex] = "Skipped";
		setTranscriptions(updatedTranscriptions);

		nextQuestion();
	};

	if (showResults) {
		return (
			<ResultsPage
				questions={questionsArray}
				transcriptions={transcriptions}
				timeSpent={timeSpent}
			/>
		);
	}

	return (
		<div className={styles.container}>
			<h3 className={styles.question}>
				Question {currentQuestionIndex + 1}:{" "}
				{questionsArray[currentQuestionIndex]}
			</h3>
			<ReactMic
				record={recording}
				className={styles.waveform}
				onStop={onStop}
				strokeColor="#007bff"
				backgroundColor="#f7f9fc"
			/>
			<button
				onClick={recording ? stopRecording : startRecording}
				disabled={loading}
			>
				{recording ? "Stop Recording" : "Start Recording"}
			</button>
			{loading && <p className={styles.loadingIndicator}>Transcribing...</p>}
			<div className={styles.buttons}>
				<button onClick={reRecord} disabled={recording || loading}>
					Re-record
				</button>
				<button
					onClick={nextQuestion}
					disabled={
						recording || !transcriptions[currentQuestionIndex] || loading
					}
				>
					Next Question
				</button>
				<button
					onClick={skipQuestion}
					disabled={
						recording || loading || transcriptions[currentQuestionIndex]
					}
				>
					Skip
				</button>
			</div>
		</div>
	);
};

export default Questionnaire;
