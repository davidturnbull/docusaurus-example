---
title: "Error handling for content extensions"
sidebar_label: "Error handling"
path: /content-extensions/error-handling/
---

If a [content extension](./../content-extensions.md) is unable to return a `"SUCCESS"` response, it should return an `"ERROR"` response.

:::note  
 If a [request signature cannot be verified](./../verifying-requests.md), an `"ERROR"` response should _not_ be returned. You should respond to the request with a status code of `401`.  
:::

## Error response

The body of an `"ERROR"` response must contain the following properties:

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

This is an example of an `"ERROR"` response:

```json
{
  "type": "ERROR",
  "errorCode": "INTERNAL_ERROR"
}
```

:::note  
 Canva expects all responses -- even `"ERROR"` responses -- to have a status code of `200`.  
:::

## List of error codes

| Code                       | Description                                    |
| -------------------------- | ---------------------------------------------- |
| `"INVALID_REQUEST"`        | The request is invalid.                        |
| `"CONFIGURATION_REQUIRED"` | The extension requires configuration.          |
| `"FORBIDDEN"`              | The user does not have access to the resource. |
| `"NOT_FOUND"`              | The resource(s) could not be found.            |
| `"TIMEOUT"`                | The request has timed out.                     |
| `"INTERNAL_ERROR"`         | An unknown error has occurred.                 |

## Example

```javascript
const express = require("express");
const app = express();

app.use(express.json());

app.post("/content/resources/find", async (request, response) => {
  response.send({ type: "ERROR", errorCode: "INTERNAL_ERROR" });
});

app.listen(process.env.PORT || 3000);
```
