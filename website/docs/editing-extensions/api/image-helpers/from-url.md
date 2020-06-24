---
title: fromUrl
path: /editing-extensions/api/image-helpers/from-url/
---

Fetches an image from a URL and converts it into a `CanvaImage`.

## Usage

```javascript
const { imageHelpers } = window.canva;
const canva = window.canva.init();

canva.onReady(async () => {
  const image = await imageHelpers.fromUrl(
    "https://i.picsum.photos/id/200/500/500.jpg"
  );
  console.log(image);
});
```

## Parameters

| Parameter | Type   | Required | Description                                                           |
| --------- | ------ | :------: | --------------------------------------------------------------------- |
| `url`     | string | <Tick /> | The URL of the image to be fetched and converted into a `CanvaImage`. |

## Returns

A `Promise` that resolves with a `CanvaImage`.
