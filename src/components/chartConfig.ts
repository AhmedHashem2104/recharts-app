// Chart type configuration for all supported Recharts chart types
export interface ChartTypeConfig {
  chartType: string;
  componentName: string;
  keywords: string[]; // Keywords to detect this chart type from prompt
  requiresWrapper: boolean; // Whether it needs a special wrapper component
  defaultElements: (config: ElementConfig) => ChartElement[];
  supportsStacking?: boolean;
  supportsGrouping?: boolean;
  supportsMultipleSeries?: boolean;
}

export interface ChartElement {
  type: string;
  props?: Record<string, unknown>;
  children?: ChartElement[];
}

export interface ElementConfig {
  nameKey: string;
  valueKey: string;
  dataKeys?: string[];
  colors: string[];
  isStacked?: boolean;
  isGrouped?: boolean;
  hasTrendline?: boolean;
  multipleTrendlines?: boolean;
}

// Generate random vibrant colors
export const generateRandomColor = (): string => {
  // Generate a random hue (0-360) with good saturation and lightness
  const hue = Math.floor(Math.random() * 360);
  const saturation = 60 + Math.floor(Math.random() * 40); // 60-100%
  const lightness = 40 + Math.floor(Math.random() * 30); // 40-70%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Generate an array of random colors
export const generateRandomColors = (count: number): string[] => {
  return Array.from({ length: count }, () => generateRandomColor());
};

// Generate a palette of random colors (cached per session)
let cachedColors: string[] = [];
export const getRandomColorPalette = (count: number = 20): string[] => {
  if (cachedColors.length < count) {
    cachedColors = generateRandomColors(Math.max(count, 20));
  }
  return cachedColors.slice(0, count);
};

// Get a random color from the palette by index
export const getRandomColor = (index: number = 0): string => {
  const palette = getRandomColorPalette();
  return palette[index % palette.length];
};

// Default color palette - now uses random colors
export const DEFAULT_COLORS = getRandomColorPalette(20);

// Trendline colors - also random but distinct
export const TRENDLINE_COLORS = generateRandomColors(10);

// Generate common Cartesian chart elements (axes, grid, tooltip, legend)
export const generateCartesianElements = (
  nameKey: string,
  valueKey: string
): ChartElement[] => [
  { type: "CartesianGrid", props: { strokeDasharray: "3 3" } },
  {
    type: "XAxis",
    props: {
      dataKey: nameKey,
      label: {
        value: nameKey,
        position: "insideBottom",
        offset: -5,
      },
    },
  },
  {
    type: "YAxis",
    props: {
      label: {
        value: valueKey,
        angle: -90,
        position: "insideLeft",
      },
    },
  },
  { type: "Tooltip", props: {} },
  { type: "Legend", props: {} },
];

// Generate common Polar chart elements
export const generatePolarElements = (nameKey: string): ChartElement[] => [
  { type: "PolarGrid", props: {} },
  { type: "PolarAngleAxis", props: { dataKey: nameKey } },
  { type: "PolarRadiusAxis", props: {} },
  { type: "Tooltip", props: {} },
  { type: "Legend", props: {} },
];

// Chart type configurations
export const CHART_TYPE_CONFIGS: Record<string, ChartTypeConfig> = {
  // Bar Charts
  bar: {
    chartType: "bar",
    componentName: "BarChart",
    keywords: ["bar", "bars", "column", "columns"],
    requiresWrapper: false,
    supportsStacking: true,
    supportsGrouping: true,
    supportsMultipleSeries: true,
    defaultElements: (config) => {
      const elements = generateCartesianElements(
        config.nameKey,
        config.valueKey
      );
      const keys = config.dataKeys || [config.valueKey];
      const stackId = config.isStacked ? "stack1" : undefined;

      keys.forEach((key, idx) => {
        elements.push({
          type: "Bar",
          props: {
            dataKey: key,
            fill: config.colors[idx % config.colors.length],
            ...(stackId && { stackId }),
          },
        });
      });
      return elements;
    },
  },

  stackedbar: {
    chartType: "stackedbar",
    componentName: "BarChart",
    keywords: ["stacked bar", "stacked column", "stacked bars"],
    requiresWrapper: false,
    supportsStacking: true,
    supportsMultipleSeries: true,
    defaultElements: (config) => {
      const elements = generateCartesianElements(
        config.nameKey,
        config.valueKey
      );
      const keys = config.dataKeys || [config.valueKey];

      keys.forEach((key, idx) => {
        elements.push({
          type: "Bar",
          props: {
            dataKey: key,
            fill: config.colors[idx % config.colors.length],
            stackId: "stack1",
          },
        });
      });
      return elements;
    },
  },

  groupedbar: {
    chartType: "groupedbar",
    componentName: "BarChart",
    keywords: ["grouped bar", "grouped column", "grouped bars"],
    requiresWrapper: false,
    supportsGrouping: true,
    supportsMultipleSeries: true,
    defaultElements: (config) => {
      const elements = generateCartesianElements(
        config.nameKey,
        config.valueKey
      );
      const keys = config.dataKeys || [config.valueKey];

      keys.forEach((key, idx) => {
        elements.push({
          type: "Bar",
          props: {
            dataKey: key,
            fill: config.colors[idx % config.colors.length],
          },
        });
      });
      return elements;
    },
  },

  // Line Charts
  line: {
    chartType: "line",
    componentName: "LineChart",
    keywords: ["line", "lines", "graph", "graphs", "trend"],
    requiresWrapper: false,
    supportsMultipleSeries: true,
    defaultElements: (config) => {
      const elements = generateCartesianElements(
        config.nameKey,
        config.valueKey
      );
      const keys = config.dataKeys || [config.valueKey];

      keys.forEach((key, idx) => {
        elements.push({
          type: "Line",
          props: {
            type: "monotone",
            dataKey: key,
            stroke: config.colors[idx % config.colors.length],
            strokeWidth: 2,
          },
        });
      });
      return elements;
    },
  },

  // Area Charts
  area: {
    chartType: "area",
    componentName: "AreaChart",
    keywords: ["area", "areas", "filled"],
    requiresWrapper: false,
    supportsStacking: true,
    supportsMultipleSeries: true,
    defaultElements: (config) => {
      const elements = generateCartesianElements(
        config.nameKey,
        config.valueKey
      );
      const keys = config.dataKeys || [config.valueKey];
      const stackId = config.isStacked ? "stack1" : undefined;

      keys.forEach((key, idx) => {
        elements.push({
          type: "Area",
          props: {
            type: "monotone",
            dataKey: key,
            stroke: config.colors[idx % config.colors.length],
            fill: config.colors[idx % config.colors.length],
            fillOpacity: 0.6,
            ...(stackId && { stackId }),
          },
        });
      });
      return elements;
    },
  },

  stackedarea: {
    chartType: "stackedarea",
    componentName: "AreaChart",
    keywords: ["stacked area", "stacked areas"],
    requiresWrapper: false,
    supportsStacking: true,
    supportsMultipleSeries: true,
    defaultElements: (config) => {
      const elements = generateCartesianElements(
        config.nameKey,
        config.valueKey
      );
      const keys = config.dataKeys || [config.valueKey];

      keys.forEach((key, idx) => {
        elements.push({
          type: "Area",
          props: {
            type: "monotone",
            dataKey: key,
            stroke: config.colors[idx % config.colors.length],
            fill: config.colors[idx % config.colors.length],
            fillOpacity: 0.6,
            stackId: "stack1",
          },
        });
      });
      return elements;
    },
  },

  // Pie Charts
  pie: {
    chartType: "pie",
    componentName: "PieChart",
    keywords: ["pie", "pies", "circle", "percentage", "proportion"],
    requiresWrapper: true,
    defaultElements: (config) => [
      {
        type: "Pie",
        props: {
          dataKey: config.valueKey,
          cx: "50%",
          cy: "50%",
          label: true,
          outerRadius: 120,
        },
      },
      { type: "Tooltip", props: {} },
      { type: "Legend", props: {} },
    ],
  },

  donut: {
    chartType: "donut",
    componentName: "PieChart",
    keywords: ["donut", "doughnut"],
    requiresWrapper: true,
    defaultElements: (config) => [
      {
        type: "Pie",
        props: {
          dataKey: config.valueKey,
          cx: "50%",
          cy: "50%",
          label: true,
          outerRadius: 120,
          innerRadius: 60,
        },
      },
      { type: "Tooltip", props: {} },
      { type: "Legend", props: {} },
    ],
  },

  // Scatter Charts
  scatter: {
    chartType: "scatter",
    componentName: "ScatterChart",
    keywords: ["scatter", "scatter plot", "scatterplot"],
    requiresWrapper: false,
    supportsMultipleSeries: true,
    defaultElements: (config) => {
      const elements = generateCartesianElements(
        config.nameKey,
        config.valueKey
      );
      const keys = config.dataKeys || [config.valueKey];

      keys.forEach((key, idx) => {
        elements.push({
          type: "Scatter",
          props: {
            dataKey: key,
            fill: config.colors[idx % config.colors.length],
            name: key,
          },
        });
      });
      return elements;
    },
  },

  bubble: {
    chartType: "bubble",
    componentName: "ScatterChart",
    keywords: ["bubble", "bubbles"],
    requiresWrapper: false,
    supportsMultipleSeries: true,
    defaultElements: (config) => {
      const elements = generateCartesianElements(
        config.nameKey,
        config.valueKey
      );
      const keys = config.dataKeys || [config.valueKey];

      keys.forEach((key, idx) => {
        elements.push({
          type: "Scatter",
          props: {
            dataKey: key,
            fill: config.colors[idx % config.colors.length],
            name: key,
          },
        });
      });
      return elements;
    },
  },

  // Radar Charts
  radar: {
    chartType: "radar",
    componentName: "RadarChart",
    keywords: ["radar", "spider", "web", "polar"],
    requiresWrapper: true,
    supportsMultipleSeries: true,
    defaultElements: (config) => {
      const elements = generatePolarElements(config.nameKey);
      const keys = config.dataKeys || [config.valueKey];

      keys.forEach((key, idx) => {
        elements.push({
          type: "Radar",
          props: {
            dataKey: key,
            stroke: config.colors[idx % config.colors.length],
            fill: config.colors[idx % config.colors.length],
            fillOpacity: 0.6,
          },
        });
      });
      return elements;
    },
  },

  // Composed Charts
  composed: {
    chartType: "composed",
    componentName: "ComposedChart",
    keywords: ["composed", "combined", "mixed", "multiple", "overlay"],
    requiresWrapper: false,
    supportsMultipleSeries: true,
    defaultElements: (config) => {
      const elements = generateCartesianElements(
        config.nameKey,
        config.valueKey
      );
      const keys = config.dataKeys || [config.valueKey];

      keys.forEach((key, idx) => {
        const color = config.colors[idx % config.colors.length];
        if (idx === 0) {
          elements.push({
            type: "Bar",
            props: { dataKey: key, fill: color },
          });
        } else if (idx === 1) {
          elements.push({
            type: "Line",
            props: {
              type: "monotone",
              dataKey: key,
              stroke: color,
              strokeWidth: 2,
            },
          });
        } else {
          elements.push({
            type: "Area",
            props: {
              type: "monotone",
              dataKey: key,
              stroke: color,
              fill: color,
              fillOpacity: 0.6,
            },
          });
        }
      });
      return elements;
    },
  },

  // Treemap
  treemap: {
    chartType: "treemap",
    componentName: "Treemap",
    keywords: ["treemap", "tree map", "hierarchy"],
    requiresWrapper: true,
    defaultElements: (config) => [
      {
        type: "Treemap",
        props: {
          dataKey: config.valueKey,
          nameKey: config.nameKey,
          stroke: "#fff",
          fill: config.colors[0],
        },
      },
      { type: "Tooltip", props: {} },
    ],
  },

  // Funnel Chart
  funnel: {
    chartType: "funnel",
    componentName: "FunnelChart",
    keywords: ["funnel", "funnels", "conversion"],
    requiresWrapper: true,
    defaultElements: (config) => [
      {
        type: "Funnel",
        props: {
          dataKey: config.valueKey,
          nameKey: config.nameKey,
        },
      },
      { type: "Tooltip", props: {} },
      { type: "Legend", props: {} },
    ],
  },

  // Sankey
  sankey: {
    chartType: "sankey",
    componentName: "Sankey",
    keywords: ["sankey", "flow", "alluvial"],
    requiresWrapper: true,
    defaultElements: (config) => [
      {
        type: "Sankey",
        props: {
          dataKey: config.valueKey,
          nameKey: config.nameKey,
        },
      },
      { type: "Tooltip", props: {} },
    ],
  },

  // Sunburst
  sunburst: {
    chartType: "sunburst",
    componentName: "SunburstChart",
    keywords: ["sunburst", "sun burst", "hierarchical pie"],
    requiresWrapper: true,
    defaultElements: (config) => [
      {
        type: "Sunburst",
        props: {
          dataKey: config.valueKey,
          nameKey: config.nameKey,
        },
      },
      { type: "Tooltip", props: {} },
      { type: "Legend", props: {} },
    ],
  },

  // Radial Bar
  radialbar: {
    chartType: "radialbar",
    componentName: "RadialBarChart",
    keywords: ["radial", "radial bar"],
    requiresWrapper: true,
    supportsMultipleSeries: true,
    defaultElements: (config) => {
      const elements = generatePolarElements(config.nameKey);
      const keys = config.dataKeys || [config.valueKey];

      keys.forEach((key, idx) => {
        elements.push({
          type: "RadialBar",
          props: {
            dataKey: key,
            fill: config.colors[idx % config.colors.length],
          },
        });
      });
      return elements;
    },
  },

  // Histogram
  histogram: {
    chartType: "histogram",
    componentName: "BarChart",
    keywords: ["histogram", "histograms"],
    requiresWrapper: false,
    defaultElements: (config) => {
      const elements = generateCartesianElements(
        config.nameKey,
        config.valueKey
      );
      elements.push({
        type: "Bar",
        props: {
          dataKey: config.valueKey,
          fill: config.colors[0],
        },
      });
      return elements;
    },
  },

  // Box Plot
  boxplot: {
    chartType: "boxplot",
    componentName: "ComposedChart",
    keywords: ["box plot", "boxplot", "box and whisker"],
    requiresWrapper: false,
    defaultElements: (config) => {
      const elements = generateCartesianElements(
        config.nameKey,
        config.valueKey
      );
      elements.push({
        type: "Bar",
        props: {
          dataKey: config.valueKey,
          fill: config.colors[0],
        },
      });
      return elements;
    },
  },

  // Heatmap
  heatmap: {
    chartType: "heatmap",
    componentName: "BarChart",
    keywords: ["heatmap", "heat map"],
    requiresWrapper: false,
    defaultElements: (config) => {
      const elements = generateCartesianElements(
        config.nameKey,
        config.valueKey
      );
      elements.push({
        type: "Bar",
        props: {
          dataKey: config.valueKey,
          fill: config.colors[0],
        },
      });
      return elements;
    },
  },

  // Lollipop
  lollipop: {
    chartType: "lollipop",
    componentName: "ComposedChart",
    keywords: ["lollipop", "lollipops"],
    requiresWrapper: false,
    defaultElements: (config) => {
      const elements = generateCartesianElements(
        config.nameKey,
        config.valueKey
      );
      const color = config.colors[0];
      elements.push({
        type: "Line",
        props: {
          type: "monotone",
          dataKey: config.valueKey,
          stroke: color,
          strokeWidth: 2,
          dot: { r: 6, fill: color },
        },
      });
      return elements;
    },
  },

  // Density Plot
  density: {
    chartType: "density",
    componentName: "AreaChart",
    keywords: ["density plot", "density"],
    requiresWrapper: false,
    defaultElements: (config) => {
      const elements = generateCartesianElements(
        config.nameKey,
        config.valueKey
      );
      const color = config.colors[0];
      elements.push({
        type: "Area",
        props: {
          type: "monotone",
          dataKey: config.valueKey,
          stroke: color,
          fill: color,
          fillOpacity: 0.6,
        },
      });
      return elements;
    },
  },

  // Polar Area
  polararea: {
    chartType: "polararea",
    componentName: "RadialBarChart",
    keywords: ["polar area", "polar area chart"],
    requiresWrapper: true,
    supportsMultipleSeries: true,
    defaultElements: (config) => {
      const elements = generatePolarElements(config.nameKey);
      const keys = config.dataKeys || [config.valueKey];

      keys.forEach((key, idx) => {
        elements.push({
          type: "RadialBar",
          props: {
            dataKey: key,
            fill: config.colors[idx % config.colors.length],
          },
        });
      });
      return elements;
    },
  },
};

// Detect chart type from prompt
export const detectChartType = (prompt: string): string => {
  const promptLower = prompt.toLowerCase().trim();

  // Check for trendline first
  if (
    promptLower.includes("dual trendline") ||
    promptLower.includes("multiple trendline") ||
    promptLower.match(/\b(dual|multiple)\s*(trendline|trend\s*line)\b/)
  ) {
    return "line"; // Will be handled with trendline flag
  }

  // Check all chart types in order of specificity (most specific first)
  const sortedConfigs = Object.entries(CHART_TYPE_CONFIGS).sort((a, b) => {
    // Prioritize longer keywords (more specific)
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

  // Default to bar chart
  return "bar";
};

// Get chart configuration
export const getChartConfig = (chartType: string): ChartTypeConfig | null => {
  return CHART_TYPE_CONFIGS[chartType] || null;
};
