---
title: "Quick start for editing extensions"
sidebar_label: "Quick start"
path: /editing-extensions/quick-start/
---

:::note  
 If you're not sure what editing extensions are, refer to the [overview](./../editing-extensions.md).  
:::

In this guide, we're going to create an editing extension that inverts the colors of an image.

You will learn how to:

- configure an editing extension
- interact with Canva via the editing extensions API
- manipulate a user's image

Let's begin.

## Prerequisites

This guide assumes experience with:

- HTML
- JavaScript
- Canvas

If you're not familiar with Canvas, refer to MDN's [Canvas tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial).

## Step 1: Setup a development environment

At its most basic, an editing extension is a JavaScript file. When you're ready to release your app, you can upload this file to the Developer Portal.

While you're developing an extension though, you can define a **Dev URL** via the Developer Portal. When you preview the extension, the extension will be loaded from this URL instead of from the uploaded file. This allows for a more efficient workflow.

The URL in the **Dev URL** should point to an HTML page that:

- loads the editing extension API
- contains the JavaScript for the extension

There are many ways to create this page. To keep things simple, we're going to use [Glitch](https://glitch.com) -- a web-based editor for creating and deploying web apps. Glitch is free and registration is not required.

To create a Glitch project, click this button:

[![](https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png)](https://glitch.com/edit/?utm_content=project_editing-extension-starter#!/remix/editing-extension-starter)

This button will open the Glitch editor with a starter template for an editing extension. This template includes an `script.js` file. We'll add all of the code for the extension to this file.

To get the user-facing URL of the app:

1.  Click **Share**.
2.  Click **Live App**.
3.  Click **Copy**.

In a later step, we'll use this URL as the **Dev URL** for the extension.

## Step 2: Create an app via the Developer Portal

1.  Log in to the Developer Portal.
2.  Click **Your apps**.
3.  Click **Create an app**.
4.  In the **App name** field, enter a name for the app.
5.  Agree to the [terms and conditions](https://about.canva.com/policies/developer-terms/).
6.  Click **Create app**.

## Step 3: Add an editing extension to the app

For an app to do something, it needs to include one or more _extensions_. An extension is what hooks into the Canva editor and provides users with content or functionality.

To add an editing extension to the app, click **Editing**.

In the form that appears:

1.  Enter a description in the **Short description** field.
2.  Select the **Raster** checkbox.
3.  Upload an empty JavaScript file to the **JS File** field. (Before submitting the extension for review, this file will need to contain the source code for the extension.)
4.  Enter the user-facing URL of the Glitch app in the **Dev URL** field.

## Step 4: Initialize the extension

Inside the `script.js` file, we can access the editing extensions API via the `window.canva` object:

```javascript
console.log(window.canva);
```

This is possible because of some boilerplate code that's already been setup for you in the `index.html` file. (You can take a look at the `index.html` file if you want, but we won't touch the file in this guide, so you're also welcome to ignore it.)

The first thing we need to do is initialize the API:

```javascript
const canva = window.canva.init();
```

This allows us to access a number of essential methods through the `canva` variable.

## Step 5: Preview the extension in the Canva editor

1.  Click **Preview**.
2.  Select the extension from the dropdown list. The Canva editor will open in a new tab.
3.  Click **Connect**. The extension will automatically load after it's connected.

:::note  
 You only have to connect the extension once, before using an extension for the first time. On return visits, the extension will be immediately available via the side panel.  
:::

## Step 6: Render the user's image

When the extension loads, the selected image will disappear. This is because, when an editing extension loads, Canva places an iframe directly on top of the user's image.

Canva passes the user's image into the iframe, but the extension is responsible for rendering it. If the extension doesn't render the image, the iframe will remain empty and it'll appear as if the image has disappeared. In reality though, it's just hidden behind an empty iframe.

To render the user's image, register a callback with the `onReady` method:

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  // code goes here
});
```

This callback receives an `opts` object that contains the following properties:

| Parameter         | Type         | Description                                                                |
| ----------------- | ------------ | -------------------------------------------------------------------------- |
| `image`           | `CanvaImage` | The user's image.                                                          |
| `previewSize`     | object       | The dimensions of the iframe that contains the user's image.               |
| `presetId`        | string       | The ID of a preset that should be immediately applied to the user's image. |
| `assets`          | object       | Refer to [Assets](./assets.md).                                            |
| `localizedLabels` | object       | Refer to [Localization](./localization.md).                                |

The user's image is provided as a `CanvaImage` object, which has the following properties:

| Property    | Type   | Description                          |
| ----------- | ------ | ------------------------------------ |
| `blob`      | Blob   | The binary image data.               |
| `imageType` | string | The MIME type of the image.          |
| `height`    | number | The height of the image (in pixels). |
| `width`     | number | The width of the image (in pixels).  |

The image data is provided as a `Blob`, but it's easier to render the image if it's a `HTMLImageElement`. Fortunately, the editing extensions API provides us with helper methods for converting `CanvaImage` objects to and from different formats.

To access these methods, destructure `imageHelpers` from `window.canva`:

```javascript
const { imageHelpers } = window.canva;
```

Then, inside the `onReady` callback, call the `toImageElement` function:

```javascript
canva.onReady(async (opts) => {
  const img = await imageHelpers.toImageElement(opts.image);
});
```

This function will convert the `CanvaImage` into a `HTMLImageElement`.

To render the image, append it to the body of the document:

```javascript
canva.onReady(async (opts) => {
  const img = await imageHelpers.toImageElement(opts.image);
  document.body.appendChild(img);
});
```

If you preview the extension, the image should appear inside the iframe.

## Step 7: Insert the user's image into a `HTMLCanvasElement`

In the browser, one of the most straight-forward ways to manipulate an image is by inserting it into a `HTMLCanvasElement`. This provides us with the flexibility of the Canvas API.

To do this, create a `HTMLCanvasElement` _before_ the `appendChild` method:

```javascript
const canvas = document.createElement("canvas");
```

Then set the `width` and `height` of the `HTMLCanvasElement` to match the `width` and `height` of the `previewSize` property:

```javascript
canvas.width = opts.previewSize.width;
canvas.height = opts.previewSize.height;
```

This ensures the size of the `HTMLCanvasElement` matches the size of the iframe that contains the user's image.

You'll also need to set the `style.width` and `style.height` properties to `"100%"`:

```javascript
canvas.style.width = "100%";
canvas.style.height = "100%";
```

If you don't, resizing the user's image will only resize the iframe that contains the image and not the image itself.

Next, update the `appendChild` method to append the `HTMLCanvasElement` to the body of the document:

```javascript
document.body.appendChild(canvas);
```

To insert the user's image into the `HTMLCanvasElement`, create a `context` variable and call the `getContext` method:

```javascript
const context = canvas.getContext("2d");
```

The _context_ of a `HTMLCanvasElement` affects what methods are available to us.
By passing a value of `"2d"` into the `getContext` method, we can access methods for working on a two-dimensional plane. If we passed through a value of `"webgl"`, we could access methods for working on a three-dimensional plane.

When we manipulate the user's image, we'll do so by manipulating the context, rather than the `HTMLCanvasElement` directly.

For now, call the `drawImage` method on the `context` variable:

```javascript
context.drawImage(img, 0, 0, canvas.width, canvas.height);
```

This will render the user's image within the `HTMLCanvasElement`.

At this point, the `script.js` file should resemble the following:

```javascript
const { imageHelpers } = window.canva;
const canva = window.canva.init();

canva.onReady(async (opts) => {
  const img = await imageHelpers.toImageElement(opts.image);
  const canvas = document.createElement("canvas");

  canvas.width = opts.previewSize.width;
  canvas.height = opts.previewSize.height;
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  document.body.appendChild(canvas);

  const context = canvas.getContext("2d");
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
});
```

If you reload the extension, nothing will appear to have changed -- we're still just rendering the user's image -- but now we're ready for the fun stuff.

## Step 8: Apply an effect to the user's image

In the browser, there are countless ways to apply effects to images. For this guide, we're going to use the `filter` property. This allows us to apply CSS-like filters to the `HTMLCanvasElement`.

Inside the `onReady` callback, set the `filter` property of the `context` variable to `"invert(100%)"`:

```javascript
const context = canvas.getContext("2d");
context.filter = "invert(100%)";
context.drawImage(img, 0, 0, canvas.width, canvas.height);
```

It's important to set the `filter` property _before_ calling the `drawImage` method.

Based on this change, opening the extension will invert the colors of the selected image.

## Step 9: Update the user's image

When the user opens an editing extension, Canva provides the extension with a downscaled version of the user's image. This allows the extension to load quickly and apply effects more efficiently. But it wouldn't be ideal if we saved the downscaled version of the image, because then we'd lower the quality of every image a user edits with an extension.

To avoid this problem, Canva provides the extension with the full-resolution version of the image immediately before the user's image is saved. The extension is responsible for:

- receiving the full-resolution version of the image
- if necessary, re-applying all effects to the image

To receive the full-resolution image, register a callback with the `onImageUpdate` method:

```javascript
canva.onImageUpdate(async (opts) => {
  console.log(opts.image);
});
```

This callback receives an object that contains the full-resolution image as a `CanvaImage`.

Next, convert the image into a `HTMLImageElement`:

```javascript
canva.onImageUpdate(async (opts) => {
  const img = await imageHelpers.toImageElement(opts.image);
});
```

Ideally, we could draw this full-resolution image straight into the `HTMLCanvasElement` that already exists. To allow for this, create a `canvas` variable before the `onReady` callback:

```javascript
let canvas;
```

Then, inside the `onReady` callback, remove the `const` keyword from the `canvas` variable:

```javascript
canvas = document.createElement("canvas");
```

Inside the `onImageUpdate` callback, we can now access the `HTMLCanvasElement` and re-draw the image:

```javascript
canva.onImageUpdate(async (opts) => {
  const img = await imageHelpers.toImageElement(opts.image);
  const context = canvas.getContext("2d");
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
});
```

Based on this change, the `HTMLCanvasElement` will contain the full-resolution image. Then, when the image is saved (in the next step), the full-resolution image will be saved.

:::note  
 In this example, we didn't have to re-apply the effect to the image, as the `filter` property isn't overwritten when we re-draw the image. For some extensions though, it will be necessary to re-apply effects in the `onImageUpdate` callback.  
:::

## Step 12: Save the user's image

When the user exits the extension or clicks the **Apply** button, we need to return the modified image to Canva as a `CanvaImage`. This allows Canva to save the modified image.

To do this, register a callback with the `onSaveRequest` method:

```javascript
canva.onSaveRequest(async () => {
  // code goes here
});
```

Then, inside this callback, use the `fromCanvas` method to convert the `HTMLCanvasElement` into a `CanvaImage`:

```javascript
canva.onSaveRequest(async () => {
  return await imageHelpers.fromCanvas("image/jpeg", canvas);
});
```

The `fromCanvas` method accepts a MIME type as its first argument and a `HTMLCanvasElement` as its second argument.

Based on this change, it's now possible to invert the colors of the image, click the **Apply** button, and persist those changes.

## Example

This is the complete code for the extension:

```javascript
const { imageHelpers } = window.canva;
const canva = window.canva.init();

let canvas;

canva.onReady(async (opts) => {
  const img = await imageHelpers.toImageElement(opts.image);
  canvas = document.createElement("canvas");

  canvas.width = opts.previewSize.width;
  canvas.height = opts.previewSize.height;
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  document.body.appendChild(canvas);

  const context = canvas.getContext("2d");
  context.filter = "invert(100%)";
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
});

canva.onImageUpdate(async (opts) => {
  const context = canvas.getContext("2d");
  const img = await imageHelpers.toImageElement(opts.image);
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
});

canva.onSaveRequest(async () => {
  return await imageHelpers.fromCanvas("image/jpeg", canvas);
});
```
