const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
exports.default = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    devServer: {
        static: "./dist",
        hot: true,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            "@shared": path.resolve(__dirname, '../shared'),
        },
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, './dist'),
    },
    plugins: [new HtmlWebpackPlugin({
        template: './src/index.html',
    })],
    mode: 'development',
    
};

