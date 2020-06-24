---
title: onReady
path: /editing-extensions/api/canva-api-client/on-ready/
---

Registers a callback that executes when an editing extension is initialized.

## Usage

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  console.log(opts);
});
```

## Parameters

The `onReady` method accepts the following arguments:

| Parameter | Type     | Description                                                       |
| --------- | -------- | ----------------------------------------------------------------- |
| `handler` | function | The callback to execute when an editing extension is initialized. |

The `handler` function receives an object with the following properties:

| Parameter         | Type         | Description                                                                |
| ----------------- | ------------ | -------------------------------------------------------------------------- |
| `image`           | `CanvaImage` | The user's image.                                                          |
| `previewSize`     | object       | The dimensions of the iframe that contains the user's image.               |
| `presetId`        | string       | The ID of a preset that should be immediately applied to the user's image. |
| `assets`          | object       | Refer to [Assets](./../../assets.md).                                      |
| `localizedLabels` | object       | Refer to [Localization](./../../localization.md).                          |

The `previewSize` object contains the following properties:

| Parameter | Type   | Description                           |
| --------- | ------ | ------------------------------------- |
| `height`  | number | The height of the iframe (in pixels). |
| `width`   | number | The width of the iframe (in pixels).  |
