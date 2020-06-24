---
title: "Updating the user's image"
sidebar_label: "Update the user's image"
path: /editing-extensions/update-image/
---

When a user opens an editing extension, Canva provides a downscaled (lower-resolution) version of the user's image in the `onReady` callback:

```javascript
canva.onReady(async (opts) => {
  console.log(opts.image);
});
```

This improves the performance of the extension, both in terms of the initial load time and the rendering speed as the user manipulates their image.

When a user [saves their image](./save-image.md), Canva provides the extension with an updated version of the image. This updated image is the full-resolution version.

To be approved for release in the [Apps Directory](https://canva.com/apps), the extension must:

1.  Receive the updated version of the image from Canva.
2.  Replace the original image with the updated version.
3.  Apply all current (and future) effects to the updated image.

This ensures that, when the extension saves the user's image, it saves the highest quality version.

:::note  
 In the future, Canva may request an extension to update the user's image at other points in the extension's lifecycle.  
:::

## Prerequisites

This tutorial assumes familiarity with editing extensions, JavaScript, and the `HTMLCanvasElement`. You should have also read the following pages:

- [Quick start for editing extensions](./quick-start.md)
- [Rendering the user's image](./render-image.md)

## Step 1: Render the user's image

To demonstrate how to update the user's image, create an editing extension that renders the user image.

You can use this example from [Rendering the user's image](./render-image.md):

```javascript
const { imageHelpers } = window.canva;
const canva = window.canva.init();

const state = {
  image: null,
  canvas: null,
};

canva.onReady(async (opts) => {
  // Keep track of the user's image
  state.image = opts.image;

  // Convert the CanvaImage into a HTMLImageElement
  const img = await imageHelpers.toImageElement(state.image);

  // Create a HTMLCanvasElement
  state.canvas = document.createElement("canvas");

  // Resize the HTMLCanvasElement
  state.canvas.width = opts.previewSize.width;
  state.canvas.height = opts.previewSize.height;
  state.canvas.style.width = "100%";
  state.canvas.style.height = "100%";

  // Draw the HTMLImageElement into the HTMLCanvasElement
  const context = state.canvas.getContext("2d");
  context.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);

  // Render image into the HTMLBodyElement
  document.body.appendChild(state.canvas);
});
```

## Step 2: Register a callback with the `onImageUpdate` method

When Canva wants an extension to update the user's image, it emits an event. To listen for this event, register a callback with the `onImageUpdate` method:

```javascript
canva.onImageUpdate(async (opts) => {
  console.log(opts);
});
```

## Step 3: Keep track of the updated image

The `onImageUpdate` callback receives an `opts` object that contains the updated image:

```javascript
canva.onImageUpdate(async (opts) => {
  console.log(opts.image);
});
```

This image, like the original input image, is a `CanvaImage`.

Your extension is expected to replace the original image with the updated image. To do this, first replace the `image` property in the `state` object with the updated image:

```javascript
canva.onImageUpdate(async (opts) => {
  // Replace the original image with the updated image
  state.image = opts.image;
});
```

This ensures that `state.image` always contains the latest version of the image.

## Step 4: Render the updated image

To render the updated image, reuse the logic from the `onReady` callback:

```javascript
canva.onImageUpdate(async (opts) => {
  // Replace the original image with the updated image
  state.image = opts.image;

  // Convert the updated image into a HTMLImageElement
  const img = await imageHelpers.toImageElement(state.image);

  // Draw the HTMLImageElement into the HTMLCanvasElement
  const context = state.canvas.getContext("2d");
  context.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);
});
```

You can even refactor the logic into a function:

```javascript
async function drawImage() {
  // Convert the user's image image into a HTMLImageElement
  const img = await imageHelpers.toImageElement(state.image);

  // Draw the HTMLImageElement into the HTMLCanvasElement
  const context = state.canvas.getContext("2d");
  context.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);
}
```

Then call this function in the `onReady` and `onImageUpdate` callbacks.

## Step 5: Apply effects to the updated image

When an extension updates the user's image, it's important that any changes the user has made to their image are not overwritten. This means any effects applied to the current image must also be applied to the updated image.

Sometimes, this doesn't require any work.

For example, if you modify the `filter` property of a `CanvasRenderingContext2D`, the effect won't be overwritten when an extension updates the user's image:

```javascript
// Draw the HTMLImageElement into the HTMLCanvasElement
const context = state.canvas.getContext("2d");
context.filter = "invert(100%)";
context.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);

// Render image into the HTMLBodyElement
document.body.appendChild(state.canvas);
```

As a result, no additional work is required.

For some complex effects though, updating the image will also overwrite the effects applied to the original image. If this happens, reapply the effects in the `onImageUpdate` callback.

## Example

```javascript
const { imageHelpers } = window.canva;
const canva = window.canva.init();

const state = {
  image: null,
  canvas: null,
};

canva.onReady(async (opts) => {
  // Keep track of the user's image
  state.image = opts.image;

  // Convert the CanvaImage into a HTMLImageElement
  const img = await imageHelpers.toImageElement(state.image);

  // Create a HTMLCanvasElement
  state.canvas = document.createElement("canvas");

  // Resize the HTMLCanvasElement
  state.canvas.width = opts.previewSize.width;
  state.canvas.height = opts.previewSize.height;
  state.canvas.style.width = "100%";
  state.canvas.style.height = "100%";

  // Draw the user's image
  await drawImage();

  // Render the user's image
  document.body.appendChild(state.canvas);
});

canva.onImageUpdate(async (opts) => {
  // Replace the original image with the updated image
  state.image = opts.image;

  // Update the user's image
  await drawImage();
});

async function drawImage() {
  // Convert the user's image image into a HTMLImageElement
  const img = await imageHelpers.toImageElement(state.image);

  // Draw the HTMLImageElement into the HTMLCanvasElement
  const context = state.canvas.getContext("2d");
  context.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);
}
```

## Next steps

- [Saving the user's image](./save-image.md).
