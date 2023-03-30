import {
  CalculatedReportData,
  ContainedLighthouseData,
  DataRunOutput,
  FormattedTotalsReturn,
  MetricName,
  ReadableMetrics,
  ReportData,
} from "./types";

export const calculateValues = (
  data: ContainedLighthouseData
): FormattedTotalsReturn => {
  const {
    id,
    firstContentfulPaint: fcp,
    largestContentfulPaint: lcp,
    timeToFirstByte: tfb,
    timeToInteractive: tti,
    totalBlockingTime: tbt,
    cumulativeLayoutShift: cls,
    firstInputDelay: fid,
  } = data;

  return formatTotals({
    id,
    firstContentfulPaint: calculateMetricValue(fcp),
    largestContentfulPaint: calculateMetricValue(lcp),
    timeToInteractive: calculateMetricValue(tti),
    firstInputDelay: calculateMetricValue(fid),
    cumulativeLayoutShift: calculateMetricValue(cls),
    timeToFirstByte: calculateMetricValue(tfb),
    totalBlockingTime: calculateMetricValue(tbt),
  });
};

const calculateMetricValue = (data: DataRunOutput[]): CalculatedReportData => {
  let total = 0;
  data.forEach((d) => {
    total += d.numericValue;
  });

  return {
    title: data[0].title,
    runs: data.length,
    totalValue: total,
    averageValue: total / data.length,
    numericUnit: data[0].numericUnit,
  };
};

const readableMetrics: ReadableMetrics = {
  firstContentfulPaint: {
    label: "FCP",
    displayValue: "s",
  },
  largestContentfulPaint: {
    label: "LCP",
    displayValue: "s",
  },
  timeToInteractive: {
    label: "TTI",
    displayValue: "ms",
  },
  firstInputDelay: {
    label: "FID",
    displayValue: "ms",
  },
  cumulativeLayoutShift: {
    label: "CLS",
    displayValue: null,
  },
  timeToFirstByte: {
    label: "TFB",
    displayValue: "ms",
  },
  totalBlockingTime: {
    label: "TBT",
    displayValue: "ms",
  },
};

export const formatTotals = (data: ReportData): FormattedTotalsReturn => {
  const {
    id,
    firstContentfulPaint,
    largestContentfulPaint,
    timeToInteractive,
    firstInputDelay,
    cumulativeLayoutShift,
    timeToFirstByte,
    totalBlockingTime,
  } = data;
  return {
    url: id,
    FCP: makeReadableTotal(firstContentfulPaint, "firstContentfulPaint"),
    LCP: makeReadableTotal(largestContentfulPaint, "largestContentfulPaint"),
    TTI: makeReadableTotal(timeToInteractive, "timeToInteractive"),
    FID: makeReadableTotal(firstInputDelay, "firstInputDelay"),
    CLS: makeReadableTotal(cumulativeLayoutShift, "cumulativeLayoutShift"),
    TFB: makeReadableTotal(timeToFirstByte, "timeToFirstByte"),
    TBT: makeReadableTotal(totalBlockingTime, "totalBlockingTime"),
  };
};

const makeReadableTotal = (
  input: CalculatedReportData,
  label: MetricName
): string => {
  const { displayValue } = readableMetrics[label];
  const { averageValue, numericUnit } = input;

  if (displayValue === "ms" && numericUnit === "millisecond") {
    return `${averageValue.toFixed(1)} ${displayValue}`;
  }

  if (displayValue === "s" && numericUnit === "millisecond") {
    return `${(averageValue / 1000).toFixed(2)} ${displayValue}`;
  }

  if (displayValue === null && numericUnit === "unitless") {
    return `${averageValue.toFixed(2)}`;
  }

  return `$O_o`;
};
