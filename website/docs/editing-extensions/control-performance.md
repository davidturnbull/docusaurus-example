---
title: "Improving the performance of controls"
sidebar_label: "Improve control performance"
path: /editing-extensions/control-performance/
---

Some controls, such as the [ColorPicker](./controls/color-picker.md) control, emit a lot of events.

<!-- IMAGE -->

This can cause performance issues if an editing extension re-renders the control panel in the `onControlsEvent` callback.

For example, consider this code snippet from [Managing the state of controls](./control-state.md):

```javascript
canva.onControlsEvent(async (opts) => {
  if (opts.message.message.value) {
    state[opts.message.controlId] = opts.message.message.value;
  }

  renderControls();
});
```

If this extension has a color picker, interacting with the color picker may re-render the control panel dozens or hundreds of times in a matter of seconds.

To avoid this problem, the `onControlsEvent` callback provides a `commit` property:

```javascript
canva.onControlsEvent(async (opts) => {
  console.log(opts.message.commit);
});
```

The `commit` property is a boolean that is `false` while the user is interacting with the control and `true` once the user has finished interacting with the control.

For example, as a user drags their cursor across the colors in a color picker, the `commit` property is `false`. When they release the cursor, the `commit` property is `true`.

<!-- IMAGE -->

You can use the `commit` property to exit the `onControlsEvent` callback if the user has not finished interacting with the control:

```javascript
canva.onControlsEvent(async (opts) => {
  // Do nothing if "commit" is false
  if (!opts.message.commit) {
    return;
  }

  if (opts.message.message.value) {
    state[opts.message.controlId] = opts.message.message.value;
  }

  renderControls();
});
```

This significantly decreases the number of times the control panel has to be re-rendered.

:::note  
 For most controls, the `commit` property is always `true`.  
:::

## Example

```javascript
const canva = window.canva.init();

const state = {
  colorPickerExample: "#ff0099",
};

canva.onReady(async () => {
  renderControls();
});

canva.onControlsEvent(async (opts) => {
  // Do nothing if "commit" is false
  if (!opts.message.commit) {
    return;
  }

  if (opts.message.message.value) {
    state[opts.message.controlId] = opts.message.message.value;
  }

  renderControls();
});

function renderControls() {
  const controls = [
    canva.create("color_picker", {
      id: "colorPickerExample",
      label: "Color Picker Example",
      color: state.colorPickerExample,
    }),
  ];
  canva.updateControlPanel(controls);
}
```
