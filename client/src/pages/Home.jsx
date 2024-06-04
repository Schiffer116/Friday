import Sidebar from "../components/Sidebar";
import TicketInfo from "../components/TicketInfo";
import axios from "../api/axios";
import { useState, useEffect } from "react";
import useCities from "../components/useCities";
const FLIGHTS_URL = "/schedule";
// const FROMS = [
//   { airport: 1, city: "Hanoi" },
//   { airport: 2, city: "Ho Chi Minh" },
//   { airport: 3, city: "Da Nang" },
//   { airport: 4, city: "Hue" },
//   { airport: 5, city: "Nha Trang" },
//   { airport: 6, city: "Phu Quoc" },
//   { airport: 7, city: "Vung Tau" },
// ];
// const TOS = FROMS;

// // // api city list
// const test = [
//   {
//     "id": 12,
//     "price": 200,
//     "src": "LAX",
//     "dst": "JFK",
//     "dateTime": 1700031600000000,
//     "duration": 21600000000,
//     "seatCount": [
//       {
//         "class": "1",
//         "count": 0
//       },
//       {
//         "class": "2",
//         "count": 0
//       }
//     ],
//     "layovers": [
//       {
//         "airportId": "ORD",
//         "ord": 1,
//         "duration": 720000000,
//         "note": "Layover at O'Hare International Airport"
//       }
//     ],
//     "bookedSeat": 5,
//     "emptySeat": 75
//   },
//   {
//     "id": 13,
//     "price": 220,
//     "src": "BOS",
//     "dst": "SFO",
//     "dateTime": 1700031600000000,
//     "duration": 21600000000,
//     "seatCount": [
//       {
//         "class": "1",
//         "count": 0
//       },
//       {
//         "class": "2",
//         "count": 0
//       }
//     ],
//     "layovers": [
//     ],
//     "bookedSeat": 7,
//     "emptySeat": 73
//   },
//   {
//     "id": 14,
//     "price": 240,
//     "src": "MIA",
//     "dst": "SEA",
//     "dateTime": 1700031600000000,
//     "duration": 21600000000,
//     "seatCount": [
//       {
//         "class": "1",
//         "count": 0
//       },
//       {
//         "class": "2",
//         "count": 0
//       }
//     ],
//     "layovers": [
//       {
//         "airportId": "ATL",
//         "ord": 1,
//         "duration": 720000000,
//         "note": "Layover at Hartsfield-Jackson Atlanta International Airport"
//       }
//     ],
//     "bookedSeat": 9,
//     "emptySeat": 71
//   }
// ]

const Home = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);
  const [sucess, setSucess] = useState(false);
  const [role, setRole] = useState("customer");

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setResults(test);
  // };

  // useEffect(() => {
  //   setRole("admin");
  // }, []);

  function convertDateTime(dateString) {
    const date = new Date(dateString / 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const requestAuth = async () => {
      try {
        const response = await axios.post("/schedule");
        setRole("admin");
        console.log("Home, ", role);
      } catch (error) {
        if (error.response.status === 401) {
          console.log("Sidebar unauthorized");
          setRole("customer");
        } else {
          setRole("admin");
        }
      }
    };
    requestAuth();
  }, []);

  // *----- Get cities from api
  const FROMS = useCities();
  const TOS = FROMS;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(FLIGHTS_URL);
      console.log(from, to, date);
      const fromAirport = FROMS.find((city) => city.city === from)?.id;
      const toAirport = TOS.find((city) => city.city === to)?.id;
      // const inputDateInMicroseconds = new Date(date).getTime() * 1000; // convert date to microseconds
      let filteredData = res.data;

      if (fromAirport) {
        filteredData = filteredData.filter((item) => item.src === fromAirport);
      }
      if (toAirport) {
        filteredData = filteredData.filter((item) => item.dst === toAirport);
      }
      if (date) {
        filteredData = filteredData.filter(
          (item) => convertDateTime(item.dateTime) === date
        );
      }

      setResults(filteredData);
      setSucess(true);
      console.log("Data received in Home:", filteredData);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Sidebar />
      <div className="wrapper">
        {/* Input  */}
        <form onSubmit={handleSubmit} className="all-box">
          <div className="search-bar">
            <div className="input-cont">
              <p>From</p>
              <select
                className="from-input"
                onChange={(e) => setFrom(e.target.value)}
                value={from}
              >
                <option />
                {FROMS.map((city) => (
                  <option key={city.id} value={city.city}>
                    {city.city}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-cont">
              <p>To</p>
              <select
                className="to-input"
                onChange={(e) => setTo(e.target.value)}
                value={to}
              >
                <option />

                {TOS.map((city) => (
                  <option key={city.id} value={city.city}>
                    {city.city}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-cont">
              <p>Date</p>
              <input
                className="date-input"
                type="date"
                onChange={(e) => setDate(e.target.value)}
                value={date}
              />
            </div>
          </div>

          <div className="button-box">
            <button className="button-search">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
        </form>

        {/* Results */}
        {sucess ? (
          <div className="title-cont">
            <h1 className="results"> RESULTS</h1>
          </div>  
        ) : null}
        <div className="content-box">
          {results.map((result) => (
            //*------ Ticket information here
            <TicketInfo key={result.id} ticket={result} role={role} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
