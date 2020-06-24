---
title: "Detecting control events"
sidebar_label: "Detect control events"
path: /editing-extensions/control-events/
---

When a user interacts with a control, such as clicking a [Button](./controls/button.md) or using a [ColorPicker](./controls/color-picker.md), Canva emits an event. Your extension can listen for these events and perform actions in response to them, such as adjusting the intensity of an effect as a user changes the value of a [Slider](./controls/slider.md).

<!-- IMAGE -->

## Prerequisites

This tutorial assumes familiarity with editing extensions and JavaScript. You should have also read the following pages:

- [Quick start for editing extensions](./quick-start.md)
- [Rendering controls](./render-controls.md)

## Step 1: Create an editing extension that renders controls

To demonstrate how to detect control events, create an editing extension that renders controls in the control panel.

You can use this example from [Rendering controls](./render-controls.md):

```javascript
const canva = window.canva.init();

canva.onReady(async () => {
  // An array of controls
  const controls = [
    canva.create("button", {
      id: "myButton",
      label: "My Button",
    }),
  ];

  // Update the control panel
  canva.updateControlPanel(controls);
});
```

## Step 2: Register a callback with the `onControlsEvent` method

To listen for control events, register a callback with the `onControlsEvent` method:

```javascript
canva.onControlsEvent(async (opts) => {
  console.log(opts);
});
```

This callback receives an `opts` object that contains the following properties:

| Property  | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| `message` | object | Information about the event. |

The `message` object contains the following properites:

| Property      | Type    | Description                                                    |
| ------------- | ------- | -------------------------------------------------------------- |
| `controlId`   | string  | The ID of the control that emitted the event.                  |
| `controlType` | string  | The type of control that emitted the event.                    |
| `commit`      | boolean | If `true`, the user has finished interacting with the control. |
| `message`     | object  | Additional information about the event.                        |

This is an example of an `opts.message` object for a [Slider](./controls/slider.md) control:

```javascript
{
  commit: false,
  controlId: "sliderExample",
  controlType: "slider",
  message: {
    type: "setValue",
    value: 23
  }
}
```

## Step 3: Identify which control emitted the event

When an extension has multiple controls, it's important to identify which control has emitted the event.

To do this, create a conditional in the `onControlsEvent` callback that checks the `controlId` of the control:

```javascript
canva.onControlsEvent(async (opts) => {
  if (opts.message.controlId === "myButton") {
    console.log("You clicked my button!");
  }
});
```

If you only care if the user has interacted with a certain _type_ of control, create a conditional that checks the `controlType` of the control:

```javascript
canva.onControlsEvent(async (opts) => {
  if (opts.message.controlType === "button") {
    console.log("You clicked a button!");
  }
});
```

## Example

```javascript
const canva = window.canva.init();

canva.onReady(async () => {
  // An array of controls
  const controls = [
    canva.create("button", {
      id: "myButton",
      label: "My Button",
    }),
  ];

  // Update the control panel
  canva.updateControlPanel(controls);
});

canva.onControlsEvent(async (opts) => {
  if (opts.message.controlId === "myButton") {
    console.log("You clicked my button!");
  }
});
```

## Next steps

- [Managing the state of controls](./control-state.md)
- [Improving the performance of controls](./control-performance.md)
- [Rendering controls with JSX](./jsx.md)
