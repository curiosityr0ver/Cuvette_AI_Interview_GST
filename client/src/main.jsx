// src/main.jsx
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Questionnaire from "./pages/Questionnaire";
import LandingPage from "./pages/LandingPage";
import Footer from "./pages/Footer";
const questions = [
	{ id: 1, text: "Question 1" },
	{ id: 2, text: "Question 2" },
	{ id: 3, text: "Question 3" },
	// Add more questions as needed
];

createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/quiz" element={<Questionnaire questions={questions} />} />
		</Routes>
		<Footer />
	</BrowserRouter>
);
