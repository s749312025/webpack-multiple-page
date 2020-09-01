const {merge} = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
    devServer: {
        contentBase: '../dist',
        port: 6301,
        hot: true
    },
})