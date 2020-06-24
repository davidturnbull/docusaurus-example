---
title: onImageUpdate
path: /editing-extensions/api/canva-api-client/on-image-update/
---

Registers a callback that executes when Canva requests the extension to update the user's image.

:::note  
 When an app receives an updated image, it should apply all previous and future transformations to that image _instead of_ the image provided in the `onReady` callback.  
:::

## Usage

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  // this method must exist for the extension to start
});

canva.onImageUpdate(async (opts) => {
  console.log(opts);
});
```

## Parameters

The `onImageUpdate` method accepts the following arguments:

| Parameter | Type     | Description                                                                     |
| --------- | -------- | ------------------------------------------------------------------------------- |
| `handler` | function | The callback to execute when Canva requests the app to update the user's image. |

The `handler` function receives an object with the following properties:

| Parameter | Type         | Description        |
| --------- | ------------ | ------------------ |
| `image`   | `CanvaImage` | The updated image. |
