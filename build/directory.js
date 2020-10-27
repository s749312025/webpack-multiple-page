const glob = require('glob')
const path = require('path')
const fs = require('fs')
const projectRoot = process.cwd()

function resolve(dir) {
	return path.join(__dirname, '..', dir)
}


// 获取所有src/html下的ejs文件
const entryFile = glob.sync(path.join(projectRoot, './src/html/**/*.ejs'))
// 获取所有ejs文件的目录
const htmlAllFileDir = entryFile.map(item => {
    const match = item.match(/src\/html\/(.*).ejs/)
    return match[0] && match[1]
})

let HTMLPlugins = [] // 保存HTMLWebpackPlugin实例
let Entries = {} // 保存入口列表

HTMLPlugins = htmlAllFileDir.map(item => {
    // 如果 js目录下存在对应js，就把它放入入口文件
    let hasJs = false
    if (glob.sync(path.join(__dirname, `../src/js/${item}.js`)).length > 0) {
        hasJs = true
        Entries[item] = resolve(`src/js/${item}.js`)
    }

    // 如果data目录下存在对应的json，就用它渲染ejs模板
    let hasData = false
    if (glob.sync(path.join(__dirname, `../src/data/${item}.json`)).length > 0) {
        hasData = fs.readFileSync(path.join(__dirname, `../src/data/${item}.json`), "utf-8")
    }

    const chunks = ['jquery', 'common'].concat(hasJs ? [item] : [])
    const data = hasData ? JSON.parse(hasData) : {}

    const commonData = JSON.parse(fs.readFileSync(path.join(__dirname, `../src/data/common.json`), "utf-8"))

    return {
        filename: `${item}.html`,
        template: resolve(`src/html/${item}.ejs`),
        chunks: chunks,
        data: {...commonData, ...data},
    }
})

module.exports = {
    HTMLPlugins,
    Entries
}