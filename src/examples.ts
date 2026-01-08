export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface ChartExample {
  name: string;
  description: string;
  data: ChartDataPoint[];
  prompt: string;
  chartType: "bar" | "line" | "pie" | "area";
}

export const chartExamples: ChartExample[] = [
  {
    name: "Sales Over Time",
    description: "Monthly sales data for the first half of the year",
    data: [
      { name: "Jan", value: 400, sales: 4000 },
      { name: "Feb", value: 300, sales: 3000 },
      { name: "Mar", value: 500, sales: 5000 },
      { name: "Apr", value: 450, sales: 4500 },
      { name: "May", value: 600, sales: 6000 },
      { name: "Jun", value: 550, sales: 5500 },
    ],
    prompt: "Create a bar chart showing sales data over time",
    chartType: "bar",
  },
  {
    name: "Product Categories",
    description: "Distribution of products across different categories",
    data: [
      { name: "Electronics", value: 45, count: 120 },
      { name: "Clothing", value: 30, count: 80 },
      { name: "Food", value: 25, count: 65 },
      { name: "Books", value: 20, count: 50 },
      { name: "Toys", value: 15, count: 40 },
    ],
    prompt: "Create a pie chart showing product distribution by category",
    chartType: "pie",
  },
  {
    name: "Revenue Trends",
    description: "Quarterly revenue trends over two years",
    data: [
      { name: "Q1 2023", value: 12000, growth: 5 },
      { name: "Q2 2023", value: 15000, growth: 8 },
      { name: "Q3 2023", value: 18000, growth: 12 },
      { name: "Q4 2023", value: 20000, growth: 15 },
      { name: "Q1 2024", value: 22000, growth: 10 },
      { name: "Q2 2024", value: 25000, growth: 14 },
    ],
    prompt: "Create a line chart showing revenue trends over quarters",
    chartType: "line",
  },
  {
    name: "Website Traffic",
    description: "Daily website visitors for a week",
    data: [
      { name: "Monday", value: 1200, pageViews: 3500 },
      { name: "Tuesday", value: 1500, pageViews: 4200 },
      { name: "Wednesday", value: 1800, pageViews: 5100 },
      { name: "Thursday", value: 1600, pageViews: 4800 },
      { name: "Friday", value: 2000, pageViews: 6000 },
      { name: "Saturday", value: 1400, pageViews: 4000 },
      { name: "Sunday", value: 1100, pageViews: 3200 },
    ],
    prompt: "Create an area chart showing website traffic over the week",
    chartType: "area",
  },
  {
    name: "Regional Performance",
    description: "Sales performance across different regions",
    data: [
      { name: "North", value: 50000, target: 45000 },
      { name: "South", value: 45000, target: 50000 },
      { name: "East", value: 60000, target: 55000 },
      { name: "West", value: 55000, target: 60000 },
      { name: "Central", value: 40000, target: 40000 },
    ],
    prompt: "Create a bar chart comparing regional sales performance",
    chartType: "bar",
  },
  {
    name: "User Demographics",
    description: "Age distribution of platform users",
    data: [
      { name: "18-24", value: 25, percentage: 25 },
      { name: "25-34", value: 35, percentage: 35 },
      { name: "35-44", value: 20, percentage: 20 },
      { name: "45-54", value: 12, percentage: 12 },
      { name: "55+", value: 8, percentage: 8 },
    ],
    prompt: "Create a pie chart showing user age distribution",
    chartType: "pie",
  },
];

export const defaultExample = chartExamples[0];
