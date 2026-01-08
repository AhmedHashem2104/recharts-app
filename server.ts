import express from "express";
import cors from "cors";
import {
  CopilotRuntime,
  copilotRuntimeNodeHttpEndpoint,
  EmptyAdapter,
} from "@copilotkit/runtime";
import { BuiltInAgent } from "@copilotkitnext/agent";

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Initialize CopilotRuntime with a default agent
// When using EmptyAdapter, we need to explicitly provide a default agent
const emptyAdapter = new EmptyAdapter();
const copilotKit = new CopilotRuntime({
  agents: {
    // @ts-expect-error - Type mismatch due to dependency versions, but runtime accepts BuiltInAgent at runtime
    default: new BuiltInAgent({
      // EmptyAdapter doesn't provide a real model, so we use a placeholder
      // For production with a real AI service, this will be set automatically
      model: "empty/empty",
    }),
  },
});

// Handle the service adapter in the runtime
copilotKit.handleServiceAdapter(emptyAdapter);

// Create the CopilotKit endpoint handler
// Note: EmptyAdapter is used for development/demo purposes
// For production with AI capabilities, configure a proper service adapter:
// - OpenAIAdapter (requires OPENAI_API_KEY)
// - AnthropicAdapter (requires ANTHROPIC_API_KEY)
// - GoogleGenerativeAIAdapter (requires GOOGLE_GENERATIVE_AI_API_KEY)
// Example: serviceAdapter: new OpenAIAdapter({ model: "gpt-4" })
const copilotKitHandler = copilotRuntimeNodeHttpEndpoint({
  runtime: copilotKit,
  endpoint: "/api/copilotkit",
  serviceAdapter: emptyAdapter,
});

// CopilotKit runtime endpoint
app.all("/api/copilotkit", copilotKitHandler);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`🚀 CopilotKit server running on http://localhost:${PORT}`);
  console.log(
    `📡 CopilotKit endpoint: http://localhost:${PORT}/api/copilotkit`
  );
});
