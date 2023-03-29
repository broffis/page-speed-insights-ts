import fetch from "node-fetch";
import dotenv from "dotenv";

import { LighthouseData } from "./types";

dotenv.config();

const api_key = process.env.PAGE_SPEED_INSIGHTS_API_KEY;

export const apiCall = async (
  testUrl: string,
  repeat: number
): Promise<LighthouseData> => {
  // let i = 0;
  const totalData: LighthouseData = {
    id: testUrl,
    firstContentfulPaint: [],
    largestContentfulPaint: [],
    timeToInteractive: [],
    firstInputDelay: [],
    cumulativeLayoutShift: [],
    timeToFirstByte: [],
    totalBlockingTime: [],
  };

  const url = setUpQuery(testUrl);
  // do {
  //   await fetch(url)
  //     .then((resp) => resp.json())
  //     .then((data: any) => {
  //       const { audits } = data?.lighthouseResult || {};

  //       if (audits) {
  //         const firstContentfulPaint = audits["first-contentful-paint"],
  //           largestContentfulPaint = audits["largest-contentful-paint"],
  //           timeToInteractive = audits["interactive"],
  //           firstInputDelay = audits["max-potential-fid"],
  //           cumulativeLayoutShift = audits["cumulative-layout-shift"],
  //           timeToFirstByte = audits["server-response-time"],
  //           totalBlockingTime = audits["total-blocking-time"];

  //         totalData.firstContentfulPaint.push(firstContentfulPaint);
  //         totalData.largestContentfulPaint.push(largestContentfulPaint);
  //         totalData.timeToInteractive.push(timeToInteractive);
  //         totalData.firstInputDelay.push(firstInputDelay);
  //         totalData.cumulativeLayoutShift.push(cumulativeLayoutShift);
  //         totalData.timeToFirstByte.push(timeToFirstByte);
  //         totalData.totalBlockingTime.push(totalBlockingTime);
  //       }

  //       i++;
  //     });
  // } while (i < repeat);

  for (let i = 0; i < repeat; i++) {
    await fetch(url)
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
            totalBlockingTime = audits["total-blocking-time"];

          totalData.firstContentfulPaint.push(firstContentfulPaint);
          totalData.largestContentfulPaint.push(largestContentfulPaint);
          totalData.timeToInteractive.push(timeToInteractive);
          totalData.firstInputDelay.push(firstInputDelay);
          totalData.cumulativeLayoutShift.push(cumulativeLayoutShift);
          totalData.timeToFirstByte.push(timeToFirstByte);
          totalData.totalBlockingTime.push(totalBlockingTime);
        }
      });
  }

  return totalData;
};

const setUpQuery = (testUrl: string) => {
  const url = encodeURIComponent(testUrl);
  const api = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
  const parameters = {
    key: api_key,
    url,
  };
  let query = `${api}?`;
  for (const key in parameters) {
    if (Object.keys(parameters).includes(key)) {
      query += "&";
    }
    query += `${key}=${parameters[key]}`;
  }
  return query;
};

/**
 * TODO:
 * - remove loop from api call => not blocking return of totalData
 * - split out parsing api data from api call
 */
