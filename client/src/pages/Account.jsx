import Sidebar from "../components/Sidebar";
import BigButton from "../components/BigButton";
import axios from "../api/axios";
const Account = () => {
  const Logout = async () => {
    try {
      const response = await axios.get("/logout");
      console.log(response.data);
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Sidebar />
      <div className="wrapper">
        <div className="container-box">
          <div
            className="container-white"
            style={{ flexDirection: "row", justifyContent: "center" }}
          >
            {/* <Link to="/forgot" className="big-button">Forgot</Link> */}
            <BigButton onClick={() => Logout()} text={"Logout"} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
