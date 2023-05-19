import LocationData from "./structures/LocationData";

import rain from "../assets/weather/rain.jpg";
import clouds from "../assets/weather/cloudy.jpg";
import mist from "../assets/weather/mist.jpg";
import snow from "../assets/weather/snow.jpg";
import sunny from "../assets/weather/sunny.jpg";

const chooseBackgroundImage = (id) => {
	switch (true) {
		case id >= 802: {
			return `url(${clouds})`;
		}
		case id >= 800: {
			return `url(${sunny})`;
		}
		case id > 700: {
			return `url(${mist})`;
		}
		case id >= 600: {
			return `url(${snow})`;
		}
		case id >= 200: {
			return `url(${rain})`;
		}
	}
};

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
	locationWeather.bgImage = chooseBackgroundImage(weather.id);
	locationWeather.description = weather.description;
	locationWeather.icon = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
	locationData.timezone = data.timezone ?? data.sys.timezone;
	locationData.pressure = main.pressure;
	locationData.humidity = main.humidity;
	locationData.visibility = data.visibility;
	return locationData;
};

export default extractLocationData;
