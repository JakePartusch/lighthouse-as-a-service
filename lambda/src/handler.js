const lighthouse = require("lighthouse");
const launchChrome = require("@serverless-chrome/lambda");

const opts = {
  chromeFlags: ["--headless"]
};

const launchChromeAndRunLighthouse = async (url, opts, config = null) => {
  const chrome = await launchChrome({ flags: opts.chromeFlags });
  opts.port = chrome.port;
  const results = await lighthouse(url, opts, config);
  await chrome.kill();
  return results.lhr;
};

module.exports.evaluate = async event => {
  console.log(JSON.stringify(event, null, 2));

  const { queryStringParameters } = event;
  const { url } = queryStringParameters;
  if (!url) {
    return {
      statusCode: 400,
      body: "url is required."
    };
  }

  const results = await launchChromeAndRunLighthouse(url, opts);

  const { categories } = results;
  const { performance, accessibility, seo, pwa } = categories;
  console.log(JSON.stringify(categories, null, 2));

  const simpleScores = {
    performance: performance.score * 100,
    accessibility: accessibility.score * 100,
    bestPractices: categories["best-practices"].score * 100,
    seo: seo.score * 100,
    pwa: pwa.score * 100
  };

  console.log("Scores:", JSON.stringify(simpleScores, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify(simpleScores)
  };
};
