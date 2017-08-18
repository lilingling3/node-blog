var mongoose = require('mongoose');
var categorySchema = require('../schemas/categories');
// 模型
module.exports = mongoose.model('Category',categorySchema);
