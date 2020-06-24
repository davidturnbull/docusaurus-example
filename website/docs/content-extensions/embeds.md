---
title: "Add embeds to a content extension"
sidebar_label: Embeds
path: /content-extensions/embeds/
---

A content extension can support one of two types of content:

- [images](./images.md)
- [embeds]()

When a content extension supports embeds, it can provide users with embeddable media, such as YouTube videos, Instagram photos, and animated GIFs. This media appears in the side panel and can be dragged into the user's design.

![](images/6b478ec38f.gif)

## How embeds work

Behind the scenes, Canva uses [Iframely](https://iframely.com) to embed media in designs. This means any URL supported by Iframely can be embedded via a content extension.

![](images/b691ed293a.jpg)

To check if a URL is supported by Iframely, refer to [URLs supported by Iframely](https://iframely.com/docs/providers#urls-supported-by-iframely).

## Enabling embeds

For a content extension to support embeds, it must be configured via the Developer Portal.

To enable support for embeds:

1.  Navigate to an app via the Developer Portal.
2.  From the **Extensions** page, expand the **Content** panel.
3.  From the **Asset type** dropdown, select **Embed only**.

:::warning  
 A content extension can't support embeds _and_ images. It can only support one or the other.  
:::

## What embeds can't do

When working with embeds, there are some limitations:

- The media is embedded via an iframe. This means the user can only manipulate the size and position of the media. They cannot apply effects to it.
- Canva only stores a reference to the media. If the original media becomes unavailable, an error will be displayed in place of the media.
- If a user downloads their design, the media won't be interactive or animated.
- Unlike images, embeds can't be organized into [containers](./containers.md).

## Receiving embed requests

When a content extension supports embeds, Canva will retrieve the embeddable media by sending a `POST` request to the following URL:

```bash
<endpoint_url>/content/resources/find
```

`<endpoint_url>` is a placeholder that will be replaced by the extension's **Endpoint URL**. You can configure this URL via the Developer Portal. The `/content/resources/find` path is not configurable.

The body of this request is a JSON object that contains the following properties:

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

This is an example of an `"EMBED"` request:

```json
{
  "user": "AUQ2RUzug9pEvgpK9lL2qlpRsIbn1Vy5GoEt1MaKRE=",
  "brand": "AUQ2RUxiRj966Wsvp7oGrz33BnaFmtq4ftBeLCSHf8=",
  "label": "CONTENT",
  "limit": 100,
  "type": "EMBED",
  "locale": "en-US"
}
```

## Responding to embed requests

After receiving an `"EMBED"` request, your extension should return a `"SUCCESS"` response that includes the embeds that will appear in the side panel.

The body of this response must contain the following properties:

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

Each object in the `resources` array must contain the following properties:

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

The `thumbnail` object must contain the following properties:

| Name         | Type   | Required | Description |
| ------------ | ------ | -------- | ----------- |
| `helloWorld` | string | <Tick /> |             |

:::tip  
 For thumbnail images, we recommend a minimum width and height of 150 pixels.  
:::

This is an example of a `"SUCCESS"` response:

```json
{
  "type": "SUCCESS",
  "resources": [
    {
      "id": "dQw4w9WgXcQ",
      "name": "Rick Astley - Never Gonna Give You Up",
      "type": "EMBED",
      "thumbnail": {
        "url": "https://i.imgur.com/Q2Unw.gif"
      },
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ]
}
```

:::tip  
 When an `"EMBED"` resource is an animated GIF, the thumbnail should also be animated.  
:::

## Error handling

If your extension is unable to return the requested embeds, it should return an `"ERROR"` response:

```json
{
  "type": "ERROR",
  "errorCode": "INVALID_REQUEST"
}
```

For a complete list of valid error codes, refer to [Error handling](./error-handling.md).
