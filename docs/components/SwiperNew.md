**轮播图组件**

 **1. 样式**
 *整屏轮播图，
 *类似于微信读书首页样式，
 *用户可以通过滑动来获取不同的板块，
 *理论上如果用户愿意，可以一直滑动下去
 **2. 用法**

``` stylus
<SwiperNew
	navigation={this.props.navigation}
	getArticleList={this.getArticleList}
	ref={ref => this.swiperNew = ref}
>
	{this.renderBlockItem()}

</SwiperNew>
```
中间是需要渲染的内容

 **3. props基本属性**
 *getArticleList：加载更多内容的回调函数
 *
 **4. 基本原理**
 *android使用ViewPageAndroid实现
 *ios使用ScrollView实现

