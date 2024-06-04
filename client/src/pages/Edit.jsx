import Sidebar from "../components/Sidebar";
import { useLocation } from "react-router-dom";

import { useEffect, useState } from "react";
import axios from "../api/axios";
import BigButton from "../components/BigButton";
import useSeatClass from "../components/useSeatClass";
import useCities from "../components/useCities";
const SCHEDULE_URL = "/schedule";

// {
//   "id": 2
//     "price": 1,
//     "src": "SGN",
//     "dst": "HAN",
//     "dateTime": 1716681600,
//     "duration": 3600000000,
//     "seatCount": [
//       {
//         "class": "2",
//         "count": 2
//       },
//       {
//         "class": "1",
//         "count": 3
//       },
//       {
//         "class": "busines",
//         "count": 4
//       }
//     ],
//     "layovers": [
//       {
//         "ord": 1,
//         "airportId": "CDG",
//         "duration": "2",
//         "note": "slow"
//       }
//     ]
//   }

const Edit = () => {
  const convertTime = (time) => {
    console.log(time);
    const seconds = time / 1e6;
    return [
      Math.floor(seconds / 3600),
      "h",
      Math.floor((seconds % 3600) / 60) === 0
        ? null
        : Math.floor((seconds % 3600) / 60),
    ];
  };

  const convertDate = (date) => {
    let newDate = new Date(date / 1000);
    let formattedDate = newDate.toLocaleString("en-US", {
      timeZone: "Asia/Bangkok",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    return formattedDate;
  };
  // save to localStorage for later
  const location = useLocation();
  console.log(location.state);
  //   const history = useHistory();
  const [ticketBooked, setTicketBooked] = useState({});
  const temp = useSeatClass();
  const TITLES = temp.map((seatClass) => seatClass.class);
  const FROMS = useCities();
  const TOS = FROMS;

  const [date, setDate] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [transAirport, setTransAirport] = useState([]);
  const [seatClass, setSeatClass] = useState(Array(TITLES.length).fill(0));

  useEffect(() => {
    setError("");
  }, [date, from, to, price, duration, transAirport, seatClass]);

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

  const convertToMinutes = (time) => {
    if (time > 100000) {
      return time / 60 / 1000000;
    } else {
      return time;
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
  function convertToDateTimeLocal(microseconds) {
    const date = new Date(microseconds / 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hour}:${minute}`;
  }

  useEffect(() => {
    if (location.state !== null) {
      localStorage.setItem("ticket", JSON.stringify(location.state));
      console.log("Set ticket booked", location.state);
      setTicketBooked(location.state);
    } else if (localStorage.getItem("ticket")) {
      console.log("Get ticket booked", location.state);
      setTicketBooked(JSON.parse(localStorage.getItem("ticket")));
    }
    console.log(ticketBooked);
  }, [location.state]);

  useEffect(() => {
    if (ticketBooked) {
      console.log(ticketBooked);
      setDate(convertToDateTimeLocal(ticketBooked.dateTime));
      setFrom(ticketBooked.src);
      setTo(ticketBooked.dst);
      setPrice(ticketBooked.price);
      setDuration(convertToMinutes(ticketBooked.duration));
      setTransAirport(ticketBooked.layovers ? ticketBooked.layovers : []);
      console.log("Duration edit", duration);
      setSeatClass(
        ticketBooked.seatCount
          ? ticketBooked.seatCount.map((seat) => Number(seat.class))
          : null
      );
    }
  }, [ticketBooked]);

  useEffect(() => {
    if (transAirport.length > 0) {
      setSucess(true);
    }
  }, [transAirport]);

  // useEffect(() => {
  //   if (location.state !== null) {
  //     localStorage.setItem("ticket", JSON.stringify(location.state));
  //     console.log("Set ticket booked", location.state);
  //     setTicketBooked(location.state);
  //   }
  // }, [location.state]);

  console.log("Tiket id", ticketBooked);
  const onRemove = async () => {
    try {
      const res = await axios.delete(SCHEDULE_URL, {
        data: ticketBooked.id,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(JSON.stringify(res?.data));
      console.log(JSON.stringify(res));
      localStorage.removeItem("ticket");
      window.history.replaceState({}, "");
      window.location.reload();
    } catch (err) {
      console.log(err);
      setError("Can't remove flight that already have tickets");
    }
  };

  const handleSubmit = async (e) => {
    const seatCount = TITLES.map((seat, index) => ({
      class: seat,
      count: seatClass[index],
    }));
    const test = JSON.stringify({
      id: ticketBooked.id,
      price: Number(price), 
      src: from,
      dst: to,
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
    e.preventDefault();
    try {
      // Get api here
      const res = await axios.put(SCHEDULE_URL, test, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(JSON.stringify(res?.data));
      console.log(JSON.stringify(res));
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
          <form className="container-white" onSubmit={handleSubmit}>
            <section>
              <p
                className={error ? "error" : "offscreen"}
                aria-live="assertive"
              >
                {error}
              </p>
            </section>
            {ticketBooked === null || Object.keys(ticketBooked).length === 0 ? (
              <h1 style={{ margin: "0 auto" }}>
                You haven&apos;t chosen any flight yet
              </h1>
            ) : (
              <div>
                <div className="path">
                  <div className="From">
                    <h2>{ticketBooked.src}</h2>

                    <p>
                      {convertDate(ticketBooked.dateTime)
                        .split(",")
                        .slice(0, -1)}
                    </p>
                    <p>
                      {convertDate(ticketBooked.dateTime).split(",").slice(-1)}
                    </p>
                  </div>
                  <div className="plane-dot-box">
                    <div className="plane-box">
                      <span className="material-symbols-outlined">travel</span>
                    </div>
                    <div className="illu-box">
                      <span className="dot"></span>
                      <hr />
                      <span className="dot"></span>
                    </div>
                  </div>
                  <div className="To">
                    <h2>{ticketBooked.dst}</h2>
                    <p>Duration: {convertTime(ticketBooked.duration)}</p>
                    <p>
                      Seat total:{" "}
                      {ticketBooked.emptySeat + ticketBooked.bookedSeat}
                    </p>
                  </div>
                </div>

                {/**-------------- Edit information */}
                <div className="content-box">
                  <div className="pass-box">
                    <h2>Edit information</h2>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div className="schedule-column">
                    <div className="input-cont row">
                      <h4>Date</h4>
                      <input
                        type="datetime-local"
                        className="input-box"
                        style={{ width: "10rem" }}
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
                          <option key={city.city} value={city.id}>
                            {city.id}
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
                          <option key={city.city} value={city.id}>
                            {city.id}
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
                <h2 className="title-cont">Transit airport {}</h2>
                <div
                  style={{
                    margin: "0 auto",
                    paddingBottom: "2rem",
                    display: "flex",
                    flexDirection: "row",
                    gap: "1rem",
                    justifyContent: "center",
                  }}
                >
                  <button
                    type="button"
                    className="button-book"
                    onClick={addRow}
                  >
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
                              value={transAirport[rowIndex]["airportId"]}
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
                            {convertToMinutes(row.duration)}
                          </td>
                          <td
                            contentEditable
                            onBlur={(e) => handleBlur(e, rowIndex, "note")}
                          >
                            {row.note}
                          </td>
                          <td
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
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
                <div className="content-box"></div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2rem",
                  }}
                >
                  <a>
                    <button
                      type="button"
                      onClick={() => onRemove()}
                      className={"big-button remove"}
                    >
                      Remove flight
                    </button>
                  </a>
                  <BigButton disabled={false} text="Confirm" />
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Edit;
