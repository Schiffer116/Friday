import Sidebar from "../components/Sidebar";
import RowHistory from "../components/RowHistory";
import Table from "../components/Table";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

// post /confirm/:ticket_id

// delete when status is "booked"

const HistoryAdmin = () => {
  // useEffect(() => {
  //   setHistory([{
  //     "id": 1,
  //     "bookEmail": "john.doe@example.com",
  //     "flightId": 12312,
  //     "passengerName": "John Doe",
  //     "passengerId": "A123456789",
  //     "phoneNumber": "+1234567890",
  //     "class": "Economy",
  //     "passengerType": "Adult",
  //     "bookTime": 1713924000000000,
  //     "status": "Booked",
  //     "note": "Special meal request",
  //     "price": 1000000
  //   },
  //   {
  //     "id": 1,
  //     "bookEmail": "john.doe@example.com",
  //     "flightId": 12312,
  //     "passengerName": "John Doe",
  //     "passengerId": "A123456789",
  //     "phoneNumber": "+1234567890",
  //     "class": "Economy",
  //     "passengerType": "Adult",
  //     "bookTime": 1713924000000000,
  //     "status": "Confirmed",
  //     "note": "Special meal request",
  //     "price": 1000000
  //   }
  // ]);
  // }, []);

  const [history, setHistory] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyRes = await axios.get("/full-history");

        setHistory(historyRes.data);
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
            <div className="total-table">
              <Table
                type="history"
                title={{
                  one: "Flight ID",
                  two: "Name",
                  three: "CCCD",
                  four: "Book Time",
                  five: "Ticket ID",
                  six: "Class",
                  seven: "Phone Number",
                  eight: "Status",
                  nine: "Note",
                  ten: "Price",
                  eleven: "Action",
                }}
                render={history.map((row, index) => (
                  <RowHistory
                    key={row.id}
                    dataHistory={row}
                    rowIndex={index}
                    confirmRow={confirmRow}
                  />
                ))}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default HistoryAdmin;
