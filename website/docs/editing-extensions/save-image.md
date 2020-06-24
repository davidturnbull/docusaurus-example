---
title: "Saving the user's image"
sidebar_label: "Save the user's image"
path: /editing-extensions/save-image/
---

When a user has finished manipulating their image, an editing extension is responsible for returning the image to Canva in a format that it understands. This allows Canva to persist any changes made to the image.

## Prerequisites

This tutorial assumes familiarity with editing extensions, JavaScript, and the `HTMLCanvasElement`. You should have also read the following pages:

- [Quick start for editing extensions](./quick-start.md)
- [Rendering the user's image](./render-image.md)
- [Updating the user's image](./update-image.md)

## Step 1: Render (and update) the user's image

To demonstrate how to save the user's image, create an editing extension that:

- Renders the user's image when they open the extension
- Updates the user's image when the `onImageUpdate` method is called

You can use this example from [Updating the user's image](./update-image.md):

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

:::note  
 All editing extensions must implement the `onImageUpdate` method. For more information, refer to [Updating the user's image](./update-image.md).  
:::

## Step 2: Register a callback with the `onSaveRequest` method

When a user saves their image, Canva emits an event. Your extension is expected to listen for this event and return the user's modified image as a `CanvaImage`.

To listen for this event, register a callback with the `onSaveRequest` method:

```javascript
canva.onSaveRequest(async () => {
  console.log("Save requested...");
});
```

This callback does not receive any parameters.

## Step 3: Return a `CanvaImage` in the `onSaveRequest` callback

For Canva to save a user's image, an extension must:

- Convert the image back into a `CanvaImage`
- Return the image in the `onSaveRequest` callback

You can do this with the `fromCanvas` function:

```javascript
canva.onSaveRequest(async () => {
  return imageHelpers.fromCanvas("image/jpeg", state.canvas);
});
```

You should now be able to open the extension and save an image without an error appearing in the JavaScript Console, and if you apply an effect to an image, the changes should persist.

:::note  
 The JavaScript client also provides the [`fromUrl`](./api/image-helpers/from-url.md) and [`fromDataUrl`](./api/image-helpers/from-data-url.md) functions.  
:::

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

canva.onSaveRequest(async () => {
  return imageHelpers.fromCanvas("image/jpeg", state.canvas);
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

- [Rendering controls](./render-controls.md)
- [Detecting control events](./control-events.md)
- [Managing the state of controls](./control-state.md)
