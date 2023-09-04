import "@/styles/DailyForecast.scss";

import { useParams } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";

import WeatherInfo from "./WeatherInfo";
import LocationData from "../scripts/structures/LocationData";
import extractLocationData from "../scripts/ExtractLocationData";
import LoadingScreen from "./LoadingScreen";

function DailyForecast() {
	const { locationName } = useParams();
	let [locationData, setLocationData] = useState(LocationData());
	let [dailyForecast, setDailyForecast] = useState(null);
	let [locationPosition, setLocationPosition] = useState(null);

	const fetchTodaysData = useCallback(() => {
		fetch(
			`https://api.opencagedata.com/geocode/v1/json?q=${locationName}&key=${
				import.meta.env.VITE_GEOCODING_API_KEY
			}`
		)
			.then((response) => response.json())
			.then((data) => {
				const { lat, lng } = data.results[0].geometry;
				setLocationPosition({ lat: lat, lng: lng });
				const location = locationName.split(",");
				fetch(
					`https://api.openweathermap.org/data/2.5/weather?q=${location[0]},${location[1]}&units=metric&lang=en&appid=71f59a10032e07b22e7a6492250eb24d`
				)
					.then((response) => response.json())
					.then((json) => {
						setLocationData(extractLocationData(json));
					});
				fetch(
					`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&lang=en&appid=71f59a10032e07b22e7a6492250eb24d`
				)
					.then((response) => response.json())
					.then((json) => {
						let previousDay = new Date().toString().slice(0, 3);
						const tempData = [];
						let forecast = { day: "Today", weatherData: [] };
						json.list.map((data) => {
							const day = new Date(data.dt_txt).toString().slice(0, 3);
							const locationData = extractLocationData(data);
							locationData.time = data.dt_txt.slice(11, -3);
							forecast.weatherData.push(locationData);
							if (day !== previousDay) {
								previousDay = day;
								tempData.push(forecast);
								forecast = { day: day, weatherData: [] };
							}
						});
						tempData.push(forecast);
						setDailyForecast(tempData);
					});
			});
	}, [locationName]);

	useEffect(() => {
		fetchTodaysData();
	}, [fetchTodaysData]);

	return (
		<>
			<main>
				{dailyForecast && locationPosition ? (
					<div>
						<div id="current-weather">
							<WeatherInfo
								title={locationName}
								weatherData={locationData}
								showFullInfo={true}
							></WeatherInfo>
						</div>
						{dailyForecast.map((data, index) => {
							return (
								<div className="horizontal-container" key={index}>
									<p className="day">{data.day}</p>
									<div className="forecast">
										{data.weatherData.map((hourData, index) => {
											return (
												<WeatherInfo
													key={index}
													showLocalTime={false}
													weatherData={hourData}
													title={hourData.time}
												></WeatherInfo>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<LoadingScreen />
				)}
			</main>
		</>
	);
}

export default DailyForecast;
