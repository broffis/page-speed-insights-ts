import fetch from "node-fetch";
import dotenv from "dotenv";

import { LighthouseData } from "./types";
import { Device } from "./psi";

dotenv.config();

const api_key = process.env.PAGE_SPEED_INSIGHTS_API_KEY;

export const apiCall = async (
  testUrl: string,
  device: Device
): Promise<LighthouseData | null> => {
  const url = setUpQuery(testUrl, device);
  return await fetch(url)
    .then((resp) => resp.json())
    .then((data: any) => {
      const { audits } = data?.lighthouseResult || {};

      if (audits) {
        const firstContentfulPaint = audits["first-contentful-paint"],
          largestContentfulPaint = audits["largest-contentful-paint"],
          timeToInteractive = audits["interactive"],
          firstInputDelay = audits["max-potential-fid"],
          cumulativeLayoutShift = audits["cumulative-layout-shift"],
          timeToFirstByte = audits["server-response-time"],
          totalBlockingTime = audits["total-blocking-time"],
          speedIndex = audits["speed-index"];

        return {
          firstContentfulPaint,
          largestContentfulPaint,
          timeToInteractive,
          firstInputDelay,
          cumulativeLayoutShift,
          timeToFirstByte,
          totalBlockingTime,
          speedIndex,
        };
      }
      return null;
    });
};

const setUpQuery = (slug: string, device: Device) => {
  const url = encodeURIComponent(`https://www.build.com${slug}`);
  const api = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
  const parameters = {
    url,
    strategy: device,
  };
  let query = `${api}?key=${api_key}`;
  for (const key in parameters) {
    if (Object.keys(parameters).includes(key)) {
      query += "&";
    }
    query += `${key}=${parameters[key]}`;
  }
  return query;
};
