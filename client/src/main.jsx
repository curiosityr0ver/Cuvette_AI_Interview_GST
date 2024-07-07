// src/main.jsx
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Questionnaire from "./pages/Questionnaire";
import LandingPage from "./pages/LandingPage";
import Result from "./pages/ResultPage";

createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Questionnaire />} />
			<Route path="/quiz" element={<Questionnaire />} />
			<Route path="/result" element={<Result />} />
			<Route path="*" element={<h1>Not Found</h1>} />
		</Routes>
	</BrowserRouter>
);
