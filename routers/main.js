var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');
var data;
//处理通用数据
router.use(function (req,res,next) {
    data = {
        userinfo: req.userinfo,
        categories: [],
    };
    // 读取所有分类信息
    Category.find().then(function (categories) {
        data.categories = categories;
        next();
    })
});
// 首页
router.get('/',function (req,res) {
    // 不能重新赋值给一个新对象
    // data = {
    //     count:0,
    //     page: Number(req.query.page || 1), // get 方式 分页
    //     category: req.query.category || '', //  按照分类进行展示
    //     pages: 0,
    //     limit: 2,
    //     contents:''
    // };

    data.count = 0;
    data.pages = 0;
    data.category = req.query.category || '';
    data.page = Number(req.query.page || 1);
    data.limit = 2;
    data.contents = '';
    // 声明要查找的分类
    var findCategory = {};
    if(data.category){
        findCategory.category = data.category;
    }
    // 读取所有分类信息
     Content.where(findCategory).count()// 返回总数  根据查询条件返回总条数
        .then(function (count) {
            data.count = count;
            data.pages = Math.ceil(data.count/data.limit);
            data.page = Math.min(data.page,data.pages);
            data.page = Math.max(data.page,1);
            var SKIP = (data.page -1)*data.limit;
            // where 根据查找条件 进行查找
            return Content.where(findCategory).find().limit(data.limit).skip(SKIP).populate(['category','user'])
                .sort({addTime:-1})
    }).then(function (contents) {
        data.contents = contents;
        // console.log(data);
        res.render('main/index', data);
    })
});
// 阅读全文
router.get('/views',function (req,res) {
    var contentId = req.query.contentid || '';
    // console.log("contentid  "+contentId);
    Content.findOne({
        _id:contentId
    }).then(function (content) {
        // console.log(content);
        data.content = content;
        // 处理阅读数 每当用户 读的时候 同时修改数据库
        content.views ++;
        content.save();
        res.render('main/view',data)
    })
});
module.exports = router;