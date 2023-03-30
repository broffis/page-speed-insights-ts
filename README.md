# Google Page Speed Insights Runner

This is a project I've been working on as a result of Core Web Vitals (CWV) becoming a focus in my role

## Getting Started

### Clone and install

Clone the app using your preferred method, then run install

```
npm ci
```

### Get an API key

1. Log in to your [Google Web Developer console](https://console.cloud.google.com/) and navigate to the APIs & Services page

2. Create a new project and generate a key. Save that for later

3. Enable the [PageSpeed Insights API](https://console.cloud.google.com/apis/api/pagespeedonline.googleapis.com) on your new key

4. Rename the `.env.example` file to just `.env` and set the `PAGE_SPEED_INSIGHTS_API_KEY=` to your new key

```
PAGE_SPEED_INSIGHTS_API_KEY={your key}
```

### Running

After install, operation is pretty straightforward

```
npm run
```

The terminal will give you a couple prompts: number of runs, page to test, and device to be used. You will get a confirmation prompt with your inputs. After a few moments you will get an output in your terminal of the test run.

![Screen Shot 2023-03-30 at 1 58 10 PM](https://user-images.githubusercontent.com/40612618/228923763-1bcb17d6-9599-4199-862b-44a0b5bf85ba.png)

Note: the more times you run the test, the longer this will take

## Adding New Fields

This part is kind of a PiTA, mostly because you'll have to make what feels like the same change in several places.

1. Find the value in the `lighthouseResult.audits` you would like to use. Grab it's, e.g.: "largest-contentful-paint", whatever you'd like to call in in camelCase (largestContentfulPaint), and the initials you'd like to use (LCP). Check the object in audits for `scoreDisplayMode`, `displayValue`, and `numericUnit`. These will be helpful later

2. Update `types.ts`: You'll need to add the field to `ContainedLighthouseData`, `LighthouseData`, `ReportData`. You'll have to add the initials to both `MetricLabel` and `MetricLabelsEnum`. Finally, add the camelCase name to the `MetricName` type.

3. Update `api-call.ts`: Using the camelCase name, pull the lighthouse audit and make sure you return that from the apiCall

```
largestContentfulPaint = audits["largest-contentful-paint"]
```

4.  Update `calculate.ts`: pull your new camelCase name from the data passed in to `calculateValues` and give it a fun shorthand. Pass it into the return of `formatTotals`. Update the `readableMetrics` const with your new values. In `formatTotals`, pull the new camelCase out of "data", and add it to your return with your new capitalized initials

5.  Update `psi.ts`: last bit. Add your new camelCase as an empty array to `totalData`. Make sure you add it to the destructure of `apiData` and push into the `totalData` array.

6.  Test your output. If it returns, congrats. If it doesn't, cry a little and check your console
