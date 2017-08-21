// 加载express 模块
var express = require('express');
//加载模板
var swig = require('swig');
// 引入body-parser 用于处理post请求提交的数据
var bodyParser = require('body-parser');
//引入cookie模块
var Cookies = require('cookies');
var User = require('./models/Users');
// 创建app应用
var app = express();
//css js image 静态文件托管  用户访问public 下面返回
app.use('/public',express.static(__dirname + '/public'));
// cookie 设置 使用中间件 任何时候请求
app.use(function (req,res,next) {
    req.cookies = new Cookies(req,res);
    //console.log(req.cookies.get('userinfo')); // 获取 前端发送过来的cookie
    // 保存cookie 全局访问 解析cookie
    req.userinfo = {};
    var userCookie = req.cookies.get('userinfo');
    if(userCookie){
        try {
            req.userinfo =  JSON.parse(userCookie);
        //  获取当前登录用户的类型 是否是管理员
            User.findById(req.userinfo._id)
                .then(userinfo =>{
                    req.userinfo.isAdmin = Boolean(userinfo.isAdmin);
                    next()
            })
        }catch(e) {
            next()
        }

    }else {
        next();
    }

});
//在开发过程中 设置swig页面不缓存
swig.setDefaults({
    cache: false
});
// 配置 bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view cache', false);
// 定义当前使用模板
// 第一模板名称 后缀   第二个参数 解析
app.engine('html',swig.renderFile);
// 定义存放的路径
app.set('views','./views');
// 注册使用的模板引擎
app.set('view engine','html');
// app.get('/',function (req,res,next) {
//     // res.send('欢迎')
//     // 读取views下指定页面
//     res.render('index')
// });
// 根据不同功能划分不同模块
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

// mongoose 连接数据库
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27018/blog',{useMongoClient: true});
var connection=mongoose.connection;
connection.on('error',function(err){
    if(err){
        console.log(err);
    }
});
connection.on('open',function(){
    console.log('opened');
});
//监听请求
app.listen(3030,function () {
    console.log('服务开启 3030')
});
//*
// 用户发送http请求 ——> url ——>解析路由 ——>找到匹配的规则 --》执行指定绑定函数，返回对应内容
//  /publi ——》 静态 ——》直接读取指定目录下的文件，返回给用户
//   -》动态 -》处理页面逻辑 处理模板 解析模板
//
// */