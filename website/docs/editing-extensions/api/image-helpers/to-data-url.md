---
title: toDataUrl
path: /editing-extensions/api/image-helpers/to-data-url/
---

Converts a `CanvaImage` into a data URL.

## Usage

```javascript
const { imageHelpers } = window.canva;
const canva = window.canva.init();

canva.onReady(async (opts) => {
  const dataUrl = await imageHelpers.toDataUrl(opts.image);
  console.log(dataUrl);
});
```

## Parameters

| Parameter | Type         | Required | Description                                  |
| --------- | ------------ | :------: | -------------------------------------------- |
| `image`   | `CanvaImage` | <Tick /> | The `CanvaImage` to convert into a data URL. |

## Returns

A `Promise` that resolves with a data URL.
