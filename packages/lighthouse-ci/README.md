# Lighthouse as a Service CI

LaaS is an API which interfaces with Chrome and [Lighthouse](https://github.com/GoogleChrome/lighthouse) to provide auditing, performance metrics, and best practices for Web Apps.

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
