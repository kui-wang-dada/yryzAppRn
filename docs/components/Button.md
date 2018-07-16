**Button使用**

 1. 属性
 继承自react-native-elements的button属性，没有this.props.children，暴露了title，textStyle,icon等属性，建议button中间有比较复杂的children时不要使用
 2. 用法
 

``` stylus
				<Button
					style={style.buttonStyle}
					backgroundColor='red'
					icon={{ name: 'cached' }}
					title='BUTTON WITH ICON'>
				</Button>
```


