#!/usr/bin/env node
//上面一行表明此文件是 node 可执行文件

/* * ━━━━━━━━ 神兽出没 ━━━━━━━━
 *        ┏┓          ┏┓
 *       ┏┛┻━━━━━━━━━━┛┻┓
 *       ┃              ┃
 *       ┃      ━━      ┃
 *       ┃  ━┳━┛  ┗━┳━  ┃     Code is far away from bug
 *       ┃              ┃     with the animal protecting
 *       ┃     ━┻━      ┃
 *       ┃              ┃
 *       ┗━━━┓      ┏━━━┛
 *           ┃      ┃         神兽保佑,代码无bug
 *           ┃      ┃
 *           ┃      ┗━━━━━┓
 *           ┃            ┣┓
 *           ┃            ┏┛
 *           ┗━┓┓┏━━━━┳┓┏━┛
 * 　　　　     ┃┫┫    ┃┫┫
 * 　　　　     ┗┻┛    ┗┻┛
 * * ━━━━━━━━ 感觉萌萌哒 ━━━━━━━━ */

var app = require('./app'),//引入 app.js 导出的 app 实例
    debug = require('debug')('test:server'),//引入 debug 模块，打印调试日志
    http = require('http'),//引入 http 模块，用以创建 http 服务
    port = process.env.PORT || '3000',//系统环境变量 PORT 如果设置了端口号，就用环境变量设置的，否则使用默认值3000 （PS:process.env.xxx可以读取系统环境变量）
    server = null;

//设置端口号
app.set('port', port);

//创建 http 服务
server = http.createServer(app);

//监听端上面设置的口号
server.listen(port);
//绑定错误事件处理函数
server.on('error', onError);
//绑定监听事件处理函数
server.on('listening', onListening);

//错误事件处理函数
function onError (error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    //对特定的错误类型做友好的处理
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

//监听事件处理函数
function onListening () {
    var addr = server.address(),
        bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;

    debug('Listening on ' + bind);
}

console.info('服务启动成功，请在浏览器访问 http://127.0.0.1:3000');
