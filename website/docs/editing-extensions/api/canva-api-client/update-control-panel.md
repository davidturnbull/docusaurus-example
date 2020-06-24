---
title: updateControlPanel
path: /editing-extensions/api/canva-api-client/update-control-panel/
---

Renders an editing extension's control panel.

## Usage

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  const controls = [
    canva.create("button", { id: "myButton", label: "My Button" }),
  ];
  canva.updateControlPanel(controls);
});
```

## Parameters

The `updateControlPanel` method accepts the following arguments:

| Parameter  | Type  | Required | Description                                          |
| ---------- | ----- | :------: | ---------------------------------------------------- |
| `controls` | array | <Tick /> | An array of controls to render in the control panel. |
