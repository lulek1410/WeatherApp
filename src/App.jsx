import "./styles/App.scss";

import { LocationProvider } from "./context/LocationContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Header from "./components/Header";
import DailyForecast from "./components/DailyForecast";

function App() {
	return (
		<>
			<LocationProvider>
				<div className="app-container">
					<BrowserRouter basename="">
						<Header></Header>
						<Routes>
							<Route exact path="/" element={<Home />} />
							<Route path="forecast/:cityName" element={<DailyForecast />} />
						</Routes>
					</BrowserRouter>
				</div>
			</LocationProvider>
		</>
	);
}

export default App;
