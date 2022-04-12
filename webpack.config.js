const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'src')],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'file-loader',
        options: {
          name: '/icons/[name].[ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.png'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    hot: true,
    // compress: true,
    port: 4200,
  },
  mode: 'production',
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  plugins: [
    new HtmlWebpackPlugin({  // Also generate a test.html
      template: 'src/index.html',
    })
  ]
};
