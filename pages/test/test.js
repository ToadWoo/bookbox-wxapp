Page({
  data:{
  },
  onLoad:function(options){
    //发送异步请求，请求参数中包含app.js中的返回结果
    console.log("testonload")
  },
  onReady:function(){
    // 页面渲染完成
    console.log("testonready")
  },
  onShow:function(){
    // 页面显示
    console.log("testonshow")
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
});