---
title: "Working with images in an editing extension"
path: /editing-extensions/images/
---

## Receiving images from Canva

When a user opens an editing extension, Canva places an iframe in front of the user's image. This iframe is referred to as the _viewport_. Your extension runs within this frame, isolated from the rest of Canva.

By default, this iframe will be empty. Your extension needs to receive the user's image from Canva and render it within the iframe. If you don't render the user's image, their image will appear to vanish.

To receive the user's image from Canva, register a callback with the `onReady` method:

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  // the app is running
});
```

This callback will execute when the app has finished launching. It receives an object as its only argument. This object contains the following properties:

| Parameter         | Type         | Description                                                                |
| ----------------- | ------------ | -------------------------------------------------------------------------- |
| `image`           | `CanvaImage` | The user's image.                                                          |
| `previewSize`     | object       | The dimensions of the iframe that contains the user's image.               |
| `presetId`        | string       | The ID of a preset that should be immediately applied to the user's image. |
| `assets`          | object       | Refer to [Assets](./assets.md).                                            |
| `localizedLabels` | object       | Refer to [Localization](./localization.md).                                |

The `image` object contains the following properties:

| Property    | Type   | Description                          |
| ----------- | ------ | ------------------------------------ |
| `blob`      | Blob   | The binary image data.               |
| `imageType` | string | The MIME type of the image.          |
| `height`    | number | The height of the image (in pixels). |
| `width`     | number | The width of the image (in pixels).  |

An object with these properties is known as a `CanvaImage`. You have a lot of freedom in terms of how you manipulate the user's image, but you must return it to Canva as a `CanvaImage` object. Canva provides a number of methods for streamlining this process.

The image the extension receives is downscaled to a lower resolution. This improves the startup time of the extension and the performance of any image manipulations. When the user saves the image, the `onImageUpdate` method provides the extension with the full-resolution version of the image. This process is explained later in this topic.

:::warning  
 Your extension must never save the downscaled version of the user's image.  
:::

## Converting the user's image

Canva provides the user's image as a `CanvaImage` object. You can manipulate this object directly, but the editing extensions API provides us with methods for converting `CanvaImage` objects to (and from) a variety of other formats. These other formats are generally easier to work with.

The relevant methods include:

| Method                                                      | Description                                                      |
| ----------------------------------------------------------- | ---------------------------------------------------------------- |
| [`fromCanvas`](./api/image-helpers/from-canvas.md)          | Converts a `HTMLCanvasElement` into a `CanvaImage`.              |
| [`fromDataUrl`](./api/image-helpers/from-data-url.md)       | Converts a data URL into a `CanvaImage`.                         |
| [`fromUrl`](./api/image-helpers/from-url.md)                | Fetches an image from a URL and converts it into a `CanvaImage`. |
| [`getSize`](./api/image-helpers/get-size.md)                | Gets the dimensions of a `CanvaImage`.                           |
| [`toImageElement`](./api/image-helpers/to-image-element.md) | Converts a `CanvaImage` into a `HTMLImageElement`.               |
| [`toDataUrl`](./api/image-helpers/to-data-url.md)           | Converts a `CanvaImage` into a data URL.                         |

To access these methods, destructure `imageHelpers` from the `window.canva` object:

```javascript
const { imageHelpers } = window.canva;
```

This is an example of converting a `CanvaImage` into a `HTMLImageElement`:

```javascript
const { imageHelpers } = window.canva;

const canva = window.canva.init();

canva.onReady(async (opts) => {
  const img = await imageHelpers.toImageElement(opts.image);
  console.log(img);
});
```

## Rendering the user's image

After receiving the user's image from Canva, your extension must render it within the iframe. If you don't render the image, it will appear to have vanished. (In reality, the empty iframe is just hiding the user's image from view.)

_How_ you render the image will depend on the format of the image.

If you convert the image into a `HTMLImageElement`, it can be appended to the `document.body`:

```javascript
canva.onReady(async (opts) => {
  const img = await imageHelpers.toImageElement(opts.image);
  document.body.appendChild(img);
});
```

But this doesn't allow for a lot of flexibility in terms of transforming the image.

Generally, it's more convenient to insert the `HTMLImageElement` into a `HTMLCanvasElement`:

```javascript
canva.onReady(async (opts) => {
  const canvas = document.createElement("canvas");

  canvas.width = opts.previewSize.width;
  canvas.height = opts.previewSize.height;
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  document.body.appendChild(canvas);

  const context = canvas.getContext("2d");
  const img = await imageHelpers.toImageElement(opts.image);
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
});
```

This provides us with the flexibility of the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

## Handling viewport resizes

When the user resized their image while an editing extension is open, the extension should re-render the image to match the new dimensions of the viewport. This ensures that:

- if the user increases the size of the viewport, the image quality is retained
- if the user decreases the size of the image, future transformations will be applied to a smaller surface area (and therefore be applied faster)

To detect when the size of the viewport changes, register a callback with the `onViewportResize` method:

```javascript
canva.onViewportResize(async (opts) => {
  console.log(opts);
});
```

This callback receives an object with the following properties:

- `previewSize`
- `commit`

The `previewSize` property is an object that contains the width and height of the viewport.

The `commit` property is a boolean that is `false` while the user is resizing the viewport and `true` once the user has finished resizing the viewport. This allows the extension to only re-render the user's image when they've finished resizing the viewport, which is more efficient than re-rendering the image as it changes pixel-by-pixel.

There's a problem though:

The `onViewportResize` callback doesn't have direct access to the user's image or the `HTMLCanvasElement` that is available in the `onReady` callback.

As a quick fix, register the `onViewportResize` callback inside the `onReady` callback:

```javascript
canva.onReady(async (opts) => {
  const canvas = document.createElement("canvas");

  canvas.width = opts.previewSize.width;
  canvas.height = opts.previewSize.height;
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  document.body.appendChild(canvas);

  const context = canvas.getContext("2d");
  const img = await imageHelpers.toImageElement(opts.image);
  context.drawImage(img, 0, 0, canvas.width, canvas.height);

  canva.onViewportResize(async (opts) => {
    console.log(opts);
  });
});
```

This ensures that the `onViewportResize` callback has access to the `image`, `canvas`, and `context` variables defined in the `onReady` callback. As a result, we can resize the `HTMLCanvaselement` and re-render the user's image if the `commit` property is `true`:

```javascript
canva.onViewportResize(async (opts) => {
  if (!opts.commit) {
    return;
  }

  canvas.width = opts.previewSize.width;
  canvas.height = opts.previewSize.height;
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
});
```

But while this code works, it's not ideal.

## Managing image state

If we register callbacks inside other callbacks:

- the code will become increasingly difficult to read and reason about
- it's more difficult to keep track of the values of variables

The more elegant solution is to define a `state` object _before_ the `onReady` callback:

```javascript
const state = {};
```

Then, inside the `onReady` callback, store the user's image and the `HTMLCanvasElement` inside the `state` object:

```javascript
canva.onReady(async (opts) => {
  state.image = opts.image;
  state.canvas = document.createElement("canvas");

  state.canvas.width = opts.previewSize.width;
  state.canvas.height = opts.previewSize.height;
  state.canvas.style.width = "100%";
  state.canvas.style.height = "100%";

  document.body.appendChild(state.canvas);

  const context = state.canvas.getContext("2d");
  const img = await imageHelpers.toImageElement(state.image);
  context.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);
});
```

This pattern makes it trivial to flatten the structure of the callbacks:

```javascript
const state = {
  image: null,
  canvas: null,
};

canva.onReady(async (opts) => {
  state.image = opts.image;
  state.canvas = document.createElement("canvas");

  state.canvas.width = opts.previewSize.width;
  state.canvas.height = opts.previewSize.height;
  state.canvas.style.width = "100%";
  state.canvas.style.height = "100%";

  document.body.appendChild(state.canvas);

  const context = state.canvas.getContext("2d");
  const img = await imageHelpers.toImageElement(state.image);
  context.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);
});

canva.onViewportResize(async (opts) => {
  if (!opts.commit) {
    return;
  }

  state.canvas.width = opts.previewSize.width;
  state.canvas.height = opts.previewSize.height;

  const context = state.canvas.getContext("2d");
  const img = await imageHelpers.toImageElement(state.image);
  context.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);
});
```

In the updated code, there are three changes:

- all references to `canvas` and `opts.image` now reference `state.canvas` and `state.image`
- the `onViewportResize` callback has been moved outside of the `onReady` callback
- the `getContext` method is used inside the `onViewportResize` callback

The end result is that the code is easier to read and it's easier to keep track of the variables.

## Updating the user's image

When a user opens an editing extension, Canva provides a downscaled version of their image:

```javascript
canva.onReady(async (opts) => {
  console.log(opts.image);
});
```

This improves the extension's load time.

Before we can save the user's image though, we need to get the full-resolution version of the user's image. Otherwise, we'd be lowering the quality of the user's original media, which wouldn't be a great user experience.

To allow for this, register a callback with the `onImageUpdate` method:

```javascript
canva.onImageUpdate(async (opts) => {
  console.log(opts);
});
```

Before the user's image is saved, this callback receives an object with an `image` property that contains the full-resolution version of the user's image as a `CanvaImage`.

At a minimum, this callback needs to replace the downscaled version of the user's image with the full-resolution version:

```javascript
canva.onImageUpdate(async (opts) => {
  state.image = opts.image;
  const context = state.canvas.getContext("2d");
  const img = await imageHelpers.toImageElement(state.image);
  context.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);
});
```

But it's critical to understand that the image received by the `onImageUpdate` callback is the _unmodified_ version of the image. This means any effects the user has already applied to their image must be reapplied to the full-resolution version of the image.

## Saving the user's image

To allow users to save any changes they've made to their image, register a callback with the `onSaveRequest` method:

```javascript
canva.onSaveRequest(async () => {
  // handle save request
});
```

Then, inside the callback, convert the user's image into a `CanvaImage` with the `fromCanvas` function, and return the converted image:

```javascript
canva.onSaveRequest(async () => {
  return await imageHelpers.fromCanvas("image/jpeg", state.canvas);
});
```

This snippet once again demonstrates the convenience of storing the `HTMLCanvasElement` in the `state` object.

## Example

```javascript
const { imageHelpers } = window.canva;

const canva = window.canva.init();

const state = {
  image: null,
  canvas: null,
};

canva.onReady(async (opts) => {
  state.image = opts.image;
  state.canvas = document.createElement("canvas");

  state.canvas.width = opts.previewSize.width;
  state.canvas.height = opts.previewSize.height;
  state.canvas.style.width = "100%";
  state.canvas.style.height = "100%";

  document.body.appendChild(state.canvas);

  const context = state.canvas.getContext("2d");
  const img = await imageHelpers.toImageElement(state.image);
  context.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);
});

canva.onViewportResize(async (opts) => {
  if (!opts.commit) {
    return;
  }

  state.canvas.width = opts.previewSize.width;
  state.canvas.height = opts.previewSize.height;

  const context = state.canvas.getContext("2d");
  const img = await imageHelpers.toImageElement(state.image);
  context.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);
});

canva.onImageUpdate(async (opts) => {
  state.image = opts.image;
  const context = state.canvas.getContext("2d");
  const img = await imageHelpers.toImageElement(state.image);
  context.drawImage(img, 0, 0, state.canvas.width, state.canvas.height);
});

canva.onSaveRequest(async () => {
  return await imageHelpers.fromCanvas("image/jpeg", state.canvas);
});
```
