import React from 'react';
import {
	Button,
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	ScrollView,
	FlatList,
	Touchable,
	CheckBox,
	Toast,
	Platform,
	Alert } from '@components';
import { transformSize, commonStyle } from '@utils'
import { http } from "@services";
import { connect } from 'react-redux';
import { getInterestList } from './service/request';
import { chooseInterest} from './transition.action';
import { isIphoneX } from '@utils';
import { saveUserInterests } from '@modules/login/services/LoginPrenster';

@connect()
export default class ChooseInterest extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			classifys: [],
			isCheck: {},
		}
	}
	render() {
		let { classifys } = this.state;
		return (
			<View style={style.wrap}>
				<View style={style.header}>
					<Touchable
						type="opacity"
						onPress={this.handlePass}
						style={style.passBtn}>
						<Text style={style.passBtnText}>跳过</Text>
					</Touchable>
				</View>
				<Text style={style.h1}>选择你的标签</Text>
				<ScrollView>
					<View style={style.classifysWrap}>
						{classifys.map(this.tagItem)}
					</View>
				</ScrollView>
				<View style={style.submitWrap}>
					{/* <Button
						onPress={this.getclassify}
						style={style.changeData}
						icon='change'
						textStyle={style.changeText}
						iconColor={commonStyle.fontColor_assist_content}
						title='换一批'
					/> */}
					<Button
						onPress={this.handlesubmit}
						style={style.submit}
						title='选好了，开启寻找APP之旅'
					/>
				</View>
			</View>
		)
	}

	componentDidMount() {
		this.getclassify();
	}

	getclassify =  async () => {
		const res = await getInterestList();
		let classifys = res.data.data;
		if (classifys) {
			this.setState({classifys})
		}
	}

	tagItem = (item, index) => {
		return (
			<Touchable
				type="opacity"
				key={item.kid}
				onPress={() => this.handleChooseTag(item, index)}
				style={ [style.classify, this.state.isCheck[item.kid] ? style.chooseClassify : null]  }>
				<Text style={[ style.classifyText, this.state.isCheck[item.kid] ? style.chooseText : null]}>{item.labelName}</Text>
			</Touchable>
		)
	}

	handlePass = () => {
		this.props.onPressPass();
	}

	handleChooseTag = (item, index) => {
		let { isCheck } = this.state;		// 选择
		if (!isCheck[item.kid]) {
			isCheck[item.kid] = item
		} else {
			isCheck[item.kid] = !isCheck[item.kid];
		}
		// isCheck[item.kid] = !isCheck[item.kid];
		this.setState({ isCheck });
	}

	handlesubmit = async () => {
		let { isCheck } = this.state;
		let checkItems = [];

		for (let key in isCheck) {
			let item = isCheck[key];
			if (item)
				checkItems.push(item);
		}
		let _checkItems = checkItems.length;
		if (!_checkItems) {
			return Alert.alert( '', '请选择要关注的标签~' );
		}
		this.props.onPressSubmit();
		this.props.dispatch(chooseInterest(checkItems))
		saveUserInterests()
	}
}

const style = StyleSheet.create({
	header: {
		height: isIphoneX() ? transformSize(200) : transformSize(144),
	},
	passBtn: {
		width: transformSize(270),
		backgroundColor: 'transparent',
		position: 'absolute',
		top: isIphoneX() ? transformSize(90) : (Platform.OS === 'android' ? transformSize(36) : transformSize(66)),
		right: transformSize(30),
		elevation: 0,
	},
	passBtnText: {
		flex: 1,
		textAlign: 'right',
		color: commonStyle.fontColor_assist_content,
		fontSize: transformSize(30),
	},
	wrap: {
		flex: 1,
		backgroundColor: '#fff',
		minHeight: '100%',
	},
	h1: {
		// fontWeight: 'bold',
		color: 'black',
		// marginTop: transformSize(52),
		marginBottom: transformSize(50),
		fontSize: transformSize(48),
		textAlign: 'center',
	},
	classifysWrap: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginHorizontal: transformSize(60),
		marginTop: transformSize(50),
	},
	classify: {
		alignItems: 'center',
		justifyContent: 'center',
		width: transformSize(180),
		marginHorizontal: transformSize(15),
		height: transformSize(58),
		marginBottom: transformSize(40),
		backgroundColor: commonStyle.color_background,
		borderRadius: transformSize(60),
	},
	chooseClassify: {
		backgroundColor: '#8c5bf9',
	},
	classifyText: {
		fontSize: transformSize(30),
		color: '#333',
		textAlign: 'center',
		backgroundColor: 'transparent',
	},
	chooseText: {
		color: '#fff'
	},
	submitWrap: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: transformSize(100),
	},
	changeData: {
		marginTop: transformSize(110),
		marginBottom:  transformSize(52),
		backgroundColor: 'transparent',
		color: commonStyle.fontColor_assist_content,
		fontSize: transformSize(28),
	},
	changeText: {
		color: commonStyle.fontColor_assist_content,
		fontSize: transformSize(28),
		marginVertical: 0,
	},
	submit: {
		width: '100%',
		marginTop: transformSize(50),
		marginBottom: isIphoneX() ? transformSize(243): transformSize(200),
		height: transformSize(80),
		backgroundColor: commonStyle.color_theme,
		borderRadius: transformSize(40),
		elevation: 0,
	},
	submitText: {
		flex: 1,
		textAlign: 'center',
		color: '#fff',
		fontSize: transformSize(56),
		lineHeight: transformSize(62)
	},
});
