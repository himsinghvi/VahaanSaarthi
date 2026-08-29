import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { AssistantProvider } from "./context/AssistantContext";
import { AuthProvider } from "./context/AuthContext";
import { DemoTourProvider } from "./context/DemoTourContext";
import DemoTour from "./components/DemoTour";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <AuthProvider>
          <AssistantProvider>
            <DemoTourProvider>
              <App />
              <DemoTour />
            </DemoTourProvider>
          </AssistantProvider>
        </AuthProvider>
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
