import React from 'react'
import {
	View,
	Dimensions,
	ListView,
	Text,
	Image
} from 'react-native'
import {
	FlowList
} from '@components'
// import { logoPlaceholder, imgPlaceholder_wide, imgPlaceholder_square, imgPlaceholder_long } from '@assets';
import {
	logoPlaceholder
} from '../../assets/index'


const width = Dimensions.get('window').width

export default class ListViews extends React.Component {


	constructor(props) {
		super(props);

	}


	render() {
		return (
			<Image
				onLoad={() => {
					// alert('加载成功')
				}}
				resizeMode={'center'}
				defaultSource={require('../../assets/images/icon_qq.png')}
				source={{ uri: 'http://img.zcool.cn/community/0142135541fe180000019ae9b8cf86.jpg@1280w_1l_2o_100sh.png' }}
				style={{ marginLeft: 20, marginTop: 20, marginRight: 20, height: 200 }}>
				{/* <Image source={logoPlaceholder} /> */}
			</Image>
		)
	}


}