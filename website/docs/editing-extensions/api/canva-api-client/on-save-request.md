---
title: onSaveRequest
path: /editing-extensions/api/canva-api-client/on-save-request/
---

Registers a callback that executes when Canva emits a save request.

## Usage

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  // this method must exist for the extension to start
});

canva.onSaveRequest(async () => {
  console.log("A save has been requested!");
});
```

## Parameters

The `onSaveRequest` method accepts the following arguments:

| Parameter | Type     | Description                                                                                        |
| --------- | -------- | -------------------------------------------------------------------------------------------------- |
| `handler` | function | The callback to execute when Canva emits a save request. This callback must return a `CanvaImage`. |
