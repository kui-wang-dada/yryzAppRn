#悠然一指项目结构文档

为了便于规范化开发，先输出悠然一指项目结构文档，目录结构如下：

```
.
├── App.js                         //APP入口
├── README.md
├── android                        //安卓工程入口
├── app.json    
├── config                         //配置文件目录
├── env.json    
├── index.js
├── ios                            //iOS入口
├── jsconfig.json
├── node_modules  
├── package.json
├── publishandroid.bat
├── publishandroid.sh
├── push.bat
├── rn-cli.config.js
├── src                           //react-native 工程入口
├── syncjs.sh
└── yarn.lock
```


主要开发类都在src中，src结构目录如下：

```
.
├── App.js
├── AppNavigator.js   
├── Main.js
├── assets       //图片资源
│   ├── fonts    //字体图标
│   ├── images   //公共切图
│   └── index.js  
├── components
│   ├── ActionSheet   //弹框
│   ├── Button.js     //Button
│   ├── FlowList.js   //FlatList封装
│   ├── Icon.js       //字体图标组件
│   ├── Image.js      //图片组件
│   ├── ImagePreview.js  //查看大图
│   ├── Input.js         //输入框
│   ├── Loading.js       //加载中动画
│   ├── Message.js      //空页面
│   ├── Rating.js       //⭐️⭐️⭐️⭐️⭐️等级
│   ├── StatusBar.js    //状态栏
│   ├── SvgView         //SVG动画，用于动态引导页
│   ├── SwiperNew       //轮播图
│   ├── Tag.js          //标签
│   ├── TagGroup.js     //标签组
│   ├── Toast           //toast提示
│   ├── Touchable.js    //点击组件封装
│   ├── YModal.js       //Modal组件
│   ├── index.js
│   └── share.js        //分享弹框
├── modules
│   ├── article         //详情
│   ├── demo            //demo
│   ├── home            //首页
│   ├── index.js
│   └── user            //用户
├── services
│   ├── http.js        //http请求方法类
│   ├── index.js
│   ├── modules.js   
│   ├── navigation.js   
│   └── net.js
├── store.js
└── utils
    ├── Validator.js   //验证规则类
    ├── cache.js   //缓存
    ├── commonStyle.js     //通用color、font、space、align
    ├── env.js   
    ├── filter.js  //规则类
    ├── index.js   
    └── resizeImage.js  //图片规则类

```





