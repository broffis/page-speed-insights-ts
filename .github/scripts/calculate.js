module.exports = (data) => {
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

const calculateMetricValue = (data) => {
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

const readableMetrics = {
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

const formatTotals = (data) => {
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

const makeReadableTotal = (input, label) => {
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
