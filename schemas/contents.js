var mongoose = require('mongoose');
//定义内容表结构
module.exports = new mongoose.Schema({
    //关联字段  分类的id
    category:{
        type:mongoose.Schema.Types.ObjectId, //类型是 ObjectId
        ref:'Category' // 定义引用 content
        // 跟模型module.exports = mongoose.model('Category',categorySchema);一一对应
    // mongoose 通过 ref populate 关联字段
    },
    // 关联用户表
    user:{
        type:mongoose.Schema.Types.ObjectId, //类型是 ObjectId
        ref:'User'
    },
    title:String,
    // 添加时间
    addTime:{
        type:Date,
        default:new Date()
    },
    description:{
        type:String,
        default:''
    },
    // 阅读量
    views:{
        type:Number,
        default:0
    },
    content:{
        type:String,
        default:''
    },
    // 存储 评论
    comments:{
        type:Array,
        default:[]
    },
});
