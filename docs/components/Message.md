**Message页面文档**

 1. 基本属性props


| preset | 固定的类型，有多种                                    |
| ------ | -------------------------------------------------- |
| icon   | 在type不存在是可自定义图片                             |
| text   | 在type存在情况下为‘内容还在筹备中’，无type可自定         |
| action | 在type不存在的情况下，可定义一个button事件         |
|        |                                                    |
|        |                                                    |

 2. 用法


``` stylus
<Message icon={noDataIcon} text={'TA还没有关注写手'} />
```
或者

使用固定的类型，preset有一下几种类型:
request-success //请求成功
request-failed //请求失败
no-favorite //没有收藏
no-search-result //搜索内容为空
no-network //请无网络
no-data //没数据
no-page //页面404
please-wait //内容筹备中
使用方法如下:
``` stylus
 <Message preset="no-data" />;
```
