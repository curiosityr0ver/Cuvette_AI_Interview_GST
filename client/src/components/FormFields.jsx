/* eslint-disable react/prop-types */
// ./components/FormFields.jsx
import React from "react";
import styles from "./FormFields.module.css";

const FormFields = ({
	formData,
	handleChange,
	handleCheckboxChange,
	error,
}) => {
	return (
		<div className={styles.form}>
			<input
				type="email"
				name="email"
				placeholder="Email"
				value={formData.email}
				onChange={handleChange}
				required
				className={styles.input}
			/>
			<input
				type="tel"
				name="phone"
				placeholder="Phone"
				value={formData.phone}
				onChange={handleChange}
				required
				className={styles.input}
			/>
			<input
				type="text"
				name="fullName"
				placeholder="Full Name"
				value={formData.fullName}
				onChange={handleChange}
				required
				className={styles.input}
			/>
			<input
				type="url"
				name="linkedin"
				placeholder="LinkedIn Profile"
				value={formData.linkedin}
				onChange={handleChange}
				className={styles.input}
			/>
			<div className={styles.orSeparator}>OR</div>
			<select
				name="role"
				value={formData.role}
				onChange={handleChange}
				required
				className={styles.select}
			>
				<option value="" disabled>
					Select Role
				</option>
				<option value="full stack developer">Full Stack Developer</option>
				<option value="frontend developer">Frontend Developer</option>
				<option value="backend developer">Backend Developer</option>
				<option value="data scientist">Data Scientist</option>
				<option value="devops engineer">DevOps Engineer</option>
			</select>
			<select
				name="experience"
				value={formData.experience}
				onChange={handleChange}
				required
				className={styles.select}
			>
				<option value="" disabled>
					Select Experience
				</option>
				<option value="0">0 years</option>
				<option value="1">1 year</option>
				<option value="2">2 years</option>
				<option value="3">3 years</option>
				<option value="4">4 years</option>
				<option value="5">5 years</option>
				<option value="6">6 years</option>
				<option value="7">7 years</option>
				<option value="8">8 years</option>
				<option value="9">9 years</option>
				<option value="10+">10+ years</option>
			</select>
			<div className={styles.checkboxGroup}>
				<label>
					<input
						type="checkbox"
						name="React"
						checked={formData.technologies.React}
						onChange={handleCheckboxChange}
					/>
					React
				</label>
				<label>
					<input
						type="checkbox"
						name="Node"
						checked={formData.technologies.Node}
						onChange={handleCheckboxChange}
					/>
					Node
				</label>
				<label>
					<input
						type="checkbox"
						name="SQL"
						checked={formData.technologies.SQL}
						onChange={handleCheckboxChange}
					/>
					SQL
				</label>
				<label>
					<input
						type="checkbox"
						name="ExpressJS"
						checked={formData.technologies.ExpressJS}
						onChange={handleCheckboxChange}
					/>
					ExpressJS
				</label>
				<label>
					<input
						type="checkbox"
						name="DevOps"
						checked={formData.technologies.DevOps}
						onChange={handleCheckboxChange}
					/>
					DevOps
				</label>
				<label>
					<input
						type="checkbox"
						name="ML"
						checked={formData.technologies.ML}
						onChange={handleCheckboxChange}
					/>
					ML
				</label>
				<label>
					<input
						type="checkbox"
						name="DataScience"
						checked={formData.technologies.DataScience}
						onChange={handleCheckboxChange}
					/>
					Data Science
				</label>
			</div>
			{error && <div className={styles.error}>{error}</div>}
		</div>
	);
};

export default FormFields;
