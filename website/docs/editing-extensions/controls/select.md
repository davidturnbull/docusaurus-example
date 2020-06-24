---
title: Select
path: /editing-extensions/controls/select/
---

![](images/f05f51111a.gif)

## Usage

```javascript
canva.create("select", {
  id: "selectExample",
  value: "apples",
  options: [
    { value: "apples", label: "Apples" },
    { value: "bananas", label: "Bananas" },
    { value: "pears", label: "Pears" },
  ],
});
```

:::note  
 When the value of a control changes, an extension should re-render the control panel. For more information, refer to the [Controls](./#managing-the-state-of-controls.md) topic.  
:::

## Properties

| Property  | Type   | Required | Description                                                                                                     |
| --------- | ------ | :------: | --------------------------------------------------------------------------------------------------------------- |
| `id`      | string | <Tick /> | A unique ID for the select control.                                                                             |
| `options` | array  | <Tick /> | The options to render within the select control.                                                                |
| `value`   | string |          | The value to display as selected. This value should match one of the `value` properties in the `options` array. |

Each object in the `options` array should have the following properties:

| Property | Type   | Required | Description                            |
| -------- | ------ | :------: | -------------------------------------- |
| `value`  | string | <Tick /> | The value of the option.               |
| `label`  | string | <Tick /> | A human readable label for the option. |

## Events

When a user selects an option, the `onControlsEvent` callback is executed:

```javascript
canva.onControlsEvent(async (opts) => {
  console.log(opts.message);
  // {
  //   commit: true,
  //   controlId: "selectExample",
  //   controlType: "select",
  //   message: {
  //     type: "setValue",
  //     value: "apples"
  //   }
  // }
});
```

This callback receives an object with the following properties:

| Parameter | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| `message` | object | Information about the event. |

The `message` object contains the following properties:

| Property      | Type    | Description                                                                                                                                                                                              |
| ------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `commit`      | boolean | This value is `false` while the user is interacting with the control and `true` when they have finished interacting with the control. For a select control, the value of this property is always `true`. |
| `controlId`   | string  | The ID of the control.                                                                                                                                                                                   |
| `controlType` | string  | The type of control. For a select control, the value of this property is always `"select"`.                                                                                                              |
| `message`     | object  | Additional information about the event.                                                                                                                                                                  |

The inner `message` object contains the following properties:

| Property | Type   | Description                                                                                 |
| -------- | ------ | ------------------------------------------------------------------------------------------- |
| `type`   | string | The type of event. For a select control, the value of this property is always `"setValue"`. |
| `value`  | string | The value of the selected option.                                                           |

## Example

```javascript
const canva = window.canva.init();

const state = {
  selectExample: "apples",
};

const renderControls = () => {
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
