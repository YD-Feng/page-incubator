var express = require('express'),
    path = require('path'),
    morgan = require('morgan'),
    favicon = require('serve-favicon'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    routes = require('./routes/main'),
    mysql = require('mysql'),
    dataBaseConfig = require('./config/dataBase'),
    session = require('express-session'),
    SessionStore = require('express-mysql-session'),
    log4js = require('log4js'),
    validateEngine = require('./validate/validateEngine'),

    //生成一个 SessionStore 实例
    sessionStore = new SessionStore({
        host: dataBaseConfig.host,
        port: dataBaseConfig.port,
        user: dataBaseConfig.user,
        password: dataBaseConfig.password,
        database: dataBaseConfig.database,
        schema: {
            tableName: 'session',
            columnNames: {
                session_id: 'id',
                expires: 'expires',
                data: 'data'
            }
        }
    }, mysql.createConnection(dataBaseConfig)),

    //生成一个 express 实例
    app = express();


//开发日志相关配置
log4js.configure({
    appenders: {
        dateFile: {
            type: 'dateFile',
            filename: 'logs/logInfo.log',
            pattern: '.yyyy-MM-dd',
            alwaysIncludePattern: true,
            layout: {
                type: 'pattern',
                pattern: '[%d] [%p] %m%n'
            },
            daysToKeep: 30
        }
    },
    categories: {
        default: {
            appenders: ['dateFile'],
            level: 'info'
        }
    },
    pm2: true,
    replaceConsole: true
});
var logger = log4js.getLogger();

//控制台输出系统日志
app.use(morgan('dev'));
//指定 web 应用的标题栏小图标的路径为：/static/favicon.ico
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
//加载解析 json 的中间件
app.use(bodyParser.json());
//加载解析 urlencoded 请求体的中间件
app.use(bodyParser.urlencoded({
    extended: false
}));
//加载解析 cookie 的中间件
app.use(cookieParser());
//设置 static 文件夹为存放静态文件的目录
app.use(express.static(path.join(__dirname, 'static/dist')));
//加载解析 session 的中间件
app.use(session({
    key: dataBaseConfig.sessionKey,
    secret: dataBaseConfig.sessionSecret,
    cookie: {
        maxAge: 6 * 60 * 60 * 1000
    },
    store: sessionStore,
    rolling: true,
    resave: false,
    saveUninitialized: false
}));

app.use(validateEngine());

//配置路由
routes(app, logger);

//捕获404错误，并转发到错误处理器
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//错误处理器
app.use(function (err, req, res, next) {
    logger.error(err);
    res.status(err.status || 500);
    res.send(err.status, {
        code: err.status || 500,
        msg: err.message
    });
});

//导出 app 实例供其他模块调用
module.exports = app;
