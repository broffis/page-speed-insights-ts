const fetch = require("node-fetch");

const api_key = process.env.PAGE_SPEED_INSIGHTS_API_KEY;

const setUpQuery = (slug, device) => {
  console.log(api_key);
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

module.exports = async (testUrl, device) => {
  const url = setUpQuery(testUrl, device);
  return await fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      const { audits } =
        (data === null || data === void 0 ? void 0 : data.lighthouseResult) ||
        {};
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
