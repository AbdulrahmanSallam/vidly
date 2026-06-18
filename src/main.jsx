import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import logger from "./services/logService";
import { ToastContainer } from "react-toastify";

logger.init();

createRoot(document.getElementById("root")).render(
  <>
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
    <ToastContainer />
  </>,
);
