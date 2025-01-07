import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import * as Toast from "@radix-ui/react-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toast.Provider swipeDirection="right" duration={3000}>
      <App />
    </Toast.Provider>
  </StrictMode>,
);
