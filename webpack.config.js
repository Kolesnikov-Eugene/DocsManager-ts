const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Configuration for the Main Process
const mainConfig = {
  entry: './src/main/main.ts', // Entry point for the Main Process
  target: 'electron-main', // Main Process target
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/main'), // Output directory for Main Process
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Handle TypeScript files
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  mode: 'production'
};

// Configuration for the Renderer Process
const rendererConfig = {
  entry: './src/renderer/index.tsx', // Entry point for the Renderer Process
  target: 'electron-renderer', // Renderer Process target
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/renderer'), // Output directory for Renderer Process
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // Handle TypeScript and TSX files
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/, // Handle CSS files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/, // Handle images
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html', // Source HTML template
      filename: 'index.html', // Output HTML file
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist/renderer'),
    },
    compress: true,
    port: 9000, // Development server port
  },
  mode: 'production'
};

// Export both configurations
module.exports = [mainConfig, rendererConfig];