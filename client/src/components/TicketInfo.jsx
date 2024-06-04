import { Link } from "react-router-dom";
import Table from "./Table";

const TicketInfo = (props) => {
  const { ticket, role } = props;
  console.log(ticket, role);

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

  return (
    <div className="ticket-info">
      <div className="box">
        <div id={ticket.id} className="detail-flight">
          <div className="from">
            <h2>{ticket.src}</h2>
            <p>{convertDate(ticket.dateTime)}</p>
            <p></p>
          </div>
          <div className="to">
            <h2>{ticket.dst}</h2>
            <p>{convertTime(ticket.duration)}</p>
          </div>
        </div>

        <div className="saigon">
          <div className="ticket-box">
            <span className="material-symbols-outlined">airplane_ticket</span>
            <p>{ticket.emptySeat}</p>
          </div>
          <div className="button-box" style={{display: "flex", flexDirection: "row", gap: "1rem"}}>
            {role === "admin" && (
              <Link className="button-book edit" to="/edit" state={ticket}>
              Edit
            </Link>
            )}
            <Link className="button-book" to="/book" state={ticket}>
              Book
            </Link>
          </div>
        </div>
      </div>
      {ticket.layovers.length !== 0 && (
        <div className="layover">
          <Table
            type="layover"
            color="var(--blue-button)"
            title={{
              one: "No",
              two: "Airport",
              three: "Duration",
              four: "Note",
            }}
            data={ticket}
          />
        </div>
      )}
    </div>
  );
};

export default TicketInfo;
