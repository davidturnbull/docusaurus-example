---
title: "Rendering controls with JSX"
sidebar_label: "Render controls with JSX"
path: /editing-extensions/jsx/
---

In an editing extension, you typically render controls with the `canva.create` method:

```javascript
canva.create("button", { id: "myButton", label: "My Button" });
```

But it's also possible to render controls with JSX:

```jsx
<button id="myButton" label="My Button" key="1" />
```

Functionally, there are no differences between either approach -- the JSX is just syntactic sugar -- but some developers prefer working with JSX because:

- They're already familiar with the syntax
- The syntax is (arguably) easier to read

By default though, a web browser can't understand JSX. You need to add a _pragma_ to your source code and ensure that your build process can compile JSX into JavaScript.

## A (brief) introduction to pragmas

A pragma is a directive that tells a compiler how the contents of a file should be compiled.

This comment, for instance, is the pragma that allows an editing extension to support JSX:

```javascript
/** @jsx canva.create */
```

If you add this comment to the top of a JavaScript or TypeScript file that contains JSX elements and run it through a supported compiler, the JSX elements will be converted into their equivalent `canva.create` methods.

## Compiling JSX into JavaScript

There are various tools for compiling JSX into JavaScript. The right tool for the job depends on whether you're developing an extension with JavaScript or TypeScript.

If you're developing an extension with JavaScript, we recommend the [Babel](https://babeljs.io/) compiler. If you're developing an extension with TypeScript, we recommend the [TypeScript](https://www.typescriptlang.org/) compiler.

For step-by-step walkthroughs of using these compilers, refer to the following tutorials:

- [Rendering controls with JSX and Babel](./jsx-babel.md)
- [Rendering controls with JSX and TypeScript](./jsx-typescript.md)

These tutorials assume you've [setup a build pipeline with webpack](./webpack-babel.md).
