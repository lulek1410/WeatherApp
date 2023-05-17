import "@/styles/Loading.scss";

import { faCloud } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingAnimation from "./LoadingAnimation";

function LoadingScreen() {
	return (
		<>
			<div id="loading-container">
				<div id="logo">
					<FontAwesomeIcon icon={faCloud} size="lg" />
					<p>WeatherApp</p>
				</div>
				<LoadingAnimation />
			</div>
		</>
	);
}

export default LoadingScreen;
