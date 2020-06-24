---
title: "Editing extensions"
sidebar_label: Overview
path: /editing-extensions/
---

:::note  
 This topic provides an overview of what editing extensions are and how they work. If you'd like to create an editing extension, check out [the quick start guide](./editing-extensions/quick-start.md).  
:::

There are three types of _extensions_ a developer can add to a Canva app:

- [content](./content-extensions.md)
- [editing]()
- [publish](./publish-extensions.md)

The purpose of an editing extension is to allow Canva's users to apply effects and filters to their images.

These are some examples of editing extensions:

- Duotone
- Glitch
- Pixelate

You can find more examples at [canva.com/apps](https://canva.com/apps).

## How users experience editing extensions

When a user selects an image in their design, an **Effects** button becomes available via the toolbar. If the user clicks this button, a list of editing extensions will appear in the side panel.

Some extensions are configured to provide _presets_. In these cases, thumbnails will appear in the side panel. When clicked, these presets will apply pre-configured effects to the selected image.

If an extension doesn't provide presets, the extension will appear under the **Tools** heading. The user can select the extension to open its control panel.

When a user exits an extension or clicks the **Apply** button, any changes they've made will be saved.

:::note  
 A user must connect (install) an extension before they can use it. This is a one-time-only process that gives users a chance to agree to the extension's terms and conditions.  
:::

## How editing extensions work

When a user opens an editing extension, Canva places an iframe in front of the user's image that matches the width and height of the image.

The editing extension itself is a JavaScript file that runs within this iframe. At a minimum, it must receive the user's image from Canva, render it, and return the image to Canva in a format that it understands. To streamline this process, Canva provides an API that is available from within the iframe.

To manipulate the user's image, you can use any browser-based technology, such as [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) or [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API).

When a user exits an extension, the extension must return the manipulated image to Canva in a format that it understands. This image must have _at least_ the same dimensions as the original image. If you've upscaled the user's image, it must be returned with the same aspect ratio.

When the manipulated image is returned to Canva, the original image will be updated and the iframe will be removed. From the user's perspective, the addition and removal of the iframe is invisible.

## Example

This is an example of an editing extension that inverts the colors of the user's image:

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

To learn how to create this extension from scratch, check out [the quick start guide](./editing-extensions/quick-start.md).
