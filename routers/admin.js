var express = require('express');
var router = express.Router();
var User = require('../models/Users');
var Category = require('../models/Category');
var Content = require('../models/Content');

router.use(function (req,res,next) {
    //非管理员
    if(!req.userinfo.isAdmin){
        res.send('对不起，只有管理员才可以进入后台管理系统')
        return
    }
    next()
});
// 首页
router.get('/',function (req,res) {
    // res.send('后台管理首页')
    res.render('admin/index',{
        userinfo:req.userinfo
    })
});
// 用户管理
router.get('/user',function (req,res) {
    // 读取数据库中所有用户并展示
    // 分页 limit() 限制显示的条数  skip() 忽略数据的条数
    /*
       每页显示两条    skip = （当前页-1）*limit
       1:1-2  skip:0
       2:3-4  skip:2
    * */

    var page =Number(req.query.page || 1);
    var LIMIT = 2;
    var pages = 0;
    User.count().then((count) => {
        // 异步会出现问题 所以这样写  count 是总条数
        // 计算总页数  有小数 向上取整
        // console.log("count "+ count);
        pages = Math.ceil(count/LIMIT);
        // console.log("pages "+ pages);
        // 当前页不能 大于总页数 不得小于1
        page = Math.min(page,pages);
        page = Math.max(page,1);
        // console.log("page "+page);
        var SKIP = (page -1)*LIMIT;
        User.find().limit(LIMIT).skip(SKIP).then((users) => {
            res.render('admin/user_index',{
                userinfo:req.userinfo,
                users:users,
                page:page, // 当前页
                pages:pages, // 总页数
                count:count, // 总条数
                limit:LIMIT, // 每页显示条数
            })
        });
    });


});
// 分类管理
router.get('/category',function (req,res) {

    var page =Number(req.query.page || 1);
    var LIMIT = 10;
    var pages = 0;
    Category.count().then((count) => {
        // 异步会出现问题 所以这样写  count 是总条数
        // 计算总页数  有小数 向上取整
        // console.log("count "+ count);
        pages = Math.ceil(count/LIMIT);
        // console.log("pages "+ pages);
        // 当前页不能 大于总页数 不得小于1
        page = Math.min(page,pages);
        page = Math.max(page,1);
        // console.log("page "+page);
        /*
        * sort 排序 1 表示正序 -1表示 倒序
        * */
        var SKIP = (page -1)*LIMIT;
        Category.find().sort({_id:-1}).limit(LIMIT).skip(SKIP).then((categories) => {
            res.render('admin/category_index',{
                userinfo:req.userinfo,
                categories:categories,
                page:page, // 当前页
                pages:pages, // 总页数
                count:count, // 总条数
                limit:LIMIT, // 每页显示条数
            })
        });
    });

});
// 添加分类
router.get('/category/add',function (req,res) {
    res.render('admin/category_add',{
        userinfo:req.userinfo,
    })
});

// 分类保存
router.post('/category/add',function (req,res) {
    // console.log(req.body);
    var name = req.body.name || '';
    if(name == ''){
        res.render('admin/error',{
            userinfo:req.userinfo,
            message:'名称不能为空'
        });
        return;
    }
// 查询数据库中 是否有相同的名称
    Category.findOne({
        name:name
    }).then(function (ca) {
        if(ca){
            res.render('admin/error',{
                userinfo:req.userinfo,
                message:'分类已经存在'
            });
            return Promise.reject();
        }else {
        // 数据库中不存在 进行保存
            return new Category({
                name:name
            }).save();
        }
    }).then(function (newCategory) {
        console.log(newCategory);
        // 保存成功之后 会返回一个新数据
        res.render('admin/success',{
            userinfo:req.userinfo,
            message:'分类保存成功',
            url:'/admin/category'
        });
    });

});

// 分类删除
router.get('/category/del',function (req,res) {
    var id = req.query.id;
    Category.remove({
        _id:id
    }).then(function () {
        res.render('admin/success',{
            userinfo:req.userinfo,
            message:'删除成功',
            url:'/admin/category'
        });
    })
});

//分类修改
router.get('/category/edit',function (req,res) {
    // 获取要修改的分类信息，并且用表单的形式展示出来
    var id = req.query.id;
    Category.findOne({
        _id:id
    }).then((category) => {
        console.log(category);
        if(!category){
            res.render('admin/error',{
                userinfo:req.userinfo,
                message:'分类信息不存在'
            });
        }else {
            res.render('admin/category_edit',{
                userinfo:req.userinfo,
                category:category
            });
        }
    })
});
// 修改保存
router.post('/category/edit',function (req,res) {
    var id = req.query.id || '';
    var name = req.body.name || '';
    Category.findOne({
        _id:id
    }).then((category) => {
        // console.log("查询到的"+category);
        if(!category){
            res.render('admin/error',{
                userinfo:req.userinfo,
                message:'分类信息不存在'
            });
            return;
        }else {
        // 用户没有做任何修改
            if(name == category.name){
                res.render('admin/success',{
                    userinfo:req.userinfo,
                    message:'修改成功',
                    url:'/admin/category'
                });
                return Promise.reject();
            }else {
            // 做了修改  判断名称是否在数据库中存在
               return Category.findOne({  // id 不一样 名称一样
                    _id:{$ne:id},
                    name:name
                })
            }

        }
    }).then((same) =>{
        // console.log("same "+same);
        if(same){ // 存在同名
            res.render('admin/error',{
                userinfo:req.userinfo,
                message:'数据库中存在同名分类',
            });
            return Promise.reject();
        }else {
            return Category.update({
                _id:id   // 条件
            },{
                name:name
            })
        }
    }).then(function (newc) {
        // console.log("newc "+newc);
        res.render('admin/success',{
            userinfo:req.userinfo,
            message:'修改成功',
            url:'/admin/category'
        });
    })
});

// 内容管理
router.get('/content',function (req,res) {

    var page =Number(req.query.page || 1);
    var LIMIT = 10;
    var pages = 0;
    Content.count().then((count) => {
        // 异步会出现问题 所以这样写  count 是总条数
        // 计算总页数  有小数 向上取整
        // console.log("count "+ count);
        pages = Math.ceil(count/LIMIT);
        // console.log("pages "+ pages);
        // 当前页不能 大于总页数 不得小于1
        page = Math.min(page,pages);
        page = Math.max(page,1);
        // console.log("page "+page);
        /*
         * sort 排序 1 表示正序 -1表示 倒序
         * populate() 关联的值
         * */
        var SKIP = (page -1)*LIMIT;
        Content.find().limit(LIMIT).skip(SKIP).populate(['category','user']).sort({addTime:-1}).then(function(contents){
            // console.log(contents);
            res.render('admin/content_index',{
                userinfo:req.userinfo,
                contents:contents,
                page:page, // 当前页
                pages:pages, // 总页数
                count:count, // 总条数
                limit:LIMIT, // 每页显示条数
            })
        });
    });

});
router.get('/content/add',function (req,res) {
    Category.find().sort({_id:-1}).then(function (category) {
        res.render('admin/content_add',{
            userinfo:req.userinfo,
            categories:category
        });
    })

});
router.post('/content/add',function (req,res) {
    // console.log(req.body);
    var user = req.userinfo._id.toString();
    var category = req.body.category;
    var title = req.body.title;
    var content = req.body.content;
    var description = req.body.description;
    if(content == '' || title == '' || content == '' || description == '' || category == ''){
        res.render('admin/error',{
            userinfo:req.userinfo,
            message:'填写内容相关不能为空',
        });
    }
//  保存内容 添加新的时候
   new Content({
        content,
        title,
        category,
        description,
        user
    }).save().then(function () {
        res.render('admin/success',{
            userinfo:req.userinfo,
            message:'内容保存成功',
            url:'/admin/content'
        });
    })

});
// 内容修改
router.get('/content/edit',function (req,res) {
    var id = req.query.id || '';
    var categories = []; // 保存查找到的分类
    Category.find().sort({_id:-1})
        .then(function (cs) {
            categories = cs;
            // find 查找结果是一个数组 findOne 是查找到某个
            return Content.findOne({
                _id:id
            }).populate('category')
        }).then(function (content) {
        if(!content){
            res.render('admin/error',{
                userinfo:req.userinfo,
                message:'修改的内容不存在',
            });
        }else {
            // console.log(content);
            res.render('admin/content_edit',{
                userinfo:req.userinfo,
                content:content,
                categories:categories
            });
        }
    });

});
//修改保存
router.post('/content/edit',function (req,res) {
    var id = req.query.id || '';
    var category = req.body.category;
    var title = req.body.title;
    var content = req.body.content;
    var description = req.body.description;
    if(content == '' || title == '' || content == '' || description == '' || category == ''){
        res.render('admin/error',{
            userinfo:req.userinfo,
            message:'填写内容相关不能为空',
        });
        return
    }
    // 保存更新
    Content.update({
        _id:id
    },{
        category,
        title,
        content,
        description
    }).then(function () {
        res.render('admin/success',{
            userinfo:req.userinfo,
            message:'内容修改成功',
            url:'/admin/content/edit?id=' + id
        });
    })

});
// 内容删除
router.get('/content/del',function (req,res) {
    var id = req.query.id;
    Content.remove({
        _id:id
    }).then(function () {
        res.render('admin/success',{
            userinfo:req.userinfo,
            message:'删除成功',
            url:'/admin/content'
        });
    })
});
module.exports = router;