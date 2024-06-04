import { useState, useEffect } from "react";
import axios from "../api/axios";

const useCities = () => {
  const [cities, setCities] = useState(() => {
    // Try to get cities from localStorage
    const savedCities = localStorage.getItem("airport");
    if (savedCities) {
      return JSON.parse(savedCities);
    }
    return [];
  });

  useEffect(() => {
    if (cities.length === 0) {
      axios.get("/airport").then((res) => {
        setCities(res.data);
        // Save cities to localStorage
        localStorage.setItem("airport", JSON.stringify(res.data));
      });
    }
  }, [cities]);

  return cities;
};

export default useCities;
