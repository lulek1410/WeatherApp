import "@/styles/Home.scss";

import { useCallback, useEffect, useState } from "react";

import WeatherInfo from "./WeatherInfo";
import extractLocationData from "../scripts/ExtractLocationData";
import LoadingScreen from "./LoadingScreen";

const suggestedLocations = {
	ids: [
		2643743, 524901, 5128581, 2950159, 1816670, 1850144, 1261481, 964137,
		3435910, 3143244,
	],
	coords: [
		{ lat: 51.5072178, lng: -0.1275862 },
		{ lat: 55.755826, lng: 37.6173 },
		{ lat: 40.7127753, lng: -74.0059728 },
		{ lat: 52.52000659999999, lng: 13.404954 },
		{ lat: 39.904211, lng: 116.407395 },
		{ lat: 35.6761919, lng: 139.6503106 },
		{ lat: 28.6139391, lng: 77.2090212 },
		{ lat: -25.7478676, lng: 28.2292712 },
		{ lat: -34.6036844, lng: -58.3815591 },
		{ lat: 59.9138688, lng: 10.7522454 },
	],
	cityName: [
		"London, UK",
		"Moscow, Russia",
		"New York, USA",
		"Berlin, Germany",
		"Beijing, China",
		"Tokyo, Japan",
		"New Delhi, India",
		"Pretoria, South Africa",
		"Buenos Aires, Argentina",
		"Oslo, Norway",
	],
};

const defaultLocation = {
	id: 2988507,
	cityName: "Paris, France",
};

function Home() {
	let [suggestedLocationsData, setSuggestedLocationsData] = useState(null);
	let [locationData, setLocationData] = useState(null);

	const fetchSingleLocationsData = useCallback((cityCallLink, cityName) => {
		fetch(
			`https://api.openweathermap.org/data/2.5/weather?${cityCallLink}&units=metric&lang=en&appid=71f59a10032e07b22e7a6492250eb24d`
		)
			.then((response) => response.json())
			.then((json) => {
				const locationData = extractLocationData(json);
				locationData.cityName = cityName;
				setLocationData(locationData);
			});
	}, []);

	const fetchSuggestedLocationsData = useCallback(async () => {
		const locationsData = [];
		const locationsCoords = suggestedLocations.coords;
		const getData = async (index = 0) => {
			if (index >= locationsCoords.length) {
				setSuggestedLocationsData(locationsData);
				return;
			}
			const coords = locationsCoords[index];
			const response = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lng}&units=metric&lang=en&appid=71f59a10032e07b22e7a6492250eb24d`
			);
			const json = await response.json();
			locationsData.push(extractLocationData(json));
			await getData(++index);
		};
		getData();
	}, []);

	useEffect(() => {
		fetchSuggestedLocationsData();
	}, [fetchSuggestedLocationsData]);

	const fetchCurrentLocationsData = useCallback(
		({ lat, lng }) => {
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
					fetchSingleLocationsData(
						`q=${cityName},${stateName},${countryName}`,
						`${cityName},${countryName}`
					);
				});
		},
		[fetchSingleLocationsData]
	);

	useEffect(() => {
		const showUsersLocationData = (position) => {
			const coords = position.coords;
			fetchCurrentLocationsData({
				lat: coords.latitude,
				lng: coords.longitude,
			});
		};
		navigator.geolocation.getCurrentPosition(showUsersLocationData, () => {
			fetchSingleLocationsData(
				`id=${defaultLocation.id}`,
				defaultLocation.cityName
			);
		});
	}, [fetchCurrentLocationsData, fetchSingleLocationsData]);

	return (
		<>
			<main>
				{!locationData || !suggestedLocationsData ? (
					<LoadingScreen />
				) : (
					<div>
						<div className="local-weather">
							<WeatherInfo
								description={locationData.cityName}
								weatherData={locationData}
								showFullInfo={true}
								clickable={true}
							/>
						</div>
						<div>
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
						</div>
					</div>
				)}
			</main>
		</>
	);
}

export default Home;
