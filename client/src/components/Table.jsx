const Table = ({ border, color, type, title, data, render }) => {
  console.log("here", type, title, data, render);
  return (
    <table
      style={type === "layover" ? { minWidth: "90%" } : {}}
      className="content-table"
    >
      <thead style={{ backgroundColor: color, border: border }}>
        <tr>
          <th>{title.one}</th>
          <th>{title.two}</th>
          <th>{title.three}</th>
          <th>{title.four}</th>
          {title.five === undefined ? null : <th>{title.five}</th>}
          {title.six === undefined ? null : <th>{title.six}</th>}
          {title.seven === undefined ? null : <th>{title.seven}</th>}
          {title.eight === undefined ? null : <th>{title.eight}</th>}
          {title.nine === undefined ? null : <th>{title.nine}</th>}
          {title.ten === undefined ? null : <th>{title.ten}</th>}
          {title.eleven === undefined ? null : <th>{title.eleven}</th>}
        </tr>
      </thead>

      {/* get api, count number of ticket, .map()*/}
      {console.log(type === "month")}
      <tbody>
        {type === "month" ? (
          <RowsMonth dataMonth={data} />
        ) : type === "year" ? (
          <RowsYear dataYear={data} />
        ) : type === "layover" ? (
          <RowsLayer dataLayer={data.layovers} />
        ) : (
          render
        )}
      </tbody>
    </table>
  );
};
const convertToMin = (duration) => {
  return Number(duration) / 60 / 1000000;
};

const RowsLayer = ({ dataLayer }) => {
  console.log("here layer", dataLayer);
  return (
    <>
      {dataLayer === undefined
        ? null
        : dataLayer.map((row, index) => (
            <tr key={index}>
              <td>{row.ord}</td>
              <td>{row.airportId}</td>
              <td>{convertToMin(row.duration)}</td>
              <td style={{ maxWidth: "6rem" }}>{row.note}</td>
            </tr>
          ))}
    </>
  );
};
const RowsMonth = ({ dataMonth }) => {
  console.log("here month", dataMonth);
  return (
    <>
      {dataMonth === undefined
        ? null
        : dataMonth.map((row, index) => (
            <tr key={row.id}>
              <td>{index}</td>
              <td>{row.id}</td>
              <td>{row.ticketCount}</td>
              <td>{row.revenue}</td>
              <td>{row.percent}</td>
            </tr>
          ))}
    </>
  );
};

const RowsYear = ({ dataYear }) => {
  console.log("here year", dataYear);
  return (
    <>
      {dataYear === undefined
        ? null
        : dataYear.map((row, index) => (
            <tr key={row.month}>
              <td>{index}</td>
              <td>{row.month}</td>
              <td>{row.flight}</td>
              <td>{row.revenue}</td>
              <td>{row.percent}</td>
            </tr>
          ))}
    </>
  );
};

export default Table;
