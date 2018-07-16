import React, { Component } from 'react';
import { PropTypes } from 'prop-types'
import {
	View,
	ScrollView,
	StyleSheet,
	ImageBackground,
	Text,
	TouchableOpacity,
	FlatList,
	InteractionManager,
	Platform,
	findNodeHandle,
	UIManager
} from 'react-native';

import { Icon, Toast, Touchable, Alert,Message } from '@components'
import { http } from "@services";
import { transformSize, commonStyle } from '@utils'
import { SCREEN_HEIGHT } from '@utils/commonStyle';
import { isIphoneX } from '@utils/filter';

let jsonData = require('./components/cityThree.json');
let FlatListHeight = 0;
export default class EditMyProfileScreen extends React.Component {

	static navigationOptions = ({ navigation }) => {
		const headerRight = (
			<TouchableOpacity onPress={navigation.getParam('submit')}>
				<Text style={{ color: commonStyle.color_theme, width: 50, fontSize: transformSize(30) }}>保存</Text>
			</TouchableOpacity>
		);
		let type = navigation.getParam('type');
		let showSave = navigation.getParam('showSave');
		return {
			headerTitle: EditMyProfileScreen._navigationTitle(type),
			headerRight: showSave ? headerRight : null,
			headerStyle: {
				backgroundColor: '#fff',
				borderBottomWidth: StyleSheet.hairlineWidth,
				borderBottomColor: '#eeeeee',
				elevation: 0,
			}
		};
	}

	static _navigationTitle(type) {
		if (type === 0) {
			return '性别';
		} else if (type === 1) {
			return '个人标签';
		} else if (type === 2) {
			return '地区';
		}
	}

	static propTypes = {
		...View.propTypes,
		type: PropTypes.number,	// 0 性别  1 个人标签 2 地区
		onEndEdit: PropTypes.func, // type data

		gender: PropTypes.string,
		labels: PropTypes.array, // [省 市 区]
		address: PropTypes.array, // [省 市 区]
	};

	_submit = () => {
		let result;
		if (this.state.type === 0) {
			let gender = this.state.gender;
			result = gender;
		} else if (this.state.type === 2) {
			let address = [this.state.selectedProvince, this.state.selectedCity, this.state.selectedArea];
			result = address;
		} else if (this.state.type === 1) {
			let { isCheck } = this.state;
			let checkItems = [];
			for (let key in isCheck) {
				if (isCheck[key]) {
					let labels = this.state.labelsData.filter((label) => {
						return Number(label.kid) === Number(key);
					});
					checkItems.push(labels[0]);
				}
			}
			let _checkItems = checkItems.length;
			if (!_checkItems) {
				return Alert.alert('', '还未设置个人标签');
			}
			result = checkItems;
		}
		if (this.props.navigation.state.params.config.onEndEdit) {
			this.props.navigation.state.params.config.onEndEdit(this.state.type, result);
		}
		this.props.navigation.pop();
	}

	constructor(props) {
		super(props);

		let type = this.props.navigation.state.params.config.type;
		this.state = {
			// 类型
			type: type,

			// 性别
			genderData: [],
			gender: '男',

			// 地区
			province: [],	// 省
			city: [],		// 市
			area: [],		// 区
			selectedProvince: '',	// 选中的省
			selectedCity: '',			// 选中的市
			selectedArea: '',			// 选中的地区
			currentLevel: 0,		// 当前地区级别

			// 标签
			labelsData: [],
			labels: [],
			isCheck: {},
		};
	}

	_loadData = () => {
		// 0 性别  1 个人标签 2 地区
		if (this.state.type === 0) {
			this._loadGenderData();
		} else if (this.state.type === 1) {
			this._loadLabelsData();
		} else if (this.state.type === 2) {
			// this.props.navigation.state.params.config.address[]
			let address = this.props.navigation.state.params.config.address;
			this.state.selectedProvince = address[0] ? address[0] : '';
			this.state.selectedCity = address[1] ? address[1] : '';
			this.state.selectedArea = address[2] ? address[2] : '';
			this._loadAddressData();
		}
	}

	// 地区数据
	_loadAddressData = () => {
		var province = this.getProvince();
		if (this.state.selectedProvince === '') {
			this.state.selectedProvince = province[0];
			this.setState({
				province: province,
			});
		} else {
			this.setState({
				province: province,
			});
			// 滚到指定行
			let currentIndex = 0;
			for (let index = 0; index < province.length; index++) {
				const element = province[index];
				if (element === this.state.selectedProvince) {
					currentIndex = index;
					break;
				}
			}
			// 如果在下一屏，则滚动
			if (transformSize(110) * (currentIndex + 1) > SCREEN_HEIGHT - (isIphoneX || Platform.OS === 'android') ? 88 : 64) {
				InteractionManager.runAfterInteractions(() => {
					this._flatListView.scrollToIndex({ viewPosition: 1, index: currentIndex, animated: true })
				});
			}
		}
		this._loadAddressCity();
	}

	_loadAddressCity = () => {
		var city = this.getProvinceCity(this.state.selectedProvince);
		if (this.state.selectedCity === '') {
			this.state.selectedCity = city[0] ? city[0] : '';
			this.setState({
				city: city,
			});
		} else {
			this.setState({
				city: city,
			});
			// 滚到指定行
			let currentIndex = 0;
			for (let index = 0; index < city.length; index++) {
				const element = city[index];
				if (element === this.state.selectedCity) {
					currentIndex = index;
					break;
				}
			}
			// 如果在下一屏，则滚动
			if (transformSize(110) * (currentIndex + 1) > FlatListHeight) {
				InteractionManager.runAfterInteractions(() => {
					this._flatListView.scrollToIndex({ viewPosition: 1, index: currentIndex, animated: true })
				});
			}
		}
		this._loadAddressAreaData();
	}

	_loadAddressAreaData = () => {
		var area = this.getProvinceCityArea(this.state.selectedProvince, this.state.selectedCity);
		if (this.state.selectedArea === '') {
			this.state.selectedArea = area[0] ? area[0] : '';
			this.setState({
				area: area,
			});
		} else {
			this.setState({
				area: area,
			});
			// 滚到指定行
			let currentIndex = 0;
			for (let index = 0; index < area.length; index++) {
				const element = area[index];
				if (element === this.state.selectedArea) {
					currentIndex = index;
					break;
				}
			}
			// 如果在下一屏，则滚动
			if (transformSize(110) * (currentIndex + 1) > FlatListHeight) {
				InteractionManager.runAfterInteractions(() => {
					this._flatListView.scrollToIndex({ viewPosition: 1, index: currentIndex, animated: true })
				});
			}
		}
	}

	// 获取全国省: ['省1', '省2', '省3'......]
	getProvince() {
		var result = [];
		for (var code in jsonData) {
			result.push(jsonData[code].name);
		}
		return result;
	}

	// 获取各个省的城市[['省1-城市1', '省1-城市2', '省1-城市3'......],['省2-城市1', '省2-城市2', '省2-城市3'......]]
	getProvinceCity(province) {
		var result = [];
		var cityData = [];
		for (var code in jsonData) {
			let temp = jsonData[code].name;
			if (temp === province) {
				cityData = jsonData[code].children;
				for (var j in cityData) {
					result.push(cityData[j].name);
				}
				break;
			}
		}
		return result;
	}

	// 获取各个省的城市[['省1-城市1-区1', '省1-城市1-区2', '省1-城市1-区3'......]......]
	getProvinceCityArea(province, city) {
		var result = [];
		var cityData = [];
		for (var code in jsonData) {
			let tempProvince = jsonData[code].name;
			if (tempProvince === province) {
				cityData = jsonData[code].children;
				for (var j in cityData) {
					let tempCity = cityData[j].name;
					let _tempCity = cityData[j].children;
					if (tempCity === city) {
						for (var k in _tempCity) {
							result.push(_tempCity[k].name);
						}
						break;
					}
				}

			}
		}
		return result;
	}


	// 个人标签数据
	_loadLabelsData = async () => {
		// services/app/v3/user/label/list
		let url = '/services/app/v3/user/label/list';
		let responseData = await http.get(url);
		if (responseData && responseData.length > 0) {
			let isCheck = {};
			this.props.navigation.state.params.config.labels.map((label) => {
				let key = String(label.kid);
				isCheck[key] = true;
			});
			this.setState({
				labelsData: responseData.data.data,
				isCheck: isCheck
			});
			this.props.navigation.setParams({ showSave: true});
		} else {
			this.props.navigation.setParams({ showSave: false});
		}
	}

	// 性别数据
	_loadGenderData = () => {
		let genderData = [
			{ name: '男' },
			{ name: '女' },
		];
		this.setState({
			gender: this.props.navigation.state.params.config.gender === '' ? '男' : this.props.navigation.state.params.config.gender,
			genderData: genderData
		});
		this.props.navigation.setParams({ showSave: true });
	}

	_onPressRow = (index) => {
		if (this.state.type === 0) {
			this.setState({
				gender: index === 0 ? '男' : '女',
			});
		} else if (this.state.type === 2) {
			if (this.state.currentLevel === 0) {
				let province = this.state.province[index];
				if (province !== this.state.selectedProvince) {
					this.state.selectedProvince = province;
					this.state.selectedCity = '';
					this.state.selectedArea = '';
				}
				this._loadAddressCity();
				if (this.state.selectedProvince === '台湾省' || this.state.selectedProvince === '香港特别行政区' || this.state.selectedProvince === '澳门特别行政区') {
					// 显示保存
					this.props.navigation.setParams({ showSave: true });
					return;
				}
			} else if (this.state.currentLevel === 1) {
				let city = this.state.city[index];
				if (city !== this.state.selectedCity) {
					this.state.selectedCity = city;
					this.state.selectedArea = '';
				}
				this._loadAddressAreaData();
			} else if (this.state.currentLevel === 2) {
				this.state.selectedArea = this.state.area[index];
			}

			let currentLevel = this.state.currentLevel
			if (this.state.currentLevel < 2) {
				currentLevel += 1;
			}

			if (currentLevel < 2) {
				this.props.navigation.setParams({ showSave: false });
			} else {
				this.props.navigation.setParams({ showSave: true });
			}
			this.setState({
				currentLevel: currentLevel
			})
		}
	}

	_renderListItem = (index, showLine, name, displayCheck, check) => {
		let BLine = showLine ? styles.BLine : null;
		return (
			<Touchable type='highlight' onPress={this._onPressRow.bind(this, index)}>
				<View style={styles.listItem} >
					<View style={[styles.listItemInner, BLine]}>
						<Text style={styles.listName}>{name}</Text>
						{
							check ? <View style={styles.listRight}>
								<Icon name={'choose-a'} color={commonStyle.color_theme} size={transformSize(35)} />
							</View> :
								displayCheck ?
									<View style={styles.listRight}>
										<Icon name={'choose-b'} color={'#666'} size={transformSize(35)} />
									</View> : null
						}
					</View>
				</View>
			</Touchable>
		);
	}

	_renderGender = (index, item) => {
		return this._renderListItem(index, this.state.genderData.length - 1 !== index, item.name, true, item.name === this.state.gender);
	}

	_renderRegion = (index, item) => {
		let regionData = this._flatListAddressData();
		let selectedName = this._currentSelectedName();
		return this._renderListItem(index, regionData.length - 1 !== index, item, false, item === selectedName);
	}

	_currentSelectedName = () => {
		let name = '';
		if (this.state.currentLevel === 0) {
			name = this.state.selectedProvince;
		} else if (this.state.currentLevel === 1) {
			name = this.state.selectedCity;
		} else if (this.state.currentLevel === 2) {
			name = this.state.selectedArea;
		}
		return name;
	}

	_renderItem = ({ index, item }) => {
		if (this.state.type === 0) {
			return this._renderGender(index, item);
		} else if (this.state.type === 2) {
			return this._renderRegion(index, item);
		}
		return null;
	}

	_flatListData = () => {
		if (this.state.type === 0) {
			return this.state.genderData;
		} else if (this.state.type === 1) {
			return this.state.labelsData;
		} else if (this.state.type === 2) {
			return this._flatListAddressData();
		}
	}

	_flatListAddressData = () => {
		let data = [];
		if (this.state.currentLevel === 0) {
			data = this.state.province;
		} else if (this.state.currentLevel === 1) {
			data = this.state.city;
		} else if (this.state.currentLevel === 2) {
			data = this.state.area;
		}
		return data;
	}

	handleChooseTag = (item, index) => {
		let { isCheck } = this.state;		// 选择
		isCheck[item.kid] = !isCheck[item.kid];
		this.setState({ isCheck });
	}

	tagItem = (item, index) => {
		return (
			<Touchable
				type="opacity"
				key={item.kid}
				onPress={() => this.handleChooseTag(item, index)}
				style={[styles.classify, this.state.isCheck[item.kid] ? styles.chooseClassify : null]}>
				<Text style={[styles.classifyText, this.state.isCheck[item.kid] ? styles.chooseText : null]}>{item.labelName}</Text>
			</Touchable>
		)
	}

	_onLayout(event) {
		{
			let { x, y, width, height } = event.nativeEvent.layout;
			FlatListHeight = height;
		}
	}

	_renderContent = () => {
		if (this.state.type === 1) {

			if (this.state.labelsData && this.state.labelsData.length > 0) {
				return (< ScrollView style={{ backgroundColor: '#fff' }}>
					<View style={styles.labelsContainer}>
						{this.state.labelsData.map(this.tagItem)}
					</View>
				</ScrollView>);
			} else {
				return (<Message preset="no-data" />);
			}

		} else {
			return (
				<FlatList
					style={{ flex: 1, backgroundColor: '#F2F2F2' }}
					ref={ref => { this._flatListView = ref; }}
					data={this._flatListData()}
					getItemLayout={(data, index) => ({ length: transformSize(110), offset: transformSize(110) * index, index })}
					renderItem={this._renderItem}
					showsVerticalScrollIndicator={false}
					ListEmptyComponent={() => (<Message preset="no-data" />)}
					keyExtractor={(item) => JSON.stringify(item)}
					onLayout={this._onLayout}
				/>);
		}
	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: 'white'}}>
				{this._renderContent()}
			</View>
		);
	}

	componentDidMount() {
		let type = this.props.navigation.state.params.config.type;
		let submit = this._submit;
		this.props.navigation.setParams({ type, submit });
		this._loadData();
	}
}

const styles = StyleSheet.create({
	listItem: {
		backgroundColor: '#fff',
	},

	listItemInner: {
		height: transformSize(110),
		flexDirection: 'row',
		marginHorizontal: transformSize(40),
		alignItems: 'center',
		justifyContent: 'space-between',
	},

	BLine: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: '#eee'
	},

	listRight: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	listName: {
		fontSize: transformSize(32),
		color: 'black'
	},

	labelsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingHorizontal: transformSize(58),
		paddingTop: transformSize(80)
	},

	classify: {
		alignItems: 'center',
		justifyContent: 'center',
		width: transformSize(180),
		marginHorizontal: transformSize(15),
		height: transformSize(60),
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
});
