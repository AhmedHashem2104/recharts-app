import { useState } from "react";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import ChartGenerator from "./components/ChartGenerator";
import { chartExamples, defaultExample, type ChartDataPoint } from "./examples";
import "./App.css";

function App() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>(
    defaultExample.data
  );
  const [chartPrompt, setChartPrompt] = useState(defaultExample.prompt);
  const [selectedExample, setSelectedExample] = useState<string>(
    defaultExample.name
  );

  // Make chart data readable to CopilotKit
  useCopilotReadable({
    description: "The current chart data that should be visualized",
    value: chartData,
  });

  // Action to generate a chart
  useCopilotAction({
    name: "generateChart",
    description:
      "Generate a chart or graph based on provided data and description",
    parameters: [
      {
        name: "data",
        type: "object",
        description: "The data to visualize in the chart",
        required: true,
      },
      {
        name: "chartType",
        type: "string",
        description:
          "The type of chart to generate (e.g., 'line', 'bar', 'pie', 'area', 'scatter')",
        required: true,
      },
      {
        name: "title",
        type: "string",
        description: "The title of the chart",
        required: false,
      },
      {
        name: "xAxisKey",
        type: "string",
        description: "The key in the data object to use for the x-axis",
        required: false,
      },
      {
        name: "yAxisKey",
        type: "string",
        description: "The key in the data object to use for the y-axis",
        required: false,
      },
    ],
    handler: async ({ data, chartType, title, xAxisKey, yAxisKey }) => {
      if (Array.isArray(data)) {
        setChartData(data as ChartDataPoint[]);
      } else if (data && typeof data === "object") {
        setChartData([data as ChartDataPoint]);
      }
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
              value={JSON.stringify(chartData, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  if (Array.isArray(parsed)) {
                    setChartData(parsed);
                  }
                } catch {
                  // Invalid JSON, keep the text for editing
                }
              }}
            />
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

          <div className="generative-ui-section">
            <h2>AI Chart Generation</h2>
            <p>
              Use the chat interface (sidebar icon) to describe your chart, or
              enter data and a description above.
            </p>
            <div className="instruction-text">
              <strong>💡 Try saying in the chat:</strong>
              <ul>
                <li>"Create a bar chart with the current data"</li>
                <li>"Generate a line graph showing the trends"</li>
                <li>"Make a pie chart from this data: [paste your data]"</li>
                <li>"Show me an area chart"</li>
              </ul>
            </div>
            <div className="info-box">
              <p>
                <strong>How it works:</strong>
              </p>
              <p>
                The AI will analyze your data and description, then
                automatically generate the appropriate chart type with proper
                styling and labels.
              </p>
            </div>
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
