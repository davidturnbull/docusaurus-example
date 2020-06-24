---
title: "Handling viewport resizes"
sidebar_label: "Handle viewport resizes"
path: /editing-extensions/viewport-resizes/
---

The larger an image is, the longer it takes to apply an effect to the image. On modern machines, the difference might not be noticeable, but Canva is a global product with a diverse userbase who use a variety of machines, so it's important to be mindful of performance.

With this in mind, we expect all editing extensions to:

1.  Detect when a user resizes the viewport (the iframe that contains their image)
2.  Resize the user's image to match the size of the viewport

This ensures that, when the user reduces the size of their image (which is more common than the opposite), the extension can apply the effect to a smaller surface area, improving performance.

## Prerequisites

This tutorial assumes familiarity with editing extensions, JavaScript, and the `HTMLCanvasElement`. You should have also read the following pages:

- [Quick start for editing extensions](./quick-start.md)
- [Rendering the user's image](./render-image.md)

## Step 1: Render the user's image

To demonstrate how to resize the user's image when they resize the viewport, create an editing extension that render's the user image.

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

  // Render the user's image
  document.body.appendChild(state.canvas);
});
```

<!-- TODO: Provide a Glitch project -->

## Step 2: Detect when a user resizes the viewport

When a user resizes the viewport, Canva emits an event. To listen for this event, register a callback with the [`onViewportResize`](./api/canva-api-client/on-viewport-resize.md) method:

```javascript
canva.onViewportResize(async (opts) => {
  console.log(opts);
});
```

If you add this code to the extension and try resizing the viewport, the `opts` object will be logged to the JavaScript Console as the viewport's dimensions change.

<!-- IMAGE -->

## Step 3: Resizes the user's image

Inside the `onViewportResize` callback, the `opts` object contains a `previewSize` object. This object contains the `width` and `height` of the viewport.

To resize the user's image, update the dimensions of the `HTMLCanvasElement` to match the dimensions of the viewport:

```javascript
state.canvas.width = opts.previewSize.width;
state.canvas.height = opts.previewSize.height;
```

Then re-draw the user's image:

```javascript
const context = state.canvas.getContext("2d");
const img = await imageHelpers.toImageElement(state.image);
context.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);
```

Visually, resizing the viewport won't look any different, but if users reduce the size of the viewport, they'll see improved performance when applying effects to the image.

At this point, the `onViewportResize` callback should resemble the following:

```javascript
canva.onViewportResize(async (opts) => {
  // Resize the HTMLCanvasElement
  state.canvas.width = opts.previewSize.width;
  state.canvas.height = opts.previewSize.height;

  // Re-draw the user's image
  const context = state.canvas.getContext("2d");
  const img = await imageHelpers.toImageElement(state.image);
  context.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);
});
```

## Step 4: Improve the performance of viewport resizes

Although the above code increases the performance of manipulating images, it _decreases_ the performance of resizing the viewport. This is because the code repeatedly re-draws the user's image while they resize the viewport, rather than _after_ they've resized the viewport.

To fix this, exit the `onViewportResize` callback if the `opts.commit` property is `false`:

```javascript
canva.onViewportResize(async (opts) => {
  // Only re-draw the image after resizing the viewport
  if (!opts.commit) {
    return;
  }

  // Resize the HTMLCanvasElement
  state.canvas.width = opts.previewSize.width;
  state.canvas.height = opts.previewSize.height;

  // Re-draw the user's image
  const context = state.canvas.getContext("2d");
  const img = await imageHelpers.toImageElement(state.image);
  context.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);
});
```

The `opts.commit` property is `false` while the user is resizing the viewport and `true` once they've finished resizing the viewport. By exiting when `opts.commit` is `false`, you can reduce the number of times the user's image is re-drawn.

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

  // Draw the HTMLImageElement into the HTMLCanvasElement
  const context = state.canvas.getContext("2d");
  context.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);

  // Render the user's image
  document.body.appendChild(state.canvas);
});

canva.onViewportResize(async (opts) => {
  // Only re-draw the image after resizing the viewport
  if (!opts.commit) {
    return;
  }

  // Resize the HTMLCanvasElement
  state.canvas.width = opts.previewSize.width;
  state.canvas.height = opts.previewSize.height;

  // Re-draw the user's image
  const context = state.canvas.getContext("2d");
  const img = await imageHelpers.toImageElement(state.image);
  context.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);
});
```

## Next steps

- [Updating the user's image](./update-image.md)
- [Saving the user's image](./save-image.md)
