---
title: "Setup a live reload loop with webpack"
sidebar_label: "Setup a Development URL"
path: /editing-extensions/webpack-live-reload/
---

If you're developing an [editing extension](./../editing-extensions.md), it's tedious to repeatedly upload a JavaScript file to the Developer Portal every time you want to test a change.

A much nicer workflow is to:

1.  Edit the source code on your local machine.
2.  Reload the preview via the Developer Portal.
3.  See the changes you've made.

To allow for this, the Developer Portal provides a **Dev URL** field.

<!-- IMAGE -->

You can use the **Dev URL** field to load an editing extension from a URL instead of from the **JS File** field. This tutorial explains everything you need to know to make the most of this feature.

## Prerequisites

This guide assumes that you've setup a build pipeline with webpack. If you haven't already done this, refer to either of the following tutorials:

- [Setup a build pipeline with webpack and Babel](./webpack-babel.md)
- [Setup a build pipeline with webpack and TypeScript](./webpack-typescript.md)

## Step 1: Generate an `index.html` file

The URL in the **Dev URL** field needs to point toward an HTML file that:

- Loads the editing extensions JavaScript client
- Runs the extension after the client has finished loading

To create this file, install the [`html-webpack-plugin`](https://www.npmjs.com/package/html-webpack-plugin) package:

```shell
npm install html-webpack-plugin --save-dev
# yarn add html-webpack-plugin --dev
```

This package is a webpack plugin that creates an HTML file during the build process.

To use this plugin, require it at the top of the `webpack.config.js` file:

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
```

Then, in the configuration object, create the following `plugins` property:

```javascript
plugins: [new HtmlWebpackPlugin()],
```

If you run the build script, an `index.html` file will appear in the `dist` directory.

## Step 2: Customize the `index.html` file

The default `index.html` file won't do exactly what we need it to do. Fortunately, we can create a custom `index.html` file to use as a template.

Inside the `src` directory, create a `template.html` file:

```shell
touch src/template.html
```

The name of the file does not matter.

Copy the following code into the `template.html` file:

```html
<!DOCTYPE html>
<html lang="en">
  <head></head>
  <body></body>
</html>
```

Then, back in the `webpack.config.js` file, update the plugin's configuration to reference the `template.html` file:

```javascript
plugins: [
  new HtmlWebpackPlugin({ template: "./src/template.html" })
],
```

Based on these changes, we can now control the generation of the `index.html` file.

## Step 3: Load the JavaScript client for editing extensions

If we upload a JavaScript file to the **JS File** field and preview an extension, Canva automatically injects the JavaScript client into the iframe. It's this client that allows us to interact with Canva via an API. But when Canva loads an extension via the **Dev URL**, this client is _not_ injected. We need to load the client ourselves.

To allow for this, Canva appends the following query parameters to the **Dev URL**:

| Parameter | Type   | Description                                  |
| --------- | ------ | -------------------------------------------- |
| `libBase` | string | The base URL of the JavaScript client.       |
| `lib`     | string | The version number of the JavaScript client. |

You can use these parameters to construct the URL of the client.

To do this, create a `script` element inside the `template.html` file, between the `body` tags:

```html
<script type="text/javascript">
  // code goes here
</script>
```

Then extract the parameters from the URL:

```html
<script type="text/javascript">
  // Get the URL and version number of JavaScript client
  const params = new URLSearchParams(window.location.search);
  const baseUrl = params.get("libBase");
  const version = params.get("lib");
</script>
```

...and combine these parameters to create a URL:

```html
<script type="text/javascript">
  // Get the URL and version number of JavaScript client
  const params = new URLSearchParams(window.location.search);
  const baseUrl = params.get("libBase");
  const version = params.get("lib");

  // Construct the URL of the JavaScript client
  const libUrl = baseUrl + version + ".js";
</script>
```

To load this client, programmatically create a `script` element, set the `src` attribute to the URL of the client, and insert it into the `head` element:

```html
<script type="text/javascript">
  // Get the URL and version number of JavaScript client
  const params = new URLSearchParams(window.location.search);
  const baseUrl = params.get("libBase");
  const version = params.get("lib");

  // Construct the URL of the JavaScript client
  const libUrl = baseUrl + version + ".js";

  // Load the JavaScript client
  const lib = document.createElement("script");
  lib.src = libUrl;
  document.head.appendChild(lib);
</script>
```

By programmatically creating the `script` element, we have more control over when the code runs, which is important for the next step.

## Step 4: Run the extension after the client loads

Based on the current code, `html-webpack-plugin` will automatically create a `script` element that will load the JavaScript bundle for the extension. But this bundle will load _before_ the client for editing extensions has finished loading, which means our extension won't work.

To fix this, add an `inject` property to the plugin's configuration:

```javascript
plugins: [
  new HtmlWebpackPlugin({ template: "./src/template.html", inject: false })
],
```

This will prevent `html-webpack-plugin` from automatically creating a `script` element.

In the `template.html` file, create a function that runs when the client has finished loading:

```javascript
// Load the JavaScript client
const lib = document.createElement("script");
lib.src = libUrl;
lib.onload = () => {
  // code goes here
};
document.head.appendChild(lib);
```

...and inside this function, create another `script` element that loads the JavaScript bundle for the extension:

```javascript
// Load the JavaScript client
const lib = document.createElement("script");
lib.src = libUrl;
lib.onload = () => {
  // Load the JavaScript bundle for the extension
  const extension = document.createElement("script");
  extension.src = "bundle.js";
  document.body.appendChild(extension);
};
document.head.appendChild(lib);
```

This is the complete code for the `template.html` file:

```html
<!DOCTYPE html>
<html lang="en">
  <head></head>
  <body>
    <script>
      // Get the URL and version number of JavaScript client
      const params = new URLSearchParams(window.location.search);
      const baseUrl = params.get("libBase");
      const version = params.get("lib");

      // Construct the URL of the JavaScript client
      const libUrl = baseUrl + version + ".js";

      // Load the JavaScript client
      const lib = document.createElement("script");
      lib.src = libUrl;
      lib.onload = () => {
        // Load the JavaScript bundle for the extension
        const extension = document.createElement("script");
        extension.src = "bundle.js";
        document.body.appendChild(extension);
      };
      document.head.appendChild(lib);
    </script>
  </body>
</html>
```

## Step 5: Setup a development server

Canva expects the **Dev URL** field to contain a HTTPS URL. This URL, however, does not need to be public-facing.

To setup this URL, install the `webpack-dev-server` package:

```shell
npm install webpack-dev-server --save-dev
# yarn add webpack-dev-server
```

`webpack-dev-server` provides us with a local server that supports live reloading. This means it'll automatically regenerate the JavaScript bundle as you make changes to your code.

To enable `webpack-dev-server`, add the following `devServer` property to the configuration object in the `webpack.config.js` file:

```javascript
devServer: {
  contentBase: "./dist",
  https: true,
  port: 8080,
  disableHostCheck: true
}
```

Then start the server with the `npx` command:

```shell
npx webpack-dev-server --config ./webpack.config.js --mode development
```

But to start the server with fewer keystrokes, add a `start` script to the `package.json` file:

```json
{
  "start": "webpack-dev-server --config ./webpack.config.js --mode development"
}
```

The server should become available at `https://localhost:8080`. If we navigate to this URL though, we'll get an error that says something like `NET::ERR_CERT_AUTHORITY_INVALID`.

This happens because we don't have a valid security certificate, but since we know the page we're trying to access is secure, it's fine to bypass the warning.

To bypass the warning in Google Chrome:

1.  Click **Advanced**.
2.  Click **Proceed to localhost (unsafe)**.

You'll need to bypass this warning every time you start the server. Alternatively, consider using a service like [ngrok](https://ngrok.com/) to securely expose the URL of the local server. Then you won't have to deal with the security error.

## Step 6: Add the URL of the local server to the **Dev URL** field

1.  Navigate to an app via the Developer Portal.
2.  From the **Extensions** page, expand the **Editing** panel.
3.  In the **Dev URL** field, enter the URL of the local server.

## Step 7: Load the extension from the local server

Copy the following code into the `src/index.js` file:

```javascript
const { imageHelpers } = window.canva;
const canva = window.canva.init();

canva.onReady(async (opts) => {
  const img = await imageHelpers.toImageElement(opts.image);
  const canvas = document.createElement("canvas");

  canvas.width = opts.previewSize.width;
  canvas.height = opts.previewSize.height;
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  document.body.appendChild(canvas);

  const context = canvas.getContext("2d");
  context.filter = "invert(100%)";
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
});
```

Then preview the extension.

The user's image should appear in the editor, and if you make a change to the code, you should be able to simply exit the extension and open it again to see your changes.
