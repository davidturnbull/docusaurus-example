---
title: "Error handling for editing extensions"
sidebar_label: "Error handling"
path: /editing-extensions/error-handling/
---

In an editing extension, there are three mechanisms for handling errors:

- showing a notification to the user
- reporting an error to Canva
- exiting the user from the extension

This topic explains how (and when) to implement each approach.

## Showing a notification to the user

When an error occurs that can't be handled silently, tell the user what went wrong by showing them a notification with the `showNotification` method:

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  canva.showNotification("myErrorMessage", "error");
});
```

The first argument of the `showNotification` method is the key of a [localized label](./localization.md). This determines the text that appears in the notification. The second argument is the type of notification.

When the notification type is `"error"`:

- the notification will remain on the screen for a (slightly) longer duration
- an **OK** button will be available to dismiss the notification

You can learn more about notifications in the [Notifications](./notifications.md) topic.

## Reporting an error to Canva

When any type of error occurs, report it to Canva with the `reportError` method:

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  canva.reportError("GENERAL_ERROR");
});
```

The following strings are valid error codes:

- `"INVALID_INPUT_MEDIA"`
- `"UNSUPPORTED_DEVICE"`
- `"UNSUPPORTED_BROWSER"`
- `"OUT_OF_MEMORY"`
- `"OPERATION_NOT_ALLOWED"`"
- `"GENERAL_ERROR"`

Behind the scenes, we'll keep track of these errors and use the data to figure out if there's anything we can do to prevent them from reoccurring.

## Exiting the user from the extension

If it's not possible for the extension to gracefully return to a non-error state, it should exit the user from the extension. You can do this with the `exit` method:

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  canva.exit();
});
```

This will immediately -- and silently -- exit the user from the extension. To avoid confusing the user, always show them a notification before calling the `exit` method.
