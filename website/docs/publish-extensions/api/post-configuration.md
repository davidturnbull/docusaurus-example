---
title: "POST /configuration"
sidebar_label: /configuration
path: /publish-extensions/api/post-configuration/
---

:::note  
 This route is only required by publish extensions that support [authentication](./../authentication.md).  
:::

When a user opens a publish extension, Canva sends a `POST` request to the following URL:

```bash
<endpoint_url>/configuration
```

This route is expected to check if the current user is authenticated with the destination platform. If the user is not authenticated, a `"CONFIGURATION_REQUIRED"` error should be returned:

```json
{
  "type": "ERROR",
  "errorCode": "CONFIGURATION_REQUIRED"
}
```

:::note  
 If a publish extension uses the [List](./../list-layout.md) or [Nested](./../nested-layout.md) layout, Canva will wait for a `"SUCCESS"` response from `/configuration` before sending a request to `/publish/resources/find`.  
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
  "brand": "AUQ2RUxiRj966Wsvp7oGrz33BnaFmtq4ftBeLCSHf8="
}
```

## Response

### Body

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

### Example

```json
{
  "type": "SUCCESS",
  "labels": ["PUBLISH"]
}
```
