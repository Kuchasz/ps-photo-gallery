var resolve = require("path").resolve;
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: resolve("./src/demo/main.ts"),
    output: {
        filename: "bundle.js",
        path: resolve("./dist")
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['awesome-typescript-loader', 'angular2-template-loader']
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            // {
            //     test: /\.scss$/,
            //     exclude: resolve('src', 'app'),
            //     use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!sass-loader' })
            // },
            {
                test: /\.scss$/,
                // include: resolve('src', 'app'),
                use: ['raw-loader', 'sass-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            resolve('./src'),
            {}
        ),
        new HtmlWebpackPlugin({
            template: resolve('src/demo/index.html')
        })
    ],
    devServer: {
        port: 8080,
        host: 'localhost',
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        contentBase: './dist',
        open: false
    }
};
