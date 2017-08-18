var mongoose = require('mongoose');
var userSchema = require('../schemas/users');
// 模型
module.exports = mongoose.model('User',userSchema);
