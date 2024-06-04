import React from "react";
import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";

import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import StatMonth from "./pages/StatMonth";
import StatYear from "./pages/StatYear";
import Schedule from "./pages/Schedule";
import Book from "./pages/Book";
import Edit from "./pages/Edit";
import Layout from "./pages/Layout";
import History from "./pages/History";
import Account from "./pages/Account";
import Unauthorized from "./pages/Unauthorized";
import Settings from "./pages/Settings";
import SettingsPara from "./pages/SettingsPara";
import SettingsClass from "./pages/SettingsClass";
import Missing from "./pages/Missing";
// roles code or sth depends on backend gg

const Pages = () => {
  return (
    <div className="bg-blur">
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public: admin + user here */}
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* <Route element={<RequireAuth allowedRoles={[ROLES.user, ROLES.admin]}/>}> 
              <Route path="/home" element={<Home />} />
            </Route> */}

          {/* <Route element={<RequireAuth allowedRoles={[ROLES.admin]}/>}>  */}
          <Route path="/edit" element={<Edit />} />
          <Route path="/book" element={<Book />} />
          <Route path="/history" element={<History />} />
          <Route path="/book/history" element={<History />} />
          <Route path="/stat" element={<StatMonth />} />
          <Route path="/stat/month" element={<StatMonth />} />
          <Route path="/stat/year" element={<StatYear />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/home" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/airport" element={<Settings />} />
          <Route path="/settings/para" element={<SettingsPara />} />
          <Route path="/settings/class" element={<SettingsClass />} />
          <Route path="/" element={<Home />} />
          {/* </Route> */}
        </Route>

        <Route path="/*" element={<Missing />} />
      </Routes>
    </div>
  );
};

export default Pages;
