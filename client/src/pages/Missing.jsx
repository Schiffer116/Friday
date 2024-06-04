import { Link } from "react-router-dom";
const Missing = () => {
  return (
    <div className="structure" style={{ width: "100vw", padding: "10rem" }}>
      <div className="container-white" style={{ margin: "0 auto" }}>
        <div className="row">
          <div className="col-12 text-center">
            <h1 style={{ color: "var(--blue-title)" }}>Missing</h1>
            <p>You are lost into the Shadow Realm.</p>
            <Link to="/home" className="big-button">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Missing;
