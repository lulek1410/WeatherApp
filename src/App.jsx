import "./styles/App.scss";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Header from "./components/Header";
import DailyForecast from "./components/DailyForecast";

function App() {
	return (
		<>
			<div className="app-container">
				<BrowserRouter>
					<Header></Header>
					<Routes>
						<Route exact path="/" element={<Home />} />
						<Route path="forecast/:locationName" element={<DailyForecast />} />
					</Routes>
				</BrowserRouter>
			</div>
		</>
	);
}

export default App;
