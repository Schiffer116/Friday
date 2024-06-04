import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import BigButton from "../components/BigButton";
import axios from "../api/axios";
import { useEffect, useState } from "react";

const SettingsPara = () => {
  useEffect(() => {
    const requestAuth = async () => {
      try {
        const response = await axios.post("/schedule");
        console.log(response.data);
      } catch (error) {
        if (error.response.status === 401) {
          window.location.href = "/unauthorized";
        }
      }
    };
    requestAuth();
  }, []);

  const Title = [
    "Minimum flight time (min)",
    "Minimum stop time (min)",
    "Maximum stop time (min)",
    "Maximum number of transit airports",
    "Latest time of ticket booking time (min)",
    "Latest time of ticket cancellation (min)",
  ];
  const [policies, setPolicies] = useState([
    { name: "min_flight_duration", value: 0 },
    { name: "min_layover_duration", value: 0 },
    { name: "max_layover_duration", value: 0 },
    { name: "max_layover_count", value: 0 },
    { name: "advance_book_deadline", value: 0 },
    { name: "cancellation_deadline", value: 0 },
    // ...
  ]);

  const convertToMirco = (time) => {
    return time * 60 * 1000000;
  };

  const convertToMinutes = (time) => {
    if (time > 100000) {
      return time / 60 / 1000000;
    } else {
      return time;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/policy");
        const newPolicies = Object.entries(response.data).map(
          ([name, value]) => ({ name, value })
        );
        setPolicies(newPolicies);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleBlur = (e, index) => {
    const newPolicies = [...policies];
    newPolicies[index].value = Number(e.target.textContent);
    setPolicies(newPolicies);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const convertedPolicies = policies.map((policy, index) => {
        if (index !== 3 && policy.value < 100000) {
          return { ...policy, value: convertToMirco(policy.value) };
        } else {
          return policy;
        }
      });   
      const policiesObject = convertedPolicies.reduce((obj, policy) => {
        obj[policy.name] = policy.value;
        return obj;
      }, {});
      const response = await axios.put("/policy", policiesObject);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="wrapper">
        <div className="choices-box">
          <div className="choices">
            <Link className="choice" to="/settings/airport">
              Airport
            </Link>
            <Link className="choice" to="/settings/para">
              Para
            </Link>
            <Link className="choice" to="/settings/class">
              Class
            </Link>
          </div>
        </div>
        <div className="container-box">
          <form
            className="container-white"
            onSubmit={handleSubmit}
            style={{
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <table className="content-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Number</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: "400" }}>{Title[index]}</td>
                    <td contentEditable onBlur={(e) => handleBlur(e, index)}>
                      {index === 3
                        ? policy.value
                        : convertToMinutes(policy.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <BigButton text="Confirm" />
          </form>
        </div>
      </div>
    </>
  );
};

export default SettingsPara;
