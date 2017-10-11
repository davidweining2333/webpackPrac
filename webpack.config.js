const path = require('path');
// 生产环境单独抽离css文件（不依赖js）
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// 每次构建清理dist目录
const CleanWebpackPlugin = require('clean-webpack-plugin');
// 自动修改html的出口文件引用
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 为了调用webpack中的HRM插件
const webpack = require('webpack');
// 判断是否为开发环境

const isDevEnv = process.env.NODE_ENV === "development";
const _ = require("lodash");

const extractSass = new ExtractTextPlugin({
    filename: "[name].css",
    disable: isDevEnv
});

const useHRM = false;

const tempConfig = {
    entry: {
        riskMap: './src/feature/main.js',
        test: './src/feature/test.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            // sass loader
            test: /\.scss$/,
            use: extractSass.extract({

                use: [{
                    loader: "css-loader"
                }, {
                    loader: "sass-loader"
                }],
                // 在开发环境使用 style-loader,将css样式添加为内联样式
                fallback: "style-loader",
            })
        },{
            // css loader
            test: /\.css$/,
            use: ['style-loader','css-loader']
        },{
            test: /\.(png|svg|jpg|gif)$/,
            use: 'file-loader'
        }]
    },
    plugins: [
        // 构建前清理dist目录
        new CleanWebpackPlugin(['dist']),
        // 分离css文件
        // ,
        // 动态生成html（自动插入生成的js和css）
        new HtmlWebpackPlugin({
            // title: 'Output Management',
            template : "src/feature/main.html",
            filename: "main.html"
        }),extractSass
    ],
    devServer: {
        contentBase: './dist'
    }
}

if (isDevEnv) {
    _.defaultsDeep(tempConfig, {
        devtool: "source-map",
        devServer: {
            hot: useHRM
        }
    });
    if (useHRM) {
        tempConfig.entry = './src/feature/main.js';
    }
    tempConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
    _.defaultsDeep(tempConfig, {
    //  webpack-dev-server监听文件改变重新构建并刷新浏览器

    });
}
console.log(tempConfig)
module.exports = tempConfig;

