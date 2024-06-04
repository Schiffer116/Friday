import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import BigButton from "../components/BigButton";
import useSeatClass from "../components/useSeatClass";
import useCities from "../components/useCities";

const SCHEDULE_URL = "/schedule";
const Schedule = () => {
  useEffect(() => {
    const requestAuth = async () => {
      try {
        const response = await axios.post("/schedule");
        console.log(response);
      } catch (error) {
        if (error.response.status === 401) {
          console.log("Unauthorized");
          window.location.href = "/unauthorized";
        }
      }
    };
    requestAuth();
  }, []);

  const temp = useSeatClass();
  const TITLES = temp.map((seatClass) => seatClass.class);
  const FROMS = useCities();
  // const FROMS = [
  //     {
  //       "airport": "AMS",
  //       "name": "Schiphol Airport",
  //       "city": "Amsterdam",
  //       "status": true
  //     },
  //     {
  //       "airport": "CDG",
  //       "name": "Charles de Gaulle Airport",
  //       "city": "Paris",
  //       "status": true
  //     },
  //     {
  //       "airport": "LHR",
  //       "name": "Heathrow Airport",
  //       "city": "London",
  //       "status": true
  //     },
  //     {
  //       "airport": "FRA",
  //       "name": "Frankfurt Airport",
  //       "city": "Frankfurt",
  //       "status": true
  //     }
  // ]
  const TOS = FROMS;

  const [transAirport, setTransAirport] = useState([]);
  const [date, setDate] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [seatClass, setSeatClass] = useState(Array(TITLES.length).fill(0));
  const [error, setError] = useState("");
  const [sucess, setSucess] = useState(false);

  const handleBlur = (e, rowIndex, column) => {
    const newData = [...transAirport];
    newData[rowIndex][column] = e.target.textContent;
    setTransAirport(newData);
  };
  const handleAirportId = (e, rowIndex, column) => {
    const newData = [...transAirport];
    newData[rowIndex][column] = e.target.value;
    setTransAirport(newData);
  };

  const findAirport = (city) => {
    const cityObj = FROMS.find((item) => item.city === city);
    return cityObj ? cityObj.id : null;
  };
  const convertToMicro = (duration) => {
    if (duration < 100000) {
      return Number(duration) * 60 * 1000000;
    } else {
      return Number(duration);
    }
  };

  const convertToUnixTime = (datetimeLocalString) => {
    const [datePart, timePart] = datetimeLocalString.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);
    const dateInMicroseconds = Date.UTC(year, month - 1, day, hour, minute) * 1000;
    return dateInMicroseconds;
  };

  const addRow = () => {
    setTransAirport([
      ...transAirport,
      { airportId: "", ord: "", duration: "", note: "" },
    ]);
    setSucess(true);
  };
  const removeRow = (index) => {
    const newData = [...transAirport];
    newData.splice(index, 1);
    setTransAirport(newData);
    newData.length === 0 && setSucess(false);
  };

  const sendSchedule = async (e) => {
    e.preventDefault();
    const seatCount = TITLES.map((seat, index) => ({
      class: seat,
      count: seatClass[index],
    }));
    const test = JSON.stringify({
      price: Number(price),
      src: findAirport(from),
      dst: findAirport(to),
      dateTime: convertToUnixTime(date),
      duration: convertToMicro(duration),
      seatCount: seatCount,
      layovers: transAirport.map((row, index) => ({
        ord: index + 1,
        airportId: row.airportId,
        duration: convertToMicro(Number(row.duration)),
        note: row.note,
      })),
    });
    console.log(test);
    try {
      // Get api here
      const res = await axios.post(SCHEDULE_URL, test, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(JSON.stringify(res?.data));
      console.log(JSON.stringify(res));
      setDate("");
      setFrom("");
      setTo("");
      setPrice("");
      setTransAirport([]);

      setSeatClass(Array(TITLES.length).fill(0));
      setDuration("");
      // clear input after submit
    } catch (err) {
      console.log(err);
      setError(err.response.data);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="wrapper">
        <div className="container-box">
          <form onSubmit={sendSchedule} className="container-white">
          <section>
              <p
                className={error ? "error" : "offscreen"}
                aria-live="assertive"
              >
                {error}
              </p>
            </section>
            <h2 className="title-cont">Add flights</h2>
            <div style={{ display: "flex" }}>
              <div className="schedule-column">
                <div className="input-cont row">
                  <h4>Date</h4>
                  <input
                    type="datetime-local"
                    className="input-box"
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                  />
                </div>
                <div className="input-cont row">
                  <h4>From</h4>
                  <select
                    className="input-box"
                    onChange={(e) => setFrom(e.target.value)}
                    value={from}
                    required
                  >
                    <option />
                    {FROMS.map((city) => (
                      <option key={city.city} value={city.city}>
                        {city.city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-cont row">
                  <h4>To</h4>
                  <select
                    className="input-box"
                    onChange={(e) => setTo(e.target.value)}
                    value={to}
                    required
                  >
                    <option />
                    {TOS.map((city) => (
                      <option key={city.city} value={city.city}>
                        {city.city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="schedule-column">
                <div className="input-cont row">
                  <h4>Price</h4>
                  <input
                    type="number"
                    className="input-box"
                    style={{ width: "8rem" }}
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                  />
                </div>
                <div className="input-cont row">
                  <h4>Duration (min)</h4>
                  <input
                    type="number"
                    className="input-box"
                    placeholder="number"
                    style={{ width: "8rem" }}
                    onChange={(e) => setDuration(e.target.value)}
                    value={duration}
                  />
                </div>
                {TITLES.map((title, index) => (
                  <div className="input-cont row" key={index}>
                    <h4>Seat: {title}</h4>
                    <input
                      type="number"
                      className="input-box"
                      style={{ width: "8rem" }}
                      placeholder="number"
                      onChange={(e) => {
                        const newSeatClass = [...seatClass];
                        newSeatClass[index] = Number(e.target.value);
                        setSeatClass(newSeatClass);
                      }}
                      value={seatClass[index]}
                    />
                  </div>
                ))}
              </div>
            </div>

            <h2 className="title-cont">Add transit airport</h2>
            <div
              style={{
                margin: "0 auto",
                paddingBottom: "2rem",
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
              }}
            >
              <button type="button" className="button-book" onClick={addRow}>
                Add
              </button>
            </div>

            {sucess ? (
              <table className="content-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Airport</th>
                    <th>Stop time</th>
                    <th>note</th>
                    <th>Action</th>
                  </tr>
                </thead>

                {/* input */}
                <tbody>
                  {transAirport.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>{rowIndex + 1}</td>
                      <td>
                        <select
                          className="input-box"
                          style={{ minWidth: "6rem" }}
                          onChange={(e) =>
                            handleAirportId(e, rowIndex, "airportId")
                          }
                        >
                          <option />
                          {FROMS.map((ap, index) => (
                            <>
                              <option key={index} value={ap.id}>
                                {ap.id}
                              </option>
                            </>
                          ))}
                        </select>
                      </td>
                      <td
                        contentEditable
                        onBlur={(e) => handleBlur(e, rowIndex, "duration")}
                      >
                        {row.duration}
                      </td>
                      <td
                        contentEditable
                        onBlur={(e) => handleBlur(e, rowIndex, "note")}
                      >
                        {row.note}
                      </td>
                      <td style={{ display: "flex", justifyContent: "center" }}>
                        <button
                          type="button"
                          className="button-book remove"
                          onClick={() => removeRow(rowIndex)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
            <div style={{ margin: "0 auto" }}>
              <BigButton
                disabled={
                  !(
                    (date && from && to && price)
                    // seatClass.length
                  )
                }
                text="Add flight"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Schedule;
