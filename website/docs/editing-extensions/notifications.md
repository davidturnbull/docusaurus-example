---
title: "Display notifications in an editing extension"
sidebar_label: Notifications
path: /editing-extensions/notifications/
---

As a user interacts with an editing extension, it's possible to display toast notifications that provide them with some useful information or highlight when something goes wrong.

## Types of notifications

There are two types of notifications:

- `"info"`
- `"error"`

Both notifications look similar. The main difference is that `"error"` notifications remain on screen for a longer period of time and can be dismissed by clicking an **OK** button.

## Loading notification messages

The text that appears in a notification cannot be included in the source code of the editing extension. This is because Canva needs to:

- verify that the text meets our guidelines
- localize the text for different regions

Therefore, any text that will appear in a notification must be defined as a label in the **Localized Labels JSON file**. The purpose, structure, and usage of this file is explained in the [Localization](./localization.md) topic.

As an example, this is a **Localized labels JSON file** that defines a single label with a `key` of `"greeting"`:

```json
{
  "en": [
    {
      "key": "greeting",
      "value": "Hello! I hope you're having a lovely day.",
      "translatorNote": "Label for notification when user opens the app."
    }
  ]
}
```

If we upload this file to the Developer Portal, we can then access the text of this label from within the `onReady` callback:

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  console.log(opts.localizedLabels.greeting);
});
```

## Showing a notification

To display a notification, Canva provides the `showNotification` method:

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  canva.showNotification("greeting", "info");
});
```

This method expects the `key` of a localized label as the first argument and the type of notification as the second argument. The second argument is optional and a value of `"info"` will be assumed if it's not provided.
