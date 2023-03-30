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

The terminal will give you a couple prompts: number of runs, page to test, and device to be used. After a few moments you will get an output in your terminal of the test run. Note: the more times you run the test, the longer this will take
