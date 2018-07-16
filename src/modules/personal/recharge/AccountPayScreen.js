import React from 'react'
import { StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { View, Text, Button, FlatList, Image, Icon } from '@components';
import { transformSize, commonStyle } from '@utils';
import { http } from '@services'
import { Pay } from 'ydk-react-native'

export default class AccountPayScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showMoney: this.props.navigation.state.params.money, // 显示要充值的悠然币
			reChargeMoney: this.props.navigation.state.params.chargeYMB, // 要充值的金额 
			selectPayWayIndex: 0, // 默认支付方式为支付宝
			payData: [
				{
					id: 'alipay',
					name: '支付宝',
					img: require('./assets/pay_alipay.png'),
				},
				{
					id: 'wechat',
					name: '微信',
					img: require('./assets/pay_wechat.png'),
				}
			]

		};
	}

	static navigationOptions = {
		title: '账户充值'
	}

	renderItem = ({ item, index }) => {
		let check = (this.state.selectPayWayIndex === index)
		return (
			<View>
				<TouchableOpacity style={styles.item} onPress={() => this.onItem(item, index)}>
					<Image source={item.img} style={{ width: transformSize(100), height: transformSize(100) }} />
					<Text style={styles.itemName}>{item.name}</Text>
					<Icon name={check ? 'choose-a' : 'choose-b'} color={check ? commonStyle.color_theme : '#999999'} style={styles.itemCheck} />
				</TouchableOpacity>
				{
					index === 0 ? <View style={styles.line} /> : null
				}
			</View>
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.hint}>请选择支付方式</Text>
				<FlatList
					style={{ flexGrow: 0 }}
					data={this.state.payData}
					renderItem={this.renderItem}
					keyExtractor={(item, index) => index}
					extraData={this.state} />
				<View style={{ backgroundColor: '#f8f8f8', width: '100%', height: transformSize(20) }} />
				<Text style={styles.moneyHint}>充值额度</Text>
				<Text style={styles.money}>{this.state.showMoney}悠然币</Text>
				<Button onPress={this.onReCharge} style={styles.reCharge} title='充值' />
			</View>
		);
	}

	onItem = (item, index) => {
		this.setState({
			selectPayWayIndex: index
		})
	}

	onReCharge = async () => {

		// alert('开始走支付流程:' +  this.state.payData[this.state.selectPayWayIndex].name + this.state.reChargeMoney)
		let payChannel = 1; // 支付渠道：1支付宝，2微信，3苹果支付
		if (this.state.selectPayWayIndex === 0) {
			payChannel = 1
		} else if (this.state.selectPayWayIndex === 1) {
			payChannel = 2
		}
		await this.pay(this.state.reChargeMoney, payChannel, 1);
	}

	async pay(amount, payChannel, paySource) {  // 支付渠道：1支付宝 2微信 3苹果; 支付来源: 1android 2ios 3wap
		let res = await http.post('/services/app/v1/order/recharge', { amount, payChannel, paySource });
		try {
			let data = await Pay.pay({ ...res.data.data, payChannel });
			this.props.navigation.state.params.onRefresh();
			Alert.alert('', '支付成功');
		} catch (ex) {
			console.warn(ex);
		}

	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		flexDirection: 'column'
	},
	hint: {
		width: '100%',
		fontSize: transformSize(30),
		paddingVertical: transformSize(30),
		paddingLeft: transformSize(40),
		textAlign: 'left',
		backgroundColor: '#f8f8f8'
	},
	item: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: transformSize(40),
		paddingVertical: transformSize(24)
	},
	itemName: {
		marginLeft: transformSize(30),
		fontSize: transformSize(32),
		color: '#333'
	},
	itemCheck: {
		position: 'absolute',
		right: transformSize(40),
		fontSize: transformSize(40)
	},
	moneyHint: {
		width: '100%',
		textAlign: 'center',
		fontSize: transformSize(30),
		marginTop: transformSize(130),
		color: '#666'
	},
	money: {
		width: '100%',
		textAlign: 'center',
		fontSize: transformSize(50),
		marginTop: transformSize(30),
		color: commonStyle.color_theme
	},
	reCharge: {
		height: transformSize(80),
		marginTop: transformSize(120),
		marginHorizontal: transformSize(70),
		borderRadius: transformSize(100),
		backgroundColor: commonStyle.color_theme
	},
	line: {
		marginLeft: transformSize(30),
		marginRight: transformSize(30),
		height: transformSize(2),
		backgroundColor: '#eaeaea'
	}
})