//cityChange.js
//获取应用实例
const app = getApp()
let globalData = app.globalData

Page({
  data: {
    inputValue: '',
    cities: [],
  },
  
  //输入框绑定事件
  bindKeyInput: function (e) {
    this.inputValue = e.detail.value;
    
    this.setData({
      inputValue: this.inputValue
    })

    if (this.inputValue != ''){
      this.getCity();
    }
    // console.log(this.inputValue);  
  },

  //查询城市
  getCity: function() {
    let cityURL = 'https://search.heweather.com/find?location=' + this.inputValue + '&key=' + globalData.key + '&group=cn';
    wx.request({
      url: cityURL,
      success: (res) => {
        if (res.data.HeWeather6["0"].status == 'ok'){
          // console.log(res);
          this.setData({
            cities: res.data.HeWeather6["0"].basic
          })
        } else {
          wx.showToast({
            title: '抱歉，关键字输入有问题...',
            icon: 'none',
          })
        }
      }
    })
  },

  //城市点击事件
  choose: function (e) {
    let item = e.currentTarget.dataset.item;

    // 使用 getCurrentPages 获取页面堆栈，修改首页数据
    let pages = getCurrentPages();
    let len = pages.length;
    console.log(len)
    let indexPage = pages[len - 2];
    indexPage.setData({
      // 是否切换了城市
      cityChanged: true,
      // 需要查询的城市
      longitudeChange: item.lon,
      latitudeChange: item.lat,     
    })
    wx.navigateBack({});

    // console.log(item)
  },


})