var express = require('express');
var path = require('path');
var proxy = require('http-proxy-middleware');

var app = express();
var options = {
    target: 'http://example.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api': ''
    }
}
app.use('/api', proxy(options));

app.use(express.static(path.join(__dirname, 'dist')));

app.listen(3001);