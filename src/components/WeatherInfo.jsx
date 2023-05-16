import "@/styles/WeatherInfo.scss";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import humidityIcon from "../assets/humidity.png";
import pressureIcon from "../assets/pressure.png";
import windSpeedIcon from "../assets/wind.png";
import windDegreeIcon from "../assets/arrow.png";
import visibilityIcon from "../assets/eye.png";

const translateDegreesToDirection = (degree) => {
	switch (true) {
		case degree < 11.25 || degree > 348.75: {
			return "North";
		}
		case degree < 33.75: {
			return "North-Northeast";
		}
		case degree < 56.25: {
			return "Northeast";
		}
		case degree < 78.75: {
			return "East-Northeast";
		}
		case degree < 101.25: {
			return "East";
		}
		case degree < 123.75: {
			return " East-Southeast";
		}
		case degree < 146.25: {
			return "Southeast";
		}
		case degree < 168.75: {
			return "South-Southeast";
		}
		case degree < 191.25: {
			return "South";
		}
		case degree < 213.75: {
			return "South-Southwest";
		}
		case degree < 236.25: {
			return "Southwest";
		}
		case degree < 258.75: {
			return "West-Southwest";
		}
		case degree < 281.25: {
			return "West";
		}
		case degree < 303.75: {
			return "West-Northwest";
		}
		case degree < 326.25: {
			return "Northwest";
		}
		case degree < 348.75: {
			return "North-Northwest ";
		}
	}
};

const getLocationTime = (userCurrentTime, locationOffsetHours) => {
	const userOffsetHours = -userCurrentTime.getTimezoneOffset() / 60;
	let locationHours =
		userCurrentTime.getHours() - (userOffsetHours - locationOffsetHours);
	if (locationHours > 23) {
		locationHours -= 24;
	} else if (locationHours < 0) {
		locationHours = 24 - locationHours;
	}
	userCurrentTime.setHours(locationHours);
	return userCurrentTime.toTimeString().slice(0, 5);
};

function WeatherInfo(props) {
	const {
		description,
		weatherData,
		showFullInfo = false,
		showLocalTime = true,
		clickable = false,
	} = props;
	const [localTime, setLocalTime] = useState(0);

	const navigate = useNavigate();

	useEffect(() => {
		setLocalTime(getLocationTime(new Date(), weatherData.timezone / 3600));
	}, [weatherData]);

	useEffect(() => {
		const timer = setInterval(() => {
			const newLocalTime = getLocationTime(
				new Date(),
				weatherData.timezone / 3600
			);
			if (newLocalTime != localTime) {
				setLocalTime(newLocalTime);
			}
		}, 2000);

		return () => clearInterval(timer);
	});

	return (
		<>
			<div
				className="weather-info"
				style={{ cursor: clickable ? "pointer" : "auto" }}
				onClick={
					clickable
						? () => {
								navigate(`/forecast/${description}`);
							}
						: undefined
				}
			>
				<p className="fs-big description">{description}</p>
				{showLocalTime && (
					<p>
						Local time: <time>{localTime}</time>{" "}
					</p>
				)}
				<p className="fs-big temperature">{weatherData.temperature.current}</p>
				{showFullInfo && (
					<p className="fs-med temperature">
						{"feels like: " + weatherData.temperature.feelsLike}
					</p>
				)}
				<img
					src={weatherData.weather.icon}
					alt="weather image"
					className="weather-image"
				/>
				<p className="weather-description fs-med">
					{weatherData.weather.description}
				</p>
				{showFullInfo && (
					<div className="details-grid">
						<p>
							<img src={pressureIcon} alt="Atmospheric pressure" />
							{weatherData.pressure + " hPa"}
						</p>
						<p>
							<img src={humidityIcon} alt="Humidity" />
							{weatherData.humidity}
							{String.fromCharCode(37)}
						</p>
						<p>
							<img src={windSpeedIcon} alt="Wind speed" />
							{weatherData.wind.windSpeed + " m/s"}
						</p>
						<p>
							<img
								src={windDegreeIcon}
								alt="Wind direction"
								style={{
									transform: `rotate(${weatherData.wind.windDegree - 270}deg)`,
								}}
							/>
							{translateDegreesToDirection(weatherData.wind.windDegree) +
								" wind"}
						</p>
						<p>
							<img src={visibilityIcon} alt="Visibility" />
							{weatherData.visibility + " m"}
						</p>
					</div>
				)}
			</div>
		</>
	);
}

WeatherInfo.propTypes = {
	description: PropTypes.string.isRequired,
	weatherData: PropTypes.object.isRequired,
	showFullInfo: PropTypes.bool,
	showLocalTime: PropTypes.bool,
	clickable: PropTypes.bool,
};

export default WeatherInfo;
