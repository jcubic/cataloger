/* global process, require, module, __dirname */

var webpack = require('webpack');
var copyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
const ENV = process.env.NODE_ENV || 'development';

function isNodeModule(module) {
    return module.context && module.context.indexOf("node_modules") !== -1;
}

module.exports = {
    entry:  {
        app: path.resolve('./admin') + '/app.js'
    },
    output: {
        path: path.resolve('./dist'),
        filename: "[name].js"
    },
    plugins: ([
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: isNodeModule
        }),
        new webpack.DefinePlugin({
            PRODUCTION: process.env.NODE_ENV == 'production'
        }),
        new copyWebpackPlugin([
            { from: './node_modules/tinymce/plugins', to: './plugins' },
            { from: './node_modules/tinymce/themes', to: './themes' },
            { from: './node_modules/tinymce/skins', to: './skins' },
            { from: './node_modules/font-awesome/css/font-awesome.min.css', to: './css/font-awesome.min.css' },
            { from: './node_modules/font-awesome/fonts', to: './fonts' }
        ])
    ]).concat(ENV==='production' ? [
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            },
            compress: {
                unsafe_comps: true,
                properties: true,
                keep_fargs: false,
                pure_getters: true,
                collapse_vars: true,
                unsafe: true,
                warnings: false,
                screw_ie8: true,
                sequences: true,
                dead_code: true,
                drop_debugger: true,
                comparisons: true,
                conditionals: true,
                evaluate: true,
                booleans: true,
                loops: true,
                unused: true,
                hoist_funs: true,
                if_return: true,
                join_vars: true,
                cascade: true,
                drop_console: true
            }
        })
    ] : []),
        module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /jquery(\.min)?\.js$/,
                loader: 'expose-loader?jQuery'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /\.(eot|woff2?|ttf|svg)$/,
                loader: 'file-loader' +
                    (process.env.NODE_ENV == 'production' ? '?publicPath=assets/&outputPath=/assets/' : '')
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json']
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        historyApiFallback: true,
        open: true
    }
};
