---
title: fromCanvas
path: /editing-extensions/api/image-helpers/from-canvas/
---

Converts a `HTMLCanvasElement` into a `CanvaImage`.

## Usage

```javascript
const { imageHelpers } = window.canva;
const canva = window.canva.init();

canva.onReady(async () => {
  const canvas = document.createElement("canvas");
  const image = await imageHelpers.fromCanvas("image/jpeg", canvas);
  console.log(image);
});
```

## Parameters

| Parameter   | Type              | Required | Description                                                                                                                |
| ----------- | ----------------- | :------: | -------------------------------------------------------------------------------------------------------------------------- |
| `imageType` | string            | <Tick /> | The MIME type to assign to the `CanvaImage`. The possible values are `"image/jpeg"`, `"image/png"`, and `"image/svg+sml"`. |
| `canvas`    | HTMLCanvasElement | <Tick /> | The `HTMLCanvasElement` to convert into a `CanvaImage`.                                                                    |
| `quality`   | number            |          | A number from 0-100 that indicates the desired quality of the converted image.                                             |

## Returns

A `Promise` that resolves with a `CanvaImage`.
