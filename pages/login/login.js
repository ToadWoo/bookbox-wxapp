Page({
    data: {
    },
    onLoad: function (options) {
        //发送异步请求，请求参数中包含app.js中的返回结果
        console.log("testonload")
    },
    formSubmit: function (e) {
        //todo 表单验证
        var user = e.detail.value.user;
        var pwd = e.detail.value.password;

        if (!user || !pwd) {
            wx.showModal({
                title: '提示',
                content: '学号及密码不能为空哦！',
                showCancel: false,
                confirmColor: '#338FFC',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return false;
        }
        console.log(user, pwd)

        wx.request({
            url: 'http://api.diviniti.cn/jmu/library/login',
            data: {
                user: user,
                pwd: pwd
            },
            success: function (res) {
                // success
                console.log(res.data)
                var cookie = res.data.cookie;
                wx.request({
                    url: 'http://api.diviniti.cn/jmu/library/user/info',
                    data: {
                        cookie:cookie
                    },
                    success: function (res) {
                        // success
                        console.log(res.data)
                    }
                })
            }
        })



    }
});