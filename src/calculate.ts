import {
  CalculatedReportData,
  ContainedLighthouseData,
  DataRunOutput,
  ReportData,
} from "./types";

export const calculateValues = (data: ContainedLighthouseData): ReportData => {
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

  return {
    id,
    firstContentfulPaint: calculateMetricValue(fcp),
    largestContentfulPaint: calculateMetricValue(lcp),
    timeToInteractive: calculateMetricValue(tti),
    firstInputDelay: calculateMetricValue(fid),
    cumulativeLayoutShift: calculateMetricValue(cls),
    timeToFirstByte: calculateMetricValue(tfb),
    totalBlockingTime: calculateMetricValue(tbt),
  };
};

const calculateMetricValue = (data: DataRunOutput[]): CalculatedReportData => {
  let total = 0;
  let score = 0;
  data.forEach((d) => {
    total += d.numericValue;
    score = +d.score;
  });

  return {
    title: data[0].title,
    runs: data.length,
    totalValue: total,
    averageValue: total / data.length,
    numericUnit: data[0].numericUnit,
  };
};
