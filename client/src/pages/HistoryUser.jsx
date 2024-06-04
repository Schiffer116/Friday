import Sidebar from "../components/Sidebar";
import RowHistoryUser from "../components/RowHistoryUser";
import Table from "../components/Table";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

// post /confirm/:ticket_id

// delete when status is "booked"

const HistoryUser = () => {
  //   {
  //     "id": 1,
  //     "flightId": 123,
  //     "passengerName": "John Doe",
  //     "passengerId": "A123456789",
  //     "phoneNumber": "+1234567890",
  //     "class": "Economy",
  //     "passengerType": "Adult",
  //     "bookTime": 1713924000000000,
  //     "status": "Confirmed",
  //     "note": "Special meal request"
  // }

  const [history, setHistory] = useState([]);
  const [sucess, setSucess] = useState(false);

  // API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyRes = await axios.get("/user-history");

        setHistory(historyRes.data);
        historyRes.data.length > 0 ? setSucess(true) : setSucess(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const confirmRow = (index, updatedRow) => {
    setHistory((prevData) => {
      const newData = [...prevData];
      newData[index] = updatedRow;
      return newData;
    });
  };
  const requestPrice = async (flightId, ticketClass, passengerType) => {
    try {
      const res = await axios.get(
        `/price?flight-id=${flightId}&ticket-class=${ticketClass}&passenger-type=${passengerType}`
      );
      return res.data;
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
          <form className="container-white">
            {sucess ? (
              <div className="total-table">
                <Table
                  type="history"
                  title={{
                    one: "Flight ID",
                    two: "Name",
                    three: "Book Time",
                    four: "Ticket ID",
                    five: "Class",
                    six: "Status",
                    seven: "Note",
                    eight: "Price",
                    nine: "Action",
                  }}
                  render={history.map((row, index) => (
                    <RowHistoryUser
                      key={row.id}
                      dataHistory={row}
                      rowIndex={index}
                      confirmRow={confirmRow}
                      price={requestPrice}
                    />
                  ))}
                />
              </div>
            ) : (
              <h2 style={{ color: "var(--blue-title)" }}>
                You haven&apos;t booked any ticket yet
              </h2>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default HistoryUser;
