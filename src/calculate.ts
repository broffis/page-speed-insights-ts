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
  SlackData,
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
): SlackData => {
  const metric = readableMetrics[label];
  const { averageValue, numericUnit } = input;
  const { displayValue } = metric;

  let value = 0;

  if (displayValue === "ms" && numericUnit === "millisecond") {
    value = Number(averageValue.toFixed(1));
  }

  if (displayValue === "s" && numericUnit === "millisecond") {
    value = Number((averageValue / 1000).toFixed(2));
  }

  if (displayValue === null && numericUnit === "unitless") {
    value = Number(averageValue.toFixed(2));
  }

  return {
    msg: `${value}${displayValue}`,
    emoji: generateSlackEmoji(value, metric),
  };
};

const generateSlackEmoji = (value: number, metric: ReadableMetric): string => {
  const { min, max } = metric;
  if (value < min) {
    return GREEN_CIRCLE;
  } else if (value < max && value >= min) {
    return ORANGE_DIAMOND;
  } else {
    return RED_SQUARE;
  }
};
