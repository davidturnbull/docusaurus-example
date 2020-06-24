---
title: "Add a search field to a content extension"
sidebar_label: Search
path: /content-extensions/search/
---

A content extension can be configured to include a search field. This allows users to find exactly the content they're looking for.

![](images/0ae87bd96e.gif)

This topic explains how to receive and handle search queries.

## Enabling search

By default, content extensions don't support search. You need to enable the feature.

To enable search for a content extension:

1.  Navigate to an app via the Developer Portal
2.  On the **Extensions** page, expand the **Content** panel.
3.  Select the **Display search field** checkbox.

## Receiving search requests

When a user performs a search, Canva sends a `POST` request to the following URL:

```bash
<endpoint_url>/content/resources/find
```

This is the same URL that Canva sends requests to when requesting images, embeds, and containers. The only difference is that the body of this request includes a `query` property that contains the user's search query:

```json
{
  "user": "AUQ2RUzug9pEvgpK9lL2qlpRsIbn1Vy5GoEt1MaKRE=",
  "brand": "AUQ2RUxiRj966Wsvp7oGrz33BnaFmtq4ftBeLCSHf8=",
  "label": "CONTENT",
  "limit": 100,
  "type": "IMAGE",
  "locale": "en-US",
  "query": "funny cats"
}
```

## Detecting when a user performs a search

When a `POST` request is _not_ triggered by a search, the `query` property is `null`. You can therefore detect when a user has performed a search by checking if the value of the `query` property is `null`:

```javascript
app.post("/content/resources/find", async (request, response) => {
  if (request.body.query) {
    // the user has performed a search
  }

  if (!request.body.query) {
    // the user has not performed a search
  }
});
```

## Responding to search requests

When a user performs a search, a content extension should return a `"SUCCESS"` response that includes resources relevant to the user's query:

```json
{
  "type": "SUCCESS",
  "resources": []
}
```

What counts as "relevant" depends on what you're trying to accomplish. Your extension could just return resources that have the user's exact search query in their `name` property. Or after users perform a search, you could keep track of what resources they drag into their designs and then use that data to surface the most relevant resources for future searches. It's your choice.

:::note  
 If a search returns more results than can be included in a single response, use [pagination](./pagination.md) to load the additional resources.  
:::

## Handling containers

If an extension supports [containers](./containers.md), it's important to know that the `query` and `containerId` properties are mutually exclusive. If the `query` property is not `null`, then the `containerId` will be `null`. This means a user cannot search within a container. You can, however, use a search query to return a filtered list of containers.

## Advanced search queries

Canva supports [advanced search queries](https://support.canva.com/create-your-design/search/advanced-search/). This allow users to find exactly the content they're looking for by including certain operators and keywords in their queries.

These are some examples of advanced search queries:

| Query              | Description                          |
| ------------------ | ------------------------------------ |
| apple + red        | Apples that are red.                 |
| apple NOT red      | Apples that are not red.             |
| apple OR banana    | Apples or bananas.                   |
| apple +cutout:true | Apples with transparent backgrounds. |

Extensions are not required to support this syntax, but if you'd like your extension to be more tightly integrated with the Canva experience, consider parsing search queries and using the above operators and keywords to filter search results.

## Example

This example allows users to search for photos from [Pixabay](https://pixabay.com). You'll need a (free) API key to run it.

```javascript
const axios = require("axios");
const express = require("express");
const app = express();

app.use(express.json());

app.post("/content/resources/find", async (request, response) => {
  // Configure the request
  const options = {
    url: "https://pixabay.com/api/",
    params: {
      key: process.env.PIXABAY_API_KEY,
    },
  };

  // If a user has provided a query, include it in the request
  if (request.body.query) {
    options["params"]["q"] = request.body.query;
  }

  // Send a request to Pixabay
  const pixabay = await axios.request(options);

  // Transform the array of images into an array of "IMAGE" resources
  const images = pixabay.data.hits.map((image) => {
    return {
      type: "IMAGE",
      id: image.id,
      name: `Photo by ${image.user}`,
      thumbnail: {
        url: image.webformatURL,
        height: image.webformatHeight,
        width: image.webformatWidth,
      },
      contentType: "image/jpeg",
      url: image.webformatURL,
    };
  });

  // Return a "SUCCESS" response
  response.send({
    type: "SUCCESS",
    resources: images,
  });
});

app.listen(process.env.PORT || 3000);
```
