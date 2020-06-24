---
title: create
path: /editing-extensions/api/canva-api-client/create/
---

Creates a control that can be rendered in an editing extension's control panel.

## Usage

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  const button = canva.create("button", {
    id: "buttonExample",
    label: "Button Example",
  });
  console.log(button);
});
```

## Parameters

The `create` method accepts the following arguments:

| Parameter     | Type   | Description                                                                  |
| ------------- | ------ | ---------------------------------------------------------------------------- |
| `controlName` | string | The name of the control.                                                     |
| `props`       | object | The properties to configure the appearance and functionality of the control. |

:::note  
 Refer to the [Controls](./../../controls.md) topic for the available controls and their properties.  
:::
