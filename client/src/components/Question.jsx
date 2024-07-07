import { useState, useEffect, useRef } from "react";
import { ReactMic } from "react-mic";
import { transcribeAudio } from "../api/cloudApi"; // Ensure you have this API function
import styles from "./Question.module.css";
import spinnerStyles from "./Spinner.module.css";

const Question = ({ question, onNext, onSkipAll }) => {
	const [recording, setRecording] = useState(false);
	const [audioBlob, setAudioBlob] = useState(null);
	const [transcript, setTranscript] = useState("");
	const [elapsedTime, setElapsedTime] = useState(0);
	const [recordingDuration, setRecordingDuration] = useState(0);
	const [recordedOnce, setRecordedOnce] = useState(false);
	const [loading, setLoading] = useState(false);

	const elapsedInterval = useRef(null);
	const recordingInterval = useRef(null);

	useEffect(() => {
		if (!recordedOnce) {
			elapsedInterval.current = setInterval(() => {
				if (!recording) {
					setElapsedTime((prev) => prev + 1);
				}
			}, 1000);
		}

		return () => clearInterval(elapsedInterval.current);
	}, [recording, recordedOnce]);

	useEffect(() => {
		if (recording) {
			recordingInterval.current = setInterval(() => {
				setRecordingDuration((prev) => prev + 1);
			}, 1000);
		} else if (!recording && recordingInterval.current) {
			clearInterval(recordingInterval.current);
		}

		return () => clearInterval(recordingInterval.current);
	}, [recording]);

	const toggleRecording = () => {
		if (recording) {
			setRecording(false);
			setRecordedOnce(true);
		} else {
			setRecording(true);
			setAudioBlob(null);
			setTranscript("");
			setRecordingDuration(0);
		}
	};

	const onStop = async (recordedBlob) => {
		setRecording(false);
		setAudioBlob(recordedBlob.blob);
		setLoading(true);

		try {
			const formData = new FormData();
			formData.append("audio", recordedBlob.blob, "audio.webm");
			const { transcript } = await transcribeAudio(formData);
			setTranscript(transcript);
		} catch (error) {
			console.error("Error transcribing audio:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleNext = () => {
		onNext({
			question,
			transcript: audioBlob ? transcript : "Skipped",
			elapsedTime,
			recordingDuration,
		});
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.header}>{question}</h2>
			<ReactMic
				record={recording}
				className={styles.soundWave}
				onStop={onStop}
				strokeColor="#1C1C1E"
				backgroundColor="#007AFF"
			/>
			<div className={styles.buttonContainer}>
				<button
					onClick={toggleRecording}
					disabled={loading}
					className={styles.mainButton}
				>
					{recording
						? "Stop Recording"
						: audioBlob
						? "Re-record"
						: "Start Recording"}
				</button>
				<div className={styles.secondaryButtons}>
					<button
						onClick={handleNext}
						disabled={recording || loading}
						className={styles.nextButton}
					>
						{audioBlob ? "Next" : "Skip"}
					</button>
					<button onClick={onSkipAll} className={styles.skipAllButton}>
						Skip All
					</button>
				</div>
			</div>
			{loading && <div className={spinnerStyles.spinner}></div>}
			{audioBlob && !loading && (
				<div className={styles.transcriptContainer}>
					<p>Transcript: {transcript}</p>
				</div>
			)}
		</div>
	);
};

export default Question;
