const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    devtool: "source-map",
    entry: path.resolve(`${__dirname}/src/`),
    output: {
        path: path.resolve(`${__dirname}/dist/`),
        filename: "bundle.js"
    },
    devServer: {
        inline: true,
        contentBase: "./dist",
        host: "0.0.0.0",
        port: 8080,
        hot: true,
        historyApiFallback: true,
        watchOptions: {
            poll: 1000
        }
    },
    resolve: {
        extensions: [".js"]
    },
    module: {
        rules: [
            { test: /\.(js)$/, use: "babel-loader" },
            { test: /\.(png|ico)(\?.*)?$/, use: "url-loader" },
            {
                test: /\.scss$/, use: extractSass.extract({
                    use: [
                        { loader: "css-loader", options: { sourceMap: true } },
                        { loader: "sass-loader", options: { sourceMap: true } }
                    ],
                    fallback: "style-loader"
                })
            }
        ]
    },
    plugins: [
        extractSass,
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            favicon: "./public/favicon.ico",
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
};
