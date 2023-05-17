import "../styles/Header.scss";

import { faCloud, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import usePlacesAutocomplete from "use-places-autocomplete";

import { LocationContext } from "../context/LocationContext";
import { Link, useNavigate } from "react-router-dom";

function Header() {
	const { setLocation } = useContext(LocationContext);

	const navigate = useNavigate();

	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		requestOptions: {
			types: ["(cities)"],
		},
	});

	const searchLocation = () => {
		if (data[0]) {
			handleSelect(data[0].description);
		}
	};

	const handleSelect = (city) => {
		setValue(city);
		setLocation(city);
		clearSuggestions();
		navigate(`/forecast/${city}`);
	};

	const displySuggestions = () => {
		return data[0] && data[0].description != value;
	};

	return (
		<>
			<header>
				<Link to="/" className="header-logo">
					<FontAwesomeIcon icon={faCloud} size="lg" />
					<p>WeatherApp</p>
				</Link>
				<div className="input">
					<button onClick={searchLocation} name="search">
						<FontAwesomeIcon icon={faMagnifyingGlass} />
					</button>
					<Combobox onSelect={handleSelect}>
						<ComboboxInput
							value={value}
							onChange={(e) => setValue(e.target.value)}
							onKeyUp={(e) => {
								if (e.key == "Enter") {
									searchLocation();
								}
							}}
							disabled={!ready}
							placeholder="Search location"
						/>
						{displySuggestions() && (
							<ComboboxPopover portal={false}>
								<ComboboxList>
									<hr />
									{status === "OK" &&
										data.map(({ place_id, description }) => (
											<ComboboxOption key={place_id} value={description} />
										))}
								</ComboboxList>
							</ComboboxPopover>
						)}
					</Combobox>
				</div>
			</header>
		</>
	);
}

export default Header;
