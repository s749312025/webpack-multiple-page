const path = require('path')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const {HTMLPlugins, Entries} = require('../config/directory');

function resolve(dir) {
	return path.join(__dirname, '..', dir)
}

const HtmlPlugin = HTMLPlugins.map(item => {
    return new HtmlWebpackPlugin(item)
})

module.exports = {
    resolve: {
        // 解析模块时应该搜索的目录
        modules: [resolve('src'), 'node_modules'],
        // 模块别名
        alias: {
            '@': resolve('src')
        }
    },
    entry: {
        common: resolve('src/common/index.js'),
        ...Entries
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        // 在打包前先清空打包文件夹
        new CleanWebpackPlugin(),
        ...HtmlPlugin,
        // 提取css
        new MiniCssExtractPlugin({
            filename: 'css/[name].[chunkhash:6].css',
            chunkFilename: '[id].css'
        }),
        // 压缩css
        new OptimizeCssAssetsPlugin(),
        // 复制static 到 dist
        new CopyWebpackPlugin({
            patterns: [{from: path.join(__dirname, '../src/static'), to: path.join(__dirname, '../dist/static')}]
        }),
    ],
    output: {
        filename: 'js/[name].js',
        path: resolve('./dist')
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|jpeg)/,  //是匹配图片文件后缀名称
                use: [{
                    loader: 'url-loader', //是指定使用的loader和loader的配置参数
                    options: {
                        name: '[name]_[hash].[ext]',
                        limit: 81902  //是把小于1500B的文件打成Base64的格式，写入JS
                    }
                }]
            },
            {
                test: /\.(tsx|ts|js)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-transform-runtime']
                        }
                    }
                ],
                exclude: /node_modules/,
            },
            // 解析样式
            {
                test: /\.(s[ac]ss|css)$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    // 将 JS 字符串生成为 style 节点
                    // 'style-loader',
                    // 将 CSS 转化成 CommonJS 模块
                    'css-loader',
                    // 将 Sass 编译成 CSS
                    'sass-loader',
                ],
            },
        ]
    }
}