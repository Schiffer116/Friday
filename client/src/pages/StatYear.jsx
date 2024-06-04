import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import Table from "../components/Table";
import { useState } from "react";
import axios from "../api/axios";
// const test = {
//   "revenue": 65377500,
//   "months": [
//     {
//       "month": 1,
//       "flight": 2,
//       "revenue": 2692500,
//       "percent": 4
//     },
//     {
//       "month": 2,
//       "flight": 2,
//       "revenue": 3210000,
//       "percent": 5
//     },
//     {
//       "month": 3,
//       "flight": 2,
//       "revenue": 3727500,
//       "percent": 6
//     },
//     {
//       "month": 4,
//       "flight": 2,
//       "revenue": 4245000,
//       "percent": 6
//     },
//     {
//       "month": 5,
//       "flight": 2,
//       "revenue": 4762500,
//       "percent": 7
//     },
//     {
//       "month": 6,
//       "flight": 2,
//       "revenue": 5280000,
//       "percent": 8
//     },
//     {
//       "month": 7,
//       "flight": 2,
//       "revenue": 5797500,
//       "percent": 9
//     },
//     {
//       "month": 8,
//       "flight": 2,
//       "revenue": 6315000,
//       "percent": 10
//     },
//     {
//       "month": 9,
//       "flight": 2,
//       "revenue": 6832500,
//       "percent": 10
//     },
//     {
//       "month": 10,
//       "flight": 2,
//       "revenue": 7350000,
//       "percent": 11
//     },
//     {
//       "month": 11,
//       "flight": 2,
//       "revenue": 5767500,
//       "percent": 9
//     },
//     {
//       "month": 12,
//       "flight": 5,
//       "revenue": 9397500,
//       "percent": 14
//     }
//   ]
// }

const StatYear = () => {
  const [year, setYear] = useState("");
  const [dataYear, setDataYear] = useState([]);
  const [total, setTotal] = useState(0);
  const [sucess, setSucess] = useState(false);
  // const requestDataYear = (e) => {
  //   e.preventDefault();
  //   setDataYear(test['months']);
  //   setTotal(test['revenue']);

  //   console.log("here 3", dataYear)
  // }

  const requestDataYear = async (e) => {
    e.preventDefault();
    try {
      console.log(year);
      // const [year, year] = date.split("-");
      const res = await axios.get(`/revenue/${year}`);
      console.log(res.data);
      setDataYear(res.data["months"]);
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
          <div className="input-cont stat">
            <form className="all-box" onSubmit={requestDataYear}>
              <div>
                <h4>Enter year</h4>
                <input
                  type="number"
                  className="input-box"
                  onChange={(e) => setYear(e.target.value)}
                  value={year}
                ></input>
              </div>
              <div className="button-box">
                <button className="button-search" alt="enter">
                  <span className="material-symbols-outlined">search</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Table */}
        {sucess ? (
          <>
            <div className="total-table">
              <Table
                type="year"
                title={{
                  one: "No",
                  two: "Month",
                  three: "Flight",
                  four: "Total",
                  five: "Rate",
                }}
                data={dataYear}
              />
            </div>
            <h2
              style={{
                display: "flex",
                margin: "0 auto",
                justifyContent: "center",
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

export default StatYear;
