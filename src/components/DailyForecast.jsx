import "@/styles/DailyForecast.scss";

import { getGeocode, getLatLng } from "use-places-autocomplete";
import { useParams } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";

import WeatherInfo from "./WeatherInfo";
import LocationData from "../scripts/structures/LocationData";
import extractLocationData from "../scripts/ExtractLocationData";
import ReactMap from "./ReactMap";

function DailyForecast() {
	const { cityName } = useParams();
	let [locationData, setLocationData] = useState(LocationData());
	let [dailyForecast, setDailyForecast] = useState([]);
	let [locationPosition, setLocationPosition] = useState(null);

	const fetchTodaysData = useCallback(() => {
		getGeocode({ address: cityName }).then((geocodes) => {
			const { lat, lng } = getLatLng(geocodes[0]);
			setLocationPosition({ lat: lat, lng: lng });
			fetch(
				`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&lang=en&appid=71f59a10032e07b22e7a6492250eb24d`
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
					console.log(previousDay);
					const tempData = [];
					let forecast = { day: "Today", weatherData: [] };
					json.list.map((data) => {
						const day = new Date(data.dt_txt).toString().slice(0, 3);
						const locationData = extractLocationData(data);
						locationData.time = data.dt_txt.slice(11, -3);
						forecast.weatherData.push(locationData);
						console.log(day);
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
	}, [cityName]);

	useEffect(() => {
		fetchTodaysData();
		console.log("call daily");
	}, [fetchTodaysData]);

	return (
		<>
			<main>
				<div className="current-weather">
					<WeatherInfo
						description={cityName}
						weatherData={locationData}
						showFullInfo={true}
					></WeatherInfo>
					{locationPosition && <ReactMap centerPosition={locationPosition} />}
				</div>
				{dailyForecast &&
					dailyForecast.map((data, index) => {
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
												description={hourData.time}
											></WeatherInfo>
										);
									})}
								</div>
							</div>
						);
					})}
			</main>
		</>
	);
}

export default DailyForecast;
