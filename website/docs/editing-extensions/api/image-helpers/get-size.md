---
title: getSize
path: /editing-extensions/api/image-helpers/get-size/
---

Gets the dimensions of a `CanvaImage`.

## Usage

```javascript
const { imageHelpers } = window.canva;
const canva = window.canva.init();

canva.onReady(async (opts) => {
  const size = await imageHelpers.getSize(opts.image);
  console.log(size);
});
```

## Parameters

| Parameter | Type         | Required | Description                                |
| --------- | ------------ | :------: | ------------------------------------------ |
| `image`   | `CanvaImage` | <Tick /> | The `CanvaImage` to get the dimensions of. |

## Returns

A `Promise` that resolves with a `Size` object:

| Parameter | Type   | Required | Description                                 |
| --------- | ------ | :------: | ------------------------------------------- |
| `width`   | number | <Tick /> | The width of the `CanvaImage` (in pixels).  |
| `height`  | number | <Tick /> | The height of the `CanvaImage` (in pixels). |
