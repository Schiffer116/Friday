import { useEffect, useState, useRef } from "react";
import BigButton from "../components/BigButton";
import ContainerBlur from "../components/ContainerBlur";
import ContainerInput from "../components/ContainerInput";
import { Link, Navigate } from "react-router-dom";
import axios from "../api/axios";

const FORGOT_URL = "/forgot";
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const Forgot = () => {
  const userRef = useRef();

  const [oldPwd, setOldPwd] = useState("");

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  // const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  // const [matchFocus, setMatchFocus] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const isPwd = PWD_REGEX.test(pwd);

    console.log(isPwd);
    console.log(pwd);

    setValidPwd(isPwd);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setError("");
  }, [pwd, matchPwd]);

  // call api check
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(FORGOT_URL, {
        oldPwd: oldPwd,
        pwd: pwd,
      });
      console.log(res);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setError("Wrong password");
    }
  };

  return success ? (
    <Navigate to="/home" />
  ) : (
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
                label={"Old password"}
                type={"password"}
                ref={userRef}
                id="old-password"
                onChange={(e) => setOldPwd(e.target.value)}
                value={oldPwd}
              />
              <ContainerInput
                label={"New password"}
                type={"password"}
                ref={userRef}
                id="new-password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                error={
                  <p
                    id="pwdnote"
                    className={pwd && !validPwd ? "error" : "offscreen"}
                  >
                    <ul>
                      <li>8 to 24 characters</li>
                      <li>
                        Must be include uppercase and lowercase letter, 1 number
                        and 1 special character (!@#$%)
                      </li>
                    </ul>
                  </p>
                }
              />
              <ContainerInput
                label={"Confirm new password"}
                type={"password"}
                ref={userRef}
                id="confirm-password"
                onChange={(e) => setMatchPwd(e.target.value)}
                value={matchPwd}
                error={
                  <p
                    id="confirmnote"
                    className={matchPwd && !validMatch ? "error" : "offscreen"}
                  >
                    Password is not matching, are you American dumb?
                  </p>
                }
              />
              <BigButton
                disabled={!(validPwd && validPwd)}
                text="Confirm"
                link="/home"
              />
            </form>
            <Link className="other-options" to="/login">
              <h4>Back to sign in</h4>
            </Link>
          </>
        }
      ></ContainerBlur>
    </div>
  );
};

export default Forgot;
