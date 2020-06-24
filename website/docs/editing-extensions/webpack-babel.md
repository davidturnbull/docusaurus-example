---
title: "Setup a build pipeline with webpack and Babel"
sidebar_label: "Setup webpack w/ JavaScript"
path: /editing-extensions/webpack-babel/
---

This tutorial explains how to setup a build pipeline for an editing extension with webpack and Babel. This pipeline will allow you to use the latest features of JavaScript.

:::note  
 If you'd rather develop an editing extension with TypeScript, refer to [Setup a build pipeline with webpack and TypeScript](./webpack-typescript.md).  
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

Then create an `index.js` file inside the `src` directory:

```shell
touch src/index.js
```

You should end up with a directory structure that looks like this:

```shell
├── dist
├── src
│   └── index.js
└── package.json
```

## Step 2: Setup Babel

Babel is a compiler that allows us to use the latest features of JavaScript while still generating an output that can be understood by older browser.

To use Babel, install the following packages:

- [`@babel/core`](https://www.npmjs.com/package/@babel/core)
- [`@babel/preset-env`](https://www.npmjs.com/package/@babel/preset-env)
- [`@babel/plugin-transform-runtime`](https://www.npmjs.com/package/@babel/plugin-transform-runtime)

You can install these packages with the following command:

```bash
npm install @babel/core @babel/preset-env @babel/plugin-transform-runtime --save-dev
# yarn add npm install @babel/core @babel/preset-env @babel/plugin-transform-runtime --dev
```

To enable the `@babel/preset-env` preset, add the following `babel` property to the `package.json` file:

```json
{
  "babel": {
    "presets": ["@babel/preset-env"]
  }
}
```

To enable the `@babel/plugin-transform-runtime` plugin, add a `plugins` array to the `babel` property:

```json
{
  "babel": {
    "presets": ["@babel/preset-env"],
    "plugins": ["@babel/plugin-transform-runtime"]
  }
}
```

There's a number of other ways to enable presets. For alternative methods, refer to [Configure Babel](https://babeljs.io/docs/en/configuration).

## Step 3: Setup webpack

webpack is a _module bundler_. You can use it to combine multiple input files into a single output file and transform the input files with _loaders_.

To use webpack, install the following packages:

- [`webpack`](https://www.npmjs.com/package/webpack)
- [`webpack-cli`](https://www.npmjs.com/package/webpack-cli)
- [`babel-loader`](https://www.npmjs.com/package/babel-loader)

You can install these packages with the following command:

```bash
npm install webpack webpack-cli babel-loader --save-dev
# yarn add webpack webpack-cli babel-loader --dev
```

Then, in the root directory of the project, create a `webpack.config.js` file:

```bash
touch webpack.config.js
```

...and copy the following configuration into the file:

```javascript
module.exports = {
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js"],
  },
  output: {
    path: __dirname + "/dist",
    publicPath: "/",
    filename: "bundle.js",
  },
};
```

This configuration:

- Uses the `src/index.js` file as the entry point for the application
- Processes any file in the `src` directory with a `.js` extension
- Transforms files with Babel and `babel-loader`
- Outputs a `bundle.js` file to the `dist` directory

If anything about this configuration appears strange or unfamiliar, refer to [the official webpack documentation](https://webpack.js.org/configuration/).

## Step 4: Build a JavaScript bundle

To build a JavaScript bundle from any `.js` files in the `src` directory, run the following command:

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
- [Render controls with JSX and Babel](./jsx-babel.md)
