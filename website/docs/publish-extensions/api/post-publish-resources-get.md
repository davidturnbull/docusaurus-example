---
title: "POST /publish/resources/get"
sidebar_label: /publish/resources/get
path: /publish-extensions/api/post-publish-resources-get/
---

:::note  
 This route is only relevant to publish extensions that use the [List](./../list-layout.md) or [Nested](./../nested-layout.md) layout.  
:::

If a user selects a container before publishing their design, Canva sends a `POST` request to the following URL:

```bash
<endpoint_url>/publish/resources/get
```

This request is sent before [the upload request](./post-publish-resources-upload.md).

This route is expected to verify that the container still exists on the destination platform. If [authentication](./../authentication.md) is enabled, this route should also verify that the user still has the correct permissions to publish their design to the container.

:::note  
 Canva won't send a request to this route if the user doesn't select a container.  
:::

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
  "user": "AUQ2RUzug9pEvgpK9lL2qlpRsIbn1Vy5GoEt1MaKRE=",
  "brand": "AUQ2RUxiRj966Wsvp7oGrz33BnaFmtq4ftBeLCSHf8=",
  "label": "PUBLISH",
  "id": "exampleContainer",
  "preferredThumbnailWidth": 50,
  "preferredThumbnailHeight": 50
}
```

## Response

### Body

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

The `resource` object can include the following properties:

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

### Example

```json
{
  "type": "SUCCESS",
  "resource": {
    "type": "CONTAINER",
    "id": "123456",
    "name": "Example Container",
    "readOnly": false,
    "isOwner": true
  }
}
```

:::note  
 This response includes a single resource -- not an array of resources.  
:::

## Error handling

If your extension is unable to return the requested resource, it should return an `"ERROR"` response:

```json
{
  "type": "ERROR",
  "errorCode": "INVALID_REQUEST"
}
```

For a complete list of valid error codes, refer to [Error handling](./../error-handling.md).
