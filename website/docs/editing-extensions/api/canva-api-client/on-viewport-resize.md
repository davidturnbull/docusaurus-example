---
title: onViewportResize
path: /editing-extensions/api/canva-api-client/on-viewport-resize/
---

Registers a callback that executes when the size of the viewport changes.

The size of the viewport changes when:

- the user resizes the iframe that contains their image
- the zoom level of the document changes

## Usage

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  // this method must exist for the extension to start
});

canva.onViewportResize(async (opts) => {
  console.log(opts);
});
```

## Parameters

The `onViewportResize` method accepts the following arguments:

| Parameter | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| `handler` | function | The callback to execute when the size of the viewport changes. |

The `handler` function receives an object with the following properties:

| Parameter | Type    | Description                                                                                                                                |
| --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `size`    | object  | An object that contains the dimensions of the viewport.                                                                                    |
| `commit`  | boolean | The value of this property is `false` while the user is resizing the viewport and `true` when the user has finished resizing the viewport. |

The `size` object contains the following properties:

| Parameter | Type   | Description                                     |
| --------- | ------ | ----------------------------------------------- |
| `height`  | number | The height of the resized viewport (in pixels). |
| `width`   | number | The width of the resized viewport (in pixels).  |
