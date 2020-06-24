---
title: CanvaApiClient
path: /editing-extensions/api/canva-api-client/
---

## Usage

```javascript
// Initialize the client
const canva = window.canva.init();

// Call a method
canva.onReady(async () => {
  console.log("The client is initialized!");
});
```

## Methods

| Name                                                               | Description                                                                                      |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| [`create`](./canva-api-client/create.md)                           | Creates a control that can be rendered in an editing extension's control panel.                  |
| [`exit`](./canva-api-client/exit.md)                               | Exits the user from the editing extension.                                                       |
| [`init`](./canva-api-client/init.md)                               | Sets up the client and notifies Canva that the extension is awake.                               |
| [`onControlsEvent`](./canva-api-client/on-controls-event.md)       | Registers a callback that executes when the user interacts with a control.                       |
| [`onImageUpdate`](./canva-api-client/on-image-update.md)           | Registers a callback that executes when Canva requests the extension to update the user's image. |
| [`onPresetSelected`](./canva-api-client/on-preset-selected.md)     | Registers a callback that executes when the user selects a preset.                               |
| [`onPresetsRequest`](./canva-api-client/on-presets-request.md)     | Registers a callback that executes when Canva requests an extension's presets.                   |
| [`onReady`](./canva-api-client/on-ready.md)                        | Registers a callback that executes when an editing extension is initialized.                     |
| [`onSaveRequest`](./canva-api-client/on-save-request.md)           | Registers a callback that executes when Canva emits a save request.                              |
| [`onViewportResize`](./canva-api-client/on-viewport-resize.md)     | Registers a callback that executes when the size of the viewport changes                         |
| [`reportError`](./canva-api-client/report-error.md)                | Reports an error to Canva.                                                                       |
| [`showNotification`](./canva-api-client/show-notification.md)      | Displays a toast notification.                                                                   |
| [`toggleSpinner`](./canva-api-client/toggle-spinner.md)            | Shows or hides a loading spinner.                                                                |
| [`updateControlPanel`](./canva-api-client/update-control-panel.md) | Updates an editing extension's control panel.                                                    |
