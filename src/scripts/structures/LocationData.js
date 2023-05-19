const LocationData = () => {
	return {
		temperature: { current: 0, feelsLike: 0 },
		wind: { windSpeed: 0, windDegree: 0 },
		weather: { bgImage: "", description: 0, icon: 0 },
		timezone: 0,
		pressure: 0,
		humidity: 0,
		visibility: 0,
	};
};

export default LocationData;
