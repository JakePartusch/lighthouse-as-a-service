#!/usr/bin/env node
"use strict";
const meow = require("meow");
const fetch = require("node-fetch");
const chalk = require("chalk");
const ora = require("ora");
const spinner = ora("Running Lighthouse").start();

setTimeout(() => {
  spinner.color = "yellow";
  spinner.text = "Fetching scores";
}, 3000);

setTimeout(() => {
  spinner.color = "green";
  spinner.text = "Calculating averages";
}, 5000);

const fetchLighthouseScores = async (url, flags) => {
  const response = await fetch(
    `https://lerm027s40.execute-api.us-east-1.amazonaws.com/dev/evaluate?url=${url}`
  );
  const results = await response.json();
  return results;
};

const averageItem = (results, key) =>
  Math.round(
    results.reduce((previous, current) => current[key] + previous, 0) /
      results.length
  );

const calculateAverageScores = results => ({
  performance: averageItem(results, "performance"),
  accessibility: averageItem(results, "accessibility"),
  bestPractices: averageItem(results, "bestPractices"),
  seo: averageItem(results, "seo"),
  pwa: averageItem(results, "pwa")
});

const cli = meow(
  `
	Usage
	  $ @faas/lighthouse-ci <input>

	Options
    --report=<path>     Include entire json result
    --threshold=<score> Specify a score threshold for the CI to pass.

	Examples
	  $ @faas/lighthouse-ci https://google.com
	  { performance: 88, accessibility: 71, bestPractices: 93, seo: 80 }
`,
  {
    flags: {
      report: {
        type: "string"
      },
      threshold: {
        type: "string"
      }
    }
  }
);

const colors = score => {
  if (score > 85) {
    return `green ${score}`;
  }
  if (score > 50) {
    return `yellow ${score}`;
  }
  return `red ${score}`;
};

(async () => {
  if (cli.input.length === 0) {
    return cli.showHelp();
  }

  const resultPromises = [
    fetchLighthouseScores(cli.input[0]),
    fetchLighthouseScores(cli.input[0]),
    fetchLighthouseScores(cli.input[0])
  ];
  const results = (await Promise.all(resultPromises)).filter(
    result => !result.message
  );
  const resultAverage = calculateAverageScores(results);
  const { threshold } = cli.flags;
  if (threshold) {
    Object.keys(resultAverage).forEach(key => {
      if (Number(resultAverage[key]) < Number(threshold)) {
        console.log(
          chalk.red(
            `ERROR: Expected ${key} of ${threshold}, but got ${resultAverage[key]}`
          )
        );
        return process.exit(1);
      }
    });
  }
  spinner.stop();
  console.log(chalk`
    Performance:    {${colors(resultAverage.performance)}}
    Accessibility:  {${colors(resultAverage.accessibility)}}
    Best practices: {${colors(resultAverage.bestPractices)}}
    SEO:            {${colors(resultAverage.seo)}}
    PWA:            {${colors(resultAverage.pwa)}}
  `);
})();
