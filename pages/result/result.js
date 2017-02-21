var hotapp = require('../../utils/hotapp.js');
var app = getApp();
// 注册当页全局变量，存放搜索结果以便更新到data中
var curBooksList = [];
Page({
  data: {
    booksList: [],
    keyword: null,
    pageCurrent: null,
    pagesTotal: null,
    scrollHeight: null,//滚动区域高度
    cancel: true,  //是否显示输入框清除按钮
    dropLoadFunc: "dropLoad"
    // animationData: {}
  },

  // 页面初始化
  onLoad: function (param) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - (104 * res.windowWidth / 750),//窗口高度(px)-搜索模块高度(px)
        })
      }
    })
    that.setData({
      keyword: param.keyword,
    })
    var result = app.globalData.searchResult
    curBooksList = result.booksList
    // 有搜索结果
    if (result.status == "success") {
      // 更新数据
      that.setData({
        status: "success",
        booksList: result.booksList,
        pageCurrent: result.pageCurrent,
        pagesTotal: result.pagesTotal
      })
    } else {
      // 无搜索结果
      that.setData({
        status: "fail",
      })
    }

  },
  //搜索按钮事件
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
  //回车事件
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

  // 搜索
  search: function (keyword) {
    var that = this;
    //清空上次搜索的结果
    curBooksList = [];

    that.setData({
      keyword: keyword,
    })

    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })

    hotapp.request({
      url: 'http://api.diviniti.cn/jmu/library/search/' + keyword + '/page/1/count/20',
      success: function (res) {
        // 请求成功隐藏加载中的提示
        wx.hideToast()

        if (res.data.status == "success") {
          curBooksList = res.data.booksList;
          
          that.setData({
            status: "success",
            booksList: res.data.booksList,
            pageCurrent: res.data.pageCurrent,
            pagesTotal: res.data.pagesTotal,
            scrollTop: "0"
          })

          console.log("booksList"+that.data.booksList)
        } else {
          // 无搜索结果
          that.setData({
            status: "fail",
          })
        }
      }
    })
  },

  // 上拉加载
  dropLoad: function () {

    var that = this;
    if (this.data.pageCurrent < this.data.pagesTotal) {
      //锁定上拉加载
      that.setData({
        dropLoadFunc: null
      })
      that.loadMore();

    }
  },

  //加载更多
  loadMore: function () {

    var that = this;
    var page = parseInt(that.data.pageCurrent) + 1;

    hotapp.request({
      url: 'http://api.diviniti.cn/jmu/library/search/' + that.data.keyword + '/page/' + page + '/count/20',
      success: function (res) {
        
        if (res.data.status == "success") {
          // 更新数据
          curBooksList = curBooksList.concat(res.data.booksList)
          that.setData({
            booksList: curBooksList,
            pageCurrent: res.data.pageCurrent
          })
        } else {
          // 无搜索结果
          console.log("没有结果")
        }
      },
      complete:function(){
        //启动上拉加载
        that.setData({
          dropLoadFunc: "dropLoad"
        })
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

    this.setData({
      keyword: null,
      cancel: false,
      focus: true
    })
  },
  // 分享搜索结果
  onShareAppMessage: function () {
    return {
      title: '自定义分享标题',
      desc: '自定义分享描述',
      path: '/pages/result'
    }
  }
})