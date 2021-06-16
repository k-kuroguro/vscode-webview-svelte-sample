//@ts-check

'use strict';

const path = require('path');
const fs = require('fs');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const cspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const { typescript, scss } = require('svelte-preprocess');

//TODO: recursively read
const templateExts = ['.html', '.ejs'];
const templates = fs.readdirSync(path.resolve(__dirname, 'src', 'webview', 'templates'), { withFileTypes: true }).filter(elem => elem.isFile && templateExts.includes(path.extname(elem.name)));
const entry = {}, htmlPlugins = [];
for (const template of templates) {
   const extname = path.extname(template.name);
   const basename = path.basename(template.name, extname);

   //get ts file path for entry
   let tsPath = path.join('src', 'webview', `${basename}.ts`);
   if (!fs.existsSync(path.resolve(__dirname, tsPath))) {
      tsPath = path.join('src', 'webview', basename, 'index.ts');
      if (!fs.existsSync(path.resolve(__dirname, tsPath))) continue;
   }

   entry[basename] = `./${tsPath}`;
   htmlPlugins.push(
      new htmlWebpackPlugin({
         title: '',
         filename: `${basename}.html`,
         chunks: [basename],
         template: `${path.join(__dirname, 'src', 'webview', 'templates', `${basename}${extname}`)}`,
         publicPath: '${webviewDistPath}'
      }),
      new cspHtmlWebpackPlugin(
         {
            'base-uri': "'self'",
            'object-src': "'none'",
            'default-src': "'none'",
            'script-src': '${webview.cspSource}',
            'img-src': ['${webview.cspSource}', 'https:'],
            'style-src': '${webview.cspSource}'
         },
         {
            hashEnabled: {
               'script-src': true,
               'style-src': true
            },
            nonceEnabled: {
               'script-src': true,
               'style-src': true
            }
         }
      )
   );
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
      mainFields: ['svelte', 'browser', 'module', 'main']
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
            test: /\.svelte$/,
            exclude: /node_modules/,
            use: {
               loader: 'svelte-loader',
               options: {
                  preprocess: [
                     typescript({ tsconfigFile: './src/webview/tsconfig.json' }),
                     scss()
                  ],
                  emitCss: true
               }
            }
         },
         {
            test: /\.html$/,
            exclude: /node_modules/,
            use: 'html-loader'
         },
         {
            test: /\.ejs$/,
            exclude: /node_modules/,
            use: 'ejs-compiled-loader'
         },
         {
            test: /\.(css|s[ac]ss)$/i,
            exclude: /node_modules/,
            use: [miniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
         },
         {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: 'ts-loader'
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
