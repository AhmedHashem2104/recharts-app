// ECharts configuration for all supported chart types
import * as echarts from "echarts";

export interface EChartsConfig {
  chartType: string;
  echartsType: string; // ECharts chart type name
  keywords: string[];
  requiresSpecialConfig?: boolean;
  generateOption: (config: EChartsElementConfig) => echarts.EChartsOption;
}

export interface EChartsElementConfig {
  nameKey: string;
  valueKey: string;
  dataKeys?: string[];
  colors: string[];
  isStacked?: boolean;
  isGrouped?: boolean;
  hasTrendline?: boolean;
  multipleTrendlines?: boolean;
  data: Array<Record<string, unknown>>;
}

// Generate random vibrant colors
export const generateRandomColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 60 + Math.floor(Math.random() * 40);
  const lightness = 40 + Math.floor(Math.random() * 30);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const generateRandomColors = (count: number): string[] => {
  return Array.from({ length: count }, () => generateRandomColor());
};

let cachedColors: string[] = [];
export const getRandomColorPalette = (count: number = 20): string[] => {
  if (cachedColors.length < count) {
    cachedColors = generateRandomColors(Math.max(count, 20));
  }
  return cachedColors.slice(0, count);
};

// ECharts chart type configurations
export const ECHARTS_TYPE_CONFIGS: Record<string, EChartsConfig> = {
  // Bar Charts
  bar: {
    chartType: "bar",
    echartsType: "bar",
    keywords: ["bar", "bars", "column", "columns"],
    generateOption: (config) => {
      const keys = config.dataKeys || [config.valueKey];
      const series = keys.map((key, idx) => ({
        name: key,
        type: "bar" as const,
        data: config.data.map((item) => {
          const val = item[key];
          return typeof val === "number" ? val : 0;
        }),
        itemStyle: {
          color: config.colors[idx % config.colors.length],
        },
        ...(config.isStacked && { stack: "stack1" }),
      }));

      return {
        animation: true,
        animationDuration: 1000,
        animationEasing: "cubicOut",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          backgroundColor: "rgba(50, 50, 50, 0.9)",
          borderColor: "#777",
          borderWidth: 1,
          textStyle: {
            color: "#fff",
          },
        },
        legend: {
          data: keys,
          top: "top",
          textStyle: {
            fontSize: 12,
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "15%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: config.data.map((item) => String(item[config.nameKey] || "")),
          axisLabel: {
            rotate: config.data.length > 10 ? 45 : 0,
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#e0e0e0",
            },
          },
        },
        series,
      };
    },
  },

  stackedbar: {
    chartType: "stackedbar",
    echartsType: "bar",
    keywords: ["stacked bar", "stacked column", "stacked bars"],
    generateOption: (config) => {
      const keys = config.dataKeys || [config.valueKey];
      const series = keys.map((key, idx) => ({
        name: key,
        type: "bar" as const,
        data: config.data.map((item) => {
          const val = item[key];
          return typeof val === "number" ? val : 0;
        }),
        itemStyle: {
          color: config.colors[idx % config.colors.length],
        },
        stack: "stack1",
      }));

      return {
        animation: true,
        animationDuration: 1000,
        animationEasing: "cubicOut",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          backgroundColor: "rgba(50, 50, 50, 0.9)",
          borderColor: "#777",
          borderWidth: 1,
          textStyle: {
            color: "#fff",
          },
        },
        legend: {
          data: keys,
          top: "top",
          textStyle: {
            fontSize: 12,
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "15%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: config.data.map((item) => String(item[config.nameKey] || "")),
          axisLabel: {
            rotate: config.data.length > 10 ? 45 : 0,
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#e0e0e0",
            },
          },
        },
        series,
      };
    },
  },

  groupedbar: {
    chartType: "groupedbar",
    echartsType: "bar",
    keywords: ["grouped bar", "grouped column", "grouped bars"],
    generateOption: (config) => {
      const keys = config.dataKeys || [config.valueKey];
      const series = keys.map((key, idx) => ({
        name: key,
        type: "bar" as const,
        data: config.data.map((item) => {
          const val = item[key];
          return typeof val === "number" ? val : 0;
        }),
        itemStyle: {
          color: config.colors[idx % config.colors.length],
        },
      }));

      return {
        animation: true,
        animationDuration: 1000,
        animationEasing: "cubicOut",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          backgroundColor: "rgba(50, 50, 50, 0.9)",
          borderColor: "#777",
          borderWidth: 1,
          textStyle: {
            color: "#fff",
          },
        },
        legend: {
          data: keys,
          top: "top",
          textStyle: {
            fontSize: 12,
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "15%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: config.data.map((item) => String(item[config.nameKey] || "")),
          axisLabel: {
            rotate: config.data.length > 10 ? 45 : 0,
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#e0e0e0",
            },
          },
        },
        series,
      };
    },
  },

  // Line Charts
  line: {
    chartType: "line",
    echartsType: "line",
    keywords: ["line", "lines", "graph", "graphs", "trend"],
    generateOption: (config) => {
      const keys = config.dataKeys || [config.valueKey];
      const series: echarts.SeriesOption[] = keys.map((key, idx) => ({
        name: key,
        type: "line" as const,
        data: config.data.map((item) => {
          const val = item[key];
          return typeof val === "number" ? val : 0;
        }),
        lineStyle: {
          color: config.colors[idx % config.colors.length],
        },
        itemStyle: {
          color: config.colors[idx % config.colors.length],
        },
        smooth: true,
      }));

      // Add trendlines if requested
      if (config.hasTrendline) {
        const trendlineKeys =
          config.multipleTrendlines && config.dataKeys
            ? config.dataKeys
            : [config.valueKey];

        trendlineKeys.forEach((key, idx) => {
          const values = config.data.map((item) => {
            const val = item[key];
            return typeof val === "number" ? val : 0;
          });

          // Calculate linear regression
          const n = values.length;
          const sumX = values.reduce((sum, _, i) => sum + i, 0);
          const sumY = values.reduce((sum, val) => sum + val, 0);
          const sumXY = values.reduce((sum, val, i) => sum + i * val, 0);
          const sumXX = values.reduce((sum, _, i) => sum + i * i, 0);

          const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
          const intercept = (sumY - slope * sumX) / n;

          const trendlineData = values.map((_, i) => slope * i + intercept);
          const trendlineColors = generateRandomColors(10);

          series.push({
            name: `${key} Trend`,
            type: "line" as const,
            data: trendlineData,
            lineStyle: {
              color: trendlineColors[idx % trendlineColors.length],
              type: "dashed" as const,
              width: 2,
            },
            itemStyle: {
              color: trendlineColors[idx % trendlineColors.length],
              opacity: 0,
            },
            symbol: "none",
          } as echarts.SeriesOption);
        });
      }

      return {
        animation: true,
        animationDuration: 1000,
        animationEasing: "cubicOut",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
          },
          backgroundColor: "rgba(50, 50, 50, 0.9)",
          borderColor: "#777",
          borderWidth: 1,
          textStyle: {
            color: "#fff",
          },
        },
        legend: {
          data: [
            ...keys,
            ...(config.hasTrendline ? keys.map((k) => `${k} Trend`) : []),
          ],
          top: "top",
          textStyle: {
            fontSize: 12,
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "15%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: config.data.map((item) => String(item[config.nameKey] || "")),
          axisLabel: {
            rotate: config.data.length > 10 ? 45 : 0,
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#e0e0e0",
            },
          },
        },
        series,
      };
    },
  },

  // Area Charts
  area: {
    chartType: "line",
    echartsType: "line",
    keywords: ["area", "areas", "filled"],
    generateOption: (config) => {
      const keys = config.dataKeys || [config.valueKey];
      const series = keys.map((key, idx) => ({
        name: key,
        type: "line" as const,
        data: config.data.map((item) => {
          const val = item[key];
          return typeof val === "number" ? val : 0;
        }),
        areaStyle: {
          color: config.colors[idx % config.colors.length],
          opacity: 0.6,
        },
        lineStyle: {
          color: config.colors[idx % config.colors.length],
        },
        itemStyle: {
          color: config.colors[idx % config.colors.length],
        },
        smooth: true,
        ...(config.isStacked && { stack: "stack1" }),
      }));

      return {
        animation: true,
        animationDuration: 1000,
        animationEasing: "cubicOut",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          backgroundColor: "rgba(50, 50, 50, 0.9)",
          borderColor: "#777",
          borderWidth: 1,
          textStyle: {
            color: "#fff",
          },
        },
        legend: {
          data: keys,
          top: "top",
          textStyle: {
            fontSize: 12,
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "15%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: config.data.map((item) => String(item[config.nameKey] || "")),
          axisLabel: {
            rotate: config.data.length > 10 ? 45 : 0,
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#e0e0e0",
            },
          },
        },
        series,
      };
    },
  },

  stackedarea: {
    chartType: "stackedarea",
    echartsType: "line",
    keywords: ["stacked area", "stacked areas"],
    generateOption: (config) => {
      const keys = config.dataKeys || [config.valueKey];
      const series = keys.map((key, idx) => ({
        name: key,
        type: "line" as const,
        data: config.data.map((item) => {
          const val = item[key];
          return typeof val === "number" ? val : 0;
        }),
        areaStyle: {
          color: config.colors[idx % config.colors.length],
          opacity: 0.6,
        },
        lineStyle: {
          color: config.colors[idx % config.colors.length],
        },
        itemStyle: {
          color: config.colors[idx % config.colors.length],
        },
        smooth: true,
        stack: "stack1",
      }));

      return {
        animation: true,
        animationDuration: 1000,
        animationEasing: "cubicOut",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          backgroundColor: "rgba(50, 50, 50, 0.9)",
          borderColor: "#777",
          borderWidth: 1,
          textStyle: {
            color: "#fff",
          },
        },
        legend: {
          data: keys,
          top: "top",
          textStyle: {
            fontSize: 12,
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "15%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: config.data.map((item) => String(item[config.nameKey] || "")),
          axisLabel: {
            rotate: config.data.length > 10 ? 45 : 0,
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#e0e0e0",
            },
          },
        },
        series,
      };
    },
  },

  // Pie Charts
  pie: {
    chartType: "pie",
    echartsType: "pie",
    keywords: ["pie", "pies", "circle", "percentage", "proportion"],
    generateOption: (config) => ({
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: config.valueKey,
          type: "pie",
          radius: "50%",
          data: config.data.map((item, idx) => {
            const val = item[config.valueKey];
            return {
              value:
                typeof val === "number"
                  ? val
                  : typeof val === "string"
                  ? parseFloat(val) || 0
                  : 0,
              name: String(item[config.nameKey] || ""),
              itemStyle: {
                color: config.colors[idx % config.colors.length],
              },
            };
          }),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    }),
  },

  donut: {
    chartType: "donut",
    echartsType: "pie",
    keywords: ["donut", "doughnut"],
    generateOption: (config) => ({
      animation: true,
      animationDuration: 1000,
      animationEasing: "cubicOut",
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
        backgroundColor: "rgba(50, 50, 50, 0.9)",
        borderColor: "#777",
        borderWidth: 1,
        textStyle: {
          color: "#fff",
        },
      },
      legend: {
        orient: "vertical",
        left: "left",
        textStyle: {
          fontSize: 12,
        },
      },
      series: [
        {
          name: config.valueKey,
          type: "pie",
          radius: ["40%", "70%"],
          data: config.data.map((item, idx) => {
            const val = item[config.valueKey];
            return {
              value:
                typeof val === "number"
                  ? val
                  : typeof val === "string"
                  ? parseFloat(val) || 0
                  : 0,
              name: String(item[config.nameKey] || ""),
              itemStyle: {
                color: config.colors[idx % config.colors.length],
              },
            };
          }),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    }),
  },

  // Scatter Charts
  scatter: {
    chartType: "scatter",
    echartsType: "scatter",
    keywords: ["scatter", "scatter plot", "scatterplot"],
    generateOption: (config) => {
      const keys = config.dataKeys || [config.valueKey];
      const series = keys.map((key, idx) => ({
        name: key,
        type: "scatter" as const,
        data: config.data.map((item) => {
          const xVal = item[config.nameKey];
          const yVal = item[key];
          return [
            typeof xVal === "number" ? xVal : 0,
            typeof yVal === "number" ? yVal : 0,
          ];
        }),
        itemStyle: {
          color: config.colors[idx % config.colors.length],
        },
      }));

      return {
        animation: true,
        animationDuration: 1000,
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(50, 50, 50, 0.9)",
          borderColor: "#777",
          borderWidth: 1,
          textStyle: {
            color: "#fff",
          },
        },
        legend: {
          data: keys,
          top: "top",
          textStyle: {
            fontSize: 12,
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "15%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#e0e0e0",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#e0e0e0",
            },
          },
        },
        series,
      };
    },
  },

  bubble: {
    chartType: "bubble",
    echartsType: "scatter",
    keywords: ["bubble", "bubbles"],
    generateOption: (config) => {
      const keys = config.dataKeys || [config.valueKey];
      const series = keys.map((key, idx) => ({
        name: key,
        type: "scatter" as const,
        symbolSize: (data: number[]) => Math.sqrt(data[1]) * 2,
        data: config.data.map((item) => {
          const xVal = item[config.nameKey];
          const yVal = item[key];
          return [
            typeof xVal === "number" ? xVal : 0,
            typeof yVal === "number" ? yVal : 0,
          ];
        }),
        itemStyle: {
          color: config.colors[idx % config.colors.length],
        },
      }));

      return {
        tooltip: { trigger: "item" },
        legend: { data: keys },
        xAxis: { type: "value" },
        yAxis: { type: "value" },
        series,
      };
    },
  },

  // Radar Charts
  radar: {
    chartType: "radar",
    echartsType: "radar",
    keywords: ["radar", "spider", "web", "polar"],
    generateOption: (config) => {
      const keys = config.dataKeys || [config.valueKey];
      const indicators = config.data.map((item) => ({
        name: String(item[config.nameKey] || ""),
        max: Math.max(
          ...config.data.map((d) => {
            const maxVal = Math.max(
              ...keys.map((k) => {
                const val = d[k];
                return typeof val === "number" ? val : 0;
              })
            );
            return maxVal;
          })
        ),
      }));

      const series = keys.map((key, idx) => ({
        name: key,
        type: "radar" as const,
        data: [
          {
            value: config.data.map((item) => {
              const val = item[key];
              return typeof val === "number" ? val : 0;
            }),
            name: key,
            itemStyle: {
              color: config.colors[idx % config.colors.length],
            },
            areaStyle: {
              color: config.colors[idx % config.colors.length],
              opacity: 0.6,
            },
          },
        ],
      }));

      return {
        tooltip: { trigger: "item" },
        legend: { data: keys },
        radar: {
          indicator: indicators,
        },
        series,
      };
    },
  },

  // Heatmap
  heatmap: {
    chartType: "heatmap",
    echartsType: "heatmap",
    keywords: ["heatmap", "heat map"],
    generateOption: (config) => ({
      tooltip: {
        position: "top",
      },
      grid: {
        height: "50%",
        top: "10%",
      },
      xAxis: {
        type: "category",
        data: config.data.map((item) => String(item[config.nameKey] || "")),
        splitArea: {
          show: true,
        },
      },
      yAxis: {
        type: "category",
        splitArea: {
          show: true,
        },
      },
      visualMap: {
        min: 0,
        max: Math.max(
          ...config.data.map((item) => {
            const val = item[config.valueKey];
            return typeof val === "number" ? val : 0;
          })
        ),
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "15%",
        inRange: {
          color: config.colors,
        },
      },
      series: [
        {
          name: config.valueKey,
          type: "heatmap",
          data: config.data.map((item, idx) => {
            const val = item[config.valueKey];
            return [
              idx,
              0,
              typeof val === "number"
                ? val
                : typeof val === "string"
                ? parseFloat(val) || 0
                : 0,
            ];
          }),
          label: {
            show: true,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    }),
  },

  // Treemap
  treemap: {
    chartType: "treemap",
    echartsType: "treemap",
    keywords: ["treemap", "tree map", "hierarchy"],
    generateOption: (config) => ({
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          type: "treemap",
          data: config.data.map((item, idx) => {
            const val = item[config.valueKey];
            return {
              name: String(item[config.nameKey] || ""),
              value:
                typeof val === "number"
                  ? val
                  : typeof val === "string"
                  ? parseFloat(val) || 0
                  : 0,
              itemStyle: {
                color: config.colors[idx % config.colors.length],
              },
            };
          }),
        },
      ],
    }),
  },

  // Funnel
  funnel: {
    chartType: "funnel",
    echartsType: "funnel",
    keywords: ["funnel", "funnels", "conversion"],
    generateOption: (config) => ({
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      series: [
        {
          name: config.valueKey,
          type: "funnel",
          left: "10%",
          top: 60,
          bottom: 60,
          width: "80%",
          min: 0,
          max: Math.max(
            ...config.data.map((item) => {
              const val = item[config.valueKey];
              return typeof val === "number" ? val : 0;
            })
          ),
          minSize: "0%",
          maxSize: "100%",
          sort: "descending",
          gap: 2,
          label: {
            show: true,
            position: "inside",
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: "solid",
            },
          },
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 1,
          },
          emphasis: {
            label: {
              fontSize: 20,
            },
          },
          data: config.data.map((item, idx) => {
            const val = item[config.valueKey];
            return {
              value:
                typeof val === "number"
                  ? val
                  : typeof val === "string"
                  ? parseFloat(val) || 0
                  : 0,
              name: String(item[config.nameKey] || ""),
              itemStyle: {
                color: config.colors[idx % config.colors.length],
              },
            };
          }),
        },
      ],
    }),
  },

  // Sankey
  sankey: {
    chartType: "sankey",
    echartsType: "sankey",
    keywords: ["sankey", "flow", "alluvial"],
    generateOption: (config) => {
      // Sankey requires special data format
      const nodes: Array<{ name: string }> = [];
      const links: Array<{ source: string; target: string; value: number }> =
        [];

      config.data.forEach((item, idx) => {
        const source = String(item[config.nameKey] || `Node${idx}`);
        const value =
          typeof item[config.valueKey] === "number" ? item[config.valueKey] : 0;

        if (!nodes.find((n) => n.name === source)) {
          nodes.push({ name: source });
        }

        if (idx < config.data.length - 1) {
          const target = String(
            config.data[idx + 1][config.nameKey] || `Node${idx + 1}`
          );
          if (!nodes.find((n) => n.name === target)) {
            nodes.push({ name: target });
          }
          links.push({
            source,
            target,
            value:
              typeof value === "number"
                ? value
                : typeof value === "string"
                ? parseFloat(value) || 0
                : 0,
          });
        }
      });

      return {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
        },
        series: [
          {
            type: "sankey",
            data: nodes,
            links,
            emphasis: {
              focus: "adjacency",
            },
            lineStyle: {
              color: "gradient",
              curveness: 0.5,
            },
          },
        ],
      };
    },
  },

  // Sunburst
  sunburst: {
    chartType: "sunburst",
    echartsType: "sunburst",
    keywords: ["sunburst", "sun burst", "hierarchical pie"],
    generateOption: (config) => ({
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          type: "sunburst",
          data: config.data.map((item, idx) => {
            const val = item[config.valueKey];
            return {
              name: String(item[config.nameKey] || ""),
              value:
                typeof val === "number"
                  ? val
                  : typeof val === "string"
                  ? parseFloat(val) || 0
                  : 0,
              itemStyle: {
                color: config.colors[idx % config.colors.length],
              },
            };
          }),
          radius: [0, "90%"],
          label: {
            rotate: "radial",
          },
        },
      ],
    }),
  },

  // Gauge/Radial Bar
  radialbar: {
    chartType: "radialbar",
    echartsType: "gauge",
    keywords: ["radial", "radial bar", "gauge"],
    generateOption: (config) => ({
      tooltip: {
        formatter: "{a} <br/>{b}: {c}",
      },
      series: [
        {
          name: config.valueKey,
          type: "gauge",
          data: [
            {
              value: (() => {
                const val = config.data[0]?.[config.valueKey];
                return typeof val === "number"
                  ? val
                  : typeof val === "string"
                  ? parseFloat(val) || 0
                  : 0;
              })(),
              name: String(config.data[0]?.[config.nameKey] || ""),
            },
          ],
          axisLine: {
            lineStyle: {
              color: [[1, config.colors[0]]],
            },
          },
        },
      ],
    }),
  },

  // Polar Area
  polararea: {
    chartType: "polararea",
    echartsType: "polar",
    keywords: ["polar area", "polar area chart"],
    generateOption: (config) => {
      const keys = config.dataKeys || [config.valueKey];
      const series = keys.map((key, idx) => ({
        name: key,
        type: "bar" as const,
        data: config.data.map((item) => {
          const val = item[key];
          return typeof val === "number"
            ? val
            : typeof val === "string"
            ? parseFloat(val) || 0
            : 0;
        }),
        coordinateSystem: "polar" as const,
        itemStyle: {
          color: config.colors[idx % config.colors.length],
        },
      }));

      return {
        tooltip: { trigger: "axis" },
        polar: {},
        angleAxis: {
          type: "category",
          data: config.data.map((item) => String(item[config.nameKey] || "")),
        },
        radiusAxis: {},
        series,
      };
    },
  },

  // Histogram
  histogram: {
    chartType: "histogram",
    echartsType: "bar",
    keywords: ["histogram", "histograms"],
    generateOption: (config) => ({
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: config.data.map((item) => String(item[config.nameKey] || "")),
      },
      yAxis: { type: "value" },
      series: [
        {
          name: config.valueKey,
          type: "bar",
          data: config.data.map((item) => {
            const val = item[config.valueKey];
            return typeof val === "number" ? val : 0;
          }),
          itemStyle: {
            color: config.colors[0],
          },
        },
      ],
    }),
  },

  // Box Plot
  boxplot: {
    chartType: "boxplot",
    echartsType: "boxplot",
    keywords: ["box plot", "boxplot", "box and whisker"],
    generateOption: (config) => {
      // Box plot requires calculated quartiles
      const values = config.data
        .map((item) => {
          const val = item[config.valueKey];
          return typeof val === "number" ? val : 0;
        })
        .sort((a, b) => a - b);

      const q1 = values[Math.floor(values.length * 0.25)];
      const median = values[Math.floor(values.length * 0.5)];
      const q3 = values[Math.floor(values.length * 0.75)];
      const min = values[0];
      const max = values[values.length - 1];

      return {
        animation: true,
        animationDuration: 1000,
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(50, 50, 50, 0.9)",
          borderColor: "#777",
          borderWidth: 1,
          textStyle: {
            color: "#fff",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: config.data.map((item) => String(item[config.nameKey] || "")),
          axisLabel: {
            rotate: config.data.length > 10 ? 45 : 0,
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#e0e0e0",
            },
          },
        },
        series: [
          {
            name: config.valueKey,
            type: "boxplot",
            data: [[min, q1, median, q3, max]],
            itemStyle: {
              color: config.colors[0],
            },
          },
        ],
      };
    },
  },

  // Lollipop
  lollipop: {
    chartType: "lollipop",
    echartsType: "scatter",
    keywords: ["lollipop", "lollipops"],
    generateOption: (config) => ({
      tooltip: { trigger: "item" },
      xAxis: {
        type: "category",
        data: config.data.map((item) => String(item[config.nameKey] || "")),
      },
      yAxis: { type: "value" },
      series: [
        {
          name: config.valueKey,
          type: "scatter",
          symbolSize: (data: number | number[]) => {
            const val = Array.isArray(data) ? data[1] : data;
            return Math.abs(typeof val === "number" ? val : 0) * 2;
          },
          data: config.data.map((item) => {
            const val = item[config.valueKey];
            return [
              config.data.indexOf(item),
              typeof val === "number"
                ? val
                : typeof val === "string"
                ? parseFloat(val) || 0
                : 0,
            ];
          }),
          itemStyle: {
            color: config.colors[0],
          },
        },
      ],
    }),
  },

  // Density Plot
  density: {
    chartType: "density",
    echartsType: "line",
    keywords: ["density plot", "density"],
    generateOption: (config) => ({
      animation: true,
      animationDuration: 1000,
      animationEasing: "cubicOut",
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(50, 50, 50, 0.9)",
        borderColor: "#777",
        borderWidth: 1,
        textStyle: {
          color: "#fff",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: config.data.map((item) => String(item[config.nameKey] || "")),
        axisLabel: {
          rotate: config.data.length > 10 ? 45 : 0,
          interval: 0,
        },
        axisLine: {
          lineStyle: {
            color: "#666",
          },
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#666",
          },
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
            color: "#e0e0e0",
          },
        },
      },
      series: [
        {
          name: config.valueKey,
          type: "line",
          areaStyle: {
            color: config.colors[0],
            opacity: 0.6,
          },
          lineStyle: {
            color: config.colors[0],
          },
          smooth: true,
          data: config.data.map((item) => {
            const val = item[config.valueKey];
            return typeof val === "number" ? val : 0;
          }),
        },
      ],
    }),
  },

  // Candlestick Chart (Financial)
  candlestick: {
    chartType: "candlestick",
    echartsType: "candlestick",
    keywords: [
      "candlestick",
      "candle",
      "ohlc",
      "financial",
      "stock",
      "trading",
    ],
    generateOption: (config) => {
      // Candlestick requires [open, close, low, high] format
      const keys = config.dataKeys || [config.valueKey];
      const ohlcKeys =
        keys.length >= 4
          ? keys.slice(0, 4)
          : [
              keys[0],
              keys[0] || config.valueKey,
              keys[0] || config.valueKey,
              keys[0] || config.valueKey,
            ];

      return {
        animation: true,
        animationDuration: 1000,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          backgroundColor: "rgba(50, 50, 50, 0.9)",
          borderColor: "#777",
          borderWidth: 1,
          textStyle: {
            color: "#fff",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "15%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: config.data.map((item) => String(item[config.nameKey] || "")),
          scale: true,
          boundaryGap: false,
          axisLabel: {
            rotate: config.data.length > 10 ? 45 : 0,
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true,
          },
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#e0e0e0",
            },
          },
        },
        series: [
          {
            name: "Candlestick",
            type: "candlestick",
            data: config.data.map((item) => {
              const openVal = item[ohlcKeys[0]];
              const closeVal = item[ohlcKeys[1]];
              const lowVal = item[ohlcKeys[2]];
              const highVal = item[ohlcKeys[3]];
              const open = typeof openVal === "number" ? openVal : 0;
              const close = typeof closeVal === "number" ? closeVal : 0;
              const low =
                typeof lowVal === "number" ? lowVal : Math.min(open, close);
              const high =
                typeof highVal === "number" ? highVal : Math.max(open, close);
              return [open, close, low, high] as [
                number,
                number,
                number,
                number
              ];
            }),
            itemStyle: {
              color: config.colors[0],
              color0: config.colors[1] || config.colors[0],
              borderColor: config.colors[0],
              borderColor0: config.colors[1] || config.colors[0],
            },
          },
        ],
      };
    },
  },

  // Parallel Coordinates
  parallel: {
    chartType: "parallel",
    echartsType: "parallel",
    keywords: [
      "parallel",
      "parallel coordinates",
      "multivariate",
      "correlation",
    ],
    generateOption: (config) => {
      const keys = config.dataKeys || [config.valueKey];
      const parallelAxis = keys.map((key) => ({
        dim: keys.indexOf(key),
        name: key,
        type: "value" as const,
      }));

      return {
        animation: true,
        animationDuration: 1000,
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(50, 50, 50, 0.9)",
          borderColor: "#777",
          borderWidth: 1,
          textStyle: {
            color: "#fff",
          },
        },
        parallelAxis,
        series: [
          {
            type: "parallel",
            lineStyle: {
              color: config.colors[0],
              width: 1,
              opacity: 0.6,
            },
            data: config.data.map((item) =>
              keys.map((key) => {
                const val = item[key];
                return typeof val === "number"
                  ? val
                  : typeof val === "string"
                  ? parseFloat(val) || 0
                  : 0;
              })
            ),
          },
        ],
      };
    },
  },

  // Graph/Network Diagram
  graph: {
    chartType: "graph",
    echartsType: "graph",
    keywords: [
      "graph",
      "network",
      "node",
      "link",
      "relationship",
      "connection",
      "graph diagram",
    ],
    generateOption: (config) => {
      const nodes: Array<{ name: string; value?: number; category?: number }> =
        [];
      const links: Array<{ source: string; target: string; value?: number }> =
        [];
      const categories: Array<{ name: string }> = [{ name: "Default" }];

      config.data.forEach((item, idx) => {
        const nodeName = String(item[config.nameKey] || `Node${idx}`);
        const nodeValue =
          typeof item[config.valueKey] === "number" ? item[config.valueKey] : 0;

        if (!nodes.find((n) => n.name === nodeName)) {
          nodes.push({
            name: nodeName,
            value: typeof nodeValue === "number" ? nodeValue : 0,
            category: 0,
          });
        }

        // Create links between consecutive items
        if (idx < config.data.length - 1) {
          const targetName = String(
            config.data[idx + 1][config.nameKey] || `Node${idx + 1}`
          );
          links.push({
            source: nodeName,
            target: targetName,
            value: typeof nodeValue === "number" ? nodeValue : 0,
          });
        }
      });

      return {
        animation: true,
        animationDuration: 1000,
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(50, 50, 50, 0.9)",
          borderColor: "#777",
          borderWidth: 1,
          textStyle: {
            color: "#fff",
          },
        },
        legend: {
          data: categories.map((c) => c.name),
          top: "top",
          textStyle: {
            fontSize: 12,
          },
        },
        series: [
          {
            type: "graph",
            layout: "force",
            symbolSize: (data: { value?: number | unknown }) => {
              const val = typeof data.value === "number" ? data.value : 10;
              return Math.max(10, Math.min(50, val / 10));
            },
            roam: true,
            label: {
              show: true,
              position: "right",
            },
            edgeLabel: {
              show: true,
              formatter: "{c}",
            },
            data: nodes,
            links,
            categories,
            lineStyle: {
              color: "source",
              curveness: 0.3,
            },
            emphasis: {
              focus: "adjacency",
              lineStyle: {
                width: 4,
              },
            },
          },
        ],
      };
    },
  },

  // Theme River
  themeriver: {
    chartType: "themeriver",
    echartsType: "themeRiver",
    keywords: ["theme river", "stream", "flow", "timeline", "event flow"],
    generateOption: (config) => {
      const keys = config.dataKeys || [config.valueKey];
      const data: Array<[string, number, string]> = [];

      config.data.forEach((item) => {
        const date = String(item[config.nameKey] || "");
        keys.forEach((key) => {
          const val = item[key];
          const value =
            typeof val === "number"
              ? val
              : typeof val === "string"
              ? parseFloat(val) || 0
              : 0;
          data.push([date, value, key]);
        });
      });

      return {
        animation: true,
        animationDuration: 1000,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            lineStyle: {
              color: "rgba(0,0,0,0.2)",
            },
          },
          backgroundColor: "rgba(50, 50, 50, 0.9)",
          borderColor: "#777",
          borderWidth: 1,
          textStyle: {
            color: "#fff",
          },
        },
        singleAxis: {
          top: 50,
          bottom: 50,
          axisTick: {},
          axisLabel: {},
          type: "time",
          axisPointer: {
            animation: true,
            label: {
              show: true,
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              opacity: 0.2,
            },
          },
        },
        series: [
          {
            type: "themeRiver",
            emphasis: {
              itemStyle: {
                shadowBlur: 20,
                shadowColor: "rgba(0, 0, 0, 0.8)",
              },
            },
            data,
          },
        ],
      };
    },
  },

  // Effect Scatter
  effectscatter: {
    chartType: "effectscatter",
    echartsType: "effectScatter",
    keywords: [
      "effect scatter",
      "ripple",
      "animated scatter",
      "pulsing scatter",
    ],
    generateOption: (config) => {
      const keys = config.dataKeys || [config.valueKey];
      const series = keys.map((key, idx) => ({
        name: key,
        type: "effectScatter" as const,
        data: config.data.map((item) => {
          const xVal = item[config.nameKey];
          const yVal = item[key];
          return [
            typeof xVal === "number" ? xVal : 0,
            typeof yVal === "number" ? yVal : 0,
          ];
        }),
        rippleEffect: {
          brushType: "stroke" as const,
          scale: 2.5,
        },
        itemStyle: {
          color: config.colors[idx % config.colors.length],
        },
      }));

      return {
        animation: true,
        animationDuration: 1000,
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(50, 50, 50, 0.9)",
          borderColor: "#777",
          borderWidth: 1,
          textStyle: {
            color: "#fff",
          },
        },
        legend: {
          data: keys,
          top: "top",
          textStyle: {
            fontSize: 12,
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "15%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#e0e0e0",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#e0e0e0",
            },
          },
        },
        series,
      };
    },
  },

  // Lines (Route Visualization)
  lines: {
    chartType: "lines",
    echartsType: "lines",
    keywords: [
      "lines",
      "route",
      "path",
      "trajectory",
      "movement",
      "flow lines",
    ],
    generateOption: (config) => {
      // Lines chart requires coordinate pairs
      const coords: number[][] = config.data.map((item, idx) => {
        const xVal = item[config.nameKey];
        const yVal = item[config.valueKey];
        return [
          typeof xVal === "number" ? xVal : idx,
          typeof yVal === "number" ? yVal : 0,
        ];
      });

      return {
        animation: true,
        animationDuration: 1000,
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(50, 50, 50, 0.9)",
          borderColor: "#777",
          borderWidth: 1,
          textStyle: {
            color: "#fff",
          },
        },
        geo: {
          map: "world",
          roam: true,
          itemStyle: {
            areaColor: "#f3f3f3",
            borderColor: "#999",
          },
          emphasis: {
            itemStyle: {
              areaColor: "#f9f9f9",
            },
          },
        },
        series: [
          {
            type: "lines",
            coordinateSystem: "geo",
            polyline: true,
            data: [
              {
                coords,
                lineStyle: {
                  color: config.colors[0],
                  width: 2,
                },
              },
            ],
            effect: {
              show: true,
              period: 4,
              trailLength: 0.02,
              symbol: "arrow",
              symbolSize: 5,
            },
          },
        ],
      };
    },
  },

  // Tree (Hierarchical Tree)
  tree: {
    chartType: "tree",
    echartsType: "tree",
    keywords: [
      "tree",
      "hierarchical tree",
      "organization",
      "org chart",
      "tree diagram",
    ],
    generateOption: (config) => {
      // Build tree structure from flat data
      interface TreeNode {
        name: string;
        value: number;
        children: TreeNode[];
      }

      const buildTree = (
        items: Array<Record<string, unknown>>
      ): TreeNode | null => {
        if (items.length === 0) return null;

        const val0 = items[0][config.valueKey];
        const root: TreeNode = {
          name: String(items[0][config.nameKey] || "Root"),
          value:
            typeof val0 === "number"
              ? val0
              : typeof val0 === "string"
              ? parseFloat(val0) || 0
              : 0,
          children: [],
        };

        items.slice(1).forEach((item) => {
          const val = item[config.valueKey];
          root.children.push({
            name: String(item[config.nameKey] || `Node${items.indexOf(item)}`),
            value:
              typeof val === "number"
                ? val
                : typeof val === "string"
                ? parseFloat(val) || 0
                : 0,
            children: [],
          });
        });

        return root;
      };

      const treeData = buildTree(config.data);
      if (!treeData) {
        return {
          tooltip: { trigger: "item" },
          series: [],
        };
      }

      return {
        animation: true,
        animationDuration: 1000,
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
          backgroundColor: "rgba(50, 50, 50, 0.9)",
          borderColor: "#777",
          borderWidth: 1,
          textStyle: {
            color: "#fff",
          },
        },
        series: [
          {
            type: "tree",
            data: [treeData],
            top: "5%",
            left: "7%",
            bottom: "5%",
            right: "20%",
            symbolSize: 7,
            label: {
              position: "left",
              verticalAlign: "middle",
              align: "right",
              fontSize: 12,
            },
            leaves: {
              label: {
                position: "right",
                verticalAlign: "middle",
                align: "left",
              },
            },
            emphasis: {
              focus: "descendant",
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,
            lineStyle: {
              color: config.colors[0],
              width: 1.5,
              curveness: 0.5,
            },
          },
        ],
      };
    },
  },

  // Calendar Heatmap
  calendar: {
    chartType: "calendar",
    echartsType: "calendar",
    keywords: [
      "calendar",
      "calendar heatmap",
      "heat calendar",
      "activity calendar",
      "daily",
    ],
    generateOption: (config) => {
      // Generate calendar data - requires date and value
      const calendarData = config.data.map((item) => {
        const date = item[config.nameKey];
        const val = item[config.valueKey];
        return [
          typeof date === "string" ? date : String(date),
          typeof val === "number"
            ? val
            : typeof val === "string"
            ? parseFloat(val) || 0
            : 0,
        ];
      });

      // Get date range from data
      const dates = calendarData.map((d) => d[0] as string).sort();
      const startDate = dates[0] || "2024-01-01";
      const endDate = dates[dates.length - 1] || "2024-12-31";

      return {
        animation: true,
        animationDuration: 1000,
        tooltip: {
          trigger: "item",
          formatter: "{c}",
          backgroundColor: "rgba(50, 50, 50, 0.9)",
          borderColor: "#777",
          borderWidth: 1,
          textStyle: {
            color: "#fff",
          },
        },
        visualMap: {
          min: Math.min(...calendarData.map((d) => d[1] as number)),
          max: Math.max(...calendarData.map((d) => d[1] as number)),
          calculable: true,
          orient: "horizontal",
          left: "center",
          top: "top",
          inRange: {
            color: config.colors,
          },
        },
        calendar: {
          top: "middle",
          left: "center",
          orient: "vertical",
          cellSize: ["auto", 13],
          yearLabel: {
            margin: 50,
            fontSize: 14,
          },
          dayLabel: {
            firstDay: 1,
            nameMap: "en",
          },
          monthLabel: {
            nameMap: "en",
            margin: 5,
            fontSize: 12,
          },
          range: [startDate, endDate],
        },
        series: [
          {
            type: "heatmap",
            coordinateSystem: "calendar",
            data: calendarData,
          },
        ],
      };
    },
  },
};

// Detect chart type from prompt (reuse from chartConfig if needed)
export const detectEChartsType = (prompt: string): string => {
  const promptLower = prompt.toLowerCase().trim();

  // Check for trendline first
  if (
    promptLower.includes("dual trendline") ||
    promptLower.includes("multiple trendline") ||
    promptLower.match(/\b(dual|multiple)\s*(trendline|trend\s*line)\b/)
  ) {
    return "line"; // Will be handled with trendline flag
  }

  // Check all chart types in order of specificity
  const sortedConfigs = Object.entries(ECHARTS_TYPE_CONFIGS).sort((a, b) => {
    const aMaxKeyword = Math.max(...a[1].keywords.map((k) => k.length));
    const bMaxKeyword = Math.max(...b[1].keywords.map((k) => k.length));
    return bMaxKeyword - aMaxKeyword;
  });

  for (const [chartType, config] of sortedConfigs) {
    for (const keyword of config.keywords) {
      const regex = new RegExp(`\\b${keyword.replace(/\s+/g, "\\s+")}\\b`, "i");
      if (regex.test(promptLower)) {
        return chartType;
      }
    }
  }

  return "bar"; // Default
};

export const getEChartsConfig = (chartType: string): EChartsConfig | null => {
  return ECHARTS_TYPE_CONFIGS[chartType] || null;
};
