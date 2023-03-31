import {
  CalculatedReportData,
  ContainedLighthouseData,
  DataRunOutput,
  FormattedMetricOutput,
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
  speedIndex: {
    label: "SI",
    displayValue: "s",
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
): FormattedMetricOutput => {
  const { displayValue } = readableMetrics[label];
  const { averageValue, numericUnit } = input;

  if (displayValue === "ms" && numericUnit === "millisecond") {
    return {
      value: Number(averageValue.toFixed(1)),
      displayUnit: displayValue,
    };
  }

  if (displayValue === "s" && numericUnit === "millisecond") {
    return {
      value: Number((averageValue / 1000).toFixed(2)),
      displayUnit: displayValue,
    };
  }

  if (displayValue === null && numericUnit === "unitless") {
    return {
      value: Number(averageValue.toFixed(2)),
      displayUnit: "",
    };
  }

  return {
    value: 0,
    displayUnit: "O_o T_T o_O",
  };
};
