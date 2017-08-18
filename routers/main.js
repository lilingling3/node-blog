var express = require('express');
var router = express.Router();
router.get('/',function (req,res,next) {
    // res.send('main')
    console.log(req.userinfo._id);
    res.render('main/index.html',{
        userinfo:req.userinfo // cookie
    });// render 第二个参数传递模板信息
});

module.exports = router;