import readline from "readline-sync";

import { apiCall } from "./api-call";
import { ContainedLighthouseData, FormattedTotalsReturn } from "./types";
import { calculateValues } from "./calculate";
import { time } from "console";

const pages = {
  showroom: "/showroom",
  home: "/",
  "product summary": "/product/summary/433454",
  other: "",
};

const devices = {
  MOBILE: "MOBILE",
  DESKTOP: "DESKTOP",
};

export type Device = "MOBILE" | "DESKTOP";

const run = async (): Promise<FormattedTotalsReturn | null> => {
  const times = parseInt(
    readline.question(
      "How many times do you want to run the test? (Max of 20): "
    )
  );

  if (!times) {
    return null;
  }

  const page_options = Object.keys(pages);
  const selected_page_index = readline.keyInSelect(
    page_options,
    "Which page would you like to test?"
  );

  let selected_page_url: string;
  let pageTestMsg: string;

  if (selected_page_index === -1) {
    return null;
  }

  if (page_options[selected_page_index] == "other") {
    selected_page_url = readline.question(
      "What page would you like to test? Please enter only the slug with the slash (/) to start"
    );

    pageTestMsg = "";
  } else {
    selected_page_url = pages[page_options[selected_page_index]];
    pageTestMsg = `${page_options[selected_page_index]} page`;
  }

  const device_options = Object.keys(devices);
  const selected_device_index = readline.keyInSelect(
    device_options,
    "Which device should we use?"
  );

  if (selected_device_index === -1) {
    return null;
  }

  const selected_device: Device =
    devices[device_options[selected_device_index]] || "MOBILE";

  console.log(
    `Okay, testing ${pageTestMsg} using url: ${selected_page_url} on ${selected_device} ${times} on times`
  );

  const totalData: ContainedLighthouseData = {
    id: selected_page_url,
    firstContentfulPaint: [],
    largestContentfulPaint: [],
    timeToInteractive: [],
    firstInputDelay: [],
    cumulativeLayoutShift: [],
    timeToFirstByte: [],
    totalBlockingTime: [],
  };

  let i = 0;
  do {
    const apiData = await apiCall(selected_page_url, selected_device);
    if (apiData) {
      const {
        firstContentfulPaint,
        largestContentfulPaint,
        timeToFirstByte,
        timeToInteractive,
        totalBlockingTime,
        cumulativeLayoutShift,
        firstInputDelay,
      } = apiData;

      totalData.firstContentfulPaint.push(firstContentfulPaint);
      totalData.largestContentfulPaint.push(largestContentfulPaint);
      totalData.timeToInteractive.push(timeToInteractive);
      totalData.firstInputDelay.push(firstInputDelay);
      totalData.cumulativeLayoutShift.push(cumulativeLayoutShift);
      totalData.timeToFirstByte.push(timeToFirstByte);
      totalData.totalBlockingTime.push(totalBlockingTime);
    }
    i++;
  } while (i < times);
  const output = calculateValues(totalData);
  console.log(output);
  return output;
};

run();
