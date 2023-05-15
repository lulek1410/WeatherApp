import LocationData from "./structures/LocationData";

const extractLocationData = (data) => {
	const locationData = LocationData();
	const locationTempetarure = locationData.temperature;
	const locationWind = locationData.wind;
	const locationWeather = locationData.weather;
	const wind = data.wind;
	const main = data.main;
	const weather = data.weather[0];
	locationTempetarure.current = Math.round(main.temp);
	locationTempetarure.feelsLike = Math.round(main.feels_like);
	locationWind.windSpeed = wind.speed;
	locationWind.windDegree = wind.deg;
	locationWeather.description = weather.description;
	locationWeather.icon = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
	locationData.timezone = data.timezone ?? data.sys.timezone;
	locationData.pressure = main.pressure;
	locationData.humidity = main.humidity;
	locationData.visibility = data.visibility;
	return locationData;
};

export default extractLocationData;
