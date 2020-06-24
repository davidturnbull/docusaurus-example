---
title: "Rendering the user's image"
sidebar_label: "Render the user's image"
path: /editing-extensions/render-image/
---

When a user selects an image and opens an editing extension, Canva places an iframe in front of the selected image. This iframe loads the source code of the extension via the **JS File** or **Dev URL** field.

If you preview a newly created editing extension, the selected image will appear to vanish. This is because the image is hidden behind an empty iframe.

<!-- IMAGE -->

To fix this, an extension must:

- Register an `onReady` callback with the JavaScript client.
- Get the user's image (this is available via the `onReady` callback).
- Render the user's image in the iframe.

:::note  
 If the field is defined, it takes precedence over the field.  
:::

## Prerequisites

This tutorial assumes familiarity with editing extensions, JavaScript, and the `HTMLCanvasElement`. If you haven't already, read [Quick start for editing extensions](./quick-start.md).

## Step 1: Receive the user's image

When a user opens an editing extension, Canva makes the selected image available in the iframe. You can access this image in the [`onReady`](./api/canva-api-client/on-ready.md) callback, via the `opts.image` property:

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  console.log(opts.image);
});
```

For the sake of performance, this image is downscaled to a lower resolution, but an extension must never save the downscaled version of the image. To learn how to save the full-resolution version of the image, refer to [Updating the user's image](./update-image.md).

<!-- Because this extension doesn't (yet) render the user's image, previewing the extension will cause the image to vanish. In actual fact though, the image is hidden behind an empty iframe. -->

## Step 2: Keep track of the user's image

Typically, an editing extension needs to access the user's image from more than just the `onReady` callback. To do this, we recommend keeping track of the user's image inside a `state` object:

```javascript
const canva = window.canva.init();

const state = {
  image: null,
};

canva.onReady(async (opts) => {
  state.image = opts.image;
  console.log(state.image);
});
```

...or with a global variable:

```javascript
const canva = window.canva.init();

let image;

canva.onReady(async (opts) => {
  image = opts.image;
  console.log(image);
});
```

Either approach works fine. (You're also free to use any other approach to state management.)

## Step 3: Convert the user's image

The `opts.image` property in the `onReady` callback is a `CanvaImage` object. This object has the following properties:

| Property    | Type   | Description                          |
| ----------- | ------ | ------------------------------------ |
| `blob`      | Blob   | The image data.                      |
| `imageType` | string | The MIME type of the image.          |
| `width`     | number | The width of the image (in pixels).  |
| `height`    | number | The height of the image (in pixels). |

You can manipulate the image data directly by modifying the `blob` property, but [the JavaScript client](./javascript-client.md) that Canva injects into the iframe provides methods for converting `CanvaImage` objects to (and from) more convenient formats:

- [`toImageElement`](./api/image-helpers/to-image-element.md)
- [`toDataUrl`](./api/image-helpers/to-data-url.md)
- [`fromCanvas`](./api/image-helpers/from-canvas.md)
- [`fromDataUrl`](./api/image-helpers/from-data-url.md)
- [`fromUrl`](./api/image-helpers/from-url.md)

To access these methods, destructure `imageHelpers` from the `window.canva` object:

```javascript
const { imageHelpers } = window.canva;
```

This is an example of an extension that converts the `CanvaImage` into a `HTMLImageElement`:

```javascript
const { imageHelpers } = window.canva;
const canva = window.canva.init();

const state = {
  image: null,
};

canva.onReady(async (opts) => {
  // Keep track of the user's image
  state.image = opts.image;

  // Convert the CanvaImage into a HTMLImageElement
  const img = await imageHelpers.toImageElement(state.image);
  console.log(img);
});
```

:::note  
 All of the image helper methods are asynchronous.  
:::

## Step 4: Render the user's image

If you convert the user's image into a `HTMLImageElement`, you can render it in the iframe by appending it to the body of the document:

```javascript
const { imageHelpers } = window.canva;
const canva = window.canva.init();

const state = {
  image: null,
};

canva.onReady(async (opts) => {
  // Keep track of the user's image
  state.image = opts.image;

  // Convert the CanvaImage into a HTMLImageElement
  const img = await imageHelpers.toImageElement(state.image);

  // Render the user's image
  document.body.appendChild(img);
});
```

But the more common approach is to insert the `HTMLImageElement` into a `HTMLCanvasElement`. Then you can manipulate the image with the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

To do this, create a `HTMLCanvasElement`:

```javascript
const { imageHelpers } = window.canva;
const canva = window.canva.init();

const state = {
  image: null,
};

canva.onReady(async (opts) => {
  // Keep track of the user's image
  state.image = opts.image;

  // Convert the CanvaImage into a HTMLImageElement
  const img = await imageHelpers.toImageElement(state.image);

  // Create a HTMLCanvasElement
  const canvas = document.createElement("canvas");
});
```

Then set the `width` and `height` of the `HTMLCanvasElement` to the width and height of the iframe. Canva provides the iframe's width and height in the `opts.previewSize` property:

```javascript
canvas.width = opts.previewSize.width;
canvas.height = opts.previewSize.height;
```

You'll also need to set the `style.width` and `style.height` properties to `100%`:

```javascript
canvas.style.width = "100%";
canvas.style.height = "100%";
```

This ensures that resizing the iframe also resizes the image inside the iframe.

<!-- IMAGE -->

Next, get a _drawing context_ for the `HTMLCanvasElement`:

```javascript
const context = canvas.getContext("2d");
```

The drawing context affects what methods you can use to manipulate the `HTMLCanvasElement`. The argument of `2d` gives you access to methods for drawing two-dimensional images. For more information, refer to [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).

On the `context` variable, call the [`drawImage`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage) method:

```javascript
const context = canvas.getContext("2d");
context.drawImage(img, 0, 0, canvas.width, canvas.height);
```

This draws the `HTMLImageElement` into the `HTMLCanvasElement`.

Then append the `HTMLCanvasElement` to the body of the document:

```javascript
document.body.appendChild(canvas);
```

At this point, the code should resemble the following:

```javascript
const { imageHelpers } = window.canva;
const canva = window.canva.init();

const state = {
  image: null,
};

canva.onReady(async (opts) => {
  // Keep track of the user's image
  state.image = opts.image;

  // Convert the CanvaImage into a HTMLImageElement
  const img = await imageHelpers.toImageElement(state.image);

  // Create a HTMLCanvasElement
  const canvas = document.createElement("canvas");

  // Resize the HTMLCanvasElement
  canvas.width = opts.previewSize.width;
  canvas.height = opts.previewSize.height;
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  // Draw the HTMLImageElement into the HTMLCanvasElement
  const context = canvas.getContext("2d");
  context.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Render the user's image
  document.body.appendChild(canvas);
});
```

## Step 5: Keep track of the `HTMLCanvasElement`

If you insert the user's image into a `HTMLCanvasElement`, we recommend keeping track of the `HTMLCanvasElement` inside the `state` object or with a global variable. This makes it easy to access the `HTMLCanvasElement` throughout the extension's lifecycle.

To do this, add a `canvas` property to the `state` object:

```javascript
const state = {
  image: null,
  canvas: null,
};
```

Then store the `HTMLCanvasElement` in the `state.canvas` property:

```javascript
state.canvas = document.createElement("canvas");
```

...and replace all references to `canvas` with `state.canvas`:

```javascript
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
```

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
```

## Next steps

- [Handling viewport resizes](./viewport-resizes.md)
- [Updating the user's image](./update-image.md)
- [Saving the user's image](./save-image.md)
