// import { Link } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../api/axios";

const Sidebar = () => {
  const location = useLocation();
  const [role, setRole] = useState("customer");

  useEffect(() => {
    const requestAuth = async () => {
      try {
        const response = await axios.post("/schedule");
        setRole("admin");
        console.log("Sidebar: ", role);
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

  //   useEffect(() => {
  //     setRole("admin");
  // }, []);
  const isActive = (path) => {
    return location.pathname.includes(path) ? "active-link" : "";
  };
  return (
    <div className="sidenav">
      <ul>
        <li>
          <Link to="/home" className={isActive("/home")} alt="a">
            Search
          </Link>
        </li>
          <li>
          <Link to="/book" className={isActive("/book")} alt="a">
            Book
          </Link>
        </li>
        {role !== "customer" && (
          <>
            <li>
            <Link to="/edit" className={isActive("/edit")} alt="a">
              Edit
            </Link>
          </li>
            <li>
              <Link to="/stat" className={isActive("/stat")} alt="a">
                Statistic
              </Link>
            </li>
            <li>
              <Link to="/schedule" className={isActive("/schedule")} alt="a">
                Schedule
              </Link>
            </li>
          </>
        )}
      </ul>
      <div className="icons">
        <Link to="/account">
          <span className="material-symbols-outlined">account_circle</span>
        </Link>
        {role !== "customer" && (
          <Link to="/settings">
            <span className="material-symbols-outlined">settings</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
