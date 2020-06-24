---
title: "Add thumbnails to a content extension"
sidebar_label: Thumbnails
path: /content-extensions/thumbnails/
---

In a [content extension](./../content-extensions.md), all [images](./images.md) and [embeds](./embeds.md) must provide a thumbnail. These thumbnails appear in the side panel and are intended to provide a preview of the associated resource.

:::note  
 You can also provide thumbnails for [containers](./containers.md), but this is not required.  
:::

## Properties

Thumbnails are represented as objects with the following properties:

| Property | Type   | Required | Description                                                                                          |
| -------- | ------ | :------: | ---------------------------------------------------------------------------------------------------- |
| `url`    | string | <Tick /> | The URL of an image. This can be any image supported by the `src` attribute of a `HTMLImageElement`. |
| `width`  | number |          | The width of the thumbnail (in pixels).                                                              |
| `height` | number |          | The height of the thumbnail (in pixels).                                                             |

This is an example of a thumbnail as a JSON object:

```json
{
  "url": "https://i.imgur.com/yed5Zfk.gif",
  "width": 360,
  "height": 270
}
```

## Caveats

### You should provide the dimensions of a thumbnail (even though it's not technically required)

You don't have to provide the `width` and `height` attributes for a thumbnail. However, if the dimensions are not provided, Canva will fetch the thumbnail dimensions by sending a request to the thumbnail's URL.

This had two side-effects:

First, the request will need to complete before the thumbnail can be rendered. This adds a small but perceptible delay to the rendering of the thumbnail.

Second, the server that hosts the thumbnail will need to support cross-origin requests. If it doesn't, a cross-origin error will occur and the thumbnail won't load. This issue is explained further in the [CORS](./cross-origin-resource-sharing.md) topic.

If the dimensions are provided, the request does not need to be sent. As a result, Canva will immediately download the image data and CORS won't be a potential issue.

### If you provide a `height` for a thumbnail, you must also provide a `width` (and vice-versa)

You can't provide only a `height` or only a `width` An error will occur and the thumbnails won't load if only one of these attributes is provided.

### For images, the aspect ratio of the thumbnail should match the aspect ratio of the full-sized image

If the aspect ratio of the thumbnail doesn't match the aspect ratio of the full-sized image, the full-sized image will become stretched or squashed after it's uploaded to the user's account.

If you need to calculate dimensions for a thumbnail that respects the aspect ratio of the full-sized image, decide upon a width for the thumbnail and use the following formula:

    (fullHeight / fullWidth) * thumbnailWidth

The answer will be a height for the thumbnail.

In JavaScript, this function can be used to calculate the height of a thumbnail:

```javascript
const getThumbnailHeight = (fullWidth, fullHeight, thumbnailWidth) => {
  return (fullHeight / fullWidth) * thumbnailWidth;
};
```
