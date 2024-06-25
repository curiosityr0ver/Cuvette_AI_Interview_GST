import React, { useState, useRef } from "react";
import ResultsPage from "./ResultsPage";
import questionsArray from "../data/questions";
import { transcribeAudio } from "../api/cloudApi";

const SpeechToText = () => {
	const [recording, setRecording] = useState(false);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [transcriptions, setTranscriptions] = useState(
		Array(questionsArray.length).fill("")
	);
	const [audioURLs, setAudioURLs] = useState(
		Array(questionsArray.length).fill("")
	);
	const [showResults, setShowResults] = useState(false);
	const mediaRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);
	const audioContextRef = useRef(null);

	const handleUserGesture = async () => {
		if (!audioContextRef.current) {
			audioContextRef.current = new (window.AudioContext ||
				window.webkitAudioContext)();
		}

		if (audioContextRef.current.state === "suspended") {
			await audioContextRef.current.resume();
		}
	};

	const startRecording = async () => {
		await handleUserGesture();
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		mediaRecorderRef.current = new MediaRecorder(stream, {
			mimeType: "audio/webm",
		});
		audioChunksRef.current = [];

		mediaRecorderRef.current.ondataavailable = (event) => {
			audioChunksRef.current.push(event.data);
		};

		mediaRecorderRef.current.onstop = async () => {
			const audioBlob = new Blob(audioChunksRef.current, {
				type: "audio/webm",
			});
			const audioURL = URL.createObjectURL(audioBlob);

			const formData = new FormData();
			formData.append("audio", audioBlob, "audio.webm");

			try {
				const data = await transcribeAudio(formData);
				const updatedTranscriptions = [...transcriptions];
				updatedTranscriptions[currentQuestionIndex] = data.transcript;
				setTranscriptions(updatedTranscriptions);

				const updatedAudioURLs = [...audioURLs];
				updatedAudioURLs[currentQuestionIndex] = audioURL;
				setAudioURLs(updatedAudioURLs);

				setRecording(false);
			} catch (error) {
				console.error("Error during transcription:", error);
			}
		};

		mediaRecorderRef.current.start();
		setRecording(true);
	};

	const stopRecording = () => {
		mediaRecorderRef.current.stop();
		setRecording(false);
	};

	const nextQuestion = () => {
		if (currentQuestionIndex + 1 < questionsArray.length) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
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
		setAudioURLs(audioURLs);

		nextQuestion();
	};

	if (showResults) {
		return (
			<ResultsPage
				questions={questionsArray}
				transcriptions={transcriptions}
				audioURLs={audioURLs}
			/>
		);
	}

	return (
		<div>
			<h3>
				Question {currentQuestionIndex + 1}:{" "}
				{questionsArray[currentQuestionIndex]}
			</h3>
			<button onClick={recording ? stopRecording : startRecording}>
				{recording ? "Stop Recording" : "Start Recording"}
			</button>
			{audioURLs[currentQuestionIndex] && (
				<div>
					<h4>Recorded Audio:</h4>
					<audio controls src={audioURLs[currentQuestionIndex]}></audio>
				</div>
			)}
			{transcriptions[currentQuestionIndex] &&
				transcriptions[currentQuestionIndex] !== "Skipped" && (
					<div>
						<h4>Transcription:</h4>
						<p>{transcriptions[currentQuestionIndex]}</p>
					</div>
				)}
			<div>
				<button onClick={reRecord} disabled={recording}>
					Re-record
				</button>
				<button
					onClick={nextQuestion}
					disabled={recording || !transcriptions[currentQuestionIndex]}
				>
					Next Question
				</button>
				<button onClick={skipQuestion} disabled={recording}>
					Skip
				</button>
			</div>
		</div>
	);
};

export default SpeechToText;
