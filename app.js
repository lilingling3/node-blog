// 加载express 模块
var express = require('express');
//加载模板
var swig = require('swig');
// 创建app应用
var app = express();
//css js image 静态文件托管  用户访问public 下面返回
app.use('/public',express.static(__dirname + '/public'))
//在开发过程中 设置swig页面不缓存
swig.setDefaults({
    cache: false
})
app.set('view cache', false);
// 定义当前使用模板
// 第一模板名称 后缀   第二个参数 解析
app.engine('html',swig.renderFile);
// 定义存放的路径
app.set('views','./views');
// 注册使用的模板引擎
app.set('view engine','html');
app.get('/',function (req,res,next) {
    // res.send('欢迎')
    // 读取views下指定页面
    res.render('index')
});



//监听请求
app.listen(3030,function () {
    console.log('服务开启')
});
//*
// 用户发送http请求 ——> url ——>解析路由 ——>找到匹配的规则 --》执行指定绑定函数，返回对应内容
//  /publi ——》 静态 ——》直接读取指定目录下的文件，返回给用户
//   -》动态 -》处理页面逻辑 处理模板 解析模板
//
// */