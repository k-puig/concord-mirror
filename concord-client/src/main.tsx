import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { io } from "socket.io-client";
import "./index.css";

const socket = io("http://localhost:3000");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App socket={socket} />
  </React.StrictMode>,
);
