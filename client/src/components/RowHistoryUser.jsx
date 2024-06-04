import axios from "../api/axios";
import { useEffect, useState } from "react";

const RowHistoryUser = ({ key, dataHistory, rowIndex, confirmRow }) => {
  const handleConfirm = async (id) => {
    dataHistory.status = "cancelled";
    confirmRow(rowIndex, dataHistory);
    try {
      const res = await axios.post(`/cancel/${id}`);
      console.log(JSON.stringify(res?.data));
      console.log(JSON.stringify(res));
    } catch (error) {
      console.log(error);
    }
  };

  const [price, setPrice] = useState(0);
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
      <td>{new Date(dataHistory.bookTime / 1000).toLocaleDateString()}</td>
      <td>{dataHistory.id}</td>
      <td>{dataHistory.class}</td>
      <td>{dataHistory.status}</td>
      <td>{dataHistory.note}</td>
      <td>{price}</td>
      <td style={{ display: "flex", justifyContent: "center" }}>
        {dataHistory.status !== "cancelled" ? (
          <button
            type="button"
            className="button-book remove"
            onClick={() => handleConfirm(dataHistory.id)}
          >
            Cancel
          </button>
        ) : (
          <div style={{ height: "2rem" }}></div>
        )}
      </td>
    </tr>
  );
};

export default RowHistoryUser;
