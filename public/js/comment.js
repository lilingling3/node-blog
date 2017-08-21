var $messageContent = $('#messageContent');
var $messageBtn = $('#messageBtn');
var $contentId = $('#contentId');
var $commentCount= $('#commentCount');
var $messageList= $('.messageList');
var $pager= $('.pager');
// 获得所有数据，前端显示分页
var perpage = 2; // 每页显示2条
var page=1; // 当前页
var pages = 0; // 总页数

var comments = [];  // 使用全局 不用重新发送ajax请求，全局都能访问，不在作为 renderComment 函数的参数
$messageBtn.on('click',function () {
    $.ajax({
        type:'POST',
        url:'/api/comment/post',
        data:{
            contentid:$contentId.val(),
            content:$messageContent.val()
        },
        success:function (resData) {
            $messageContent.val('');
            comments = resData.data.comments.reverse();
            renderComment(); // 反转 保证最新在上面
        }
    })
});
// 页面重载 发送ajax请求 获取所有评论
$.ajax({
    type:'GET',
    url:'/api/comment',
    data:{
        contentid:$contentId.val()
    },
    success:function (resData) {
        comments = resData.data.reverse();
        renderComment(); // 反转 保证最新在上面
    }
});

// 事件委托方式处理上一页 下一页
$pager.delegate('a','click',function (e) {
    // console.log(e.target);
    if($(this).parent().hasClass('pre')){
        page--;
    }else {
        page++;
    }
    renderComment(comments); // 使用全局comments 不用再发ajax 请求
});

// 根据评论内容渲染页面
function renderComment() {
    var commentsLength = comments.length;
    $commentCount.html(commentsLength);
    pages = Math.max(1, Math.ceil(commentsLength / perpage)); // 总页数 = 总数量 / 每页显示多少条
    // 定义循环开始 结束
    var start = Math.max((page-1)*perpage,0);
    var end =Math.min(commentsLength,start + perpage) ;

    var $lis = $('.pager li');
    $lis.eq(1).html(page + '/'+ pages);

    if(page<=1){
        page = 1;
        $lis.eq(0).html('<span>没有上一页</span>')
    }else {
        $lis.eq(0).html('<a href="javascript:;">上一页</a>')
    }
    if(page>=pages){
        page = pages;
        $lis.eq(2).html('<span>没有下一页</span>')
    }else {
        $lis.eq(2).html('<a href="javascript:;">下一页</a>')
    }
    if(commentsLength == 0){
        $messageList.html('<p>还没有评论</p>')
    }else {
        var html = '';
        for(var i=start;i<end;i++){
            html += `<div class="comment">
            <p class="commentSpan"> 
                <span class="fl">${comments[i].username.toString()}</span>
                <span class="fr">${formatDate(comments[i].postTime)}</span>
            </p>
            <p>${comments[i].content}</p>
            </div>`

        }
        $messageList.html(html)
    }

}

// 时间格式化
function formatDate(d) {
    // console.log(typeof d);  string
    var date = new Date(d);
    return date.getFullYear() +'年' + (date.getMonth() +1) + '月' + date.getDate() + '日 '
        + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
}