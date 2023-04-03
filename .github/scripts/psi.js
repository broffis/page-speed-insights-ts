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

module.exports = async ({ core }, { device, slug }) => {
  const times = 20;

  console.log(
    `Okay, testing using url: ${slug} on ${device} ${times} on times`
  );

  const totalData = {
    id: slug,
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
    const apiData = await apiCall(slug, device);
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
  core.setOutput("psi-values", JSON.stringify({ ...output, device: device }));
};
