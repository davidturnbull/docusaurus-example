---
title: exit
path: /editing-extensions/api/canva-api-client/exit/
---

Exits the user from the editing extension.

## Usage

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  canva.exit();
});
```

## Parameters

The `exit` method accepts the following arguments:

| Parameter | Type         | Required | Description       |
| --------- | ------------ | :------: | ----------------- |
| `image`   | `CanvaImage` |          | The user's image. |
