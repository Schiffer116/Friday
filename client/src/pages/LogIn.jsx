import BigButton from "../components/BigButton";
import ContainerBlur from "../components/ContainerBlur";
import ContainerInput from "../components/ContainerInput";

import AuthContext from "../context/AuthProvider";
import { useRef, useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { Link, Navigate } from "react-router-dom";
const LOGIN_URL = "/login";

// useRef for focusing
const LogIn = () => {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    setError("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    console.log("submit");
    e.preventDefault();
    try {
      console.log("try");
      const res = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email: user, password: pwd }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(res?.data));
      setAuth({ user, pwd });
      setUser("");
      setPwd("");
      setSuccess(true);
    } catch (err) {
      console.log(err);
      console.log(err.message);
      setError(err.message);
    }
  };
  return (
    <>
      {success ? <Navigate to="/home" /> : null}
      <div className="middle">
        <ContainerBlur
          render={
            <>
              <section>
                <p
                  className={error ? "error" : "offscreen"}
                  aria-live="assertive"
                >
                  {error}
                </p>
              </section>
              <form onSubmit={handleSubmit} className="all-input">
                <ContainerInput
                  label={"Email"}
                  type={"email"}
                  id="username"
                  ref={userRef}
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                />

                <ContainerInput
                  label={"Password"}
                  type={"password"}
                  id="password"
                  ref={userRef}
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                />

                <BigButton text="Sign in" />
              </form>
              <Link className="other-options" to="/register">
                <h4>Create an account</h4>
              </Link>
            </>
          }
        ></ContainerBlur>
        {/* <Link className="forgot" to="/forgot">
        <h4>Forgot password?</h4>
      </Link> */}
      </div>
    </>
  );
};

export default LogIn;
