---
title: "POST /publish/resources/upload"
sidebar_label: /publish/resources/upload
path: /publish-extensions/api/post-publish-resources-upload/
---

When a user publishes their design, Canva sends a `POST` request to the following URL:

```bash
<endpoint_url>/publish/resources/upload
```

This route is expected to upload the user's design to the publishing destination and provide a response that indicates if the upload succeeded or failed.

:::note  
 All publish extensions must support this route.  
:::

## Request

### Body

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

Each object in the `assets` array contains the following properties:

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

### Example

```json
{
  "user": "AUQ2RUzug9pEvgpK9lL2qlpRsIbn1Vy5GoEt1MaKRE=",
  "brand": "AUQ2RUxiRj966Wsvp7oGrz33BnaFmtq4ftBeLCSHf8=",
  "label": "PUBLISH",
  "assets": [
    {
      "url": "https://s3.amazonaws.com/.../49-04fa92cbfbf8.jpg",
      "type": "JPG",
      "name": "0001-144954.jpg"
    }
  ]
}
```

:::note  
 When a user publishes their design as a `"JPG"` or `"PNG"`, each page of their design is a separate asset in the `assets` array. If the user publishes their design as a `"PDF"` or `"PPTX"`, their entire design will be a single asset.  
:::

## Response

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
  "type": "SUCCESS"
}
```

## Error handling

If your extension is unable to upload the requested assets, it should return an `"ERROR"` response:

```json
{
  "type": "ERROR",
  "errorCode": "INVALID_REQUEST"
}
```

For a complete list of valid error codes, refer to [Error handling](./../error-handling.md).
