---
title: "Rendering controls with JSX and TypeScript"
sidebar_label: "JSX controls w/ TypeScript"
path: /editing-extensions/jsx-typescript/
---

This tutorial explains how to render controls in an editing extension with JSX (instead of the usual `canva.create` method).

:::note  
 If you're developing an editing extension with JavaScript, the process is a little different. For more information, refer to [Rendering controls with JSX and Babel](./jsx-babel.md).  
:::

## Prerequisites

This tutorial assumes that you're using webpack and TypeScript to build the JavaScript bundle for your editing extension. If you run into any issues, refer to [Setup a build pipeline with webpack and TypeScript](./webpack-typescript.md).

## Step 1: Install `@canva/editing-extensions-api-typings`

`@canva/editing-extensions-api-typings` is an npm package that contains type definitions for editing extensions.

To install the package, run the following command:

```shell
npm install @canva/editing-extensions-api-typings --save-dev
# yarn add @canva/editing-extensions-api-typings --dev
```

We'll use these type definitions throughout this tutorial.

## Step 2: Enable JSX compilation for TypeScript

By default, TypeScript doesn't compile JSX into JavaScript. You need to enable the feature.

To enable JSX compilation, add a `jsx` property to the `compilerOptions` object in the `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "commonjs",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "sourceMap": true,
    "jsx": "react"
  }
}
```

The `jsx` property should have a value of `"react"`.

## Step 3: Create a `.tsx` file for the JSX controls

TypeScript will only compile JSX inside files with a `.tsx` extension. Because of this, we recommend splitting the logic for rendering controls into a separate `controls.tsx` file:

```typescript
import { CanvaApiClient } from "@canva/editing-extensions-api-typings";

export const renderControls = (canva: CanvaApiClient) => {
  const controls = [
    // JSX controls go here
  ];
  canva.updateControlPanel(controls);
};
```

To use this `renderControls` function, import it into the `index.ts` file and provide it with the `canva` variable:

```typescript
import { CanvaApiClient } from "@canva/editing-extensions-api-typings";
import { renderControls } from "./controls";

const canva = window.canva.init();

canva.onReady(async (opts) => {
  renderControls(canva);
});
```

:::note  
 If you simply rename `.ts` files with the `.tsx` extension, you may end up with errors, as TypeScript parses `.ts` and `.tsx` files (a little) differently.  
:::

## Step 4: Import the type definitions for the controls

At the top of the `.tsx` file, import the type definitions for the controls from `@canva/editing-extensions-api-typings/lib/jsx`:

```typescript
import { Button } from "@canva/editing-extensions-api-typings/lib/jsx";
```

You'll need to individually import the type definition for each control.

## Step 4: Add the JSX pragma to the source code

At the top of the `.tsx` file, add the follow comment:

```typescript
/** @jsx canva.create */
```

During the build process, TypeScript will recognize this comment and convert the JSX controls into their `canva.create` counterparts.

To see this compilation process in action:

1.  Navigate to the [TypeScript Playground](https://www.typescriptlang.org/v2/en/play).
2.  In the **Config** menu, select **React** from the **JSX** dropdown.
3.  Copy the following code into the editor:

    ```typescript
    /** @jsx canva.create */
    <Button id="myButton" label="My Button" key="1" />
    ```

The compiled code should resemble the following:

```typescript
"use strict";

/** @jsx canva.create */
canva.create(Button, {
  id: "myButton",
  label: "My Button",
  key: "1",
});
```

## Step 5: Use the JSX syntax instead of `canva.create`

To convert a `canva.create` method into JSX:

1.  Use the name of the control as the name of the JSX element. This name should be in pascal case, such as `ColorPicker` or `RadioGroup`.
2.  Define each property as an attribute on the JSX element.
3.  Add a unique `key` attribute to the JSX element.

If a control has a `children` property, such as the [Group](./controls/group.md) control, wrap the JSX element around the child elements:

```typescript
<Group id="group1" label="Group #1" key="group1">
  <button id="button1" label="Button #1" key="button1" />
  <button id="button2" label="Button #2" key="button2" />
  <button id="button3" label="Button #3" key="button3" />
</Group>
```

The child elements should _not_ be comma-separated.

:::note  
 An error will occur if the `canva` object is not available at runtime. This means, after the `canva` object is [initialized](./api/canva-api-client/init.md), it should be made available to any context where JSX is used.  
:::

## Step 6: Compile with TypeScript

At this point, the code is ready to be compiled.

If you followed the [webpack setup tutorial](./webpack-typescript.md), run the `build` script:

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

```typescript
/** @jsx canva.create */
import { CanvaApiClient } from "@canva/editing-extensions-api-typings";
import { Button, Group } from "@canva/editing-extensions-api-typings/lib/jsx";

export const renderControls = (canva: CanvaApiClient) => {
  const controls = [
    <Group id="group1" label="Group #1" key="group1">
      <Button id="button1" label="Button #1" key="button1" />
      <Button id="button2" label="Button #2" key="button2" />
      <Button id="button3" label="Button #3" key="button3" />
    </Group>,
  ];
  canva.updateControlPanel(controls);
};
```
