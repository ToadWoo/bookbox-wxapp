var hotapp = require('../../utils/hotapp.js');
var app = getApp();
Page({
  data: {
    current: 0,//swiper组件当前所在页面的 index
    image: "../../images/bookmodle.png"//默认封面
    // bookid: null,
    // name: null,
    // publishe: null,
    // total: null,
    // available: null,
    // author: null,
    // intro: null,
    // ISBN: null,
    // infoes: []
  },
  // 页面初始化
  onLoad: function (param) {
    this.setData({
      bookid: param.bookid,
      publisher: param.publisher,
      total: param.total,
      available: param.available
    })
    var that = this;

    hotapp.request({
      useProxy: true,
      url: 'http://api.diviniti.cn/jmu/library/book/' + that.data.bookid,
      success: function (res) {
        console.log(res.data)

        if (res.data.status == "success") {
          that.setData({
            name: res.data.name,
            author: res.data.author,
            intro: res.data.intro,
            ISBN: res.data.ISBN,
            infoes: res.data.infoes
          })
          hotapp.request({
            url: 'https://api.douban.com/v2/book/isbn/' + res.data.ISBN,
            success: function (res) {
              console.log(res.data.images.large);
              var bookDefault = "https://img3.doubanio.com/f/shire/5522dd1f5b742d1e1394a17f44d590646b63871d/pics/book-default-large.gif";
              var bookImg = res.data.images.large;
              if (bookImg != bookDefault) {
                that.setData({
                  image: res.data.images.large
                })
              }

            }
          })
        } else {
          //TODO 无搜索结果
          console.log("没有结果")
        }
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          swiperHeight: res.windowHeight - (422 * res.windowWidth / 750),//窗口高度(px)-搜索模块高度(px)
        })
      }
    })

  },
  //swiper滑动切换是触发的函数
  swiperChange: function (e) {
    this.setData({
      current: e.detail.current
    })

  },
  //tab点击切换
  changeSwiperPage: function (e) {
    this.setData({
      current: e.target.dataset.current
    })
  }


})