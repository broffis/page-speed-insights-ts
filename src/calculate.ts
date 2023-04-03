import {
  GREEN_CIRCLE,
  ORANGE_DIAMOND,
  RED_SQUARE,
  readableMetrics,
} from "./constants";
import {
  CalculatedReportData,
  ContainedLighthouseData,
  DataRunOutput,
  FormattedTotalsReturn,
  MetricName,
  ReadableMetric,
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
    speedIndex: si,
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
    speedIndex: calculateMetricValue(si),
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
    speedIndex,
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
    SI: makeReadableTotal(speedIndex, "speedIndex"),
  };
};

const makeReadableTotal = (
  input: CalculatedReportData,
  label: MetricName
): string => {
  const metric = readableMetrics[label];
  const { averageValue, numericUnit } = input;
  const { displayValue } = metric;

  let value: number;

  if (displayValue === "ms" && numericUnit === "millisecond") {
    value = Number(averageValue.toFixed(1));
    return generateSlackMessage(value, metric);
  }

  if (displayValue === "s" && numericUnit === "millisecond") {
    value = Number((averageValue / 1000).toFixed(2));
    return generateSlackMessage(value, metric);
  }

  if (displayValue === null && numericUnit === "unitless") {
    value = Number(averageValue.toFixed(2));
    return generateSlackMessage(value, metric);
  }

  return "something went wrong";
};

const generateSlackMessage = (
  value: number,
  metric: ReadableMetric
): string => {
  const { min, max, displayValue } = metric;
  let slackString = `${value}${displayValue || ""} `;
  if (value < min) {
    slackString += GREEN_CIRCLE;
  } else if (value < max && value >= min) {
    slackString += ORANGE_DIAMOND;
  } else {
    slackString += RED_SQUARE;
  }

  return slackString;
};
