import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "/src/assets/main.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <h1 className="text-2xl text-red-800">Something</h1>
  </StrictMode>
);
