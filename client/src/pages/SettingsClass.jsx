import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import BigButton from "../components/BigButton";
import axios from "../api/axios";

import { useState, useEffect } from "react";
const SettingsClass = () => {
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

  const [seat, setSeat] = useState([]);
  const [oldSeat, setOldSeat] = useState([]);
  // const [deleteSeat, setDeleteSeat] = useState([]);
  console.log(seat);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/class");
        setSeat(JSON.parse(JSON.stringify(response.data)));
        setOldSeat(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleBlur = (e, index, column) => {
    const newSeatClasses = [...seat];
    column === "multiplier"
      ? (newSeatClasses[index][column] = parseInt(e.target.textContent))
      : (newSeatClasses[index][column] = e.target.textContent);
    setSeat(newSeatClasses);
  };

  const handleAction = (e, index, column) => {
    const newData = [...seat];
    console.log(e.target.value);
    newData[index][column] = e.target.value === "true";
    setSeat(newData);
  };

  const addRow = () => {
    setSeat([...seat, { class: "", multiplier: 0, status: true }]);
  };
  // const removeRow = (index) => {
  //   const deletedSeatClass = seat[index];
  //   const newSeatClasses = seat.filter((_, i) => i !== index);
  //   setSeat(newSeatClasses);
  //   setDeleteSeat([...deleteSeat, deletedSeatClass]);
  // }

  const removeStatus = (seatClass) => {
    const updatedSeatClass = seatClass.map(({ status, ...rest }) => rest);
    return updatedSeatClass;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const old_seat = oldSeat.map(ap => JSON.stringify(ap))
    const Temp = seat.filter((seat) => !old_seat.includes(JSON.stringify(seat)));

    const fixOldSeat = removeStatus(old_seat);
    const fixSeat = removeStatus(seat);

    const test = fixSeat.filter((a) => fixOldSeat.includes(a))

    const acceptTemp = Temp.filter((seat) => seat.status === true);
    const deleteTemp = Temp.filter((seat) => seat.status === false);

    for (const seat of acceptTemp) {
      try {
        const response = await axios.post("/class", JSON.stringify(seat), {
          headers: { "Content-Type": "application/json" },
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    for (const i of test) {
      try {
        const response = await axios.put("/class", JSON.stringify(i), {
          headers: { "Content-Type": "application/json" },
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    
    for (const seat of deleteTemp) {
      try {
        const response = await axios.put("/class",
          JSON.stringify(seat),
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
            <button type="button" className="button-book" onClick={addRow}>
              Add
            </button>
            <table className="content-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Multiplier</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {seat.map((seat, index) => (
                  <tr key={index}>
                    <td
                      contentEditable
                      onBlur={(e) => handleBlur(e, index, "class")}
                    >
                      {seat.class}
                    </td>
                    <td
                      contentEditable
                      onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                          e.preventDefault();
                        }
                      }}
                      onBlur={(e) => handleBlur(e, index, "multiplier")}
                    >
                      {seat.multiplier}
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
                        value={seat.status}
                        onChange={(e) => handleAction(e, index, "status")}
                        style={{ minWidth: "4rem" }}
                      >
                        <option value={seat.status}>
                          {seat.status === true ? "Active" : "Inactive"}
                        </option>
                        <option value={!seat.status}>
                          {!seat.status === true ? "Active" : "Inactive"}
                        </option>
                        {/* <option value={true}>Active</option>
                            <option value={false}>Inactive</option> */}
                      </select>
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

export default SettingsClass;
