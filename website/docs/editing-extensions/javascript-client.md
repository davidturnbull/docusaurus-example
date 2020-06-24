---
title: "Loading the JavaScript client"
sidebar_label: "Load the JavaScript client"
path: /editing-extensions/javascript-client/
---

When a user opens an editing extension, Canva injects a JavaScript client into the extension's iframe. This client includes essential methods for:

- Converting the user's image to (and from) various formats.
- Registering callbacks that are executed throughout the extension's lifecycle.
- Rendering controls in the Canva editor's control panel.

How an extension can access the JavaScript client depends on whether Canva loads the extension from the file in the **JS File** field or from the URL in the **Dev URL** field.

<!-- IMAGE -->

:::note  
 The field is only intended for local development. It allows you to develop an extension without repeatedly uploading a JavaScript file to the field, but you can't submit an app while the field contains a value.  
:::

## JS File

If you upload a JavaScript file to the **JS File** field, you can immediately access the client through the `window.canva` object.

To see this in action:

1.  Create an editing extension via the Developer Portal.

2.  Copy the following code into a JavaScript file:

    ```javascript
    console.log(window.canva);
    ```

3.  Upload the JavaScript file to the **JS File** field.

4.  Preview the extension.

5.  Open the JavaScript Console.

You should see a range of properties attached to the `window.canva` object.

<!-- IMAGE -->

:::note  
 The field is always required, but the field takes precedence over the field. Canva only loads the file from the field if the field is empty.  
:::

## Dev URL

For a faster feedback loop while developing an editing extension, you can enter the URL of a HTML file into the **Dev URL** field. if you serve this HTML file via a local development server (such as [webpack-dev-server](https://webpack.js.org/configuration/dev-server/)) or through a proxy (such as [ngrok](https://ngrok.com/)), you can develop an extension without repeatedly uploading a JavaScript file to the **JS File** field. This does, however, require a little setup.

Here's how it works:

When you preview an extension that has a **Dev URL**, Canva appends the following query parameters to the **Dev URL**:

| Parameter | Type   | Description                                  |
| --------- | ------ | -------------------------------------------- |
| `libBase` | string | The base URL of the JavaScript client.       |
| `lib`     | string | The version number of the JavaScript client. |

Canva then sets the `src` attribute of the extension's iframe to the **Dev URL**. This allows the HTML file to load the JavaScript client by creating a URL with the query parameters:

```javascript
// Get the base URL and version of JavaScript client
const params = new URLSearchParams(window.location.search);
const baseUrl = params.get("libBase");
const version = params.get("lib");

// Construct the URL of the JavaScript client
const libUrl = baseUrl + version + ".js";

// TODO: Load the JavaScript client (see below)
```

The HTML file must load the extension's source code _after_ the JavaScript client has finished loading. (Refer to [the example below](#example) to see how to do this.)

Once the client has loaded, the `window.canva` object will be available.

:::note  
 For a step-by-step walkthrough of how to setup a local development server with webpack and the field, refer to [Setup a live reload loop with webpack](./webpack-live-reload.md).  
:::

### Example {#example}

This is an example of a HTML file that loads the JavaScript client. It assumes the extension's source code is in a file named "bundle.js".

```html
<!DOCTYPE html>
<html lang="en">
  <head></head>
  <body>
    <script>
      // Get the base URL and version of JavaScript client
      const params = new URLSearchParams(window.location.search);
      const baseUrl = params.get("libBase");
      const version = params.get("lib");

      // Construct the URL of the JavaScript client
      const libUrl = baseUrl + version + ".js";

      // Load the JavaScript client
      const lib = document.createElement("script");
      lib.src = libUrl;
      lib.onload = runApp;
      document.head.appendChild(lib);

      // Load the source code for the extension
      // This runs after the client loads
      function runApp() {
        const extension = document.createElement("script");
        extension.src = "bundle.js";
        document.body.appendChild(extension);
      }
    </script>
  </body>
</html>
```
