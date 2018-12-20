var resolve = require("path").resolve;
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var postcssLoader = {
    loader: 'postcss-loader',
    options: {
        plugins: function () {
            return [autoprefixer];
        }
    }
};

var plugins = [
    new webpack.ContextReplacementPlugin( /angular(\\|\/)core(\\|\/)/, resolve('./src')) ,
    new HtmlWebpackPlugin({
        template: resolve('src/demo/index.html'),
        title: 'Galeria zdjęć'
    }),
    new ExtractTextPlugin('[name].css'),
    new CopyWebpackPlugin([{from: 'src/demo/example-gallery-images'}])
];

if (process.env.NODE_ENV === 'production')
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {warnings: false}
    }));


module.exports = {
    entry: resolve("./src/demo/main.ts"),
    output: {
        filename: "bundle.js",
        path: resolve("./dist")//,
        // publicPath: './'
    },
    performance: { 
        hints: false 
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['awesome-typescript-loader', 'angular2-template-loader']
            },
            {
              test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
              parser: { system: true },
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader', options: {
                        minimize: true,
                        removeComments: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: false,
                        keepClosingSlash: true,
                        caseSensitive: true,
                        conservativeCollapse: true
                    }
                }
            },
            {
                test: /\.scss$/,
                exclude: [resolve('src/demo/component'), resolve('src/component')],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', postcssLoader, 'sass-loader']
                })
            },
            {
                test: /\.scss$/,
                include: [resolve('src/demo/component'), resolve('src/component')],
                use: ['raw-loader', postcssLoader, 'sass-loader']
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: 'file-loader?name=fonts/[name].[ext]'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            resolve('node_modules')
          ]
    },
    resolveLoader: {
        modules: [
            resolve('node_modules')
        ]
      },
    plugins: plugins,
    devServer: {
        port: 8080,
        host: 'localhost',
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        contentBase: './dist',
        open: true
    }
};
