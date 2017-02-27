var app = getApp();
var AV = require('../../utils/av-weapp-min.js');
var hotapp = require('../../utils/hotapp.js');
Page({
  data: {
    avatarUrl: "../../images/avatar-default.png",
    isbind: false,
    booksTotal: "-",
    warnTotal: "-",
    current: 0
  },

  //除次加载
  onLoad: function () {
    var that = this;
    const user = AV.User.current();
    if (user) {
      // 已经登录
    }
    else {
      //currentUser 为空时，微信一键登录…
      AV.User.loginWithWeapp().then(user => {
        wx.getUserInfo({
          success: ({userInfo}) => {
            // 更新当前用户的信息
            //头像存储到本地
            wx.setStorage({
              key: "tshz_avatarUrl",
              data: userInfo.avatarUrl
            });
            that.setData({
              avatarUrl: userInfo.avatarUrl
            })
            user.set(userInfo).save().then(user => {
              // 成功，此时可在控制台中看到更新后的用户信息
              app.globalData.user = user.toJSON();
            }).catch(console.error);
          },
          fail:()=>{
             wx.setStorage({
              key: "tshz_avatarUrl",
              data: "../../images/avatar-default.png"
            })
          }
        })
      }).catch(console.error);
    }
  },

  //每一次界面显示
  onShow: function () {
    var that = this;
    that.setData({
      avatarUrl: wx.getStorageSync('tshz_avatarUrl'),
      studentInfoes: wx.getStorageSync('tshz_studentInfoes')
    })
    wx.getStorage({
      key: "tshz_isbind",
      success: function (res) {
        that.setData({
          isbind: res.data
        })
        if (res.data) {
          var cookie = wx.getStorageSync('tshz_cookie')
          that.getBorrowData(cookie)
          that.getExpiredData(cookie)
        }
      }
    })
  },

  //获取借书信息
  getBorrowData: function (cookie) {
    var that = this;
    hotapp.request({
      url: 'http://api.diviniti.cn/jmu/library/borrowed',
      data: { cookie: cookie },
      method: 'GET',
      success: function (res) {
        // success
        if (res.data.status == "success") {

          var booksTotal=res.data.booksTotal;
          var booksList= res.data.booksList;

          for(var i=0;i<booksTotal;i++){
              var expireDate = booksList[i].expireDate.rawValue
              var borrowedDate = booksList[i].borrowedDate.rawValue
              booksList[i].tip =that.dateDiff(expireDate,borrowedDate)
          }

          that.setData({
            booksTotal: res.data.booksTotal,
            booksList: res.data.booksList
          })
        } else {
          wx.showToast({
            title: '数据加载失败',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '数据加载失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete:function(){
        
      }
    })
  },

  //获取催还信息
  getExpiredData: function (cookie) {
    var that = this;
    hotapp.request({
      url: 'http://api.diviniti.cn/jmu/library/expired',
      data: { cookie: cookie },
      method: 'GET',
      success: function (res) {
        // success
        if (res.data.status == "success") {

          var warnList = [];

          var warnTotal = res.data.expiredTotal + res.data.expiringTotal;

          if (res.data.expiredTotal && (!res.data.expiringTotal)) {

            warnList = res.data.expiredBooks;
          }
          if (res.data.expiringTotal && (!res.data.expiredTotal)) {

            warnList = res.data.expiringBooks;
          }
          if ((res.data.expiringTotal) && (res.data.expiredTotal)) {

            warnList = res.data.expiredBooks.connect(res.data.expiringBooks)
          }
          that.setData({
            warnTotal: res.data.expiredTotal + res.data.expiringTotal,
            warnList: warnList
          })
        } else {
          wx.showToast({
            title: '数据加载失败',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '数据加载失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete:function(){
        
      }
    })
  },

  //tab切换
  tabSwitch: function (e) {
    var that = this;
    that.setData({
      current: e.target.dataset.current
    })

  },

  //解绑
  unBind: function () {
    var that = this;
    wx.removeStorageSync('tshz_cookie');
    wx.removeStorageSync('tshz_studentInfoes');
    wx.setStorage({
      key: 'tshz_isbind',
      data: false,
      success: function (res) {
        // success
        that.setData({
          isbind: false
        })
      }
    })

  },

  //计算天数差
  dateDiff: function (expireDate, borrowDate) {
    var aDate, oDate1, oDate2, iDays,tip
    aDate = expireDate.split("-")
    oDate1 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0])
    aDate = borrowDate.split("-")
    oDate2 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0])
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)
    var now = new Date()
  
    var isExpire = parseInt((oDate1-now) / 1000 / 60 / 60 / 24)

    if (isExpire<0){
      return isExpire
    }else{
      return iDays
    }
  },
   onShareAppMessage: function () {
    return {
      title: '图书盒子',
      path: '/pages/index/index'
    }
  }
})
