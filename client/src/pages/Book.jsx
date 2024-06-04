import Sidebar from "../components/Sidebar";
import { Link, useLocation } from "react-router-dom";

import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import BigButton from "../components/BigButton";
import useSeatClass from "../components/useSeatClass";

const BOOKS_URL = "/book";

const Book = () => {
  // save to localStorage for later
  const location = useLocation();
  //   const history = useHistory();
  const temp = useSeatClass();
  const SEAT_CLASSES = temp.map((seatClass) => seatClass.class);
  const errRef = useRef();
  
  const [ticketBooked, setTicketBooked] = useState({});
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [CCCD, setCCCD] = useState("");
  const [phone, setPhone] = useState("");
  const [ticketClass, setTicketClass] = useState("");
  const [passengerType, setPassengerType] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state !== null) {
      localStorage.setItem("ticket", JSON.stringify(location.state));
      console.log("Set ticket booked", location.state);
      setTicketBooked(location.state);
    } else if (localStorage.getItem("ticket")) {
      console.log("Get ticket booked", location.state);
      setTicketBooked(JSON.parse(localStorage.getItem("ticket")));
    }
  }, [location.state]);

  // useEffect(() => {
  //   if (location.state !== null) {
  //     localStorage.setItem("ticket", JSON.stringify(location.state));
  //     console.log("Set ticket booked", location.state);
  //     setTicketBooked(location.state);
  //   }
  // }, [location.state]);

  console.log("Tiket id", ticketBooked);
  console.log("Seat class:", ticketClass);
  const onRemove = () => {
    localStorage.removeItem("ticket");
    window.history.replaceState({}, "");
    window.location.reload();
  };

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
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      flightId: ticketBooked.id,
      passengerId: CCCD,
      name: name,
      phone: phone,
      class: ticketClass,
      passengerType: passengerType,
      note: note,
    };

    try {
      const res = await axios.post(BOOKS_URL, JSON.stringify(formData), {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(res.data);
      onRemove();
    } catch (error) {
      console.error(error);
      setError(error.response.data);
    }
  };

  useEffect(() => {
    usePrice();
  }, [passengerType, ticketClass]);
  const usePrice = async () => {
    try {
      const res = await axios.get(
        `/price?flight-id=${ticketBooked.id}&ticket-class=${ticketClass}&passenger-type=${passengerType}`
      );
      console.log(JSON.stringify(res?.data));
      setPrice(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Sidebar />
      <div className="wrapper">
        <div className="choices-box">
          <div className="choices">
            <Link className="choice" to="/book">
              Book
            </Link>
            <Link className="choice" to="/book/history">
              History
            </Link>
          </div>
        </div>
        <div className="container-box">
          <form className="container-white" onSubmit={handleSubmit}>
            {ticketBooked === null || Object.keys(ticketBooked).length === 0 ? (
              <h1 style={{ margin: "0 auto" }}>
                You haven&apos;t chosen any ticket yet
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
                    <p>Seat left: {ticketBooked.emptySeat}</p>
                  </div>
                </div>
                <div className="content-box">
                  <div className="pass-box">
                    <h2>Passenger information</h2>
                  </div>
                </div>
                <section>
                  <p
                    ref={errRef}
                    className={error ? "error" : "offscreen"}
                    aria-live="assertive"
                  >
                    {error}
                  </p>
                </section>
                <div className="input-row">
                  <div>
                    <h4>Phone number</h4>
                    <input
                      type="number"
                      placeholder="Phone number"
                      className="input-box"
                      onChange={(e) => setPhone(e.target.value)}
                      value={phone}
                      required
                    />
                  </div>
                  <div>
                    <h4>Full name</h4>
                    <input
                      type="text"
                      placeholder="Full name"
                      className="input-box"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      required
                    />
                  </div>
                  <div>
                    <h4>Seat class</h4>
                    <select
                      className="input-box"
                      onChange={(e) => setTicketClass(e.target.value)}
                      value={ticketClass}
                    >
                      <option />
                      {SEAT_CLASSES.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="input-row">
                  <div>
                    <h4>CCCD</h4>
                    <input
                      type="text"
                      placeholder="CCCD"
                      className="input-box"
                      onChange={(e) => setCCCD(e.target.value)}
                      value={CCCD}
                      required
                    />
                  </div>
                  <div>
                    <h4>Passenger type</h4>
                    <select
                      className="input-box"
                      onChange={(e) => setPassengerType(e.target.value)}
                      value={passengerType}
                    >
                      <option />
                      {["adult", "child", "infant"].map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <h4>Note</h4>
                    <input
                      type="text"
                      placeholder="Note"
                      className="input-box"
                      onChange={(e) => setNote(e.target.value)}
                      value={note}
                      required
                    />
                  </div>
                </div>
                <div className="content-box">
                  <h2>Price: {price}</h2>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2rem",
                  }}
                >
                  <BigButton
                    className="remove"
                    disabled={false}
                    text="Remove"
                    onClick={() => onRemove()}
                  />
                  <BigButton disabled={false} text="Add ticket" />
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Book;
