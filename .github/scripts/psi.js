const apiCall = require("./api-call");
const calculateValues = require("./calculate");

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

module.exports = async ({ core }) => {
  const times = 20;
  const selected_page_url = process.env.PAGE_SLUG;
  const selected_device = process.env.DEVICE; // => get this as an env param

  console.log(
    `Okay, testing using url: ${selected_page_url} on ${selected_device} ${times} on times`
  );

  const totalData = {
    id: selected_page_url,
    firstContentfulPaint: [],
    largestContentfulPaint: [],
    timeToInteractive: [],
    firstInputDelay: [],
    cumulativeLayoutShift: [],
    timeToFirstByte: [],
    totalBlockingTime: [],
    speedIndex: [],
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
        speedIndex,
      } = apiData;

      totalData.firstContentfulPaint.push(firstContentfulPaint);
      totalData.largestContentfulPaint.push(largestContentfulPaint);
      totalData.timeToInteractive.push(timeToInteractive);
      totalData.firstInputDelay.push(firstInputDelay);
      totalData.cumulativeLayoutShift.push(cumulativeLayoutShift);
      totalData.timeToFirstByte.push(timeToFirstByte);
      totalData.totalBlockingTime.push(totalBlockingTime);
      totalData.speedIndex.push(speedIndex);
    }
    i++;
  } while (i < times);
  const output = calculateValues(totalData);
  console.log(output);
  core.setOutput("psi-values", output);
};
