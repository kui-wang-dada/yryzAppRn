import React from 'react'
import { StyleSheet, Platform, ImageBackground, PixelRatio, Alert, TouchableOpacity } from 'react-native';
import { View, Text, FlatList, Button } from '@components';
import { transformSize, commonStyle } from '@utils';
import { http } from '@services'
import { Pay } from 'ydk-react-native'

export default class AccountRechargeScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			totalMoney: 0, //账户悠然币
			money: Platform.select({
				'ios': 8,
				'android': 1
			}), // 充值金额（悠然币）
			chargeYMB: Platform.select({
				'ios': 80000,
				'android': 10000
			}), //传给后端的 金额（单位毫，1元=10000）
			selectItemIndex: 0, //默认充值金额选第一个
			rechargeInitData: Platform.select({
				ios: [ // ios 充值兑换比例
					{ YRB: '8', RMB: '8' },
					{ YRB: '12', RMB: '12' },
					{ YRB: '25', RMB: '25' },
					{ YRB: '50', RMB: '50' },
				],
				android: [ // Andoid 充值兑换比例
					{ YRB: '1', RMB: '1' },
					{ YRB: '5', RMB: '5' },
					{ YRB: '10', RMB: '10' },
					{ YRB: '20', RMB: '20' },
				],
			})
		}
	}

	static navigationOptions = {
		title: '账户充值'
	}

	componentDidMount() {
		this.GetAccountData();
	}

	renderItem = ({ item, index }) => {
		return (
			<TouchableOpacity style={{ width: '50%' }} onPress={() => this.onItem(item, index)}>
				<View style={[styles.item, {
					borderColor: this.state.selectItemIndex === index ? commonStyle.color_theme : '#aaa',
					marginLeft: index % 2 === 1 ? transformSize(30) : 0,
					marginRight: index % 2 === 0 ? transformSize(30) : 0
				}]}>
					<Text style={[styles.itemYMB, { color: this.state.selectItemIndex === index ? commonStyle.color_theme : '#333' }]}>{item.YRB}悠然币</Text>
					<Text style={[styles.itemRMB, { color: this.state.selectItemIndex === index ? '#907bfd' : '#999' }]}>{item.RMB}元</Text>
				</View>
			</TouchableOpacity>
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<ImageBackground style={styles.titleBg} source={require('./assets/bg_title.png')}>
					<Text style={styles.titleMoney}>{this.state.totalMoney ? this.state.totalMoney / 10000 : 0}</Text>
					<Text style={styles.title}>我的悠然币</Text>
				</ImageBackground>
				<Text style={styles.hint}>悠然币不足?马上充值</Text>
				<FlatList
					style={{ flexGrow: 0 }}
					numColumns={2}
					data={this.state.rechargeInitData}
					renderItem={this.renderItem}
					keyExtractor={(item, index) => index}
					extraData={this.state} />
				<Button onPress={this.onReCharge} style={styles.reCharge} title='充值' />
			</View >
		)
	}

	onReCharge = async () => {
		if (Platform.OS === 'ios') {
			await this.pay(this.state.chargeYMB, 3, 2);
		} else {
			this.props.navigation.navigate("AccountPay", { money: this.state.money, chargeYMB: this.state.chargeYMB, onRefresh: () => this.refreshMoney() })
		}

	}

	onItem = (item, index) => {
		this.setState({
			money: item.YRB,
			selectItemIndex: index,
			chargeYMB: item.RMB * 10000,
		})
	}

	refreshMoney = () => {
		this.GetAccountData();
	}

	async pay(amount, payChannel, paySource) {  //支付渠道：1支付宝 2微信 3苹果; 支付来源: 1android 2ios 3wap
		let res = await http.post('/services/app/v1/order/recharge', { amount, payChannel, paySource });
		let paySn = res.data.data.paySn; // 后端生成流水号
		try {
			let data = await Pay.pay(res.data.data);
			let receipt = data.signtString; // 苹果支付成功返回的苹果支付凭据
			let resPay = await http.post('/services/app/v1/order/applePayNotify', { paySn, receipt });
			if (resPay.data.code === "200") {
				this.refreshMoney();
			}
		}
		catch (ex) {
			console.warn(ex);
		}
	}

	async GetAccountData() {
		let res = await http.get('/services/app/v1/account/detail');
		if (res.data.code === '200') {
			if (res.data.data) {
				let _resData = res.data.data.amount;
				this.setState({
					totalMoney: _resData
				})
			}
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		alignItems: 'center',
		flexDirection: 'column',
		paddingLeft: transformSize(40),
		paddingRight: transformSize(40)
	},
	titleBg: {
		width: '100%',
		height: transformSize(142),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: transformSize(50),
		paddingLeft: transformSize(40),
		paddingRight: transformSize(40)
	},
	title: {
		fontSize: transformSize(36),
		color: '#f7f7f7'
	},
	titleMoney: {
		fontSize: transformSize(64),
		color: '#f7f7f7'
	},
	hint: {
		width: '100%',
		fontSize: transformSize(32),
		color: '#333',
		marginTop: transformSize(30),
		marginBottom: transformSize(50)
	},
	item: {
		borderWidth: 2 / PixelRatio.get(),
		borderRadius: transformSize(10),
		borderColor: '#ddd',
		paddingVertical: transformSize(30),
		marginBottom: transformSize(50),
	},
	itemYMB: {
		fontSize: transformSize(36),
		textAlign: 'center',
		marginBottom: transformSize(5)
	},
	itemRMB: {
		fontSize: transformSize(24),
		textAlign: 'center'
	},
	reCharge: {
		width: '90%',
		height: transformSize(80),
		marginTop: transformSize(50),
		borderRadius: transformSize(100),
		backgroundColor: commonStyle.color_theme
	}
})