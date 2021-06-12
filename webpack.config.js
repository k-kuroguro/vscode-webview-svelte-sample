//@ts-check

'use strict';

const path = require('path');
const fs = require('fs');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { typescript, scss } = require('svelte-preprocess');

//TODO: recursively read
//TODO: check exists *.html template and *.ts file
const templates = fs.readdirSync(path.resolve(__dirname, 'src', 'webview', 'templates'), { withFileTypes: true }).filter(elem => elem.isFile);
const entry = {}, htmlPlugins = [];
for (const template of templates) {
   const basename = path.basename(template.name, path.extname(template.name));
   entry[basename] = `./${path.join('src', 'webview', `${basename}.ts`)}`;
   htmlPlugins.push(new htmlWebpackPlugin({
      title: '',
      filename: `${basename}.html`,
      chunks: [basename],
      template: `!!html-loader!${path.join(__dirname, 'src', 'webview', 'templates', `${basename}.html`)}`,
      publicPath: `vscode-resource:${path.resolve(__dirname, 'dist')}`
   }));
}

const webview = {
   target: 'web',
   entry,
   mode: 'none',
   output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist')
   },
   devtool: 'nosources-source-map',
   externals: {
      vscode: 'commonjs vscode', // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
   },
   resolve: {
      alias: {
         svelte: path.resolve('node_modules', 'svelte')
      },
      extensions: ['.mjs', '.ts', '.js', '.svelte'],
      mainFields: ['svelte', 'browser', 'module', 'main'],
   },
   plugins: [
      new miniCssExtractPlugin({
         filename: '[name].css',
      }),
      ...htmlPlugins
   ],
   module: {
      rules: [
         {
            test: /\.(html|svelte)$/,
            exclude: /node_modules/,
            use: {
               loader: 'svelte-loader',
               options: {
                  preprocess: [
                     typescript({ tsconfigFile: './src/webview/tsconfig.json' }),
                     scss()
                  ],
                  emitCss: true,
               },
            },
         },
         {
            test: /\.css$/i,
            exclude: /node_modules/,
            use: [miniCssExtractPlugin.loader, 'css-loader'],
         },
         {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: 'ts-loader',
         },
      ],
   },
};

/**@type {import('webpack').Configuration}*/
const node = {
   target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
   mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')

   entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
   output: {
      // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
      path: path.resolve(__dirname, 'dist'),
      filename: 'extension.js',
      libraryTarget: 'commonjs2'
   },
   devtool: 'nosources-source-map',
   externals: {
      vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
   },
   resolve: {
      // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
      extensions: ['.ts', '.js']
   },
   module: {
      rules: [
         {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [
               {
                  loader: 'ts-loader'
               }
            ]
         }
      ]
   }
};

module.exports = [node, webview];