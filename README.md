# Lighthouse as a Service CI

[![npm](https://img.shields.io/npm/v/@laas/lighthouse-ci.svg)](https://www.npmjs.com/package/@laas/lighthouse-ci)
[![npm](https://img.shields.io/npm/l/@laas/lighthouse-ci.svg)](https://github.com/jakepartusch/lighthouse-as-a-service/blob/master/packages/lighthouse-ci/LICENSE)

> A quick, simple way to integrate [Lighthouse](https://github.com/GoogleChrome/lighthouse) performance checks into your pipeline without a Chromium dependency

<p><img src="lighthouse-ci.gif?raw=true"/></p>

### Usage

```
npx @laas/lighthouse-ci https://google.com
```

### Example Response

```
    Performance:    87
    Accessibility:  71
    Best practices: 93
    SEO:            80
```

### Setting a minimum threshold

```
npx @laas/lighthouse-ci https://google.com --threshold=80
```
