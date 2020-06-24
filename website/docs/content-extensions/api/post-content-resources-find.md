---
title: "POST /content/resources/find"
sidebar_label: /content/resources/find
path: /content-extensions/api/post-content-resources-find/
---

When a user opens a content extension, Canva sends a `POST` request to the following URL:

```bash
<endpoint_url>/content/resources/find
```

This route is expected to return a list of resources, including [images](./../images.md), [embeds](./../embeds.md), or [containers](./../containers.md). These resources will then appear in the side panel of the Canva editor.

Canva also sends requests to this route when a user:

- [opens a container](./../containers.md)
- [paginates through resources](./../pagination.md)
- [provides a search query](./../search.md)

If the route is unable to return a list of resources, it should return an [error](./../error-handling.md).

## Request

### Headers

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

### Body

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

### Example

```json
{
  "user": "AUwp7hBFlaa84jGiP17Fo0y5_oe9ZhijI5w3RchtKTg=",
  "brand": "AUwp7hDABwdaAwyEBekKbybZGICj4Ue03fXxKpJ55uU=",
  "label": "CONTENT",
  "limit": 100,
  "type": "IMAGE"
}
```

## Response

### Body

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

#### `"IMAGE"` Resource

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

:::note  
 If an `"IMAGE"` resource doesn't have a `contentType` property, Canva will attempt to parse a file extension from the `url` or `name` property. In general though, we recommend providing a `contentType`.  
:::

#### `"EMBED"` Resource

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

#### `"CONTAINER"` Resource

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

The `thumbnail` object can include the following properties:

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

:::warning  
 If you provide a `height` for a thumbnail, you must also provide a `width` (and vice-versa).  
:::

### Example

```json
{
  "type": "SUCCESS",
  "resources": [
    {
      "id": "12345",
      "name": "MacBook Air",
      "type": "IMAGE",
      "thumbnail": {
        "url": "https://i.picsum.photos/id/2/200/200.jpg"
      },
      "url": "https://i.picsum.photos/id/2/200/200.jpg",
      "contentType": "image/jpeg"
    }
  ]
}
```

## Error handling

If your extension is unable to return the requested resources, it should return an `"ERROR"` response:

```json
{
  "type": "ERROR",
  "errorCode": "INVALID_REQUEST"
}
```

For a complete list of valid error codes, refer to [Error handling](./../error-handling.md).
