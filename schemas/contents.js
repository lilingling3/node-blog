var mongoose = require('mongoose');
//定义内容表结构
module.exports = new mongoose.Schema({
    //关联字段  分类的id
    category:{
        type:mongoose.Schema.Types.ObjectId, //类型是 ObjectId
        rel:'Category' // 定义引用 content
        // 跟模型module.exports = mongoose.model('Category',categorySchema);一一对应
    },
    title:String,
    description:{
        type:String,
        default:''
    },
    content:{
        type:String,
        default:''
    }
});
