---
title: "Pointer events"
sidebar_label: "Pointer events"
path: /editing-extensions/pointer-events/
---

By default, an editing extension does not receive pointer events. This means, if the user clicks or touches inside the iframe, the extension can't detect those events.

<!-- IMAGE -->

But it's possible to enable pointer events for an editing extension, which means the extension can support a range of interesting functionality, such as allowing users to draw within the iframe.

<!-- IMAGE -->

The only side-effect of enabling pointer events is that users can't move their image while the extension is open.

## Enabling pointer events

1.  Navigate to an app via the Developer Portal.
2.  From the **Extensions** page, expand the **Editing** panel.
3.  Select **Supports touch interactions**.

## Types of pointer events

An editing extension can detect when the following events are fired:

- `pointerover`
- `pointerenter`
- `pointerdown`
- `pointermove`
- `pointerup`
- `pointercancel`
- `pointerout`
- `pointerleave`
- `gotpointercapture`
- `lostpointercapture`

For the complete API reference of pointer events, refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events).

## Handling pointer events

To detect when a pointer event is emitted, attach a pointer event handler to an element. In this code snippet, the `onpointerdown` event handler is attached to a `HTMLCanvasElement`:

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  const canvas = document.createElement("canvas");

  canvas.width = opts.previewSize.width;
  canvas.height = opts.previewSize.height;
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  document.body.appendChild(canvas);

  canvas.onpointerdown = () => {
    console.log("Pointer down!");
  };
});
```

If you preview this extension and click (or touch) anywhere inside the iframe, a message will be logged to the JavaScript Console.

The event handler receives an `event` object that contains information about the event, such as the X and Y coordinates of the pointer when the event was fired:

```javascript
canvas.onpointerdown = (event) => {
  console.log(event);
};
```

For a complete list of properties available in the `event` object, refer to:

- [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent)
- [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)
- [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)
- [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event)

## Example: Drawing with pointer events

This example adds basic drawing functionality to an editing extension:

```javascript
const { imageHelpers } = window.canva;
const canva = window.canva.init();

let isDrawing;

canva.onReady(async (opts) => {
  // Create a HTMLCanvasElement
  const canvas = document.createElement("canvas");

  // Resize the HTMLCanvasElement
  canvas.width = opts.previewSize.width;
  canvas.height = opts.previewSize.height;
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  // Add the HTMLCanvasElement to the document
  document.body.appendChild(canvas);

  // Convert the CanvaImage into a HTMLImageElement
  const img = await imageHelpers.toImageElement(opts.image);

  // Draw the HTMLImageElement into the HTMLCanvasElement
  const context = canvas.getContext("2d");
  context.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Register event handlers for pointer events
  canvas.onpointerdown = (event) => {
    isDrawing = true;
    context.moveTo(event.clientX, event.clientY);
  };

  canvas.onpointermove = (event) => {
    if (isDrawing) {
      context.lineTo(event.clientX, event.clientY);
      context.stroke();
    }
  };

  canvas.onpointerup = () => {
    isDrawing = false;
  };
});
```

To learn more about adding drawig functionality to a `HTMLCanvasElement`, refer to [Exploring canvas drawing techniques](http://perfectionkills.com/exploring-canvas-drawing-techniques/).
