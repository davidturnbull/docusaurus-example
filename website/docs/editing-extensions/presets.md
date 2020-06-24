---
title: "Add presets to an editing extension"
sidebar_label: Presets
path: /editing-extensions/presets/
---

An editing extension can be configured to support _presets_.

Presets allow the user to quickly apply effects to an image via the **Effects** panel.

## How users experience presets

If an editing extension supports presets, the presets will appear in the **Effects** panel. The user can then select a preset to apply the effect to their image.

After the user applies a preset to their image, they can select the preset again to view the extension's control panel. This allows them to configure the exact behavior of the preset.

There is no strict limit to how many presets an extension can support, but if an extension has more than four presets, the user will have to click the **See all** button to view all of them.

## Why support presets?

When an editing extension supports presets:

- the app is given more real estate in the **Effects** panel
- users can engage with the app without opening it directly
- presets provide an overall faster, slicker user experience

## Enabling presets

By default, editing extensions are not configured to support presets. You need to enable the feature.

To enable presets:

1.  Navigate to an app via the Developer Portal.
2.  From the **Extensions** page, expand the **Editing** panel.
3.  Enable **Supports preset previews**.

## Receiving preset requests

When a user opens the **Effects** panel, Canva emits an event. If **Supports preset previews** is enabled, an editing extension must listen for this event and respond with an array of presets.

To listen for this event, register a callback with the `onPresetsRequest` method:

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  // this callback must exist for the extension to load
});

canva.onPresetsRequest(async (opts) => {
  console.log(opts);
});
```

This callback receives an object that contains the following properties:

| Property        | Type         | Description                                      |
| --------------- | ------------ | ------------------------------------------------ |
| `image`         | `CanvaImage` | The user's image as a `CanvaImage` object.       |
| `minDimensions` | object       | The minimum dimensions of a preset's thumbnails. |

## Responding to preset requests

To display presets within the **Effects** panel, the `onPresetsRequest` callback must return an array of presets. Each preset must be an object with the following properties:

| Property | Type         | Description                                |
| -------- | ------------ | ------------------------------------------ |
| `id`     | string       | A unique ID for the preset.                |
| `label`  | string       | A human readable label for the preset.     |
| `image`  | `CanvaImage` | The user's image as a `CanvaImage` object. |

This is an example of an extension that render's the user's (unmodified) image as a preset:

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  // this callback must exist for the extension to load
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

## Creating preset thumbnails

If possible, we recommend providing users with accurate previews of presets. This means dynamically generating preset thumbnails based on the user's image.

To do this:

1.  Create a `HTMLCanvasElement` for each preset.
2.  Set the width and height of the each `HTMLCanvasElement` to the `width` and `height` of the `minDimensions` object. (This ensures that the effect is applied to the smallest possible surface area, increasing the rendering speed of the preview.)
3.  Apply the effect of each preset to a `HTMLCanvasElement`.
4.  Convert the `HTMLCanvasElement` into a `CanvaImage`. (You can do this with the [`fromCanvas`](./api/image-helpers/from-canvas.md) function.)

If it's not possible to provide accurate previews of presets, it's fine to use regular images, but these images still need to be converted into`CanvaImage` objects.

## Detecting when a user selects a preset

When a user selects a preset, Canva emits an event.

To listen for this event, register a callback with the `onPresetSelected` method:

```javascript
canva.onPresetSelected(async (opts) => {
  console.log(opts);
});
```

This callback receives an object with the following properties:

| Property   | Type   | Description                    |
| ---------- | ------ | ------------------------------ |
| `presetId` | string | The ID of the selected preset. |

Your extension should identify what preset has been selected and apply the relevant effect to the user's image:

```javascript
canva.onPresetSelected(async (opts) => {
  if (opts.presetId === "invert") {
    // TODO: apply the "invert" effect to the user's image
  }
});
```
