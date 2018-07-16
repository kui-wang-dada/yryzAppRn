**ImagePreview图片预览器文档**

 1. props基本属性
 imageUrls: PropTypes.arrayOf(PropTypes.object), // 图片数据
 onClick: PropTypes.func, // 点击页面方法
 checkQRCode: PropTypes.bool,//是否需要扫描二维码功能
 onQRResponse: PropTypes.func // 扫描二维码完成方法，会返回扫描结果
| ------------------- | ---------------------- |
| imageUrls           |  图片数据               |
| onClick             | func,点击页面方法        |
| checkQRCode         | boolean，图片最大宽度    |
| onQRResponse        | func 扫描二维码完成方法   |
|                     |                        |


 2. 基本用法


``` stylus
<ImagePreview imageUrls={this.imgUrlArr} initialPage={index}
    onClick={(page) => {
        //点击隐藏图片预览
    }}
/>
}
```
