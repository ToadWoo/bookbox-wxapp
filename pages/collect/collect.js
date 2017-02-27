var app = getApp();
var AV = require('../../utils/av-weapp-min.js');
Page({
  data: {

  },
  onLoad: function () {

  },
  //登录并获取收藏书目
  loginAndFetchCollection: function () {
    return AV.Promise.resolve(AV.User.current()).then(user =>
      user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    ).then(user =>
      user ? user : AV.User.loginWithWeapp()
      ).then((user) => {
        console.log('uid', user.id);
        return new AV.Query('Collection')
          .equalTo('owner', AV.Object.createWithoutData('User', user.id))
          .descending('createdAt')
          .find()
          .then(this.setCollection)
      }).catch(error => console.error(error.message));
  },
  onPullDownRefresh: function () {
    this.loginAndFetchCollection().then(wx.stopPullDownRefresh);
  },

  //获得的书目储存到数据层
  setCollection: function (res) {
    var collectList = []
    for (var i = 0; i < res.length; i++) {
      collectList.push(res[i].attributes)
    }
    this.setData({
      collectList: collectList
    })
  },

  onShow: function () {
    this.loginAndFetchCollection()
  },
  onShareAppMessage: function () {
    return {
      title: '图书盒子',
      path: '/pages/index/index'
    }
  }

})
