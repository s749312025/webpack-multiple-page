const glob = require('glob')
const path = require('path')
const fs = require('fs')
const projectRoot = process.cwd()

function resolve(dir) {
	return path.join(__dirname, '..', dir)
}


// 获取所有src/html下的html文件
const entryFile = glob.sync(path.join(projectRoot, './src/html/**/*.html'))
// 获取所有html文件的目录
const htmlAllFileDir = entryFile.map(item => {
    const match = item.match(/src\/html\/(.*).html/)
    return match[0] && match[1]
})

let HTMLPlugins = [] // 保存HTMLWebpackPlugin实例
let Entries = {} // 保存入口列表

// 如果 js目录下存在对应js，就把它放入入口文件
HTMLPlugins = htmlAllFileDir.map(item => {
    let hasJs = false
    if (glob.sync(path.join(__dirname, `../src/js/${item}.js`)).length > 0) {
        hasJs = true
        Entries[item] = resolve(`src/js/${item}.js`)
    }
    const chunks = ['common'].concat(hasJs ? [item] : [])
    return {
        filename: `${item}.html`,
        template: resolve(`src/html/${item}.html`),
        chunks: chunks,
    }
})

module.exports = {
    HTMLPlugins,
    Entries
}