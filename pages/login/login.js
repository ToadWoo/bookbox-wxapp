var app = getApp();
var AV = require('../../utils/av-weapp-min.js');
var hotapp = require('../../utils/hotapp.js');

Page({
    data: {
        load: false
    },
    onLoad: function (options) {

    },
    formSubmit: function (e) {

        var that = this;

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

        //更改绑定按钮loading状态
        that.setData({
            load: true
        })

        hotapp.request({
            url: 'http://api.diviniti.cn/jmu/library/login',
            data: {
                user: user,
                pwd: pwd
            },
            success: function (res) {
                var cookie = res.data.cookie;
                var studentUser = {
                    cookie: cookie,
                    user: user,
                    pwd: pwd
                }
                //成功后储存cookie
                if (res.data.status == "success") {

                    wx.setStorage({
                        key: "tshz_isbind",
                        data: true
                    })
                    wx.setStorage({
                        key: "tshz_cookie",
                        data: cookie
                    })
                    hotapp.request({
                        url: 'http://api.diviniti.cn/jmu/library/user/info',
                        data: { cookie: cookie },
                        method: 'GET',
                        success: function (res) {
                            // success
                            studentUser.infoes = res.data.infoes;
                            const currentUser = AV.User.current();
                            currentUser.set(studentUser).save();

                            wx.setStorage({
                                key: 'tshz_studentInfoes',
                                data: res.data,
                                success: function () {
                                    wx.navigateBack({
                                        delta: 1
                                    })
                                }
                            })
                        },
                        complete: function () {

                        }
                    })

                } else {
                    wx.showToast({
                        title: '用户名或密码输入有误',
                        icon: 'success',
                        duration: 2000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '网络异常',
                    icon: 'success',
                    duration: 2000
                })
            },
            complete: function () {
                that.setData({
                    load: false
                })
            }
        })



    },
    onShareAppMessage: function () {
        return {
            title: '图书盒子',
            path: '/pages/index/index'
        }
    }
});