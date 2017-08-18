var mongoose = require('mongoose');
var contentSchema = require('../schemas/contents');
// 模型
module.exports = mongoose.model('Content',contentSchema);
