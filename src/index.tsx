import App from "./App";
import "./index.css";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root element was not found.");
}

createRoot(rootElement).render(<App />);
