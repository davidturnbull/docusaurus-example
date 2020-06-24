---
title: reportError
path: /editing-extensions/api/canva-api-client/report-error/
---

Reports an error to Canva.

## Usage

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  canva.reportError("GENERAL_ERROR");
});
```

## Parameters

The `reportError` method accepts the following arguments:

| Parameter   | Type     | Required | Description                                                        |
| ----------- | -------- | :------: | ------------------------------------------------------------------ |
| `errorType` | `string` | <Tick /> | An error code that best describes the type of error that occurred. |

The `errorType` parameter accepts any of the following values:

- `"INVALID_INPUT_MEDIA"`
- `"UNSUPPORTED_DEVICE"`
- `"UNSUPPORTED_BROWSER"`
- `"OUT_OF_MEMORY"`
- `"OPERATION_NOT_ALLOWED"`"
- `"GENERAL_ERROR"`
