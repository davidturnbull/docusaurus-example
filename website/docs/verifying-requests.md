---
title: "Verifying requests"
path: /verifying-requests/
---

For an app to be accepted into the [Apps Directory](https://canva.com/apps), it must verify that any requests it receives from Canva are actually being sent from Canva (and not from some nefarious third-party that's pretending to be Canva). This protects your app -- and our users -- from a variety of attacks.

## What requests needs to be verified?

Your app needs to verify all `POST` requests, including (but not limited to) requests sent to the following routes:

- `/configuration`
- `/content/resources/find`
- `/publish/resources/find`
- `/publish/resources/get`
- `/publich/resources/upload`

In addition to this, if the app supports [authentication](./content-extensions/authentication.md):

- the `GET` request that Canva sends to the app's **Redirect URL** needs to be verified
- the authentication flow (as a whole) needs to be verified

There are differences between each form of verification, the details of which are described in this topic:

- [Verifying `POST` requests](./verifying-requests/#verifying-post-requests.md)
- [Verifying `GET` requests](./verifying-requests/#verifying-get-requests.md)
- [Verifying authentication flows](./verifying-requests/#verifying-authentication-flows.md)

## How we confirm that requests are verified

If you submit your app for review, it enters a "submitted" state. While in this state, actions that would usually trigger a single request -- such as opening a content extension -- will trigger multiple requests. These additional requests have invalid timestamps or signatures, allowing our reviewers to confirm that invalid requests are correctly rejected.

:::note  
 If you preview your app while it's in the "submitted" state, you may notice that most requests are failing. This is expected behavior.  
:::

## Generating a client secret

Every app has a unique client secret. This is essentially a password that is shared between Canva and the app. You'll need the client secret to verify request signatures.

To get the client secret for an app:

1.  Navigate to an app via the Developer Portal.
2.  Select **Verification & auth**.
3.  Copy the client secret from the **Client secret key** field.

:::danger  
 Do not share the client secret or commit it to source control.  
:::

## Regenerating a client secret {#regenerating-a-client-secret}

If your client secret is leaked or committed to source control, you should regenerate it. The problem is, if your app verifies requests and you change the client secret, all requests to the app will fail until it's updated.

To avoid this problem, Canva allows you to keep the previous client secret active for a specified number of hours. If more than one client secret is active, multiple request signatures will be sent with each request as a comma-separated string.

Your app only has to validate one of the provided signatures to verify the authenticity of the request. This allows you to update your apps without causing downtime.

To regenerate the client secret for an app:

1.  Navigate to an app via the Developer Portal.
2.  Click **Verification & auth**.
3.  Click **Regenerate**.
4.  Indicate how many hours the existing client secret should remain active for.
5.  Click **Regenerate client secret key**.

The new client secret will appear in the **Client secret key** field.

## Decoding the client secret

When Canva sends a request to an app, it includes the app's **Client secret** in the body (or query parameters) of the request. This secret is provided as a base64url-encoded string. For an app to verify a request, it must decode the secret from the base64url-encoded string into a byte array.

This is an example of decoding a secret with Node.js and the [base64url](https://www.npmjs.com/package/base64url) package:

```javascript
const base64url = require("base64url");
const secret = "YOUR APP'S CLIENT SECRET GOES HERE";
const key = base64url.toBuffer(secret);
console.log(key);
```

:::note  
 base64url encoding is _not_ the same thing as base64 encoding. The differences are described in [this StackOverflow answer](https://stackoverflow.com/a/55389212/13227683).  
:::

## Verifying `POST` requests {#verifying-post-requests}

When Canva sends a `POST` request, it provides the following values in the headers of the request:

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

You can use these values to verify the requests.

If a request is not valid, the app should reject the request by returning a status code of `401`.

### Timestamp

If the timestamp of when the request is received is more than five minutes before or after the timestamp of when the request was sent, the app should reject the request.

The app should accept requests that arrive up to five minutes on either side of the timestamp because:

- requests are not immediately received after they're sent
- server clocks may not be perfectly synchronized

This is an example of a JavaScript function that can verify timestamps:

```javascript
const verifyTimestamp = ({ receivedAt, sentAt, leniencyInSeconds }) => {
  if (sentAt - receivedAt > leniencyInSeconds) {
    // The timestamp is in the future
    return false;
  }

  if (receivedAt - sentAt > leniencyInSeconds) {
    // The timestamp has expired
    return false;
  }

  // The timestamp is valid
  return true;
};
```

It accepts an object with three properties:

| Property            | Type   | Description                                                                                                    |
| ------------------- | ------ | -------------------------------------------------------------------------------------------------------------- |
| `receivedAt`        | number | The UNIX timestamp of when the request was received.                                                           |
| `sentAt`            | number | The UNIX timestamp of when the request was sent.                                                               |
| `leniencyInSeconds` | number | The maximum amount of time (in seconds) that should be allowed between when the request was received and sent. |

If the timestamp is too far in the future or too far in the past, it returns `false`.

This is an example of verifying the timestamps of `POST` requests in Express.js:

```javascript
app.use(
  express.json({
    verify: (request, response, buffer) => {
      // Verify the timestamp
      const currentTime = new Date().getTime() / 1000;
      const timestamp = Number(request.header("X-Canva-Timestamp"));
      const leniencyInSeconds = 300;

      const validTimestamp = verifyTimestamp({
        receivedAt: currentTime,
        sentAt: timestamp,
        leniencyInSeconds,
      });

      // Respond with a 401 status code if the request is not valid
      if (!validTimestamp) {
        response.status(401).send("Invalid request");
      }
    },
  })
);
```

In the above snippet, the [`express.json()`](https://expressjs.com/en/api.html#express.json) middleware is used to verify any request with an incoming JSON payload.

### Signatures

If the timestamp of the request is valid, the request signature should be verified. The request signature is a string that is computed based on values specific to the request.

In `POST` requests, request signatures are generated with:

- the app's **Client secret key** (decoded from a base64url-encoded string)
- the UNIX timestamp of when the request was sent
- the path of the endpoint (e.g. `/content/resources/find`)
- the raw body of the request (also known as the _payload_)

This is an example of a function that can verify request signatures in a `POST` request:

```javascript
const base64url = require("base64url");
const { createHmac } = require("crypto");

const verifyPostRequestSignature = ({
  secret,
  signatures,
  timestamp,
  path,
  body,
}) => {
  // Decode the secret as a "base64url" and convert it into a byte array
  const key = base64url.toBuffer(secret);

  // Create the required payload for generating a signature
  const payload = `v1:${timestamp}:${path}:${body}`;

  // Generate a signature as a SHA-256 hash
  const signature = createHmac("sha256", key).update(payload).digest("hex");

  // If the "signatures" list contains the generated signature, the request is valid
  if (signatures.split(",").includes(signature)) {
    return true;
  }

  // Otherwise, the request not valid
  return false;
};
```

The function accepts an object with the following properties:

| Property     | Type   | Description                                               |
| ------------ | ------ | --------------------------------------------------------- |
| `secret`     | string | The app's **Client secret key**.                          |
| `signatures` | string | A comma-separated list of signatures.                     |
| `timestamp`  | string | The UNIX timestamp of when the request was sent.          |
| `path`       | string | The path that Canva has appended to the **Endpoint URL**. |
| `body`       | string | The raw body of the request.                              |

If the signature calculated by the function doesn't match one of the provided signatures, it returns `false`.

This is an example of verifying the signatures of `POST` requests in Express.js:

```javascript
app.use(
  express.json({
    verify: (request, response, buffer) => {
      // Verify the timestamp
      const currentTime = new Date().getTime() / 1000;
      const timestamp = Number(request.header("X-Canva-Timestamp"));
      const leniencyInSeconds = 300;

      const validTimestamp = verifyTimestamp({
        receivedAt: currentTime,
        sentAt: timestamp,
        leniencyInSeconds,
      });

      // Verify the request signature
      const secret = process.env.CANVA_CLIENT_SECRET;
      const signatures = request.header("X-Canva-Signatures");
      const path = request.path;
      const body = buffer.toString();

      const validSignature = verifyPostRequestSignature({
        secret,
        signatures,
        path,
        body,
        timestamp,
      });

      // Respond with a 401 status code if the request is not valid
      if (!validTimestamp || !validSignature) {
        response.status(401).send("Invalid request");
      }
    },
  })
);
```

:::note  
 The above code snippet assumes a `CANVA_CLIENT_SECRET` environment variable is set that contains the app's .  
:::

## Verifying `GET` requests {#verifying-get-requests}

:::note  
 Canva only sends a `GET` request if [authentication](./content-extensions/authentication.md) is enabled. This request is sent when Canva redirects users to the .  
:::

When Canva sends a `GET` request, it appends the following query parameters to the URL:

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

You can use these values to verify the requests.

If a request is not valid, the app should reject the request by returning a status code of `401`.

### Timestamp

To verify timestamps in a `GET` request, the `verifyTimestamp` function that's used for verifying `POST` requests can be reused:

```javascript
const verifyTimestamp = ({ receivedAt, sentAt, leniencyInSeconds }) => {
  if (sentAt - receivedAt > leniencyInSeconds) {
    // The timestamp is in the future
    return false;
  }

  if (receivedAt - sentAt > leniencyInSeconds) {
    // The timestamp has expired
    return false;
  }

  // The timestamp is valid
  return true;
};
```

But it's important to note that, in `GET` requests, the timestamp is provided in a parameter called `time`, not `timestamp`.

This is an example of verifying the timestamp of a `GET` request in Express.js:

```javascript
app.get("/my-redirect-url", async (request, response) => {
  // Verify the timestamp
  const currentTime = new Date().getTime() / 1000;
  const timestamp = Number(request.query.time);
  const leniencyInSeconds = 300;

  const validTimestamp = verifyTimestamp({
    receivedAt: currentTime,
    sentAt: timestamp,
    leniencyInSeconds,
  });

  // Respond with a 401 status code if the request is not valid
  if (!validTimestamp) {
    response.status(401).send("Invalid request");
  }

  response.send("Valid request");
});
```

### Signatures

In `GET` requests, request signatures are generated with:

- the app's **Client secret key** (decoded from a base64url-encoded string)
- the UNIX timestamp of when the request was sent
- the values of the request's query parameters

This is an example of a function that can verify request signatures in a `GET` request:

```javascript
const base64url = require("base64url");
const { createHmac } = require("crypto");

const verifyGetRequestSignature = ({
  secret,
  signatures,
  time,
  user,
  brand,
  extensions,
  state,
}) => {
  // Decode the secret as a "base64url" and convert it into a byte array
  const key = base64url.toBuffer(secret);

  // Create the required payload for generating a signature
  const payload = `v1:${time}:${user}:${brand}:${extensions}:${state}`;

  // Generate a signature as a SHA-256 hash
  const signature = createHmac("sha256", key).update(payload).digest("hex");

  // If the "signatures" list contains the generated signature, the request is valid
  if (signatures.split(",").includes(signature)) {
    return true;
  }

  // Otherwise, the signature is not valid
  return false;
};
```

The function accepts an object with the following properties:

| Property     | Type   | Description                                                                             |
| ------------ | ------ | --------------------------------------------------------------------------------------- |
| `secret`     | string | The app's **Client secret key**.                                                        |
| `signatures` | string | A comma-separated list of signatures.                                                   |
| `time`       | string | The UNIX timestamp of when the request was sent.                                        |
| `user`       | string | The ID of the user.                                                                     |
| `brand`      | string | The ID of the user's brand.                                                             |
| `extensions` | string | The type of extension the user is attempting to authenticate with.                      |
| `state`      | string | A unique signature that's used to validate the authenticity of authentication requests. |

If the signature calculated by the function doesn't match one of the provided signatures, it returns `false`.

This is an example of verifying the signatures of a `GET` request in Express.js:

```javascript
app.get("/my-redirect-url", async (request, response) => {
  // Verify the timestamp
  const currentTime = new Date().getTime() / 1000;
  const timestamp = Number(request.query.time);
  const leniencyInSeconds = 300;

  const validTimestamp = verifyTimestamp({
    receivedAt: currentTime,
    sentAt: timestamp,
    leniencyInSeconds,
  });

  // Verify the request signature
  const secret = process.env.CANVA_CLIENT_SECRET;
  const { user, brand, time, extensions, signatures, state } = request.query;

  const validSignature = verifyGetRequestSignature({
    secret,
    signatures,
    time,
    user,
    brand,
    extensions,
    state,
  });

  // Respond with a 401 status code if the request is not valid
  if (!validTimestamp || !validSignature) {
    response.status(401).send("Invalid request");
  }

  response.send("Valid request");
});
```

:::note  
 The above code snippet assumes a `CANVA_CLIENT_SECRET` environment variable is set that contains the app's .  
:::

## Verifying authentication flows {#verifying-authentication-flows}

If an app supports authentication, it must defend against [Cross-site request forgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery) (CSRF) attacks. To allow for this, Canva appends a `state` parameter to the app's **Redirect URL**.

The value of the `state` parameter is a string that looks like this:

```shell
95a5aa62-0713-4ae4-b99f-8efa57e7def0
```

When a user is redirected to the **Redirect URL**, your app is expected to keep track of the `state` parameter and return it to Canva at the end of the authentication flow. This confirms that the user who started the authentication flow is the same user who finished it (without any suspicious activity happening along the way).

_How_ your app keeps track of the `state` parameter is not important. You could, for instance, pass it through each page of the authentication flow as a query parameter, or you could save each authentication attempt (and each `state` parameter) to a database.

To return the value of the `state` parameter to Canva, append it to the end of the URL that's used to redirect users back to Canva at the end of an authentication flow:

```shell
https://canva.com/apps/configured?success=true&state=95a5aa62-0713-4ae4-b99f-8efa57e7def0
```

If the `state` parameter appended to this URL matches the `state` parameter that Canva appended to the **Redirect URL**, the authentication flow is considered valid. If it doesn't match, Canva will consider the authentication invalid and will abort the flow.
