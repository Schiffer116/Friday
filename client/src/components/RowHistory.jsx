import axios from "../api/axios";
import { useEffect, useState } from "react";

const RowHistory = ({ key, dataHistory, rowIndex, confirmRow }) => {
  const [price, setPrice] = useState(0);
  const handleConfirm = async (id) => {
    dataHistory.status = "confirmed";
    confirmRow(rowIndex, dataHistory);
    try {
      const res = await axios.post("/confirm", id);
      console.log(JSON.stringify(res?.data));
      console.log(JSON.stringify(res));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const requestPrice = async (flightId, ticketClass, passengerType) => {
      try {
        const res = await axios.get(
          `/price?flight-id=${flightId}&ticket-class=${ticketClass}&passenger-type=${passengerType}`
        );
        setPrice(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    requestPrice(
      dataHistory.flightId,
      dataHistory.class,
      dataHistory.passengerType
    );
  }, []);

  return (
    <tr key={key}>
      <td>{dataHistory.flightId}</td>
      <td>{dataHistory.passengerName}</td>
      <td>{dataHistory.passengerId}</td>
      <td>{new Date(dataHistory.bookTime / 1000).toLocaleDateString()}</td>
      <td>{dataHistory.id}</td>
      <td>{dataHistory.class}</td>
      <td>{dataHistory.phoneNumber}</td>
      <td>{dataHistory.status}</td>
      <td>{dataHistory.note}</td>
      <td>{price}</td>
      <td style={{ display: "flex", justifyContent: "center" }}>
        {dataHistory.status === "booked" ? (
          <button
            type="button"
            className="button-book confirm"
            onClick={() => handleConfirm(dataHistory.id)}
          >
            Confirm
          </button>
        ) : (
          <div style={{ height: "2rem" }}></div>
        )}
      </td>
    </tr>
  );
};

export default RowHistory;
