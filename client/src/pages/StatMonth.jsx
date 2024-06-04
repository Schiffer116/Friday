import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import Table from "../components/Table";

import { useState, useEffect } from "react";
import axios from "../api/axios";
const MONTHS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
// const test = {
//   "revenue": 8820000,
//   "flights": [
//       {
//           "id": 38,
//           "ticketCount": 2,
//           "revenue": 2835000,
//           "percent": 100
//       },
//       {
//           "id": 40,
//           "ticketCount": 4,
//           "revenue": 3045000,
//           "percent": 100
//       },
//       {
//           "id": 39,
//           "ticketCount": 2,
//           "revenue": 2940000,
//           "percent": 100
//       }
//   ]
// }

const StatMonth = () => {
  useEffect(() => {
    const requestAuth = async () => {
      try {
        const response = await axios.post("/schedule");
        console.log(response.data);
      } catch (error) {
        if (error.response.status === 401) {
          console.log("Unauthorized");
          window.location.href = "/unauthorized";
        }
      }
    };
    requestAuth();
  }, []);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [dataMonth, setDataMonth] = useState([]);
  const [total, setTotal] = useState(0);
  const [sucess, setSucess] = useState(false);

  // const requestDataMonth = (e) => {
  //   e.preventDefault();
  //   setDataMonth(test['flights']);
  //   setTotal(test['revenue']);

  //   console.log("here 3", dataMonth)
  // }
  const requestDataMonth = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.get(`/revenue/${year}/${month}`);

      console.log(res.data);
      setDataMonth(res.data["flights"]);
      setTotal(res.data["revenue"]);
      setSucess(true);
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
            <Link className="choice" to="/stat/month">
              Month
            </Link>
            <Link className="choice" to="/stat/year">
              Year
            </Link>
          </div>
        </div>

        {/* Input */}
        <div className="all-input">
          <form className="all-box" onSubmit={requestDataMonth}>
            <div>
              <h4>Enter year</h4>
              <input
                type="number"
                className="input-box"
                onChange={(e) => setYear(e.target.value)}
                value={year}
              ></input>
            </div>
            <div>
              <h4>Choose month</h4>
              <select
                style={{ width: "10rem" }}
                className="input-box"
                onChange={(e) => setMonth(e.target.value)}
                value={month}
              >
                <option />
                {MONTHS.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="button-box">
              <button className="button-search" alt="enter">
                <span className="material-symbols-outlined">search</span>
              </button>
            </div>
          </form>
        </div>

        {/* Table */}
        {sucess ? (
          <>
            <div className="total-table">
              <Table
                type="month"
                title={{
                  one: "No",
                  two: "Flight",
                  three: "Seat",
                  four: "Total",
                  five: "Rate",
                }}
                data={dataMonth}
              />
            </div>
            <h2
              className="container-white"
              style={{
                display: "flex",
                margin: "0 auto",
                justifyContent: "center",
                alignItems: "center",
                width: "18rem",
              }}
            >
              Total: {total}
            </h2>
          </>
        ) : null}
      </div>
    </>
  );
};

export default StatMonth;
