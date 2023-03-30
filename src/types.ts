export type TotalRunData = {
  [key: string]: LighthouseData; // => Key will be url and correlate to page url
};

type NumericUnit = "millisecond" | "unitless";
type ScoreDisplayMode = "numeric" | "binary";

export type ContainedLighthouseData = {
  id: string; // => ID will be the page url
  firstContentfulPaint: DataRunOutput[];
  largestContentfulPaint: DataRunOutput[];
  timeToInteractive: DataRunOutput[];
  firstInputDelay: DataRunOutput[];
  cumulativeLayoutShift: DataRunOutput[];
  timeToFirstByte: DataRunOutput[];
  totalBlockingTime: DataRunOutput[];
};

export type LighthouseData = {
  id: string; // => ID will be the page url
  firstContentfulPaint: DataRunOutput;
  largestContentfulPaint: DataRunOutput;
  timeToInteractive: DataRunOutput;
  firstInputDelay: DataRunOutput;
  cumulativeLayoutShift: DataRunOutput;
  timeToFirstByte: DataRunOutput;
  totalBlockingTime: DataRunOutput;
};

export type DataRunOutput = {
  id: string; // => lighthouse field id
  title: string; // => readable title
  description: string;
  score: number;
  scoreDisplayMode: ScoreDisplayMode;
  displayValue: string;
  numericValue: number;
  numericUnit: NumericUnit;
};

export type ReportData = {
  id: string; // => ID will be the page url
  firstContentfulPaint: CalculatedReportData;
  largestContentfulPaint: CalculatedReportData;
  timeToInteractive: CalculatedReportData;
  firstInputDelay: CalculatedReportData;
  cumulativeLayoutShift: CalculatedReportData;
  timeToFirstByte: CalculatedReportData;
  totalBlockingTime: CalculatedReportData;
};

export type CalculatedReportData = {
  title: string;
  runs: number;
  totalValue: number;
  averageValue: number;
  numericUnit: NumericUnit;
};

type MetricLabel = "FCP" | "LCP" | "TTI" | "FID" | "CLS" | "TFB" | "TBT";
type DisplayValue = "ms" | "s" | null;

export type ReadableMetric = {
  label: MetricLabel;
  displayValue: DisplayValue;
};

enum MetricLabels {
  FCP = "FCP",
  LCP = "LCP",
  TTI = "TTI",
  FID = "FID",
  CLS = "CLS",
  TFB = "TFB",
  TBT = "TBT",
}

export type ReadableMetrics = {
  [key: string]: ReadableMetric;
};

export type MetricName =
  | "firstContentfulPaint"
  | "largestContentfulPaint"
  | "timeToInteractive"
  | "firstInputDelay"
  | "cumulativeLayoutShift"
  | "timeToFirstByte"
  | "totalBlockingTime";

export type FormattedOutput = {
  [key in MetricLabels]: string;
};

export type FormattedTotalsReturn = FormattedOutput & {
  url: string;
};
