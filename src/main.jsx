import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/parallax.css";
import { BrowserRouter } from "react-router-dom";
import CoincontextProvider from "./Context/Coincontext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <CoincontextProvider>
         <App />
    </CoincontextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
