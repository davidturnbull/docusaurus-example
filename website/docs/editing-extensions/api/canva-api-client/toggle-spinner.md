---
title: toggleSpinner
path: /editing-extensions/api/canva-api-client/toggle-spinner/
---

Shows or hides a loading spinner.

## Usage

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  canva.toggleSpinner("preview", true);
});
```

## Parameters

| Parameter | Type    | Required | Description                                                                      |
| --------- | ------- | :------: | -------------------------------------------------------------------------------- |
| `area`    | string  | <Tick /> | The location of the spinner. Currently, the only supported value is `"preview"`. |
| `visible` | boolean | <Tick /> | If `true`, the spinner will be visible.                                          |
