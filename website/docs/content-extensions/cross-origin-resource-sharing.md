---
title: "Cross-Origin Resource Sharing"
sidebar_label: CORS
path: /content-extensions/cross-origin-resource-sharing/
---

While developing a content extension, you might find that:

- thumbnails don't appear in the side panel
- full-sized images disappear after dragging them into the design

To fix these issues, open the JavaScript Console:

1.  Click **View**.
2.  Click **Developer**.
3.  Click **Developer Tools**.

You'll probably see the following error message:

```bash
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

This error is caused by Cross-Origin Resource Sharing (CORS).

## What is CORS?

CORS is a security feature of web browsers that blocks client-side HTTP requests between different origins. An origin is a unique combination of a domain, protocol, and port.

These, for instance, are all different origins:

- `http://abc.com`
- `https://abc.com`
- `https://abc.com:3000`
- `https://abc.com:8080`
- `https://abc123.com`

When a content extension can't load images, it's because Canva is attempting to fetch the images from a different origin — the server that is serving the images — and that origin is blocking the request.

## Verifying CORS errors

If you're troubleshooting CORS errors, it's useful to check if a URL supports CORS without having to continually reload a content extension.

To check if a URL supports CORS:

1.  Visit [test-cors.org](https://test-cors.org).
2.  Enter the URL of the image into the **Remote URL** field.
3.  Click **Send Request**.

Errors will appears in the **Results** tab and JavaScript Console.

## Fixing CORS errors

When Canva fetches an image, the response to that request needs to include an `Access-Control-Allow-Origin` header. This header should have one of the following values:

- `*`
- `https://www.canva.com`

The wildcard origin says, "Let any origin access this resource." But a wildcard origin is only valid for unauthenticated requests and, if you're not careful, it can pose a security risk.

The `https://www.canva.com` origin says, "Block requests that don't originate from Canva." The `Access-Control-Allow-Origin` header only allows you to provide a single origin, which can be too restrictive, but there are [workarounds for multiple origins](#setting-multiple-origins).

There are three primary ways to set the value of the `Access-Control-Allow-Origin` header:

- at the server-level
- at the application-level
- with a proxy

## Setting the origin at the server-level

If you have access to the server that serves the images for a content extension, the `Access-Control-Allow-Origin` header can be set at the server-level.

This example demonstrates how to set the header on Apache servers using the `.htaccess` file:

```ApacheConf
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
</IfModule>
```

If you're not running Apache, refer to [w3.org/wiki/CORS_Enabled](https://www.w3.org/wiki/CORS_Enabled#At_the_HTTP_Server_level...) for alternate implementations.

## Setting the origin at the application-level

If you have access to the source code for the application that serves the images for a content extension, the `Access-Control-Allow-Origin` header can be set at the application-level.

This example demonstrates how to set the header in Express.js using the `response.header` method:

```javascript
const express = require("express");
const app = express();

app.get("/", async (request, response) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.send("CORS is enabled for this route.");
});

app.listen(process.env.PORT || 3000);
```

If you're not using Express.js, refer to [w3.org/wiki/CORS_Enabled](https://www.w3.org/wiki/CORS_Enabled#At_the_Web_Application_level...) for alternate implementations.

## Setting the origin with a proxy

If you don't have access to the server or application that serves the images for a content extension, you can fetch images through a proxy that sets the `Access-Control-Allow-Origin` headers.

### Fetching images through a hosted proxy

If you'd like to get up-and-running as quickly as possible, consider signing up for a [Cloudinary](https://cloudinary.com/) account and using their [Fetch remote images](https://cloudinary.com/documentation/fetch_remote_images) feature.

This feature can take a URL that doesn't support CORS:

    https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg

...and turn it into a URL that does support CORS:

    https://res.cloudinary.com/demo/image/fetch/https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg

### Fetching images through a self-hosted proxy

If you'd prefer to self-host a proxy, setup an endpoint that:

- fetches an image from a URL
- gets the binary data of the image
- sets the `Access-Control-Allow-Origin` header
- responds with the image data

This is an example of how to setup a proxy with Express.js and [jimp](https://www.npmjs.com/package/jimp):

```javascript
const express = require("express");
const jimp = require("jimp");

const app = express();

app.get("/", async (request, response) => {
  // Fetch image from URL
  const image = await jimp.read(request.query.url);

  // Get the image data
  const mimeType = await image.getMIME();
  const buffer = await image.getBufferAsync(mimeType);
  const imageData = buffer.toString("base64");

  // Set the `Access-Control-Allow-Origin` header
  response.header("Access-Control-Allow-Origin", "*");

  // Respond with the image data
  response.send(imageData);
});

app.listen(process.env.PORT || 3000);
```

To fetch images through this proxy, start the server:

```shell
node index.js
```

Then append the image URL to the endpoint URL as a query parameter:

```bash
http://localhost:3000/?url=<image_url>
```

You can view a live demo of this project as [a Glitch project](https://glitch.com/edit/#!/express-cors?path=server.js).

## Setting multiple origins

If you need to support multiple origins for the `Access-Control-Allow-Origin` header:

1.  Create a whitelist of supported origins.
2.  When a request is received, check the origin.
3.  If the origin is in the whitelist, set the `Access-Control-Allow-Origin` header to that origin.

This can be done at the server-level:

```ApacheConf
<IfModule mod_headers.c>
    SetEnvIf Origin "http(s)?://(www\.)?(canva.com|google.com|example.com)$" AccessControlAllowOrigin=$0
    Header add Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin
    Header merge Vary Origin
</IfModule>
```

...or at the application-level:

```javascript
const express = require("express");
const app = express();

const whitelist = ["https://www.canva.com", "https://canva.com"];

app.get("/", async (request, response) => {
  const origin = whitelist.find(request.headers["Access-Control-Allow-Origin"]);

  if (origin) {
    response.header("Access-Control-Allow-Origin", origin);
  }

  response.send("CORS is enabled for this route.");
});

app.listen(process.env.PORT || 3000);
```
