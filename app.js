//app.js
var AV = require('utils/av-weapp-min.js');
var hotapp = require('utils/hotapp.js');
AV.init({
  appId: 'gP7vju3g5dXbQyHXbLlKX4v5-gzGzoHsz',
  appKey: 'qgOtTnc2CD53LtFDiY2SL4JC',
});
App({
  onLaunch: function () {
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
            })
            user.set(userInfo).save().then(user => {
              // 成功，此时可在控制台中看到更新后的用户信息
              that.globalData.user = user.toJSON();
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
  onError: function (msg) {
    console.log(msg)
    console.log('onerror')
  },
  globalData: {
    user: null,
    searchRsult: null
  }
})