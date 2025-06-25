import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";

// ✅ Configurar Axios para que envíe cookies automáticamente
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000"; // tu API NestJS
axios.defaults.withCredentials = true; // ✅ necesario para enviar cookies

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <App />
        <Toaster position="top-right" reverseOrder={false} />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
