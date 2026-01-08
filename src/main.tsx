import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      publicApiKey={import.meta.env.VITE_COPILOTKIT_API_KEY || ""}
    >
      <CopilotSidebar>
        <App />
      </CopilotSidebar>
    </CopilotKit>
  </StrictMode>
);
