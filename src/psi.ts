import readline from "readline-sync";

import { apiCall } from "./api-call";
import { ContainedLighthouseData, ReportData } from "./types";
import { calculateValues } from "./calculate";

const pages = {
  showroom: "https://www.build.com/showroom",
};

const devices = {
  MOBILE: "MOBILE",
  DESKTOP: "DESKTOP",
};

export type Device = "MOBILE" | "DESKTOP";

const run = async (): Promise<ReportData> => {
  const times = parseInt(
    readline.question(
      "How many times do you want to run the test? (Max of 10): "
    )
  );

  const page_options = Object.keys(pages);
  const selected_page_index: number = readline.keyInSelect(
    page_options,
    "Which page would you like to test?"
  );

  const device_options = Object.keys(devices);
  const selected_device_index: number = readline.keyInSelect(
    device_options,
    "Which device should we use?"
  );

  const selected_device: Device =
    devices[device_options[selected_device_index]] || "MOBILE";

  const selected_page_url = pages[page_options[selected_page_index]];
  console.log(
    `Okay, testing the ${page_options[
      selected_page_index
    ].toUpperCase()} page using url: ${selected_page_url} on ${selected_device} ${times} on times`
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
    console.log(`run: ${i}`);
    i++;
  } while (i < times);
  const output = calculateValues(totalData);
  console.log(output);
  return output;
};

run();
