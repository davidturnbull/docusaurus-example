---
title: Paragraph
path: /editing-extensions/controls/paragraph/
---

![](images/8de44a8bd1.jpg)

## Usage

```javascript
canva.create("paragraph", {
  id: "paragraphExample",
  text: "This is a paragraph.",
});
```

## Properties

| Property | Type   | Required | Description                             |
| -------- | ------ | :------: | --------------------------------------- |
| `id`     | string | <Tick /> | A unique ID for the paragraph.          |
| `text`   | string | <Tick /> | The text that appears in the paragraph. |

## Example

```javascript
const canva = window.canva.init();

const renderControls = () => {
  const controls = [
    canva.create("paragraph", {
      id: "paragraphExample",
      text: "This is a paragraph.",
    }),
  ];
  canva.updateControlPanel(controls);
};

canva.onReady(() => {
  renderControls();
});
```
