---
title: imageHelpers
path: /editing-extensions/api/image-helpers/
---

## Usage

```javascript
const { imageHelpers } = window.canva;
```

## Methods

| Method                                                  | Description                                                      |
| ------------------------------------------------------- | ---------------------------------------------------------------- |
| [`fromCanvas`](./image-helpers/from-canvas.md)          | Converts a `HTMLCanvasElement` into a `CanvaImage`.              |
| [`fromDataUrl`](./image-helpers/from-data-url.md)       | Converts a data URL into a `CanvaImage`.                         |
| [`fromUrl`](./image-helpers/from-url.md)                | Fetches an image from a URL and converts it into a `CanvaImage`. |
| [`getSize`](./image-helpers/get-size.md)                | Gets the dimensions of a `CanvaImage`.                           |
| [`toImageElement`](./image-helpers/to-image-element.md) | Converts a `CanvaImage` into a `HTMLImageElement`.               |
| [`toDataUrl`](./image-helpers/to-data-url.md)           | Converts a `CanvaImage` into a data URL.                         |
