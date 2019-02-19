# Lighthouse as a Service (LaaS)

LaaS is an API which interfaces with Chrome and [Lighthouse](https://github.com/GoogleChrome/lighthouse) to provide auditing, performance metrics, and best practices for Web Apps.

### Example Request

```
https://lerm027s40.execute-api.us-east-1.amazonaws.com/dev/evaluate?url=https://google.com
```

### Example Response

```
{
    "performance": 88,
    "accessibility": 71,
    "bestPractices": 93,
    "seo": 80
}
```
