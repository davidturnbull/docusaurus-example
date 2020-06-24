---
title: Group
path: /editing-extensions/controls/group/
---

## Usage

```javascript
canva.create("group", {
  id: "groupExample",
  label: "Group Example",
  children: [
    // controls go here
  ],
});
```

## Properties

| Property   | Type   | Required | Description                                                                                                                             |
| ---------- | ------ | :------: | --------------------------------------------------------------------------------------------------------------------------------------- |
| `id`       | string | <Tick /> | A unique ID for the group.                                                                                                              |
| `label`    | string | <Tick /> | A human readable label for the group.                                                                                                   |
| `children` | array  | <Tick /> | The controls to display in the group. They'll be rendered in the order they appear in the array and do not need to be of the same type. |

## Example

```javascript
const canva = window.canva.init();

const renderControls = () => {
  const controls = [
    canva.create("group", {
      id: "groupExample",
      label: "Group Example",
      children: [
        // controls go here
      ],
    }),
  ];
  canva.updateControlPanel(controls);
};

canva.onReady(() => {
  renderControls();
});
```
