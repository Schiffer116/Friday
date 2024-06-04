import Pages from "./Pages";
import { createRoot } from "react-dom";
import React from "react";

import { AuthProvider } from "./context/AuthProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/*" element={<Pages />} />
          </Routes>
          <Pages />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(React.createElement(App));
