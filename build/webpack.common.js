const path = require('path')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const {HTMLPlugins, Entries} = require('./directory');

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
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        interpolate: true,
                        minimize: false
                    }
                }]
            },
            {
                test: /\.ejs$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ejs-loader',
                    options: {
                        esModule: false,
                    }
                }],
            },
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /jquery/,
                    name: 'jquery',
                    chunks: 'all'
                }
            }
        }
    },
}