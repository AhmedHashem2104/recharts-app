import { useState, useEffect, useMemo, useRef } from "react";
import { useCopilotReadable } from "@copilotkit/react-core";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import {
  detectEChartsType,
  getEChartsConfig,
  getRandomColorPalette,
  type EChartsElementConfig,
} from "./echartsConfig";

import type { ChartDataPoint, FlattenedDataPoint, ChartNestedObject, ChartValue, ChartValueArray } from "../types";

// Helper function to flatten nested objects and extract all keys
const flattenObject = (
  obj: ChartDataPoint | ChartNestedObject,
  prefix = "",
  result: FlattenedDataPoint = {}
): FlattenedDataPoint => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return result;
  }

  const objRecord = obj as ChartDataPoint | ChartNestedObject;
  for (const key in objRecord) {
    if (Object.prototype.hasOwnProperty.call(objRecord, key)) {
      const value = objRecord[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value === null || value === undefined) {
        result[newKey] = value;
      } else if (Array.isArray(value)) {
        if (value.length > 0) {
          const firstItem = value[0];
          if (typeof firstItem === "number" || typeof firstItem === "string" || typeof firstItem === "boolean") {
            result[newKey] = value as ChartValueArray;
          } else if (typeof firstItem === "object" && firstItem !== null) {
            value.forEach((item, idx) => {
              if (typeof item === "object" && item !== null && !Array.isArray(item)) {
                flattenObject(item as ChartNestedObject, `${newKey}[${idx}]`, result);
              }
            });
          }
        }
      } else if (typeof value === "object" && !(value instanceof Date)) {
        flattenObject(value as ChartNestedObject, newKey, result);
      } else {
        result[newKey] = value as ChartValue;
      }
    }
  }
  return result;
};

interface ChartGeneratorProps {
  data: ChartDataPoint[];
  prompt: string;
}

interface GeneratedChartConfig {
  chartType: string;
  echartsOption: EChartsOption; // ECharts option object
  dataMapping: {
    nameKey?: string;
    valueKey?: string;
    dataKeys?: string;
    [key: string]: string | undefined;
  };
  colors?: string[];
  promptHash?: string;
}

const ChartGenerator = ({ data, prompt }: ChartGeneratorProps) => {
  const [chartConfig, setChartConfig] = useState<GeneratedChartConfig | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const previousHashRef = useRef<string>("");

  // Make data and prompt readable to CopilotKit
  useCopilotReadable({
    description:
      "The chart data to visualize. This is an array of objects containing the data points. Each object can have nested structures, arrays, or simple key-value pairs. The data may contain numeric values, strings, dates, or mixed types. The system supports a comprehensive set of chart types: bar charts (including stacked and grouped), line charts (with trendlines), pie/donut charts, area charts (stacked), scatter plots (including bubble and effect scatter), radar charts, heatmaps, treemaps, funnels, sankey diagrams, sunburst charts, candlestick charts (for financial/stock data with OHLC), parallel coordinates (for multivariate data), network graphs (for relationships), theme rivers (for event flows), route lines, hierarchical trees, calendar heatmaps, polar area charts, histograms, box plots, lollipop charts, and density plots. Analyze the structure to identify appropriate keys for axes, series, and labels. The system automatically flattens nested objects and detects numeric, string, and date fields.",
    value: data,
  });

  useCopilotReadable({
    description:
      "The user's natural language description of what chart they want. Supported chart types include: bar, line, pie, area, scatter, radar, heatmap, treemap, funnel, sankey, sunburst, candlestick (for financial data), parallel (for multivariate analysis), graph (for network diagrams), themeriver (for event flows), effectscatter (animated scatter), lines (for routes), tree (hierarchical), calendar (calendar heatmap), and variations like stackedbar, groupedbar, stackedarea, donut, bubble, polararea, histogram, boxplot, lollipop, density. The description can include: chart type, styling preferences, axis labels, colors, titles, data series to display, comparisons, trends, trendlines, or any other visualization requirements. Interpret the intent flexibly and suggest the most appropriate chart configuration. The system can handle requests like 'create a candlestick chart for stock data', 'show a network graph of relationships', 'display parallel coordinates for multivariate analysis', 'create a calendar heatmap of daily activity', etc.",
    value: prompt,
  });

  const dataKeys = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        allKeys: [],
        numericKeys: [],
        stringKeys: [],
        dateKeys: [],
        nameKey: "",
        valueKey: "",
        flattenedData: [],
      };
    }

    const firstItem = data[0];
    const flattened = flattenObject(firstItem);
    const allKeys = Object.keys(flattened);

    const numericKeys: string[] = [];
    const stringKeys: string[] = [];
    const dateKeys: string[] = [];

    allKeys.forEach((key) => {
      const value = flattened[key];
      if (typeof value === "number" && !isNaN(value)) {
        numericKeys.push(key);
      } else if (typeof value === "string") {
        stringKeys.push(key);
        // Check if it's a date string
        if (!isNaN(Date.parse(value))) {
          dateKeys.push(key);
        }
      }
    });

    // Auto-detect name key (for labels/categories) - enhanced for generic JSON schemas
    const nameKey =
      stringKeys.find((k) =>
        /name|label|category|title|id|key|agent|month|day|date|time|year|period|quarter|week|season|location|region|country|city|state|product|item|type|class|group|team|department|category|tag/i.test(
          k
        )
      ) ||
      dateKeys[0] ||
      stringKeys[0] ||
      allKeys[0];

    // Auto-detect value key (for numeric values) - enhanced for generic JSON schemas
    const valueKey =
      numericKeys.find((k) =>
        /value|amount|count|total|sum|quantity|number|price|cost|revenue|sales|score|rating|interaction|kpi|satisfaction|metric|measure|data|result|outcome|performance|efficiency|rate|percentage|percent|ratio|index|level|size|volume|weight|length|height|width|depth|area|distance|speed|time|duration|frequency/i.test(
          k
        )
      ) ||
      numericKeys[0] ||
      "";

    // Flatten all data items
    const flattenedData = data.map((item) => flattenObject(item));

    return {
      allKeys,
      numericKeys,
      stringKeys,
      dateKeys,
      nameKey,
      valueKey,
      flattenedData,
    };
  }, [data]);

  // Create a hash of data and prompt to detect changes
  // This hash will change whenever data or prompt changes, triggering a re-render
  const dataPromptHash = useMemo(() => {
    if (!data || data.length === 0 || !prompt) return "";
    try {
      const dataStr = JSON.stringify(data);
      const promptHash = prompt.trim();
      // Use a more comprehensive hash: prompt + full data string length + first/last parts of data
      // This ensures we detect any data changes
      const dataStart = dataStr.slice(0, 100);
      const dataEnd = dataStr.slice(-100);
      return `${promptHash}_${data.length}_${dataStr.length}_${dataStart}_${dataEnd}`;
    } catch {
      // Fallback hash if JSON.stringify fails
      return `${prompt.trim()}_${data.length}_error`;
    }
  }, [data, prompt]);

  // Auto-generate chart configuration based on data and prompt
  useEffect(() => {
    if (
      data &&
      data.length > 0 &&
      prompt &&
      prompt.trim().length > 0 &&
      dataKeys.nameKey &&
      dataKeys.valueKey
    ) {
      // Check if we already have a config for this exact prompt and data combination
      if (previousHashRef.current === dataPromptHash) {
        return;
      }

      // Update the ref to track this hash
      previousHashRef.current = dataPromptHash;

      const promptLower = prompt.toLowerCase().trim();
      let hasTrendline = false;
      let multipleTrendlines = false;

      // Check for trendline
      if (
        promptLower.includes("dual trendline") ||
        promptLower.includes("multiple trendline") ||
        promptLower.match(/\b(dual|multiple)\s*(trendline|trend\s*line)\b/)
      ) {
        hasTrendline = true;
        multipleTrendlines = true;
      } else if (
        promptLower.includes("trendline") ||
        promptLower.includes("trend line") ||
        promptLower.includes("regression") ||
        promptLower.includes("linear trend") ||
        promptLower.match(/\b(trendline|trend\s*line|regression)\b/)
      ) {
        hasTrendline = true;
      }

      // Detect chart type
      let chartType = detectEChartsType(prompt);
      if (hasTrendline && chartType !== "line" && chartType !== "scatter") {
        chartType = "line";
      }

      // Extract data keys from prompt
      const mentionedKeys: string[] = [];
      const vsPattern = /(\w+)\s+(?:vs|versus|and|&)\s+(\w+)/i;
      const vsMatch = prompt.match(vsPattern);
      if (vsMatch) {
        const key1 = vsMatch[1].trim();
        const key2 = vsMatch[2].trim();
        const foundKey1 = dataKeys.allKeys.find((k) => {
          const kLower = k.toLowerCase();
          const key1Lower = key1.toLowerCase();
          return (
            kLower === key1Lower ||
            kLower.includes(key1Lower) ||
            key1Lower.includes(kLower) ||
            kLower.replace(/[_-]/g, "") === key1Lower.replace(/[_-]/g, "")
          );
        });
        const foundKey2 = dataKeys.allKeys.find((k) => {
          const kLower = k.toLowerCase();
          const key2Lower = key2.toLowerCase();
          return (
            kLower === key2Lower ||
            kLower.includes(key2Lower) ||
            key2Lower.includes(kLower) ||
            kLower.replace(/[_-]/g, "") === key2Lower.replace(/[_-]/g, "")
          );
        });
        if (foundKey1 && !mentionedKeys.includes(foundKey1)) {
          mentionedKeys.push(foundKey1);
        }
        if (foundKey2 && !mentionedKeys.includes(foundKey2)) {
          mentionedKeys.push(foundKey2);
        }
      }

      // Check for keys mentioned directly - enhanced matching for generic JSON schemas
      dataKeys.allKeys.forEach((key) => {
        const keyLower = key.toLowerCase();
        const keyFormatted = key.replace(/[_-]/g, " ").toLowerCase();
        const keyNoUnderscore = keyLower.replace(/[_-]/g, "");
        const keyParts = keyLower.split(/[._-]/); // Split by common separators

        // Check if key or its parts are mentioned in prompt
        const isMentioned =
          promptLower.includes(keyLower) ||
          promptLower.includes(keyFormatted) ||
          promptLower.includes(key.replace(/_/g, " ").toLowerCase()) ||
          promptLower.includes(key.replace(/\./g, " ").toLowerCase()) ||
          // Check if any part of the key is mentioned
          keyParts.some(
            (part) => part.length >= 3 && promptLower.includes(part)
          ) ||
          // Check word-by-word matching
          promptLower.split(/\s+/).some((word) => {
            const wordClean = word.toLowerCase().replace(/[^a-z0-9]/g, "");
            return (
              wordClean.length >= 3 &&
              (keyNoUnderscore.includes(wordClean) ||
                wordClean.includes(keyNoUnderscore) ||
                keyParts.some(
                  (part) => part.includes(wordClean) || wordClean.includes(part)
                ))
            );
          });

        if (isMentioned && !mentionedKeys.includes(key)) {
          mentionedKeys.push(key);
        }
      });

      // Determine which keys to use
      let nameKeyToUse = dataKeys.nameKey;
      let valueKeyToUse = dataKeys.valueKey;
      let dataKeysToUse: string | undefined;

      if (mentionedKeys.length > 0) {
        const mentionedNameKey = mentionedKeys.find(
          (key) =>
            dataKeys.stringKeys.includes(key) ||
            dataKeys.dateKeys.includes(key) ||
            /name|label|category|title|id|key|agent|period|quarter|week|season|location|region|country|city|state|product|item|type|class|group|team|department|tag/i.test(
              key
            )
        );
        if (mentionedNameKey) {
          nameKeyToUse = mentionedNameKey;
        }

        const mentionedValueKeys = mentionedKeys.filter(
          (key) =>
            dataKeys.numericKeys.includes(key) ||
            /value|amount|count|total|sum|quantity|number|price|cost|revenue|sales|score|rating|interaction|kpi|satisfaction|metric|measure|data|result|outcome|performance|efficiency|rate|percentage|percent|ratio|index|level|size|volume|weight|length|height|width|depth|area|distance|speed|time|duration|frequency/i.test(
              key
            )
        );
        if (mentionedValueKeys.length > 0) {
          valueKeyToUse = mentionedValueKeys[0];
          if (mentionedValueKeys.length > 1) {
            dataKeysToUse = mentionedValueKeys.join(",");
          }
        }
      }

      if (
        (promptLower.includes(" vs ") ||
          promptLower.includes(" versus ") ||
          promptLower.includes(" and ") ||
          multipleTrendlines) &&
        dataKeys.numericKeys.length >= 2
      ) {
        const promptWords = promptLower.split(/\s+/);
        const matchingKeys = dataKeys.numericKeys.filter((key) => {
          const keyLower = key.toLowerCase();
          return promptWords.some(
            (word) =>
              word.length >= 3 &&
              (keyLower.includes(word) || word.includes(keyLower))
          );
        });
        if (matchingKeys.length >= 2) {
          dataKeysToUse = matchingKeys.join(",");
          valueKeyToUse = matchingKeys[0];
        } else if (dataKeys.numericKeys.length >= 2) {
          dataKeysToUse = dataKeys.numericKeys.slice(0, 2).join(",");
          valueKeyToUse = dataKeys.numericKeys[0];
        }
      }

      // Extract colors from prompt - supports multiple colors
      const extractColors = (promptText: string): string[] | undefined => {
        const colorMap: Record<string, string> = {
          red: "#ff0000",
          blue: "#0066ff",
          green: "#00cc00",
          yellow: "#ffcc00",
          orange: "#ff6600",
          purple: "#9900cc",
          pink: "#ff00cc",
          teal: "#00cccc",
          cyan: "#00ffff",
          magenta: "#ff00ff",
          lime: "#00ff00",
          brown: "#8b4513",
          black: "#000000",
          white: "#ffffff",
          gray: "#808080",
          grey: "#808080",
          navy: "#000080",
          maroon: "#800000",
          olive: "#808000",
          aqua: "#00ffff",
          silver: "#c0c0c0",
          gold: "#ffd700",
          indigo: "#4b0082",
          violet: "#8a2be2",
          coral: "#ff7f50",
          salmon: "#fa8072",
          turquoise: "#40e0d0",
          khaki: "#f0e68c",
          lavender: "#e6e6fa",
          plum: "#dda0dd",
          beige: "#f5f5dc",
          tan: "#d2b48c",
        };
        const foundColors: string[] = [];

        // Extract all color names mentioned in the prompt (case-insensitive)
        Object.keys(colorMap).forEach((colorName) => {
          // Use word boundary to match whole words only
          const regex = new RegExp(`\\b${colorName}\\b`, "i");
          if (regex.test(promptText)) {
            foundColors.push(colorMap[colorName]);
          }
        });

        // Extract hex colors (supports both 6-digit and 3-digit hex)
        const hexMatches = promptText.match(/#[0-9a-f]{3,6}/gi);
        if (hexMatches) {
          // Convert 3-digit hex to 6-digit if needed
          hexMatches.forEach((hex) => {
            if (hex.length === 4) {
              // Convert #rgb to #rrggbb
              const r = hex[1];
              const g = hex[2];
              const b = hex[3];
              foundColors.push(`#${r}${r}${g}${g}${b}${b}`);
            } else {
              foundColors.push(hex);
            }
          });
        }

        // Extract RGB colors like "rgb(255, 0, 0)" or "rgba(255, 0, 0, 0.5)"
        const rgbMatches = promptText.match(/rgba?\([^)]+\)/gi);
        if (rgbMatches) {
          foundColors.push(...rgbMatches);
        }

        // Remove duplicates while preserving order
        const uniqueColors = Array.from(new Set(foundColors));

        return uniqueColors.length > 0 ? uniqueColors : undefined;
      };

      const extractedColors = extractColors(promptLower);

      // Get ECharts configuration
      const echartsConfig = getEChartsConfig(chartType);
      if (!echartsConfig) {
        console.warn(
          `Unknown chart type: ${chartType}, using default bar chart`
        );
        chartType = "bar";
      }

      const isStacked =
        chartType === "stackedbar" || chartType === "stackedarea";
      const isGrouped = chartType === "groupedbar";

      // Use flattened data if available
      const dataToUse =
        dataKeys.flattenedData && dataKeys.flattenedData.length > 0
          ? dataKeys.flattenedData
          : data;

      // Generate ECharts option
      const elementConfig: EChartsElementConfig = {
        nameKey: nameKeyToUse,
        valueKey: valueKeyToUse,
        dataKeys: dataKeysToUse
          ? dataKeysToUse.split(",").map((k) => k.trim())
          : undefined,
        colors:
          extractedColors && extractedColors.length > 0
            ? extractedColors
            : getRandomColorPalette(20),
        isStacked,
        isGrouped,
        hasTrendline,
        multipleTrendlines,
        data: dataToUse,
      };

      const echartsOption = echartsConfig
        ? echartsConfig.generateOption(elementConfig)
        : null;

      if (!echartsOption) {
        // Use setTimeout to avoid setState in effect
        setTimeout(() => {
          setError(
            `Failed to generate chart configuration for type: ${chartType}`
          );
        }, 0);
        return;
      }

      const defaultConfig: GeneratedChartConfig = {
        chartType,
        echartsOption,
        dataMapping: {
          nameKey: nameKeyToUse,
          valueKey: valueKeyToUse,
          ...(dataKeysToUse && { dataKeys: dataKeysToUse }),
        },
        colors:
          extractedColors && extractedColors.length > 0
            ? extractedColors
            : getRandomColorPalette(20),
        promptHash: dataPromptHash,
      };

      // Use setTimeout to avoid setState in effect warning
      setTimeout(() => {
        setChartConfig(defaultConfig);
        setError(null);
      }, 0);
    } else {
      // No data or invalid data - clear chart
      previousHashRef.current = "";
      setTimeout(() => {
        setChartConfig(null);
      }, 0);
    }
  }, [data, prompt, dataKeys, dataPromptHash]);

  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p className="empty-state-title">No Data Available</p>
          <p className="empty-state-message">
            Please provide chart data in the JSON input field.
          </p>
        </div>
      );
    }

    if (!chartConfig) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">✨</div>
          <p className="empty-state-title">Ready to Generate</p>
          <p className="empty-state-message">
            Enter a chart description to generate a visualization.
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-state">
          <div className="error-state-icon">⚠️</div>
          <p className="error-state-title">Chart Generation Error</p>
          <p className="error-state-message">{error}</p>
        </div>
      );
    }

    return (
      <div className="chart-wrapper">
        <ReactECharts
          key={chartConfig.promptHash || chartConfig.chartType}
          option={chartConfig.echartsOption}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "svg" }}
          notMerge={true}
        />
      </div>
    );
  };

  // Extract chart title from prompt or use default
  const getChartTitle = () => {
    if (!chartConfig) return "Chart Preview";
    const titleMatch = prompt.match(/(?:titled?|title:)\s*["']?([^"']+)["']?/i);
    if (titleMatch) return titleMatch[1];
    if (chartConfig.chartType) {
      return `${
        chartConfig.chartType.charAt(0).toUpperCase() +
        chartConfig.chartType.slice(1)
      } Chart`;
    }
    return "Generated Chart";
  };

  // Get chart type badge color
  const getChartTypeBadgeClass = () => {
    if (!chartConfig) return "";
    const type = chartConfig.chartType.toLowerCase();
    if (["bar", "stackedbar", "groupedbar"].includes(type)) return "badge-blue";
    if (["line", "area", "stackedarea"].includes(type)) return "badge-green";
    if (["pie", "donut", "sunburst"].includes(type)) return "badge-purple";
    if (["scatter", "bubble", "effectscatter"].includes(type))
      return "badge-orange";
    if (["radar", "polararea", "radialbar"].includes(type)) return "badge-pink";
    return "badge-gray";
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-header-left">
          <h3 className="chart-title">{getChartTitle()}</h3>
          {chartConfig && (
            <span className={`chart-type-badge ${getChartTypeBadgeClass()}`}>
              {chartConfig.chartType}
            </span>
          )}
        </div>
        {chartConfig && data && data.length > 0 && (
          <div className="chart-stats">
            <span className="stat-item">
              <span className="stat-label">Data Points:</span>
              <span className="stat-value">{data.length}</span>
            </span>
          </div>
        )}
      </div>
      <div className="chart-content">{renderChart()}</div>
    </div>
  );
};

export default ChartGenerator;
