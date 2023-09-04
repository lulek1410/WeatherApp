import "../styles/Header.scss";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";

import { faCloud, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	GeoapifyContext,
	GeoapifyGeocoderAutocomplete,
} from "@geoapify/react-geocoder-autocomplete";

function Header() {
	const [value, setValue] = useState("");
	const [suggestions, setSuggestions] = useState([]);

	const navigate = useNavigate();

	const handleSelect = (selected) => {
		const city = selected.properties.city;
		const country = selected.properties.country;
		navigate(`/forecast/${city}, ${country}`);
	};

	function suggestionsFilter(suggestions) {
		const unique = [];
		suggestions.map((val) => {
			const result = unique.map((el) => {
				return el.bbox.toString() == val.bbox.toString();
			});
			const ans = result.some((e) => e == true);
			if (ans) {
				return true;
			} else {
				unique.push(val);
				return false;
			}
		});

		return unique;
	}

	const searchLocation = () => {
		handleSelect(suggestions[0]);
	};

	return (
		<GeoapifyContext apiKey={import.meta.env.VITE_GEOAPIFY_KEY}>
			<header>
				<Link to="/" className="header-logo">
					<FontAwesomeIcon icon={faCloud} size="lg" />
					<p>WeatherApp</p>
				</Link>
				<div className="input">
					<button onClick={searchLocation} name="search">
						<FontAwesomeIcon icon={faMagnifyingGlass} />
					</button>
					<GeoapifyGeocoderAutocomplete
						value={value}
						onUserInput={(val) => {
							setValue(val);
						}}
						placeholder="Enter address here"
						type={"city"}
						limit={5}
						lang="en"
						placeSelect={handleSelect}
						suggestionsChange={(val) => {
							setSuggestions(val);
						}}
						suggestionsFilter={suggestionsFilter}
					/>
				</div>
			</header>
		</GeoapifyContext>
	);
}

export default Header;
