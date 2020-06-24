---
title: "Rendering controls"
sidebar_label: "Render controls"
path: /editing-extensions/render-controls/
---

You can design an editing extension to support a variety of _controls_. A control is an interface element, such as a button, slider, or color picker. They appear in the _control panel_ and allow users to fine-tune how an extension manipulates their image.

<!-- IMAGE -->

For the complete list of supported controls, refer to [List of controls](./controls.md).

## Prerequisites

This tutorial assumes familiarity with editing extensions and JavaScript. If you haven't already, read [Quick start for editing extensions](./quick-start.md).

## Step 1: Create a control

Initialize an editing extension and register a callback with the `onReady` method:

```javascript
const canva = window.canva.init();

canva.onReady(async () => {
  // code goes here
});
```

The `canva` object provides a `create` method for creating controls:

```javascript
const canva = window.canva.init();

canva.onReady(async () => {
  canva.create();
});
```

This method accepts two arguments:

The first argument is the name of a supported control, such as `"button"` or `"color_picker"`:

```javascript
canva.onReady(async () => {
  canva.create("button");
});
```

The second argument is the options for configuring the control. The available options depend on the control, but all controls at least require an `id`.

This is an example of a `"button"` control with its required options:

```javascript
canva.onReady(async () => {
  canva.create("button", {
    id: "myButton",
    label: "My Button",
  });
});
```

:::note  
 You can use the `id` of a control to [detect when a user interacts with a control](./control-events.md).  
:::

## Step 2: Update the control panel

Creating a control doesn't render it in the control panel. You need to update the control panel any time you want to:

- Add a control to the control panel
- Remove a control from the control panel
- Modify a control in the control panel

To update the control panel, call the `updateControlPanel` method:

```javascript
canva.onReady(async () => {
  // Create a button control
  canva.create("button", {
    id: "myButton",
    label: "My Button",
  });

  // Update the control panel
  canva.updateControlPanel();
});
```

This method accepts an array of controls as its only argument:

```javascript
canva.onReady(async () => {
  // An array of controls
  const controls = [
    // Create a button control
    canva.create("button", {
      id: "myButton",
      label: "My Button",
    }),
  ];

  // Update the control panel
  canva.updateControlPanel(controls);
});
```

The controls are rendered in the order they appear in the array.

## (Optional) Step 3: Organize controls into groups

As much as possible, we encourage developers to limit their use of controls. An extension with too many controls becomes difficult to use (and misaligned with our [UX guidelines](./../ux-guidelines.md)).

But some extensions require a variety of those controls, and in those cases, we encourage developers to organize the controls into _groups_.

<!-- IMAGE -->

A group is a labelled control that contains other controls. The purpose of a group is to add visual hierarchy and structure to a control panel.

To create a group, call the `create` method:

```javascript
canva.create("group", {
  id: "myGroup",
  label: "My Group",
  children: [],
});
```

A group requires the following options:

| Property   | Type   | Required | Description                                                                                                                          |
| ---------- | ------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------ |
| `id`       | string | <Tick /> | A unique ID for the group.                                                                                                           |
| `label`    | string | <Tick /> | A human readable label for the group.                                                                                                |
| `children` | array  | <Tick /> | The controls to display in the group. They're rendered in the order they appear in the array and do not need to be of the same type. |

To include controls in a group, add them to the `children` array:

```javascript
canva.create("group", {
  id: "myGroup",
  label: "My Group",
  children: [
    canva.create("button", {
      id: "button1",
      label: "Button #1",
    }),
    canva.create("button", {
      id: "button2",
      label: "Button #2",
    }),
    canva.create("button", {
      id: "button3",
      label: "Button #3",
    }),
  ],
});
```

## Example

```javascript
const canva = window.canva.init();

canva.onReady(async () => {
  // An array of controls
  const controls = [
    canva.create("group", {
      id: "myGroup",
      label: "My Group",
      children: [
        canva.create("button", {
          id: "button1",
          label: "Button #1",
        }),
        canva.create("button", {
          id: "button2",
          label: "Button #2",
        }),
        canva.create("button", {
          id: "button3",
          label: "Button #3",
        }),
      ],
    }),
  ];

  // Update the control panel
  canva.updateControlPanel(controls);
});
```

## Next steps

- [Detecting control events](./control-events.md)
- [Managing the state of controls](./control-state.md)
- [Improving the performance of controls](./control-performance.md)
- [Rendering controls with JSX](./jsx.md)
