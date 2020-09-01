# clarence webpack demo

## 安装环境

```bash
#npm 更换淘宝源
npm config set registry https://registry.npm.taobao.org
# 安装yarn
npm install yarn -g

#yarn 更换淘宝源
yarn config set registry https://registry.npm.taobao.org -g

#yarn 设置 node-sass 参数
npm config set sass_binary_site=s://npm.taobao.org/mirrors/node-sass/ -g
yarn config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/ -g
```

### 安装依赖

```bash
yarn
## or
npm i
```

### 最后 打包

```bash
npm run build
## or
yarn build
```

### 文件目录

html 文件写在`src/html`目录下，页面js请写在`src/js`对应目录中。
static 会整体copy到dist目录下
`src/common`文件夹放公共js文件
`src/style/scss`中 有公共样式，页面样式请在页面js文件中单独`import`scss文件进来。
