import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import BigButton from "../components/BigButton";
import axios from "../api/axios";
import { useEffect, useState } from "react";
const Settings = () => {
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

  const [airport, setAirport] = useState([]);
  // const [deleteAirport, setDeleteAirport] = useState([]);
  const [oldAirport, setOldAirport] = useState([]);
  const [error, setError] = useState("");

  const handleBlur = (e, rowIndex, column) => {
    const newData = [...airport];
    newData[rowIndex][column] = e.target.textContent;
    setAirport(newData);
  };
  const handleAction = (e, rowIndex, column) => {
    const newData = [...airport];
    console.log(e.target.value);
    newData[rowIndex][column] = e.target.value === "true";
    setAirport(newData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/airport");
        const data = response.data.map((item) => ({
          ...item,
          id: item.id,
        }));
        setAirport(JSON.parse(JSON.stringify(data)));
        setOldAirport(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);
  const addRow = () => {
    setAirport([...airport, { id: "", name: "", city: "", status: true }]);
  };

  // const removeRow = (index) => {
  //   const newData = [...airport];
  //   newData[index].status = false;

  //   const activeAirports = newData.filter((ap) => ap.status);
  //   const deletedAirports = [...deleteAirport,  newData[index]];

  //   setAirport(activeAirports);
  //   setDeleteAirport(deletedAirports);
  //   console.log("deleted");
  // };

  const removeStatus = (airport) => {
    const updatedAirport = airport.map(({ status, ...rest }) => rest);
    return updatedAirport;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // const old_airport = oldAirport.map(ap => JSON.stringify(ap));
    // const Temp = airport.filter(ap => !old_airport.includes(JSON.stringify(ap)));

    // const fixOldAirpot = removeStatus(old_airport);
    // const fixAirport = removeStatus(airport);

    // const test = fixAirport.filter((a) => fixOldAirpot.includes(a))

    // const acceptTemp = Temp.filter((ap) => ap.status === true);
    // const deleteTemp = Temp.filter((ap) => ap.status === false);
    
    const old_airport = oldAirport.map(ap => ap);
    const Temp = airport.filter(ap => !old_airport.includes(JSON.stringify(ap)));

    const fixOldAirpot = removeStatus(old_airport);
    const fixAirport = removeStatus(airport);

    const test = fixAirport.filter((a) => fixOldAirpot.includes(a))

    const acceptTemp = Temp.filter((ap) => ap.status === true);
    const deleteTemp = Temp.filter((ap) => ap.status === false);
    for (const i of test) {
      try {
        const response = await axios.put("/airport", JSON.stringify(i), {
          headers: { "Content-Type": "application/json" },
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    for (let ap of acceptTemp) {
      try {
        const response = await axios.post("/airport", JSON.stringify(ap), {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    
    for (let ap of deleteTemp) {
      try {
        const response = await axios.put(
          "/airport",
          JSON.stringify(ap),
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
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
              <section>
              <p
                className={error ? "error" : "offscreen"}
                aria-live="assertive"
              >
                {error}
              </p>
            </section>
            <button type="button" className="button-book" onClick={addRow}>
              Add
            </button>
            <table className="content-table">
              <thead>
                <tr>
                  <th>Airport ID</th>
                  <th>Airport Name</th>
                  <th>City</th>
                  <th>Status</th>
                </tr>
              </thead>

              {/* input */}
              <tbody>
                {airport.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td
                      contentEditable
                      onBlur={(e) => handleBlur(e, rowIndex, "id")}
                    >
                      {row.id}
                    </td>
                    <td
                      contentEditable
                      onBlur={(e) => handleBlur(e, rowIndex, "name")}
                    >
                      {row.name}
                    </td>
                    <td
                      contentEditable
                      onBlur={(e) => handleBlur(e, rowIndex, "city")}
                    >
                      {row.city}
                    </td>

                    <td
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        fontWeight: "bold",
                      }}
                    >
                      <select
                        className="input-box"
                        value={row.status}
                        onChange={(e) => handleAction(e, rowIndex, "status")}
                        style={{ minWidth: "2rem" }}
                      >
                        <option value={row.status}>
                          {row.status === true ? "Active" : "Inactive"}
                        </option>
                        <option value={!row.status}>
                          {!row.status === true ? "Active" : "Inactive"}
                        </option>
                        {/* <option value={true}>Active</option>
                            <option value={false}>Inactive</option> */}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <BigButton disabled={!airport.length} text="Confirm" />
          </form>
        </div>
      </div>
    </>
  );
};

export default Settings;
