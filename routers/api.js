var express = require('express');
var User = require('../models/Users');
var Content = require('../models/Content');
var router = express.Router();
// 统一返回格式
var responseData;
router.use(function (req,res,next) {
    responseData = {
        code:0,
        message:''
    };
    next()
});
// 路由注册
// 用户注册
/*1.用户名不得为空，
 2，密码不得为空，
 3，密码是否一致
 4，用户名是否已经注册

* */
router.post('/user/register',function (req,res,next) {
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    // 用户名不得为空
    if(username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    // 密码不得为空
    if(password == ''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    // 两次输入密码不一致
    if(password != repassword){
        responseData.code = 3;
        responseData.message = '两次输入密码不一致';
        res.json(responseData);
        return;
    }
    // 查询数据库   返回的是promise 对象
    User.findOne({
        username:username
    }).then(function (userinfo) {
        if(userinfo){
            responseData.code = 4;
            responseData.message = '用户名已经被注册了';
            res.json(responseData);
            return ;
        }
        // 保存用户信息 保存数据库
        var user = new User({
            username:username,
            password:password
        }); // 操作对象 操作数据库
        return user.save(); // 返回 prormise 方法
    }).then(function (newUserInfo) {
        console.log(newUserInfo);
        responseData.message = '注册成功';
        res.json(responseData);
    });


});


router.post('/user/login',function (req,res) {
    var username = req.body.username;
    var password = req.body.password;
    if(username == '' || password == ''){
        responseData.code = 1;
        responseData.message = '用户名或者密码不得为空';
        res.json(responseData);
        return;
    }

// 查询数据库 用户名 密码是否一致
    User.findOne({
        username:username,
        password:password
    }).then(function (userInfo) {
        if(!userInfo){
            responseData.code = 2;
            responseData.message = '用户名或者密码错误';
            res.json(responseData);
            return;
        }
        responseData.message = '登录成功';
        responseData.userinfo = {
            _id:userInfo.id,
            username:userInfo.username
        };
        req.cookies.set('userinfo',JSON.stringify({
            _id:userInfo.id,
            username:userInfo.username
        }));
        res.json(responseData);
        return;
    })

});
// 退出
router.get('/user/logout',function (req,res) {
    console.log('lllll');
    req.cookies.set('userinfo',null);
    res.json(responseData);
});

// 留言提交
router.post('/comment/post',function (req,res) {
    var contentId = req.body.contentid;
    var postData = {
        username:req.userinfo.username,
        postTime:new Date(),
        content:req.body.content,
    };
    Content.findOne({
        _id:contentId
    }).then(function (content) {
        content.comments.push(postData);
        return content.save();
    }).then(function (newContent) {
        responseData.message = '评论成功';
        responseData.data = newContent;
        res.json(responseData);
    })
});
// 获取指定文章 的所有评论
router.get('/comment',function (req,res) {
    var contentId = req.query.contentid;
    Content.findOne({
        _id:contentId
    }).then(function (content) {
        responseData.data = content.comments;
        res.json(responseData);
    })
});
module.exports = router;