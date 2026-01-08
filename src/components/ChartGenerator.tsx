import React, { useState, useEffect, useMemo } from "react";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import * as Recharts from "recharts";

interface ChartDataPoint {
  [key: string]: string | number;
}

interface ChartGeneratorProps {
  data: ChartDataPoint[];
  prompt: string;
}

interface ChartElement {
  type: string;
  props?: Record<string, unknown>;
  children?: ChartElement[];
}

interface GeneratedChartConfig {
  chartType: string;
  componentName: string;
  elements: ChartElement[];
  dataMapping: {
    nameKey: string;
    valueKey: string;
  };
  colors?: string[];
}

const ChartGenerator = ({ data, prompt }: ChartGeneratorProps) => {
  const [chartConfig, setChartConfig] = useState<GeneratedChartConfig | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);

  // Make data and prompt readable to CopilotKit
  useCopilotReadable({
    description: "The chart data to visualize",
    value: data,
  });

  useCopilotReadable({
    description: "The user's description of what chart they want",
    value: prompt,
  });

  // Get standardized keys
  const dataKeys = useMemo(() => {
    if (!data || data.length === 0)
      return { nameKey: "name", valueKey: "value" };

    const keys = Object.keys(data[0] || {});
    const nameKey = keys.includes("name") ? "name" : keys[0] || "name";
    const valueKey = keys.includes("value")
      ? "value"
      : keys[1] || keys[0] || "value";

    return { nameKey, valueKey };
  }, [data]);

  // Action to generate chart configuration - completely generic
  useCopilotAction({
    name: "generateChartComponent",
    description:
      "Generate a complete chart component configuration based on data structure and user prompt. Return a generic configuration that can render any chart type.",
    parameters: [
      {
        name: "chartType",
        type: "string",
        description:
          "The type of chart: 'bar', 'line', 'pie', 'area', 'scatter', etc.",
        required: true,
      },
      {
        name: "elements",
        type: "object",
        description:
          "Array of chart elements configuration. Each element has: type (component name), props (properties), and optional children array.",
        required: true,
      },
      {
        name: "nameKey",
        type: "string",
        description: "The key to use for labels/categories (x-axis)",
        required: true,
      },
      {
        name: "valueKey",
        type: "string",
        description: "The key to use for numeric values (y-axis/data)",
        required: true,
      },
      {
        name: "colors",
        type: "object",
        description: "Optional array of color hex codes",
        required: false,
      },
    ],
    handler: async ({ chartType, elements, nameKey, valueKey, colors }) => {
      setIsGenerating(true);
      try {
        const config: GeneratedChartConfig = {
          chartType: chartType.toLowerCase(),
          componentName: `${
            chartType.charAt(0).toUpperCase() + chartType.slice(1)
          }Chart`,
          elements: Array.isArray(elements) ? elements : [],
          dataMapping: {
            nameKey: nameKey || dataKeys.nameKey,
            valueKey: valueKey || dataKeys.valueKey,
          },
          colors: Array.isArray(colors)
            ? colors
            : [
                "#0066ff", // Primary color rgb(0, 102, 255)
                "#3385ff", // Primary light
                "#0052cc", // Primary dark
                "#4d9aff", // Gradient start
                "#2d7aff", // Gradient end
                "#1a75ff", // Primary hover
                "#66a3ff", // Lighter variant
                "#003d99", // Darker variant
              ],
        };

        setChartConfig(config);
      } catch (error) {
        console.error("Error generating chart config:", error);
      } finally {
        setIsGenerating(false);
      }
    },
  });

  // Auto-generate chart when data or prompt changes
  useEffect(() => {
    if (data && data.length > 0 && dataKeys.nameKey && dataKeys.valueKey) {
      const promptLower = prompt.toLowerCase();
      let chartType = "line";
      if (promptLower.includes("bar") || promptLower.includes("column")) {
        chartType = "bar";
      } else if (promptLower.includes("pie") || promptLower.includes("donut")) {
        chartType = "pie";
      } else if (promptLower.includes("area")) {
        chartType = "area";
      } else if (promptLower.includes("line")) {
        chartType = "line";
      }

      // Generate default configuration
      const defaultConfig: GeneratedChartConfig = {
        chartType,
        componentName: `${
          chartType.charAt(0).toUpperCase() + chartType.slice(1)
        }Chart`,
        elements: generateDefaultElements(chartType, dataKeys),
        dataMapping: dataKeys,
        colors: [
          "#0066ff", // Primary color rgb(0, 102, 255)
          "#3385ff", // Primary light
          "#0052cc", // Primary dark
          "#4d9aff", // Gradient start
          "#2d7aff", // Gradient end
          "#1a75ff", // Primary hover
          "#66a3ff", // Lighter variant
          "#003d99", // Darker variant
        ],
      };

      setChartConfig(defaultConfig);
    } else {
      setChartConfig(null);
    }
  }, [data, prompt, dataKeys]);

  // Generic function to generate default elements for any chart type
  function generateDefaultElements(
    type: string,
    keys: { nameKey: string; valueKey: string }
  ): ChartElement[] {
    if (type === "pie") {
      return [
        {
          type: "Pie",
          props: {
            dataKey: keys.valueKey,
            cx: "50%",
            cy: "50%",
            label: true,
            outerRadius: 120,
          },
        },
        { type: "Tooltip", props: {} },
        { type: "Legend", props: {} },
      ];
    }

    return [
      { type: "CartesianGrid", props: { strokeDasharray: "3 3" } },
      { type: "XAxis", props: { dataKey: keys.nameKey } },
      { type: "YAxis", props: {} },
      { type: "Tooltip", props: {} },
      { type: "Legend", props: {} },
      {
        type: type === "bar" ? "Bar" : type === "line" ? "Line" : "Area",
        props: {
          ...(type === "line" || type === "area" ? { type: "monotone" } : {}),
          dataKey: keys.valueKey,
          ...(type === "line"
            ? { stroke: "#0066ff", strokeWidth: 2 }
            : type === "area"
            ? { stroke: "#0066ff", fill: "#0066ff" }
            : { fill: "#0066ff" }),
        },
      },
    ];
  }

  // Generic renderer - renders any element structure recursively
  const renderElement = (
    element: ChartElement,
    index: number,
    chartData: ChartDataPoint[]
  ): React.ReactNode => {
    const Component = (
      Recharts as unknown as Record<string, React.ComponentType>
    )[element.type];

    if (!Component) {
      console.warn(`Component ${element.type} not found`);
      return null;
    }

    // Special handling for Pie charts
    if (element.type === "Pie" && chartConfig) {
      const pieData = chartData.map((item) => ({
        name: String(item[chartConfig.dataMapping.nameKey] || ""),
        value: Number(item[chartConfig.dataMapping.valueKey] || 0),
      }));

      const PieComponent = Component as React.ComponentType<{
        data: Array<{ name: string; value: number }>;
        children?: React.ReactNode;
        [key: string]: unknown;
      }>;

      return (
        <PieComponent key={index} {...element.props} data={pieData}>
          {pieData.map((_entry, idx: number) => (
            <Recharts.Cell
              key={`cell-${idx}`}
              fill={
                chartConfig.colors?.[idx % (chartConfig.colors?.length || 8)] ||
                "#0066ff"
              }
            />
          ))}
          {element.children?.map((child, childIndex) =>
            renderElement(child, childIndex, chartData)
          )}
        </PieComponent>
      );
    }

    // Generic component renderer
    const TypedComponent = Component as React.ComponentType<{
      children?: React.ReactNode;
      [key: string]: unknown;
    }>;

    return (
      <TypedComponent key={index} {...element.props}>
        {element.children?.map((child, childIndex) =>
          renderElement(child, childIndex, chartData)
        )}
      </TypedComponent>
    );
  };

  const renderChart = () => {
    if (!chartConfig || !data || data.length === 0) {
      return (
        <div className="empty-chart">
          <p>
            {isGenerating
              ? "Generating chart..."
              : "No data provided. Enter data and describe your chart to generate a visualization."}
          </p>
          <p className="hint">
            Try: "Create a bar chart" or "Show me a line graph"
          </p>
        </div>
      );
    }

    const ChartComponent =
      (Recharts as unknown as Record<string, React.ComponentType>)[
        chartConfig.componentName
      ] ||
      (Recharts as unknown as Record<string, React.ComponentType>)[
        `${chartConfig.chartType}Chart`
      ] ||
      Recharts.LineChart;

    const TypedChartComponent = ChartComponent as React.ComponentType<{
      children?: React.ReactNode;
      data?: ChartDataPoint[];
      [key: string]: unknown;
    }>;

    // For pie charts, use PieChart wrapper
    if (chartConfig.chartType === "pie") {
      return (
        <Recharts.ResponsiveContainer width="100%" height="100%">
          <Recharts.PieChart>
            {chartConfig.elements.map((element, index) =>
              renderElement(element, index, data)
            )}
          </Recharts.PieChart>
        </Recharts.ResponsiveContainer>
      );
    }

    // For other charts, use the main chart component
    return (
      <Recharts.ResponsiveContainer width="100%" height="100%">
        <TypedChartComponent
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {chartConfig.elements.map((element, index) =>
            renderElement(element, index, data)
          )}
        </TypedChartComponent>
      </Recharts.ResponsiveContainer>
    );
  };

  return (
    <div className="chart-container">
      <h3>Generated Chart</h3>
      {renderChart()}
    </div>
  );
};

export default ChartGenerator;
