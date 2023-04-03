import { ReadableMetrics } from "./types";

export const readableMetrics: ReadableMetrics = {
  firstContentfulPaint: {
    name: "firstContentfulPaint",
    label: "FCP",
    displayValue: "s",
    max: 3,
    min: 1.8,
  },
  largestContentfulPaint: {
    name: "largestContentfulPaint",
    label: "LCP",
    displayValue: "s",
    max: 4,
    min: 2.5,
  },
  timeToInteractive: {
    name: "timeToInteractive",
    label: "TTI",
    displayValue: "s",
    max: 7.3,
    min: 3.8,
  },
  firstInputDelay: {
    name: "firstInputDelay",
    label: "FID",
    displayValue: "ms",
    max: 300,
    min: 100,
  },
  cumulativeLayoutShift: {
    name: "cumulativeLayoutShift",
    label: "CLS",
    displayValue: null,
    max: 0.25,
    min: 0.1,
  },
  timeToFirstByte: {
    name: "timeToFirstByte",
    label: "TFB",
    displayValue: "s",
    max: 1.8,
    min: 0.8,
  },
  totalBlockingTime: {
    name: "totalBlockingTime",
    label: "TBT",
    displayValue: "ms",
    max: 600,
    min: 200,
  },
  speedIndex: {
    name: "speedIndex",
    label: "SI",
    displayValue: "s",
    max: 5.8,
    min: 3.4,
  },
};

export const GREEN_CIRCLE = ":large_green_circle:";
export const ORANGE_DIAMOND = ":large_orange_diamond:";
export const RED_SQUARE = ":large_red_square:";
