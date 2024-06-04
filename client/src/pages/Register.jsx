import { useRef, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "../api/axios";

import BigButton from "../components/BigButton";
import ContainerBlur from "../components/ContainerBlur";
import ContainerInput from "../components/ContainerInput";
const FULLNAME_REGEX = /^\b([A-Z][a-z]*)\b(?:\s\b[A-Z][a-z]*\b)*$/;
const USER_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
//backend api
const REGISTER_URL = "/register";

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [fullName, setFullName] = useState("");
  const [validFname, setValidFname] = useState(false);
  // const [fnameFocus, setFnameFocus] = useState(false);

  const [user, setUser] = useState("");
  const [validUser, setValidUser] = useState(false);
  // const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  // const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  // const [matchFocus, setMatchFocus] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // useEffect(() => {
  //   userRef.current.focus();
  // }, []);

  //check full name
  useEffect(() => {
    const isFname = FULLNAME_REGEX.test(fullName);

    console.log(isFname);
    console.log(fullName);

    setValidFname(isFname);
  }, [fullName]);

  // check username (gmail)
  useEffect(() => {
    const isUser = USER_REGEX.test(user);

    console.log(isUser);
    console.log(user);

    setValidUser(isUser);
  }, [user]);

  // check pwd
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
  }, [user, pwd, matchPwd]);

  // Submit done? let put on db
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        REGISTER_URL,
        JSON.stringify({ name: fullName, email: user, password: pwd }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(res?.data));
      console.log(user, pwd);
      console.log(JSON.stringify(res));
      setSuccess(true);

      // clear input after submit
    } catch (err) {
      if (!err?.response) {
        setError("Network error");
        return;
      } else if (err?.response?.status === 400) {
        setError("Missing Username or Password");
        return;
      } else if (err?.response?.status === 409) {
        setError("User already exists");
      }
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
                ref={errRef}
                className={error ? "error" : "offscreen"}
                aria-live="assertive"
              >
                {error}
              </p>
            </section>
            <form onSubmit={handleSubmit} className="all-input">
              {/* Input */}
              <ContainerInput
                label={"Full name"}
                type={"text"}
                id="fullname"
                ref={userRef}
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                // onFocus={() => setFnameFocus(true)}
                // onBlur={() => setFnameFocus(false)}
                error={
                  // should be || and checking empty on submit
                  //                                      vv
                  <p
                    id="uidnote"
                    className={fullName && !validFname ? "error" : "offscreen"}
                  >
                    Your name must be capitalized
                  </p>
                }
              />
              <ContainerInput
                label={"Gmail"}
                type={"gmail"}
                id="username"
                ref={userRef}
                onChange={(e) => setUser(e.target.value)}
                value={user}
                // onFocus={() => setUserFocus(true)}
                // onBlur={() => setUserFocus(false)}
                aria-invalid={validUser ? "false" : "true"}
                aria-describedby={"uidnote"}
                error={
                  // should be || and checking empty on submit
                  //                                     vv      vv
                  <p
                    id="uidnote"
                    className={user && !validUser ? "error" : "offscreen"}
                  >
                    Your email should be end with @gmail.com
                  </p>
                }
              />

              <ContainerInput
                label={"Password"}
                type={"password"}
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                // onFocus={() => setPwdFocus(true)}
                // onBlur={() => setPwdFocus(false)}
                aria-invalid={validPwd ? "false" : "true"}
                aria-describedby={"pwdnote"}
                error={
                  // should be || and checking empty on submit
                  //                                  vv
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
                label={"Confirm password"}
                htmlFor={"confirm_pwd"}
                type={"password"}
                id="confirm_pwd"
                onChange={(e) => setMatchPwd(e.target.value)}
                value={matchPwd}
                // onFocus={() => setMatchFocus(true)}
                // onBlur={() => setMatchFocus(false)}
                aria-invalid={validMatch ? "false" : "true"}
                aria-describedby={"confirmnote"}
                error={
                  // should be || and checking empty on submit
                  //                                        vv
                  <p
                    id="confirmnote"
                    className={matchPwd && !validMatch ? "error" : "offscreen"}
                  >
                    Password is not matching, are you American dumb?
                  </p>
                }
              />

              {/* Submit button */}
              <BigButton
                disabled={!(validFname && validUser && validPwd && validMatch)}
                text="Sign Up"
                link="/home"
                debug={[fullName, user, pwd, matchPwd]}
              />
            </form>
            <Link className="other-options" to="/login">
              <h4>Sign in</h4>
            </Link>
          </>
        }
      ></ContainerBlur>
    </div>
  );
};

export default Register;
