import { useEffect, useState } from "react";
import HistoryAdmin from "./HistoryAdmin";
import HistoryUser from "./HistoryUser";
import axios from "../api/axios";

const History = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const requestAuth = async () => {
      try {
        const response = await axios.get("/full-history");
        console.log(response.data);
        setUser("admin");
      } catch (error) {
        setUser("user");
      }
    };
    requestAuth();
  }, []);
  // useEffect(() => {
  //     setUser("customer");
  // }, []);
  console.log("Role: " + user);
  return user === "admin" ? <HistoryAdmin /> : <HistoryUser />;
};

export default History;
