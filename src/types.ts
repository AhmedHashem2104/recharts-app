// Shared type definitions for the application

// Primitive value types that can appear in chart data
export type ChartValue = string | number | boolean | null | undefined;

// Array of primitive values
export type ChartValueArray = ChartValue[];

// Nested object structure
export interface ChartNestedObject {
  [key: string]: ChartValue | ChartValueArray | ChartNestedObject | ChartNestedObject[];
}

// Chart data point - can contain nested structures
export interface ChartDataPoint {
  [key: string]: ChartValue | ChartValueArray | ChartNestedObject | ChartNestedObject[];
}

// Flattened data point - all values are primitives or arrays of primitives
export interface FlattenedDataPoint {
  [key: string]: ChartValue | ChartValueArray;
}

// Sankey chart specific data structure
export interface SankeyDataPoint {
  source: string;
  target: string;
  value: number;
}


// Graph node data structure
export interface GraphNodeData {
  name: string;
  value?: number;
  category?: number;
  [key: string]: ChartValue | ChartValueArray | ChartNestedObject | ChartNestedObject[] | undefined;
}

// Chart element props
export interface ChartElementProps {
  [key: string]: ChartValue | ChartValueArray | ChartNestedObject | ChartNestedObject[];
}
