import { useState } from "react";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import ChartGenerator from "./components/ChartGenerator";
import { chartExamples, defaultExample } from "./examples";
import type { ChartDataPoint } from "./types";
import "./App.css";

function App() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>(
    defaultExample.data
  );
  const [chartPrompt, setChartPrompt] = useState(defaultExample.prompt);
  const [selectedExample, setSelectedExample] = useState<string>(
    defaultExample.name
  );
  const [jsonText, setJsonText] = useState<string>(
    JSON.stringify(defaultExample.data, null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Make chart data readable to CopilotKit
  useCopilotReadable({
    description:
      "The current chart data that should be visualized. This is an array of data objects that can contain any structure - nested objects, arrays, dates, numbers, strings. The AI should analyze this data structure to understand what fields are available for visualization.",
    value: chartData,
  });

  // Action to generate a chart
  useCopilotAction({
    name: "generateChart",
    description:
      "Generate a chart or graph based on the provided data and user's natural language description. Supports a wide variety of chart types including: bar charts, line charts, pie charts, area charts, scatter plots, radar charts, heatmaps, treemaps, funnels, sankey diagrams, sunburst charts, candlestick charts (for financial data), parallel coordinates, network graphs, theme rivers, effect scatter, route lines, hierarchical trees, calendar heatmaps, and more. The user may describe the chart type, styling preferences, what data to show, comparisons, trends, or any visualization requirements. Interpret their intent flexibly and create an appropriate chart configuration.",
    parameters: [
      {
        name: "data",
        type: "object",
        description:
          "The data to visualize in the chart. Can be an array of objects or a single object. Each object can have nested structures, arrays, dates, numbers, strings, or mixed types. Analyze the data structure to identify appropriate fields for visualization. The system automatically handles flattening nested objects and detecting appropriate keys for axes and series.",
        required: true,
      },
      {
        name: "chartType",
        type: "string",
        description:
          "The type of chart to generate. Available types include: 'bar', 'line', 'pie', 'area', 'scatter', 'radar', 'heatmap', 'treemap', 'funnel', 'sankey', 'sunburst', 'candlestick' (for financial/stock data), 'parallel' (for multivariate data), 'graph' (for network diagrams), 'themeriver' (for event flows), 'effectscatter' (animated scatter), 'lines' (for routes/paths), 'tree' (hierarchical), 'calendar' (calendar heatmap), 'stackedbar', 'groupedbar', 'stackedarea', 'donut', 'bubble', 'polararea', 'histogram', 'boxplot', 'lollipop', 'density'. Choose based on the user's request - if they mention 'bar chart', use 'bar'; if they want to show percentages or proportions, use 'pie'; if they want financial data, use 'candlestick'; if they want network relationships, use 'graph'; if they want multivariate analysis, use 'parallel'.",
        required: true,
      },
      {
        name: "title",
        type: "string",
        description:
          "The title of the chart. Extract from the user's description if they mention a title, or create a descriptive title based on the data and chart type.",
        required: false,
      },
      {
        name: "xAxisKey",
        type: "string",
        description:
          "The key in the data object to use for the x-axis (categories/labels). Look for keys like 'name', 'label', 'category', 'date', 'month', or any string/date field. If the user specifies which field to use, respect that.",
        required: false,
      },
      {
        name: "yAxisKey",
        type: "string",
        description:
          "The key in the data object to use for the y-axis (values). Look for keys like 'value', 'amount', 'count', 'score', 'percentage', or any numeric field. If the user specifies which field to use, respect that.",
        required: false,
      },
    ],
    handler: async ({ data, chartType, title, xAxisKey, yAxisKey }) => {
      let newData: ChartDataPoint[];
      if (Array.isArray(data)) {
        newData = data as ChartDataPoint[];
      } else if (data && typeof data === "object") {
        newData = [data as ChartDataPoint];
      } else {
        return;
      }
      setChartData(newData);
      setJsonText(JSON.stringify(newData, null, 2));
      setJsonError(null);
      setChartPrompt(
        `${chartType} chart${title ? ` titled "${title}"` : ""}${
          xAxisKey ? ` with x-axis: ${xAxisKey}` : ""
        }${yAxisKey ? ` and y-axis: ${yAxisKey}` : ""}`
      );
    },
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Chart Generator</h1>
        <p>Generate beautiful charts and graphs using AI with CopilotKit</p>
      </header>

      <div className="main-content">
        <div className="input-section">
          <div className="input-group">
            <div className="label-row">
              <label htmlFor="data-input">Chart Data (JSON):</label>
              <div className="example-selector">
                <select
                  className="example-select"
                  value={selectedExample}
                  onChange={(e) => {
                    const example = chartExamples.find(
                      (ex) => ex.name === e.target.value
                    );
                    if (example) {
                      setChartData(example.data);
                      setChartPrompt(example.prompt);
                      setSelectedExample(example.name);
                      setJsonText(JSON.stringify(example.data, null, 2));
                      setJsonError(null);
                    }
                  }}
                >
                  {chartExamples.map((example) => (
                    <option key={example.name} value={example.name}>
                      {example.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <textarea
              id="data-input"
              className="data-input"
              placeholder='Example: [{"name": "Jan", "value": 400}, {"name": "Feb", "value": 300}]'
              value={jsonText}
              onChange={(e) => {
                const newText = e.target.value;
                setJsonText(newText);

                // Try to parse and update chartData if valid
                try {
                  const parsed = JSON.parse(newText);
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    setChartData(parsed);
                    setJsonError(null);
                  } else if (Array.isArray(parsed)) {
                    // Empty array is valid
                    setChartData(parsed);
                    setJsonError(null);
                  } else {
                    setJsonError("Data must be an array");
                  }
                } catch (error) {
                  // Invalid JSON - show error but allow editing
                  setJsonError(
                    error instanceof Error
                      ? `Invalid JSON: ${error.message}`
                      : "Invalid JSON"
                  );
                }
              }}
            />
            {jsonError && <div className="json-error">{jsonError}</div>}
          </div>

          <div className="input-group">
            <label htmlFor="prompt-input">Chart Description:</label>
            <textarea
              id="prompt-input"
              className="prompt-input"
              placeholder="Describe the chart you want (e.g., 'Create a line chart showing sales over time')"
              value={chartPrompt}
              onChange={(e) => setChartPrompt(e.target.value)}
            />
          </div>
        </div>

        <div className="chart-section">
          <ChartGenerator data={chartData} prompt={chartPrompt} />
        </div>
      </div>
    </div>
  );
}

export default App;
