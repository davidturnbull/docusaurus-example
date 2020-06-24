---
title: onControlsEvent
path: /editing-extensions/api/canva-api-client/on-controls-event/
---

Registers a callback that executes when the user interacts with a control.

## Usage

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  const controls = [
    canva.create("button", { id: "myButton", label: "My Button" }),
  ];
  canva.updateControlPanel(controls);
});

canva.onControlsEvent(async (opts) => {
  console.log(opts);
});
```

## Parameters

The `onControlsEvent` method accepts the following arguments:

| Parameter | Type     | Description                                                     |
| --------- | -------- | --------------------------------------------------------------- |
| `handler` | function | The callback to execute when the user interacts with a control. |

The `handler` function receives an object with the following properties:

| Parameter | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| `message` | object | Information about the event. |

The `message` object contains the following properties:

| Parameter     | Type      | Description                                                                                                                                         |
| ------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `commit`      | `boolean` | The value of this property is `false` while the user interacts with the control and `true` when the user has finished interacting with the control. |
| `controlId`   | string    | The ID of the control.                                                                                                                              |
| `controlType` | string    | The type of control. This value is always in snake case.                                                                                            |
| `message`     | object    | Additional information about the event. The available information depends on the control.                                                           |
