// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { ModuleFederationPlugin } = require('webpack').container;
// const CopyPlugin = require('copy-webpack-plugin');

// module.exports = {
//   mode: 'production',
//   entry: {
//     popup: './src/popup/index.tsx',
//     content: './src/content/index.tsx',
//     background: './src/background/index.ts'
//   },
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: '[name].bundle.js',
//     publicPath: './', // Relative paths needed for Chrome extensions
//     clean: true
//   },
//   resolve: {
//     extensions: ['.tsx', '.ts', '.js', '.jsx']
//   },
//   module: {
//     rules: [
//       {
//         test: /\.(ts|tsx|js|jsx)$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: [
//               '@babel/preset-env',
//               '@babel/preset-react',
//               '@babel/preset-typescript'
//             ]
//           }
//         }
//       },
//       {
//         test: /\.css$/,
//         use: ['style-loader', 'css-loader']
//       },
//       {
//         test: /\.(png|jpg|jpeg|gif|svg)$/,
//         type: 'asset/resource'
//       }
//     ]
//   },
//   plugins: [
//     // Module Federation Plugin to expose the PopupApp component
//     new ModuleFederationPlugin({
//       name: 'extension',
//       filename: 'remoteEntry.js',
//       exposes: {
//         './PopupApp': './src/popup/PopupApp.tsx'
//       },
//       shared: {
//         react: { singleton: true, requiredVersion: '^18.2.0' },
//         'react-dom': { singleton: true, requiredVersion: '^18.2.0' }
//       }
//     }),
//     // Generates the popup HTML using our template
//     new HtmlWebpackPlugin({
//       template: './src/popup/index.html',
//       filename: 'popup/index.html',
//       chunks: ['popup'],
//       publicPath: '../'
//     }),
//     new CopyPlugin({
//     patterns: [
//       { from: 'manifest.json', to: '.' },
//       { from: 'public', to: 'public' }
//       ]
//     }),
//   ]
// };


const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    popup: './src/popup/index.tsx',
    content: './src/content/index.tsx',
    background: './src/background/index.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    // Using 'auto' instructs webpack to use __webpack_public_path__ (set at runtime)
    publicPath: 'auto',
    clean: true
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    // Module Federation exposing your PopupApp with React set as a shared singleton.
    new ModuleFederationPlugin({
      name: 'extension',
      filename: 'remoteEntry.js',
      exposes: {
        './PopupApp': './src/popup/PopupApp.tsx'
      },
      shared: {
        react: { singleton: true, requiredVersion: '18.2.0', eager: true },
        "react-dom": { singleton: true, requiredVersion: '18.2.0', eager: true }
      }
    }),
    // Create the popup HTML. Since our output bundles end up in dist/ while popup/index.html is in dist/popup/,
    // we set the publicPath for the generated <script> tag to '../'
    new HtmlWebpackPlugin({
      template: './src/popup/index.html',
      filename: 'popup/index.html',
      chunks: ['popup'],
      publicPath: '../'
    }),
    // Copy static assets to the output folder.
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json', to: '.' },
        { from: 'public', to: 'public' }
      ]
    })
  ]
};