var hotapp = require('../../utils/hotapp.js');
var AV = require('../../utils/av-weapp-min.js');
var Collection = AV.Object.extend('Collection');


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

    //获取收藏状态
    that.isCollect(param.bookid)

    //获取图书信息
    hotapp.request({
      useProxy: true,
      url: 'http://api.diviniti.cn/jmu/library/book/' + that.data.bookid,
      success: function (res) {
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
              var bookDefault = "https://img3.doubanio.com/f/shire/5522dd1f5b742d1e1394a17f44d590646b63871d/pics/book-default-large.gif";
              var bookImg = res.data.images.large;
              if (bookImg != bookDefault) {
                that.setData({
                  image: res.data.images.large
                })
              }
            },
            complete: function () {

            }
          })
        } else {
          //TODO 无搜索结果
          console.log("没有结果")
        }
      },
      complete: function () {

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

  //获取是否收藏
  isCollect: function (bookid) {
    return AV.Promise.resolve(AV.User.current()).then(user =>
      user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    ).then(user =>
      user ? user : AV.User.loginWithWeapp()
      ).then((user) => {
        console.log('uid', user.id);
        return new AV.Query('Collection')
          .equalTo('owner', AV.Object.createWithoutData('User', user.id))
          .equalTo('bookid', bookid)
          .descending('createdAt')
          .find()
          .then(this.setIsCollect)
      }).catch(error => console.error(error.message));
  },

  //储存收藏状态
  setIsCollect: function (res) {
    var that = this;
    if (res.length) {
      that.setData({
        isCollect: true
      })
    } else {
      that.setData({
        isCollect: false
      })

    }
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
  },

  //收藏事件
  collectBook: function () {
    var that = this;

    var currentUser = AV.User.current();
    var collection = new Collection();

    var item = {
      'bookid': that.data.bookid,
      'name': that.data.name,
      'author': that.data.author,
      'location': that.data.infoes[0].location,
      'callNumber': that.data.infoes[0].callNumber,
      'publisher': that.data.publisher,
      'total': that.data.total,
      'available': that.data.available,
      'image': that.data.image,
      'owner': currentUser

    }
    collection.set(item).save().then(function () {
      //  收藏成功
      that.setData({
        isCollect: true
      })

      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        duration: 1000
      })
    }, function (error) {
      //
    });
  },
  //取消收藏
  cancelCollect: function () {
    var that = this;
    var currentUser = AV.User.current();
    return new AV.Query('Collection')
      .equalTo('bookid', this.data.bookid)
      .equalTo('owner', AV.Object.createWithoutData('User', currentUser.id))
      .find()
      .then(function (todos) {
        return AV.Object.destroyAll(todos);
      }).then(function (todos) {
        // 取消成功
        that.setData({
          isCollect: false
        })

        wx.showToast({
          title: '取消收藏',
          icon: 'success',
          duration: 1000
        })
      }, function (error) {
        // 异常处理
      });

  },
    onShareAppMessage: function () {
    return {
      title: this.data.name,
      path: '/pages/detail/detail?bookid='+this.data.bookid+'&publisher='+this.data.publisher+'&total='+this.data.total+'&available='+this.data.available
    }
  }


})