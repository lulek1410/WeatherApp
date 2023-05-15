import "@/styles/Home.scss";

import { useCallback, useEffect, useState } from "react";

import WeatherInfo from "./WeatherInfo";
import LocationData from "../scripts/structures/LocationData";
import extractLocationData from "../scripts/ExtractLocationData";

const suggestedLocations = {
	ids: [
		2643743, 524901, 5128581, 2950159, 1816670, 1850144, 1261481, 964137,
		3435910, 3143244,
	],
	cityName: [
		"London, UK",
		"Moscow, Russia",
		"New York, NY, USA",
		"Berlin, Germany",
		"Beijing, China",
		"Tokyo, Japan",
		"New Delhi, Delhi, India",
		"Pretoria, South Africa",
		"Buenos Aires, Argentina",
		"Oslo, Norway",
	],
};

function Home() {
	let [suggestedLocationsData, setSuggestedLocationsData] = useState([]);
	let [locationData, setLocationData] = useState(null);

	const fetchSuggestedLocationsData = useCallback(() => {
		fetch(
			`http://api.openweathermap.org/data/2.5/group?id=${suggestedLocations.ids.toString()}&units=metric&lang=en&appid=71f59a10032e07b22e7a6492250eb24d`
		)
			.then((response) => response.json())
			.then((json) => {
				const locationsData = [];
				json.list.map((data) => {
					const locationData = extractLocationData(data);
					locationsData.push(locationData);
				});
				setSuggestedLocationsData(locationsData);
			});
	}, []);

	useEffect(() => {
		fetchSuggestedLocationsData();
	}, [fetchSuggestedLocationsData]);

	const fetchCurrentLocationsData = useCallback(({ lat, lng }) => {
		new window.google.maps.Geocoder()
			.geocode({
				location: { lat: lat, lng: lng },
				language: "en",
			})
			.then((response) => {
				const addres = response.results[0].formatted_address.split(" ");
				const cityName = addres[3].slice(0, addres[3].length - 1);
				let countryName = "";
				let stateName = "";
				if (addres.length > 5) {
					countryName = addres[5];
					stateName = addres[4];
				} else {
					countryName = addres[4];
				}
				fetch(
					`https://api.openweathermap.org/data/2.5/weather?q=${cityName},${stateName},${countryName}&units=metric&lang=en&appid=71f59a10032e07b22e7a6492250eb24d`
				)
					.then((response) => response.json())
					.then((json) => {
						const locationData = extractLocationData(json);
						locationData.cityName = `${cityName}, ${countryName}`;
						setLocationData(locationData);
					});
			});
	}, []);

	useEffect(() => {
		const showUsersLocationData = (position) => {
			const coords = position.coords;
			fetchCurrentLocationsData({
				lat: coords.latitude,
				lng: coords.longitude,
			});
		};
		navigator.geolocation.getCurrentPosition(showUsersLocationData, () => {});
	}, [fetchCurrentLocationsData]);

	return (
		<>
			<main>
				{locationData && (
					<div className="local-weather">
						<WeatherInfo
							description={locationData.cityName}
							weatherData={locationData}
							clickable={true}
						/>
					</div>
				)}
				{suggestedLocationsData && (
					<div className="suggested-locations">
						{suggestedLocationsData.map((data, index) => {
							return (
								<WeatherInfo
									key={index}
									description={suggestedLocations.cityName[index]}
									weatherData={data}
									clickable={true}
								/>
							);
						})}
					</div>
				)}
			</main>
		</>
	);
}

export default Home;