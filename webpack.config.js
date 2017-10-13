var resolve = require("path").resolve;
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

var postcssLoader = {
    loader: 'postcss-loader',
    options: {
        plugins: () => [autoprefixer]
    }
};

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
            {
                test: /\.scss$/,
                exclude: [resolve('src/demo/component'), resolve('src/component')],
                use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', postcssLoader, 'sass-loader']})
            },
            {
                test: /\.scss$/,
                include: [resolve('src/demo/component'), resolve('src/component')],
                use: ['raw-loader', postcssLoader, 'sass-loader']
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: 'file-loader?name=dist/fonts/[name].[ext]'
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
        }),
        new ExtractTextPlugin('[name].css')
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: { warnings: false }
        // })
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
