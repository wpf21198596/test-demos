var loginFlag=false;
$(function () {

    var nav="<nav class=\"navbar navbar-inverse navbar-static-top\"><div class=\"container-fluid\">\n" +
        "        <!-- Brand and toggle get grouped for better mobile display -->\n" +
        "        <div class=\"navbar-header\">\n" +
        "            <a class=\"navbar-brand\" href='/'>飞狐电商平台</a>\n" +
        "        </div>\n" +
        "        <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n" +
        "            <ul class=\"nav navbar-nav navbar-right\" id=\"loginInfo\">\n" +
        "                <li class=\"active\"><a href=\"/login.html\">登陆</a></li>\n" +
        "            </ul>\n" +
        "            <ul class=\"nav navbar-nav navbar-right\" id=\"lis\">" +
        "                <li class=\"active\"><a href=\"/cart.html\">购物车</a></li>\n" +
        "            </ul>\n" +
        "        </div><!-- /.navbar-collapse -->\n" +
        "    </div></nav>";

    $("#navDiv").html(nav);

    $.ajaxSetup({
        beforeSend:function(xhr){
            var v_auth=$.cookie("fh_token");
            xhr.setRequestHeader("x-auth",v_auth);
        }
    })

    $.ajax({
        url:"http://localhost:8082/members",
        type:"get",
        async:false,
        success:function (res) {
            var v_user=res.data;
            if(res.code==200){
                loginFlag=true;
                var v_ccc='<li><a>欢迎'+v_user.realName+'登陆</a></li>'+
                    '<li class="active"><a href="#" onclick="loginOut()">退出</a></li>';
                $("#loginInfo").html(v_ccc);
            }
        }
    })




})
function loginOut() {
    $.ajax({
        url:"http://localhost:8082/members/loginOut",
        type:"get",
        dataType:"json",
        success:function (res) {
            if(res.code==200){
                $.removeCookie("fh_token");
                location.reload();
            }else {
                alert(res.msg);
            }
        }
    })
}
function addCart(id,flag,action){
    if(!loginFlag){
        var dialog = bootbox.dialog({
            message: '<form>\n' +
            '    账号：<input type="text" id="membersName">\n' +
            '    密码：<input type="password" id="password">\n' +
            '    <input type="button" value="登录" onclick="login('+id+')">\n' +
            '    <input type="reset">\n' +
            '</form>',
            title: "<h1 align='center'>登录</h1>",
            backdrop:false,
        });
    }else {
        var param = {};
        if(action==1){
            param.count = -1;
        }else{
            param.count = 1;
        }
        param.shopId = id;
        $.ajax({
            url: "http://localhost:8082/carts",
            type: "post",
            data: param,
            dataType: "json",
            success: function (res) {
                if (res.code == 200) {
                    if (flag == 1) {
                        initList();
                    } else {
                        location.href = "/cart.html";
                    }
                } else {
                    alert(res.msg);
                }
            }
        })
    }
}