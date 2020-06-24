---
title: onPresetSelected
path: /editing-extensions/api/canva-api-client/on-preset-selected/
---

Registers a callback that executes when the user selects a preset.

## Usage

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  // this method must exist for the extension to start
});

canva.onPresetSelected(async (opts) => {
  console.log(opts);
});
```

:::note  
 For an app to provide presets, the feature must be enabled via the Developer Portal.  
:::

## Parameters

The `onPresetSelected` method accepts the following arguments:

| Parameter | Type     | Description                                             |
| --------- | -------- | ------------------------------------------------------- |
| `handler` | function | The callback to execute when the user selects a preset. |

The `handler` function receives an object with the following properties:

| Parameter  | Type   | Description                    |
| ---------- | ------ | ------------------------------ |
| `presetId` | string | The ID of the selected preset. |
