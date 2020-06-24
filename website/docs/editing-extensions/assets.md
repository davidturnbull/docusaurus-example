---
title: "Add assets to an editing extension"
sidebar_label: Assets
path: /editing-extensions/assets/
---

If your editing extension depends on certain assets, such as images or JSON files, it's possible to:

1.  upload these assets to the Developer Portal
2.  have these assets provided to the extension at runtime
3.  download the assets only when/if they're needed

The (not recommend) alternative is to inline the assets in the JavaScript file as data URLs or base64-encoded data. This is because the encoded data is larger than the original data, which:

- increases the size of the JavaScript file
- increases the load time of the extension

We strongly encourage developers to upload their assets to the Developer Portal.

## Supported asset types

You can upload the following types of assets to an editing extension:

- bin
- css
- data
- frag
- jpg
- jpeg
- json
- png
- svg
- vert

## Uploading assets

To upload assets to an editing extension:

1.  Navigate to an app via the Developer Portal.
2.  From the **Extensions** page, expand the **Editing** panel.
3.  Drag and drop files into the **Assets** field.

Any changes to the form will save automatically.

:::note  
 The file names of assets can only contain English characters (uppercase and lowercase), underscores, hyphens, periods, and numbers.  
:::

## Downloading assets

When a user opens an editing extension, an `opts` object is provided to the `onReady` callback:

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  console.log(opts);
});
```

This `opts` object includes an `assets` property that contains a key-value pairing of the extension's assets. The key is the file name of the asset (including the file extension) and the value is a URL for the asset.

This is an example of an `assets` object:

```javascript
{
  "attractive-technical-writer.png": "https://..."
}
```

When the extension needs to access an asset, it can download it with a `GET` request.

<!-- TODO: File name requirements -->

## Example

```javascript
const canva = window.canva.init();

canva.onReady(async (opts) => {
  // Step 1. Get the URL of an asset
  const url = opts.assets["attractive-technical-writer.png"];

  // Step 2. Fetch the asset
  const asset = await fetch(url);

  // Step 3. Do something with the asset
  console.log(asset);
});
```

:::note  
 This example assumes that an image named "attractive-technical-writer.png" has been uploaded to the field in the Developer Portal.  
:::
