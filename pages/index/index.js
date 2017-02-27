//index.js
var hotapp = require('../../utils/hotapp.js');
//获取应用实例
var app = getApp();
Page({
  data: {
    cancel: false,
    inputValue: null,
    focus: false
  },

  formSubmit: function (e) {
    var that = this;
    var keyword = null;
    if (e.detail.value.book) {
      keyword = e.detail.value.book;
      that.search(keyword);
    } else {
      wx.showToast({
        title: '您没有输入哦',
        icon: 'success',
        duration: 10000
      })
      setTimeout(function () {
        wx.hideToast()
      }, 1000)
      return false;
    }
  },

  enterSubmit: function (e) {
    var that = this;
    var keyword = null;
    if (e.detail.value) {
      keyword = e.detail.value;
      that.search(keyword);
    } else {
      wx.showToast({
        title: '您没有输入哦',
        icon: 'success',
        duration: 10000
      })
      setTimeout(function () {
        wx.hideToast()
      }, 1000)
      return false;
    }
  },

  search: function (keyword) {
    wx.showToast({
      title: '搜索中',
      icon: 'loading',
      duration: 10000
    })

    hotapp.request({
      url: 'http://api.diviniti.cn/jmu/library/search/' + keyword + '/page/1/count/20',
      success: function (res) {
        wx.hideToast()
        app.globalData.searchResult = res.data;

        wx.navigateTo({
          url: '../result/result?keyword=' + keyword
        })
      },
      fail: function () {
        wx.showToast({
          title: '连接失败',
          icon: 'success',
          duration: 5000
        })
        setTimeout(function () {
          wx.hideToast()
        }, 2000)
      },
      complete: function () {

      }
    })
  },

  //input清除按钮显示
  typeIng: function (e) {
    var that = this;
    if (e.detail.value) {
      that.setData({
        cancel: true
      })
    } else {
      that.setData({
        cancel: false
      })
    }
  },
  //清除输入框
  clearInput: function () {
    console.log(1)
    this.setData({
      inputValue: null,
      cancel: false,
      focus: true
    })
  },
  onShareAppMessage: function () {
    return {
      title: '图书盒子',
      path: '/pages/index/index'
    }
  }


})
