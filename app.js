//app.js
var hotapp = require('utils/hotapp.js');
App({

  onLaunch: function() { 
    // Do something initial when launch.
    console.log('onlaunch')
  },
  onShow: function() {
      // Do something when show.
       console.log('onshow')
  },
  onHide: function() {
      // Do something when hide.
       console.log('onhide')
  },
  onError: function(msg) {
    console.log(msg)
     console.log('onerror')
  },
  // getUserInfo:function(cb){
  //   var that = this
  //   if(this.globalData.userInfo){
  //     typeof cb == "function" && cb(this.globalData.userInfo)
  //   }else{
  //     //调用登录接口
  //     wx.login({
  //       success: function () {
  //         wx.getUserInfo({
  //           success: function (res) {
  //             that.globalData.userInfo = res.userInfo
  //             typeof cb == "function" && cb(that.globalData.userInfo)
  //           }
  //         })
  //       }
  //     })
  //   }
  // },
  globalData:{
    userInfo:null,
    searchRsult:null
  }
})