---
title: "Verifying requests"
sidebar_label: Overview
path: /verify-request/
---

For an app to be approved for release via the [Apps Directory](https://canva.com/apps), it must verify that any HTTP requests it receives originate from Canva (and not from some nefarious third-party). This protects your app -- and our users -- from a variety of attacks.

## What requests need to be verified?

All HTTP requests that Canva sends to an app need to be verified. This includes `POST` requests, such as the request sent to the `/content/resources/find` endpoint, and `GET` requests, such as the request sent to the app's **Redirect URL**.

If an app supports authentication, it must also verify the authenticity of the authentication flow. This process is explained in the authentication topics:

- [Authentication for content extensions](./content-extensions/authentication.md)
- [Authentication for publish extensions](./publish-extensions/authentication.md)

## How Canva confirms that requests are verified

When you submit your app, it enters an **In review** state. While in this state, actions that would usually trigger a single request -- such as opening a content extension -- will trigger multiple requests. These additional requests are invalid, which allows our reviewers to confirm that invalid requests are rejected.

:::warning  
 If you preview your app while it's in the state, you may notice that most requests fail. This is expected behavior.  
:::

## How to verify a request

### Step 1: Verify the timestamp

When Canva sends an HTTP request to an app, it includes a UNIX timestamp (in seconds) of when the request was sent. In a `POST` request, the timestamp is available via the `X-Canva-Timestamp` HTTP header. In a `GET` request, the timestamp is available via the `time` query parameter.

Your app is expected to:

1.  Compare the timestamp of when the request was sent with when it was received.
2.  Verify that the timestamps are within 5 minutes (300 seconds) of one another.

When the timestamps are _not_ within 5 minutes of one another, the app should reject the request by returning a `401` status code.

For a step-by-step walkthrough of how to verify timestamps, refer to [Verifying timestamps](./verify-timestamp.md).

### Step 2: Verify the request signature

When Canva sends an HTTP request to an app, it includes a comma-separated list of _request signatures_ with the request.

A request signature is a unique string of characters that identifies the request:

    e03c80881a48bb730cee12c7e842301b0b116b970a03068a5f5263358926e897

In a `POST` request, the signatures are available via the `X-Canva-Signatures` HTTP header. In a `GET` request, the signatures are available via the `signatures` query parameter.

Your app is expected to:

1.  Calculate a signature for each request.
2.  Check if the calculated signature is found in the comma-separated list of signatures.
3.  Return a `401` status code if the calculated signature is **not** in the list of signatures.

The process for verifying request signatures is a little different for `POST` and `GET` requests. For step-by-step walkthroughs of verifying each type of request, refer to the following topics:

- [Verifying signatures for `POST` requests](./verify-post-request-signature.md)
- [Verifying signatures for `GET` requests](./verify-get-request-signature.md)

## Example

This example demonstrates how to verify `POST` and `GET` requests in Express.js.

```javascript
const { createHmac } = require("crypto");
const express = require("express");

const app = express();

function verifyTimestamp(
  sentAtSeconds,
  receivedAtSeconds,
  leniencyInSeconds = 300 // 5 minutes
) {
  return Math.abs(sentAtSeconds - receivedAtSeconds) < leniencyInSeconds;
}

function generateSignature(secret, message) {
  // Decode the client secret
  const string = secret.replace("-", "+").replace("_", "/");
  const key = Buffer.from(string, "base64");

  // Generate the signature
  return createHmac("sha256", key).update(message).digest("hex");
}

// This middleware is required to access the raw body of POST requests
app.use(
  express.json({
    verify: (request, response, buffer) => {
      // Get the timestamps
      const sentAtSeconds = Number(request.headers["X-Canva-Timestamp"]);
      const receivedAtSeconds = new Date() / 1000;

      // Reject requests with an invalid timestamp
      if (!verifyTimestamp(sentAtSeconds, receivedAtSeconds)) {
        console.log("The timestamp is not valid");
        response.sendStatus(401);
      }

      // Load the secret from an environment variable
      const secret = process.env.CLIENT_SECRET;

      // Construct a message
      const version = "v1";
      const { path, body } = request;
      const message = `${version}:${timestamp}:${path}:${body}`;

      // Calculate a signature
      const signature = generateSignature(secret, message);

      // Reject requests with invalid signatures
      if (!request.headers["X-Canva-Signatures"].includes(signature)) {
        console.log("The signature is not valid");
        response.sendStatus(401);
      }
    },
  })
);

app.post("/content/resources/find", async (request, response) => {
  console.log("The request is valid");
});

app.get("/my-redirect-url", async (request, response) => {
  // Get the timestamps
  const sentAtSeconds = Number(request.params.time);
  const receivedAtSeconds = new Date() / 1000;

  // Reject requests with an invalid timestamp
  if (!verifyTimestamp(sentAtSeconds, receivedAtSeconds)) {
    console.log("The timestamp is not valid");
    response.sendStatus(401);
  }

  // Load the secret from an environment variable
  const secret = process.env.CLIENT_SECRET;

  // Construct a message
  const version = "v1";
  const { time, user, brand, extensions, state } = request.params;
  const message = `${version}:${time}:${user}:${brand}:${extensions}:${state}`;

  // Calculate a signature
  const signature = generateSignature(secret, message);

  // Reject requests with invalid signatures
  if (!request.headers["X-Canva-Signatures"].includes(signature)) {
    console.log("The signature is not valid");
    response.sendStatus(401);
  }

  console.log("The request is valid");
});

app.listen(process.env.PORT || 3000);
```
