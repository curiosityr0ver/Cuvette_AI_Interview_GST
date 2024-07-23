import { useState } from "react";
import styles from "./LandingPage.module.css";
import { submitResume, submitIntro } from "../api/submitIntro";
import FormFields from "../components/FormFields";

const defaultTechnologies = {
	React: false,
	Node: false,
	SQL: false,
	ExpressJS: false,
	DevOps: false,
	ML: false,
	DataScience: false,
};

const LandingPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		phone: "",
		fullName: "",
		linkedin: "",
		resume: null,
		role: "",
		experience: "",
		technologies: defaultTechnologies,
	});

	const [error, setError] = useState("");
	const [dragActive, setDragActive] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleCheckboxChange = (e) => {
		const { name, checked } = e.target;
		setFormData((prevState) => ({
			...prevState,
			technologies: {
				...prevState.technologies,
				[name]: checked,
			},
		}));
	};

	const handleFileChange = async (file) => {
		setFormData({ ...formData, resume: file });
		try {
			const response = await submitResume({ resume: file });
			console.log(response.data);

			if (response.status === 201) {
				const data = response.data;
				setFormData((prevState) => ({
					...prevState,
					fullName: data.name || "",
					email: data.email || "",
					phone: data.phone || "",
					linkedin: data.linkedin || "",
					role: data.jobProfile || "",
					experience: data.yearsOfFullTimeExperience?.toString() || "",
					technologies: {
						React: data.technologies.includes("React"),
						Node: data.technologies.includes("Node"),
						SQL: data.technologies.includes("SQL"),
						ExpressJS: data.technologies.includes("ExpressJS"),
						DevOps: data.technologies.includes("DevOps"),
						ML: data.technologies.includes("ML"),
						DataScience: data.technologies.includes("DataScience"),
					},
				}));
			}
		} catch (error) {
			console.error("Error submitting resume:", error);
		}
	};

	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleFileChange(e.dataTransfer.files[0]);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.linkedin && !formData.resume) {
			setError("Please provide either a LinkedIn profile or a resume.");
		} else {
			setError("");
			const dataToSubmit = {
				email: formData.email,
				phone: formData.phone,
				fullName: formData.fullName,
				linkedin: formData.linkedin,
				technologies: Object.keys(formData.technologies).filter(
					(tech) => formData.technologies[tech]
				),
				jobProfile: formData.role,
				experience: formData.experience,
			};
			try {
				const response = await submitIntro(dataToSubmit);
				console.log(response);
				if (response.status === 201) {
					console.log(response.data);
					// navigate("/quiz");
				}
			} catch (error) {
				console.error("Error submitting intro:", error);
			}
		}
	};

	return (
		<div className={styles.container}>
			<h1>Enter Your Details</h1>
			<div
				className={`${styles.dropzone} ${dragActive ? styles.active : ""}`}
				onDragEnter={handleDrag}
				onDragLeave={handleDrag}
				onDragOver={handleDrag}
				onDrop={handleDrop}
				onClick={() => document.getElementById("fileUpload").click()}
			>
				<input
					type="file"
					id="fileUpload"
					name="resume"
					accept="application/pdf"
					onChange={(e) => handleFileChange(e.target.files[0])}
					style={{ display: "none" }}
				/>
				{formData.resume ? (
					<p>{formData.resume.name}</p>
				) : (
					<p>Drag 'n' drop your resume here, or click to select a file</p>
				)}
			</div>
			<FormFields
				formData={formData}
				handleChange={handleChange}
				handleCheckboxChange={handleCheckboxChange}
				error={error}
			/>
			<button onClick={handleSubmit} className={styles.submitButton}>
				Submit
			</button>
			<footer className={styles.footer}>
				<p>This application is in beta. Please be kind. 😊</p>
			</footer>
		</div>
	);
};

export default LandingPage;
