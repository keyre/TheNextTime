//index.js
//获取应用实例
const app = getApp()
let globalData = app.globalData
let typeDes = {
  comf: '舒适度指数',
  cw: '洗车指数',
  drsg: '穿衣指数',
  flu: '感冒指数',
  port: '运动指数',
  trav: '旅游指数',
  uv: '紫外线指数',
  air: '空气污染扩散条件指数',
  ac: '空调开启指数',
  ag: '过敏指数',
  gl: '太阳镜指数',
  mu: '化妆指数',
  airc: '晾晒指数',
  ptfc: '交通指数',
  isin: '钓鱼指数',
  spi: '防晒指数'
}

Page({
  data: {
    basic: {},
    dailyForecast: {},
    lifestyle: {},
    now: {},
    update: {},

    // 是否切换了城市
    cityChanged: false,
    // 需要查询的城市
    longitudeChange: '',
    latitudeChange: '',
  },

  onPullDownRefresh: function() {
    this.getLocation();
    wx.showLoading({
      title: '拼命加载中...客官不要急...',
    })
    wx.stopPullDownRefresh();
  },

  // onLoad: function () {   
  //   this.getLocation();
  // },

  onShow: function() {
    // 判断是否更改城市
    if (!this.data.cityChanged) {
      this.getLocation();
    } else {
      this.latitude = this.data.longitudeChange;
      this.longitude = this.data.latitudeChange;
      this.getNowWeather();

      this.setData({
        cityChanged: false,
        longitudeChange: '',
        latitudeChange: '',
      })
      // 回滚top
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    }
  },
  getLocation: function() {
    wx.getLocation({
      success: (res) => {
        this.latitude = res.latitude;
        this.longitude = res.longitude;
        this.getNowWeather();
      },
      fail: (res) => {
        wx.stopPullDownRefresh()
        let errMsg = res.errMsg || ''
        // 拒绝授权地理位置权限
        if (errMsg.indexOf('deny') !== -1 || errMsg.indexOf('denied') !== -1) {
          wx.showToast({
            title: '需要开启地理位置权限',
            icon: 'none',
            duration: 3000,
            success(res) {
              let timer = setTimeout(() => {
                clearTimeout(timer)
                wx.openSetting({})
              }, 3000)
            },
          })
        } else {
          wx.showToast({
            title: '网络不给力，请稍后再试',
            icon: 'none',
          })
        }


      }
    })
  },


  //天气
  getNowWeather: function() {
    let apiURL = 'https://free-api.heweather.com/s6/weather?' + 'location=' + this.longitude + ',' + this.latitude + '&key=' + globalData.key;
    wx.request({
      url: apiURL,
      success: (res) => {
        // console.log(res);

        wx.hideLoading();

        if (res.data.HeWeather6["0"].status == 'ok') {
          // 生活指数
          let lifestyle = res.data.HeWeather6["0"].lifestyle;
          // 替换和风天气返回的生活指数的type
          for (let i = 0, len = lifestyle.length; i < len; i++) {
            for (let key in typeDes) {
              if (lifestyle[i].type == key) {
                lifestyle[i].type = typeDes[key];
              }
            }
          }
          this.setData({
            // 基础信息
            basic: res.data.HeWeather6["0"].basic,
            // 天气预报
            dailyForecast: res.data.HeWeather6["0"].daily_forecast,
            // 生活指数
            lifestyle: res.data.HeWeather6["0"].lifestyle,
            // 实况天气
            now: res.data.HeWeather6["0"].now,
            // 接口更新时间
            update: res.data.HeWeather6["0"].update
          })
        } else {
          wx.showToast({
            title: '抱歉，返回数据不正常...',
            icon: 'none',
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '抱歉，请求失败了...',
          icon: 'none',
        })
      }
    })
  },

  // 跳转城市
  cityChange: function() {
    wx.navigateTo({
      url: '/pages/cityChange/cityChange'
    })
  },

  goTop: function() {
    // 回滚top
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  }

})