import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/App/App.jsx";

import { AuthProvider } from "./contexts/AuthContext.jsx";
import { APIProvider } from "./contexts/APIContext.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <APIProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </APIProvider>
  </StrictMode>
);
