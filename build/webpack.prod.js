const {merge} = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const common = require('./webpack.common');

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = merge(common, {
    // 方便追踪源代码错误
    //（如果不需要3.2小节的追踪功能，可以注释掉下行代码）
    devtool: 'source-map',
    plugins: [
        // new BundleAnalyzerPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|jpeg)/,  //是匹配图片文件后缀名称
                use: [{
                    loader: 'url-loader', //是指定使用的loader和loader的配置参数
                    options: {
                        name: '[name]_[hash].[ext]',
                        outputPath: '/images',
                        limit: 81902  //是把小于1500B的文件打成Base64的格式，写入JS
                    }
                }]
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
});