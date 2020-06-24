---
title: "Rendering controls with JSX and Babel"
sidebar_label: "JSX controls w/ JavaScript"
path: /editing-extensions/jsx-babel/
---

This tutorial explains how to render controls in an editing extension with JSX (instead of the usual `canva.create` method).

:::note  
 If you're developing an editing extension with TypeScript, the process is a little different. For more information, refer to [Rendering controls with JSX and TypeScript](./jsx-typescript.md).  
:::

## Prerequisites

This tutorial assumes that you're using webpack and Babel to build the JavaScript bundle for your editing extension. If you run into any issues, refer to [Setup a build pipeline with webpack and Babel](./webpack-babel.md).

## Step 1: Install `babel-plugin-transform-react-jsx`

By default, Babel doesn't compile JSX into JavaScript. You need to enable the feature.

To enable JSX compilation, install the [`@babel/plugin-transform-react-jsx`](https://www.npmjs.com/package/@babel/plugin-transform-react-jsx) plugin:

```shell
npm install @babel/plugin-transform-react-jsx --save-dev
# yarn add @babel/plugin-transform-react-jsx --dev
```

Then enable the plugin by adding it to the `babel.plugins` array in the `package.json` file:

```json
{
  "babel": {
    "presets": ["@babel/preset-env"],
    "plugins": [
      "@babel/plugin-transform-runtime",
      "@babel/plugin-transform-react-jsx"
    ]
  }
}
```

This code snippet assumes the `@babel/preset-env` preset and `@babel/plugin-transform-runtime` have previously been installed.

If you're not using the `package.json` file to configure Babel, refer to [Configure Babel](https://babeljs.io/docs/en/configuration) for other ways to enable plugins.

## Step 2: Add the JSX pragma to the source code

At the top of any file that will contain JSX controls, add the follow comment:

```javascript
/** @jsx canva.create */
```

During the build process, Babel will recognize this comment and convert the JSX controls into their `canva.create` counterparts.

To see an example of this compilation:

1.  Navigate to the [Babel REPL](https://babeljs.io/repl).
2.  In the sidebar, under the **Presets** heading, select **react**.
3.  Copy the following code into the editor:

    ```javascript
    /** @jsx canva.create */
    <button id="myButton" label="My Button" key="1" />
    ```

The compiled code should resemble the following:

```javascript
"use strict";

/** @jsx canva.create */
canva.create("button", {
  id: "myButton",
  label: "My Button",
  key: "1",
});
```

## Step 3: Use the JSX syntax instead of `canva.create`

To convert a `canva.create` method into JSX:

1.  Use the name of the control as the name of the JSX element.
2.  Define each property as an attribute on the JSX element.
3.  Attach a unique `key` attribute to the JSX element.

This is an example of a [Button](./controls/button.md) control defined with the `canva.create` method:

```javascript
canva.create("button", {
  id: "myButton",
  label: "My Button",
});
```

...and this is the JSX equivalent:

```javascript
<button id="myButton" label="My Button" key="1" />
```

If a control has a `children` property, such as the [Group](./controls/group.md) control, wrap that control's JSX element around the child elements:

```javascript
<group id="group1" label="Group #1" key="group1">
  <button id="button1" label="Button #1" key="1" />
  <button id="button2" label="Button #2" key="2" />
  <button id="button3" label="Button #3" key="3" />
</group>
```

The child elements should _not_ be comma-separated.

:::note  
 An error will occur if the `canva` object is not available at runtime. This means, after the `canva` object is [initialized](./api/canva-api-client/init.md), it should be made available to any context where JSX is used.  
:::

## (Optional) Step 4: Use pascal case instead of snake case for JSX elements

By default, the names of the JSX elements must be provided in snake case (lowercase, with underscores instead of spaces). Typically though, the names of JSX elements are defined in pascal case (each word capitalized, no spaces).

If you'd like to use pascal case, define a constant for each type of control:

```javascript
const Button = "button";
const Group = "group";
```

Then use the constants as the element names:

```javascript
<Group id="group1" label="Group #1" key="group1">
  <Button id="button1" label="Button #1" key="1" />
  <Button id="button2" label="Button #2" key="2" />
  <Button id="button3" label="Button #3" key="3" />
</Group>
```

## Step 5: Compile with Babel

At this point, the code is ready to be compiled.

If you followed the [webpack setup tutorial](./webpack-babel.md), run the `build` script:

```shell
npm run build
# yarn build
```

If you haven't created a `build` script, you'll need to run webpack directly:

```shell
npm run webpack
# yarn webpack
```

The compiled code should appear in the project's `dist` directory.

## Example

```javascript
/** @jsx canva.create */
const canva = window.canva.init();

const renderControls = (canva) => {
  const controls = [
    <group id="group1" label="Group #1" key="group1">
      <button id="button1" label="Button #1" key="button1" />
      <button id="button2" label="Button #2" key="button2" />
      <button id="button3" label="Button #3" key="button3" />
    </group>,
  ];

  canva.updateControlPanel(controls);
};

canva.onReady(async (opts) => {
  renderControls(canva);
});
```
