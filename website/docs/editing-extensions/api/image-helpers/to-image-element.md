---
title: toImageElement
path: /editing-extensions/api/image-helpers/to-image-element/
---

Converts a `CanvaImage` into a `HTMLImageElement`.

## Usage

```javascript
const { imageHelpers } = window.canva;
const canva = window.canva.init();

canva.onReady(async (opts) => {
  const img = await imageHelpers.toImageElement(opts.image);
  console.log(img);
});
```

## Parameters

| Parameter | Type         | Required | Description                                            |
| --------- | ------------ | :------: | ------------------------------------------------------ |
| `image`   | `CanvaImage` | <Tick /> | The `CanvaImage` to convert into a `HTMLImageElement`. |

## Returns

A `Promise` that resolves with a `HTMLImageElement`.
