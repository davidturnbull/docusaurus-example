---
title: onPresetsRequest
path: /editing-extensions/api/canva-api-client/on-presets-request/
---

Registers a callback that executes when Canva requests an extension's presets.

## Usage

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  // this method must exist for the extension to start
});

canva.onPresetsRequest(async (opts) => {
  return [
    {
      id: "presetExample",
      label: "Preset Example",
      image: opts.image,
    },
  ];
});
```

:::note  
 For an app to provide presets, the feature must be enabled via the Developer Portal.  
:::

## Parameters

The `onPresetsRequest` method accepts the following arguments:

| Parameter | Type     | Description                                                   |
| --------- | -------- | ------------------------------------------------------------- |
| `handler` | function | The callback to execute when Canva requests an app's presets. |

The `handler` function receives an object with the following properties:

| Parameter       | Type         | Description                                   |
| --------------- | ------------ | --------------------------------------------- |
| `image`         | `CanvaImage` | The user's image.                             |
| `minDimensions` | object       | The minimum dimensions for preset thumbnails. |

The `minDimensions` object contains the following properties:

| Parameter | Type   | Description                                           |
| --------- | ------ | ----------------------------------------------------- |
| `height`  | number | The minimum height for preset thumbnails (in pixels). |
| `width`   | number | The minimum width for preset thumbnails (in pixels).  |

## Returns

The `handler` function must return an array of presets or a `Promise` that resolves with an array of presets. Each preset must be an object with the following properties:

| Parameter | Type         | Description                                            |
| --------- | ------------ | ------------------------------------------------------ |
| `id`      | id           | A unique ID for the preset.                            |
| `label`   | string       | A human readable label for the preset.                 |
| `image`   | `CanvaImage` | The image that will be used as the preset's thumbnail. |
