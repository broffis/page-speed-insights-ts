import readline from "readline-sync";

import { apiCall } from "./api-call";
// import { calculateValues } from "./calculate";

const pages = {
  showroom: "https://www.build.com/showroom",
};

const run = async () => {
  const times = parseInt(
    readline.question(
      "How many times do you want to run the test? (Max of 10): "
    )
  );

  const page_options = Object.keys(pages);
  const selected_page_index = readline.keyInSelect(
    page_options,
    "Which page would you like to test?"
  );

  const selected_page_url = pages[page_options[selected_page_index]];
  console.log(
    `Okay, testing the ${page_options[
      selected_page_index
    ].toUpperCase()} page using url: ${selected_page_url} ${times} times`
  );

  const apiData = await apiCall(selected_page_url, times);
  // const output = calculateValues
  console.log(apiData);
};

run();
