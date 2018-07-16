# actionSheet使用文档

 **1. 样式**

底部弹框的一种，从下至上弹出，会有多个按钮选择：

 
 **2. 用法**

使用时需要调用utils中的modal方法，如下：

``` stylus
getActionSheet = () => {
		const options = ['回复', '举报', '取消']
		let component = (
			<ActionSheet
				cancelButtonIndex
				callback={this.cbActionSheet}
				options={options} />)
		modal.show(component)
	}
```

 **3. props 基本属性**
 cancelButtonIndex:取消按钮
 options:弹出内容
 callback:点击后的回调事件，默认含有index参数

 **4. 基本原理**

 
 - 一个flatlist，渲染多个button
 - 与外层YModal联合使用，YModal挂载在入口，通过utils中的modal方法初始化和调用

 
 

