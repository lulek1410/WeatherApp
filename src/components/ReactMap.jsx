import "@/styles/ReactMap.scss";

import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";

function ReactMap(props) {
	const [mapFilter, setMapFilter] = useState("precipitation_new");

	const { centerPosition } = props;

	const setUpMap = useCallback(() => {
		const map = new window.google.maps.Map(document.getElementById("map"), {
			center: centerPosition,
			zoom: 5,
			disableDefaultUI: true,
		});

		var myMapType = new window.google.maps.ImageMapType({
			getTileUrl: function (coord, zoom) {
				return `https://tile.openweathermap.org/map/${mapFilter}/${zoom}/${coord.x}/${coord.y}.png?appid=71f59a10032e07b22e7a6492250eb24d`;
			},
			tileSize: new window.google.maps.Size(256, 256),
			maxZoom: 9,
			minZoom: 0,
			name: "mymaptype",
			opacity: 1,
		});
		map.overlayMapTypes.insertAt(0, myMapType);
	}, [centerPosition, mapFilter]);

	useEffect(() => {
		setUpMap();
	}, [setUpMap]);

	return (
		<>
			<div className="container">
				<div id="map"></div>
				<fieldset
					id="filter-type"
					onChange={(event) => {
						setMapFilter(event.target.value);
					}}
				>
					<input
						type="radio"
						id="precipitation"
						name="map-filter"
						value="precipitation_new"
						defaultChecked={true}
					></input>
					<label htmlFor="precipitation">Precipitation</label>
					<br />
					<input
						type="radio"
						id="wind"
						name="map-filter"
						value="wind_new"
					></input>
					<label htmlFor="wind">Wind</label>
					<br />
					<input
						type="radio"
						id="clouds"
						name="map-filter"
						value="clouds_new"
					></input>
					<label htmlFor="clouds">Clouds</label>
				</fieldset>
			</div>
		</>
	);
}

ReactMap.propTypes = {
	centerPosition: PropTypes.object.isRequired,
};

export default ReactMap;
