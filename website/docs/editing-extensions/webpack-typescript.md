---
title: "Setup a build pipeline with webpack and TypeScript"
sidebar_label: "Setup webpack w/ TypeScript"
path: /editing-extensions/webpack-typescript/
---

This tutorial explains how to setup a build pipeline for an editing extension with webpack and TypeScript. This pipeline will allow you to easily compile TypeScript into JavaScript.

:::note  
 If you'd rather develop an editing extension with JavaScript, refer to [Setup a build pipeline with webpack and Babel](./webpack-babel.md).  
:::

## Step 1: Create a project

To begin, open a terminal and create a new directory for an editing extension:

```shell
mkdir my-editing-extension
```

Then navigate into this directory:

```shell
cd my-editing-extension
```

...and create a `package.json` file with either npm or Yarn:

```shell
npm init --yes
# yarn init --yes
```

The `--yes` flag will create the `package.json` file with the default values.

Next, create a `src` directory for the project's source code:

```shell
mkdir src
```

...and a `dist` directory for the project's build artifacts:

```shell
mkdir dist
```

Then create an `index.ts` file inside the `src` directory:

```shell
touch src/index.ts
```

You should end up with a directory structure that looks like this:

```shell
├── dist
├── src
│   └── index.ts
└── package.json
```

## Step 2: Setup TypeScript

To install TypeScript, run the following command:

```bash
npm install typescript --save-dev
# yarn add npm install typescript --dev
```

Then initialize a TypeScript project with the `tsc` command:

```bash
npx tsc --init
```

A `tsconfig.json` file will appear in the project's root directory. You'll need to open this file and change the value of `compilerOptions.target` from `"es5"` to `"ES2015"`:

```json
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "commonjs",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "sourceMap": true
  }
}
```

This change is required to support the async/await features of editing extensions.

## Step 3: Setup webpack

webpack is a _module bundler_. You can use it to combine multiple input files into a single output file and transform the input files with _loaders_.

To use webpack, install the following packages:

- [`webpack`](https://www.npmjs.com/package/webpack)
- [`webpack-cli`](https://www.npmjs.com/package/webpack-cli)
- [`ts-loader`](https://www.npmjs.com/package/ts-loader)

You can install these packages with the following command:

```bash
npm install webpack webpack-cli ts-loader --save-dev
# yarn add webpack webpack-cli ts-loader --dev
```

Then, in the root directory of the project, create a `webpack.config.js` file:

```bash
touch webpack.config.js
```

...and copy the following configuration into the file:

```javascript
module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx"],
  },
  output: {
    path: __dirname + "/dist",
    publicPath: "/",
    filename: "bundle.js",
  },
};
```

This configuration:

- Uses the `src/index.ts` file as the entry point for the application
- Processes any file in the `src` directory with a `.ts` or `.tsx` extension
- Transforms files with TypeScript and `ts-loader`
- Outputs a `bundle.js` file to the `dist` directory

If anything about this configuration appears strange or unfamiliar, refer to [the official webpack documentation](https://webpack.js.org/configuration/).

## Step 4: Build a JavaScript bundle

To build a JavaScript bundle from any `.ts` or `.tsx` files in the `src` directory, run the following command:

```javascript
npx webpack --config ./webpack.config.js --mode production
```

A `bundle.js` file should appear in the `dist` directory. You can upload this file to the Developer Portal with the confidence that, as long as there aren't any bugs in the code, it will run across Canva's [supported browsers](https://support.canva.com/account-basics/change-your-account-settings/supported-browsers/).

To streamline the build process, create a `"build"` script in the `package.json` file:

```json
{
  "scripts": {
    "build": "webpack --config ./webpack.config.js --mode production"
  }
}
```

Then you can run the build script with fewer keystrokes:

```bash
npm run build
# yarn build
```

## Next steps

To make this build pipeline more useful, refer to the following tutorials:

- [Setup a live reload loop for editing extensions](./webpack-live-reload.md)
- [Render controls with JSX and TypeScript](./jsx-typescript.md)
