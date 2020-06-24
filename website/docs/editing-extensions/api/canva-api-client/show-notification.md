---
title: showNotification
path: /editing-extensions/api/canva-api-client/show-notification/
---

Displays a toast notification.

## Usage

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  canva.showNotification("greeting", "info");
});
```

:::note  
 This example assumes that a localized label exists with a `key` of `"greeting"`. For more information, refer to [Notifications](./../../notifications.md).  
:::

## Parameters

| Parameter | Type   | Required | Description                                                                   |
| --------- | ------ | :------: | ----------------------------------------------------------------------------- |
| `key`     | string | <Tick /> | The key of a [localized label](./../../localization.md).                      |
| `level`   | string |          | The possible values are `"info"` or "`error"`. The default value is `"info"`. |
