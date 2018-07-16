import React from 'react';
import {
	View, Text, Image, StyleSheet, Touchable, Linking, Share,
	findNodeHandle, UIManager, Icon, FlowList
} from '@components';
import { commonStyle, modal, cache, umengTrack, env, cacheAsync } from '@utils';
import { HomeItemHor, HomeItemVer, HomeItemVideo } from '@modules/home';
import { http } from '@services';
import AppHeader from './components/AppHeader';
import { ChannelModule } from '@native-modules';

class AppDetail extends React.Component {
	static navigationOptions = ({ navigation }) => {
		const menuTrigger = (
			<Touchable transparent onPress={navigation.getParam('pressHeaderMore')} style={style.moreMenu}>
				<Icon name="more" size={5} />
			</Touchable>
		);
		let data = navigation.getParam('appParam');
		let showHeaderTop = navigation.getParam('showHeaderTop');
		return {
			headerTitle: <AppHeader data={data} showHeaderTop={showHeaderTop} />,
			headerRight: menuTrigger,
		};
	}
	constructor(props) {
		super(props);
		this.state = {
			appDetail: {},
		}
		props.navigation.setParams({ pressHeaderMore: this.openMenu });
	}
	render() {
		return (
			<FlowList
				ListHeaderComponent={this.renderAppInfo()}
				emptyComponent={<View />}
				request={`/services/app/v1/article/list/${this.id}/0`}
				renderItem={this.renderItem}
				style={style.container}
				onScroll={this.handleScroll}
			/>
		)
	}
	renderItem = ({ item }) => {
		let { videoUrl, coverImgType } = item
		if (videoUrl) {
			return (
				<HomeItemVideo
					data={item}
					goToDetail={this.goToVideoDetail(item.id)}
				></HomeItemVideo>
			)
		}
		if (coverImgType === 1) {
			return (
				<HomeItemHor
					data={item}
					goToDetail={this.goToDetail(item.id)}
				></HomeItemHor>
			)
		} else {
			return (
				<HomeItemVer
					data={item}
					goToDetail={this.goToDetail(item.id)}
				></HomeItemVer>
			)
		}
	}
	renderAppInfo = () => {
		let { appDetail = {} } = this.state;
		let logoSource = { uri: appDetail.appliIcon };
		return (
			<View style={style.appInfoWrap} ref={(r) => this._appRef = r} collapsable={false}>
				<View style={style.appInfo}>
					<View style={style.appIconStyle}>
						<Image source={logoSource} style={style.appIconStyle}></Image>
					</View>
					<View style={{ flex: 1 }}>
						<Text style={style.appNameTxt}>{appDetail.appliName}</Text>
						<Text style={style.sloganTxt}>{appDetail.slog}</Text>
						<View style={style.getAppWrap}>
							<Text style={style.categoryTxt}>{appDetail.classifys && appDetail.classifys[0].classifyName}</Text>
							<Touchable style={style.getTxtWrap} onPress={this.getApp}>
								<Text style={style.getTxt}>获取</Text>
							</Touchable>
						</View>
					</View>
				</View>
				<View style={style.appDesc}>
					<Text style={style.appDescTxt}>{appDetail.description}</Text>
					<View style={style.sepLine}></View>
					<Text style={style.devTxt}>{appDetail.companyName}</Text>
				</View>
			</View>
		)
	}
	goToVideoDetail = (id) => () => {
		this.props.navigation.navigate('VideoDetail', { id });
	}
	goToDetail = (id) => () => {
		this.props.navigation.navigate('ArticleDetail', { id });
	}
	handleScroll = () => {
		let appBarHandle = findNodeHandle(this._appRef);
		UIManager.measure(appBarHandle, (x, y, width, height, px, py) => {
			let showHeaderTop = py < commonStyle.transformSize(90);
			if (showHeaderTop) {
				this.props.navigation.setParams({ showHeaderTop });
			} else {
				this.props.navigation.setParams({ showHeaderTop });
			}
		});
	};
	getApp = async () => {
		const links = JSON.parse(this.state.appDetail.downloadLink);
		this.channel = await ChannelModule.getChannelName();
		const matchedLink = links[this.channel];
		// const matchedLink = '';
		Linking.openURL(matchedLink || links['YRYZAPP-YYB']);
		this.countDownload();

		umengTrack('应用详情页_获取');
	}
	countDownload = () => {
		http.get(`/services/app/v1/application/download/${this.id}`);
	};
	componentDidMount() {
		this.id = this.props.navigation.state.params.id;
		cacheAsync(`/services/app/v1/application/base/${this.id}`).then((res) => {
			let appDetail = res.data.data;
			this.setState({ appDetail }, () => {
				this.props.navigation.setParams({ appParam: appDetail });
				umengTrack('应用详情页', { '应用': appDetail.appliName });
			});
		})

	}
	openMenu = () => {
		let { slog, id, appliName, appliIcon } = this.state.appDetail;
		let data = {
			title: `【悠然一指】${appliName}`,
			content: slog,
			url: `${env.webBaseUrl}/app-share/${id}`,
			imgUrl: appliIcon,
		}
		let component = (<Share data={data} />)
		modal.show(component, 'share');
		this.countShare(id);
	}
	countShare = (id) => {
		http.get(`/services/app/v1/application/share/${id}`);
	};

}

export default AppDetail;

const style = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
	},
	appInfoWrap: {
		paddingHorizontal: commonStyle.padding,
		paddingBottom: commonStyle.transformSize(40),
	},
	appInfo: {
		flexDirection: 'row',
		display: 'flex',
	},
	appNameTxt: {
		color: '#000',
		fontSize: commonStyle.transformSize(42),
		marginTop: commonStyle.transformSize(10),
		fontWeight: 'bold',
	},
	sloganTxt: {
		fontSize: commonStyle.transformSize(32),
		marginTop: commonStyle.transformSize(10),
		color: '#333',
	},
	appIconStyle: {
		width: commonStyle.transformSize(200),
		height: commonStyle.transformSize(200),
		borderRadius: commonStyle.transformSize(50),
		marginRight: commonStyle.transformSize(30),
		...commonStyle.border,
		overlayColor: '#fff',
		overflow: 'hidden',
	},
	appDesc: {
		paddingTop: commonStyle.transformSize(26),
		paddingBottom: commonStyle.transformSize(16),
		paddingHorizontal: commonStyle.transformSize(26),
		backgroundColor: '#f8f8f8',
		marginTop: commonStyle.transformSize(50),
		borderRadius: commonStyle.transformSize(16),
	},

	getAppWrap: {
		flexDirection: 'row',
		marginTop: commonStyle.transformSize(30),
		justifyContent: 'space-between',
		flex: 1,
	},
	categoryTxt: {
		fontSize: commonStyle.transformSize(26),
		color: '#666',
	},
	getTxtWrap: {
		width: commonStyle.transformSize(100),
		height: commonStyle.transformSize(44),
		backgroundColor: '#7e6be1',
		borderRadius: commonStyle.transformSize(30),
		...commonStyle.centerWrap,
	},
	getTxt: {
		fontSize: commonStyle.transformSize(28),
		color: '#fff',
	},
	appDescTxt: {
		fontSize: commonStyle.transformSize(24),
		color: '#999',
	},
	sepLine: {
		marginTop: commonStyle.transformSize(18),
		height: commonStyle.transformSize(1),
		backgroundColor: '#ddd',
	},
	devTxt: {
		marginTop: commonStyle.transformSize(15),
		fontSize: commonStyle.transformSize(24),
		color: '#999',
	},
	moreMenu: {
		width: commonStyle.transformSize(112),
		height: commonStyle.commonHeaderHeight,
		...commonStyle.centerWrap,
	},
});