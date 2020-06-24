---
title: fromDataUrl
path: /editing-extensions/api/image-helpers/from-data-url/
---

Converts a data URL into a `CanvaImage`.

## Usage

```javascript
const { imageHelpers } = window.canva;
const canva = window.canva.init();

canva.onReady(async () => {
  const image = await imageHelpers.fromDataUrl(
    "image/jpeg",
    "data:image/jpeg;base64,iVBORw0KGgoAA..."
  );
  console.log(image);
});
```

## Parameters

| Parameter   | Type   | Required | Description                                                                                                                |
| ----------- | ------ | :------: | -------------------------------------------------------------------------------------------------------------------------- |
| `imageType` | string | <Tick /> | The MIME type to assign to the `CanvaImage`. The possible values are `"image/jpeg"`, `"image/png"`, and `"image/svg+sml"`. |
| `dataUrl`   | string | <Tick /> | The data URL to convert into a `CanvaImage`.                                                                               |

## Returns

A `Promise` that resolves with a `CanvaImage`.
