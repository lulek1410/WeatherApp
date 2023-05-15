import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const LocationContext = createContext(undefined);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState("");

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

LocationProvider.propTypes = {
  children: PropTypes.node,
};
