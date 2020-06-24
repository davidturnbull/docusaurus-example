---
title: ColorPicker
path: /editing-extensions/controls/color-picker/
---

![](images/d7d844ff22.gif)

## Usage

```javascript
canva.create("color_picker", {
  id: "colorPickerExample",
  label: "Color Picker Example",
  color: "#ff0099",
});
```

:::note  
 When the value of a control changes, an extension should re-render the control panel. For more information, refer to the [Controls](./#managing-the-state-of-controls.md) topic.  
:::

## Properties

| Property | Type   | Required | Description                                                                          |
| -------- | ------ | :------: | ------------------------------------------------------------------------------------ |
| `id`     | string | <Tick /> | A unique ID for the color picker.                                                    |
| `label`  | string | <Tick /> | A human readable label for the color picker.                                         |
| `color`  | string | <Tick /> | The color to display as selected in the color picker. This value must be a hex code. |

## Events

When the user changes the value of the color picker, the `onControlsEvent` callback is executed:

```javascript
canva.onControlsEvent(async (opts) => {
  console.log(opts.message);
  // {
  //   commit: true,
  //   controlId: "colorPickerExample",
  //   controlType: "color_picker",
  //   message: {
  //     type: "setColor"
  //     value: "#d166a7"
  //   }
  // }
});
```

This callback receives an object with the following properties:

| Parameter | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| `message` | object | Information about the event. |

The `message` object contains the following properties:

| Property      | Type    | Description                                                                                                                           |
| ------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `commit`      | boolean | This value is `false` while the user is interacting with the control and `true` when they have finished interacting with the control. |
| `controlId`   | string  | The ID of the control.                                                                                                                |
| `controlType` | string  | The type of control. For a color picker, the value of this property is always `"color_picker"`.                                       |
| `message`     | object  | Additional information about the event.                                                                                               |

The inner `message` object contains the following properties:

| Property | Type   | Description                                                                               |
| -------- | ------ | ----------------------------------------------------------------------------------------- |
| `type`   | string | The type of event. For a color picker, the value of this property is always `"setColor"`. |
| `value`  | string | The hex code of the selected color.                                                       |

## Example

```javascript
const canva = window.canva.init();

const state = {
  colorPickerExample: "#ff0099",
};

const renderControls = () => {
  const controls = [
    canva.create("color_picker", {
      id: "colorPickerExample",
      label: "Color Picker Example",
      color: state.colorPickerExample,
    }),
  ];
  canva.updateControlPanel(controls);
};

canva.onReady(() => {
  renderControls();
});

canva.onControlsEvent(async (opts) => {
  state[opts.message.controlId] = opts.message.message.value;

  if (opts.message.commit) {
    renderControls();
  }
});
```
