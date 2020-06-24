---
title: init
path: /editing-extensions/api/canva-api-client/init/
---

Sets up the client and notifies Canva that the extension is awake.

## Usage

```javascript
const canva = window.canva.init();
console.log(canva);
```

:::note  
 To run code when the client is ready, register a callback with the [`onReady`](./on-ready.md) method.  
:::
