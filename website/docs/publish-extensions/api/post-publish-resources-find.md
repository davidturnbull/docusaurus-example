---
title: "POST /publish/resources/find"
sidebar_label: /publish/resources/find
path: /publish-extensions/api/post-publish-resources-find/
---

:::note  
 This route is only relevant to publish extensions that use the [List](./../list-layout.md) or [Nested](./../nested-layout.md) layout.  
:::

When a user opens a publish extension, Canva sends a `POST` request to the following URL:

```bash
<endpoint_url>/publish/resources/find
```

This route is expected to return a list of resources. These resources can have a `type` of `"IMAGE"` or `"CONTAINER"`.

When a resource is a `"CONTAINER"`, it's rendered as a folder that the user can select before publishing their design. When a resource is an `"IMAGE"`, it's rendered as a non-interactive file.

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
  "label": "PUBLISH",
  "limit": 100,
  "preferredThumbnailWidth": 50,
  "preferredThumbnailHeight": 50
}
```

## Response

### Body

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

Each object in the `resources` array can include the following properties:

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

:::note  
 Unlike a [content extension](./../../content-extensions.md), different types of resources can be included in a single response.  
:::

The `thumbnail` object can include the following properties:

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

:::warning  
 If you provide a value for the `height` property, you must also provide a value for the `width` property (and vice-versa).  
:::

### Example

```json
{
  "type": "SUCCESS",
  "resources": [
    {
      "id": "12345",
      "name": "An Example Resource",
      "type": "IMAGE",
      "thumbnail": {
        "url": "https://picsum.photos/200"
      },
      "isOwner": true,
      "readOnly": false
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
