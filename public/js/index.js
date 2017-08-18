$(function () {
    var $loginBox = $('#loginBox');
    var $registerBox = $('#registerBox');
    var $userInfo = $('#userInfo');
    var $logout = $('#logout');
    $loginBox.find('a').on('click',function () {
        $registerBox.show();
        $loginBox.hide();
    });
    $registerBox.find('a').on('click',function () {
        $loginBox.show();
        $registerBox.hide();
    });
    // 用户注册
    $registerBox.find('button').on('click',function () {
        var $regUsername = $registerBox.find('[name="username"]').val();
        var $regPassword = $registerBox.find('[name="password"]').val();
        var $regRePassword = $registerBox.find('[name="repassword"]').val();
        var $colWarning = $registerBox.find('.colWarning');
        // console.log($regUsername + $regPassword+$regRePassword);
        // 通过ajax 提交请求
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:$regUsername,
                password:$regPassword,
                repassword:$regRePassword
            },
            dataType:'json',
            success:function (result) {

                // console.log(data);
                $colWarning.html(result.message)
                // console.log($colWarning);
                if(!result.code){
                    setTimeout(function () {
                        $loginBox.show();
                        $registerBox.hide();

                    },1000)
                    // window.location.reload(); // 重载页面
                }
            }
        })

    });

//  用户登录
    $loginBox.find('button').on('click',function () {
        var $logUsername = $loginBox.find('[name="username"]').val();
        var $logPassword = $loginBox.find('[name="password"]').val();
        var $colWarning = $userInfo.find('.colWarning');
        var $user = $userInfo.find('#user');
        var $info = $userInfo.find('#info');
        console.log($logUsername + '   ' + $logPassword);
        // 通过ajax 提交请求
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$logUsername,
                password:$logPassword
            },
            dataType:'json',
            success:function (result) {
                // console.log(result.message);
                $colWarning.html(result.message);
                if(!result.code){
                    // setTimeout(function () {
                    //     $loginBox.hide();
                    //     $userInfo.show();
                    //     $user.html(result.userinfo.username);
                    //     $info.html('你好，欢迎观看我的博客');
                    // },1000)
                    window.location.reload(); // 重载页面

                }
            }
        })
    })

// 退出登录
    $logout.on('click',function () {
        $.ajax({
            type:'GET',
            url:'/api/user/logout',
            success:function (result) {
               if(!result.code) {
                   window.location.reload(); // 重载页面
               }
            }
        })
    })
});