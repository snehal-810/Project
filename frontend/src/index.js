import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App2";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <App />
    <ToastContainer />
  </>
);
