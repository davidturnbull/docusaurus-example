---
title: "Managing the state of controls"
sidebar_label: "Manage control state"
path: /editing-extensions/control-state/
---

In an editing extension, controls don't maintain their own state.

To see what this means, consider the following extension:

```javascript
const canva = window.canva.init();

canva.onReady(async () => {
  // An array of controls
  const controls = [
    canva.create("select", {
      id: "selectExample",
      value: "apples",
      options: [
        { value: "apples", label: "Apples" },
        { value: "bananas", label: "Bananas" },
        { value: "pears", label: "Pears" },
      ],
    }),
  ];

  // Update the control panel
  canva.updateControlPanel(controls);
});
```

This extension renders a [Select](./controls/select.md) control. If you try to select an option from this control though, nothing will happen. The value of the control will remain "stuck" with its default value.

<!-- IMAGE -->

This happens because, when a user interacts with a control, Canva does not:

- Keep track of a control's changing value(s)
- Re-render controls when their values change

Your extension is responsible for both of these tasks.

## Prerequisites

This tutorial assumes familiarity with editing extensions and JavaScript. You should have also read the following pages:

- [Quick start for editing extensions](./quick-start.md)
- [Rendering controls](./render-controls.md)
- [Detecting control events](./control-events.md)

## Step 1: Create a `state` object

Before the `onReady` callback, create a `state` object:

```javascript
const state = {};
```

The purpose of this object is to keep track of the values of the controls. The name of this object is irrelevant.

:::note  
 You could also track the values of controls with `let` variables or take some other approach to state management.  
:::

## Step 2: Add a property to the `state` object

In the `state` object, create a key-value pair for any control that has a `value` property. In this example, there's a `selectExample` property with a value of `"apples"`:

```javascript
const state = {
  selectExample: "apples",
};
```

The name of the property does _not_ have to match the `id` of the control, but keeping these values the same will result in cleaner, more concise code.

## Step 3: Update the value of the control

In the `create` method for the control, set the `value` property to the value of the relevant property from the `state` object.

In this example, the `value` property is set to `state.selectExample`:

```javascript
canva.create("select", {
  id: "selectExample",
  value: state.selectExample,
  options: [
    { value: "apples", label: "Apples" },
    { value: "bananas", label: "Bananas" },
    { value: "pears", label: "Pears" },
  ],
});
```

This makes the `state` object the source of truth for the values of the control.

## Step 4: Update the value of the `state` object

When a user changes the value of control, your extension should update the value of the relevant property in the `state` object.

If each key in the `state` object is the `id` of a control, this only requires a single line of code:

```javascript
canva.onControlsEvent(async (opts) => {
  // Update the state object
  state[opts.message.controlId] = opts.message.message.value;
});
```

But some controls, such as button controls, don't have values. To avoid creating properties for controls that don't have values, check if a value exists in the `onControlsEvent` callback:

```javascript
canva.onControlsEvent(async (opts) => {
  // Update the state object
  if (opts.message.message.value) {
    state[opts.message.controlId] = opts.message.message.value;
  }
});
```

Even if a control doesn't have a value though, it can still have state. For example, your extension might need to keep track of how many times the user has clicked a button, and that's exactly the sort of value that could also be stored in the `state` object.

## Step 5: Update the control panel

The `state` object is not reactive. When it changes, the changes are not automatically reflected in the control panel. Your extension needs to re-render the control panel after each change.

To do this, copy the rendering logic from the `onReady` callback into the `onControlsEvent` callback:

```javascript
canva.onControlsEvent(async (opts) => {
  // Update the state object
  if (opts.message.message.value) {
    state[opts.message.controlId] = opts.message.message.value;
  }

  // Define the controls
  const controls = [
    canva.create("select", {
      id: "selectExample",
      value: state.selectExample,
      options: [
        { value: "apples", label: "Apples" },
        { value: "bananas", label: "Bananas" },
        { value: "pears", label: "Pears" },
      ],
    }),
  ];

  // Update the control panel
  canva.updateControlPanel(controls);
});
```

If you preview this extension via the Developer Portal, you should be able to successfully select a value from the select control.

## Step 6: Refactor the control panel updates

Because of the previous change, the rendering logic for controls is duplicated in the `onReady` and `onControlsEvent` callbacks.

To remove this duplication, move the rendering logic into its own function:

```javascript
function renderControls() {
  // Define the controls
  const controls = [
    canva.create("select", {
      id: "selectExample",
      value: state.selectExample,
      options: [
        { value: "apples", label: "Apples" },
        { value: "bananas", label: "Bananas" },
        { value: "pears", label: "Pears" },
      ],
    }),
  ];

  // Update the control panel
  canva.updateControlPanel(controls);
}
```

Then call this function from the `onReady` callback:

```javascript
canva.onReady(async () => {
  // Render the control panel
  renderControls();
});
```

...and from the `onControlsEvent` callback:

```javascript
canva.onControlsEvent(async (opts) => {
  // Update the state object
  if (opts.message.message.value) {
    state[opts.message.controlId] = opts.message.message.value;
  }

  // Re-render the control panel
  renderControls();
});
```

This code is cleaner and easier to maintain.

## Example

```javascript
const canva = window.canva.init();

const state = {
  selectExample: "apples",
};

canva.onReady(async () => {
  // Render the control panel
  renderControls();
});

canva.onControlsEvent(async (opts) => {
  // Update the state object
  if (opts.message.message.value) {
    state[opts.message.controlId] = opts.message.message.value;
  }

  // Re-render the control panel
  renderControls();
});

function renderControls() {
  // Define the controls
  const controls = [
    canva.create("select", {
      id: "selectExample",
      value: state.selectExample,
      options: [
        { value: "apples", label: "Apples" },
        { value: "bananas", label: "Bananas" },
        { value: "pears", label: "Pears" },
      ],
    }),
  ];

  // Update the control panel
  canva.updateControlPanel(controls);
}
```

## Next steps

- [Improving the performance of controls](./control-performance.md)
- [Rendering controls with JSX](./jsx.md)
