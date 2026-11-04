import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { AuthProvider } from "./features/auth/auth.context";
import { ToastProvider } from "./provider/toast-provider";

import "./index.css";
import QueryProvider from "./provider/query-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </QueryProvider>
  </StrictMode>,
);