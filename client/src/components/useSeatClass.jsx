import { useState, useEffect } from "react";
import axios from "../api/axios";

const useSeatClass = () => {
  const [seatClasses, setSeatClasses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/class");
        setSeatClasses(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return seatClasses;
};

export default useSeatClass;
