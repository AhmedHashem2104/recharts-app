import express from "express";
import cors from "cors";
import {
  CopilotRuntime,
  copilotRuntimeNodeHttpEndpoint,
  EmptyAdapter,
} from "@copilotkit/runtime";
import { BuiltInAgent } from "@copilotkitnext/agent";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Types matching the frontend
interface ChartDataPoint {
  [key: string]: string | number | boolean | null | undefined | string[] | number[] | ChartDataPoint | ChartDataPoint[];
}

interface GenerateChartParams {
  data: object;
  chartType?: string;
  title?: string;
  xAxisKey?: string;
  yAxisKey?: string;
  prompt?: string;
}

interface ChartAnalysisResult {
  chartType: string;
  title?: string;
  xAxisKey?: string;
  yAxisKey?: string;
  reasoning?: string;
}

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
  actions: () => {
    // Helper function to analyze data structure and determine optimal chart configuration
    const analyzeDataWithLangChain = async (
      data: object,
      prompt?: string
    ): Promise<ChartAnalysisResult> => {
      const dataArray = Array.isArray(data) ? data : [data];
      if (dataArray.length === 0) {
        return { chartType: "bar" };
      }

      const dataStr = JSON.stringify(dataArray, null, 2);
      const userPrompt =
        prompt || "Analyze this data and suggest the best chart type";

      const analysisPrompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          `You are an expert data visualization analyst. Analyze JSON data and determine the optimal chart configuration.

Available chart types: bar, line, pie, area, scatter, radar, heatmap, treemap, funnel, sankey, sunburst, candlestick, parallel, graph, themeriver, stackedbar, groupedbar, stackedarea, donut, bubble, histogram, boxplot, lollipop, density.

Analyze the data structure:
1. Identify all keys/fields
2. Determine field types (numeric, string, date, categorical)
3. Count data points
4. Identify relationships between fields

Based on the user's prompt:
1. Extract mentioned chart type
2. Understand intent (comparison, trend, distribution, relationship)
3. Identify specific fields mentioned
4. Note styling preferences

If no chart type is mentioned, determine optimal chart type based on data structure and best practices.

Return ONLY valid JSON with this exact structure (no markdown, no code blocks):
{
  "chartType": "string",
  "title": "string (optional, suggested title)",
  "xAxisKey": "string (optional, key for x-axis/labels)",
  "yAxisKey": "string (optional, key for y-axis/values)",
  "reasoning": "string (optional, brief explanation)"
}`,
        ],
        [
          "user",
          `Data to analyze:
\`\`\`json
{dataStr}
\`\`\`

User's description: {prompt}

Return only the JSON object, no other text.`,
        ],
      ]);

      const chain = analysisPrompt.pipe(new ChatOpenAI());

      try {
        // Use invoke to get a direct response instead of streaming
        const response = await chain.invoke({
          dataStr: dataStr,
          prompt: userPrompt,
        });

        const content = response.content;
        if (typeof content !== "string") {
          throw new Error("Unexpected response format");
        }

        // Remove markdown code blocks if present
        const cleanedResponse = content
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        const result = JSON.parse(cleanedResponse) as ChartAnalysisResult;
        return result;
      } catch (error) {
        console.error("Failed to parse LangChain response:", error);
        // Fallback: analyze data structure directly
        const typedData = dataArray as ChartDataPoint[];
        return analyzeDataStructure(typedData);
      }
    };

    // Fallback function to analyze data structure without LangChain
    const analyzeDataStructure = (
      data: ChartDataPoint[]
    ): ChartAnalysisResult => {
      if (data.length === 0) {
        return { chartType: "bar" };
      }

      const firstItem = data[0];
      const keys = Object.keys(firstItem);
      const numericKeys: string[] = [];
      const stringKeys: string[] = [];

      keys.forEach((key) => {
        const value = firstItem[key];
        if (typeof value === "number") {
          numericKeys.push(key);
        } else if (typeof value === "string") {
          stringKeys.push(key);
        }
      });

      // Auto-detect name key (for labels/categories)
      const nameKey =
        stringKeys.find((k) =>
          /name|label|category|title|id|key|month|day|date|time|year|period/i.test(
            k
          )
        ) ||
        stringKeys[0] ||
        keys[0];

      // Auto-detect value key (for numeric values)
      const valueKey =
        numericKeys.find((k) =>
          /value|amount|count|total|sum|quantity|number|price|cost|revenue|sales|score/i.test(
            k
          )
        ) ||
        numericKeys[0] ||
        "";

      // Determine chart type based on data characteristics
      let chartType = "bar";
      if (numericKeys.length >= 2 && stringKeys.length >= 1) {
        chartType = "line";
      } else if (numericKeys.length === 1 && stringKeys.length >= 1) {
        chartType = "bar";
      }

      return {
        chartType,
        xAxisKey: nameKey,
        yAxisKey: valueKey,
      };
    };

    return [
      {
        name: "generateChart",
        description:
          "Generate a chart or graph based on the provided data and user's natural language description. Uses LangChain to intelligently analyze the data structure and determine the optimal chart type, title, and axis keys if not provided. Supports a wide variety of chart types including: bar charts, line charts, pie charts, area charts, scatter plots, radar charts, heatmaps, treemaps, funnels, sankey diagrams, sunburst charts, candlestick charts (for financial data), parallel coordinates, network graphs, theme rivers, effect scatter, route lines, hierarchical trees, calendar heatmaps, and more.",
        parameters: [
          {
            name: "data",
            type: "object",
            description:
              "The data to visualize in the chart. Can be an array of objects or a single object. Each object can have nested structures, arrays, dates, numbers, strings, or mixed types. The system automatically analyzes the data structure to identify appropriate fields for visualization.",
            required: true,
          },
          {
            name: "chartType",
            type: "string",
            description:
              "The type of chart to generate. Available types include: 'bar', 'line', 'pie', 'area', 'scatter', 'radar', 'heatmap', 'treemap', 'funnel', 'sankey', 'sunburst', 'candlestick' (for financial/stock data), 'parallel' (for multivariate data), 'graph' (for network diagrams), 'themeriver' (for event flows), 'effectscatter' (animated scatter), 'lines' (for routes/paths), 'tree' (hierarchical), 'calendar' (calendar heatmap), 'stackedbar', 'groupedbar', 'stackedarea', 'donut', 'bubble', 'polararea', 'histogram', 'boxplot', 'lollipop', 'density'. If not provided, LangChain will analyze the data and prompt to determine the optimal chart type.",
            required: false,
          },
          {
            name: "title",
            type: "string",
            description:
              "The title of the chart. If not provided, LangChain will generate a descriptive title based on the data and prompt.",
            required: false,
          },
          {
            name: "xAxisKey",
            type: "string",
            description:
              "The key in the data object to use for the x-axis (categories/labels). Look for keys like 'name', 'label', 'category', 'date', 'month', or any string/date field. If not provided, LangChain will analyze the data structure to identify the appropriate field.",
            required: false,
          },
          {
            name: "yAxisKey",
            type: "string",
            description:
              "The key in the data object to use for the y-axis (values). Look for keys like 'value', 'amount', 'count', 'score', 'percentage', or any numeric field. If not provided, LangChain will analyze the data structure to identify the appropriate field.",
            required: false,
          },
          {
            name: "prompt",
            type: "string",
            description:
              "The user's natural language description of what chart they want. This is used by LangChain to understand the user's intent and determine optimal chart configuration when parameters are missing. Can include chart type preferences, styling, axis labels, or any visualization requirements.",
            required: false,
          },
        ],
        handler: async ({
          data,
          chartType,
          title,
          xAxisKey,
          yAxisKey,
          prompt,
        }: GenerateChartParams) => {
          // Use LangChain to analyze data and determine missing parameters
          const analysis = await analyzeDataWithLangChain(data, prompt);

          // Merge provided parameters with LangChain analysis
          const result = {
            data,
            chartType: chartType || analysis.chartType || "bar",
            ...(title || analysis.title
              ? { title: title || analysis.title }
              : {}),
            xAxisKey: xAxisKey || analysis.xAxisKey || "",
            yAxisKey: yAxisKey || analysis.yAxisKey || "",
            ...(analysis.reasoning ? { reasoning: analysis.reasoning } : {}),
          };

          return result;
        },
      },
    ];
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
