#!/usr/bin/env node
"use strict";
const meow = require("meow");
const fetch = require("node-fetch");
const chalk = require("chalk");

const fetchLighthouseScores = async (url, flags) => {
  const response = await fetch(
    `https://lerm027s40.execute-api.us-east-1.amazonaws.com/dev/evaluate?url=${url}`
  );
  const results = await response.json();
  return results;
};

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

  const results = await fetchLighthouseScores(cli.input[0]);
  const { threshold } = cli.flags;
  if (threshold) {
    Object.keys(results).forEach(key => {
      if (Number(results[key]) < Number(threshold)) {
        console.log(
          chalk.red(
            `ERROR: Expected ${key} of ${threshold}, but got ${results[key]}`
          )
        );
        return process.exit(1);
      }
    });
  }
  console.log(chalk`
    Performance:    {${colors(results.performance)}}
    Accessibility:  {${colors(results.accessibility)}}
    Best practices: {${colors(results.bestPractices)}}
    SEO:            {${colors(results.seo)}}
  `);
})();
