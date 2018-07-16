
import React from 'react';
import JPushModule from 'jpush-react-native';

const receiveCustomMsgEvent = "receivePushMsg";
const receiveNotificationEvent = "receiveNotification";
const openNotificationEvent = "openNotification";
const getRegistrationIdEvent = "getRegistrationId";
import { connect } from 'react-redux';
import { Platform } from 'react-native';
import { http, navigation } from '@services';
import { Common } from 'ydk-react-native';
import { PushModule } from '@native-modules'
import * as Action from './message.action';

import {
	View,
	NativeModules,
	DeviceEventEmitter,
	NativeAppEventEmitter,
} from 'react-native';

let mapStateToProps = (state) => {
	return {
		user: state.user,
		pushCount: state.push.pushCount,
	};
};

@connect(mapStateToProps)
export default class JPush extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			bg: '#ffffff',
			appkey: 'AppKey',
			imei: 'IMEI',
			package: 'PackageName',
			deviceId: 'DeviceId',
			version: 'Version',
			pushMsg: 'PushMessage',
			registrationId: 'registrationId',
			tag: props.user.userName,
			alias: props.user.custId,
		};
	}

	bindRegisterId = async (user) => {
		if (!JPushModule) return;
		if (user.isSignIn) {
			this.setTag();
			this.setAlias(user);
			let jpushRegistrationId = await PushModule.getRegisterId();
			http.get("/services/app/v1/user/bindingJpushId/" + jpushRegistrationId);
		} else {
			this.deleteAlias();
			this.props.dispatch({ type: Action.CLEAR_PUSH });
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		this.bindRegisterId(nextProps.user);
		if (this.props.pushCount !== nextProps.pushCount && Common) {
			Common.setBadgeCount(nextProps.pushCount);
		}
		return false;
	}


	jumpScreen = (map) => {
		this.props.navigation.navigate("Setting");
	}

	onGetRegistrationIdPress = () => {
		JPushModule.getRegistrationID((registrationId) => {
		});
	}
	componentWillMount() {
	}
	componentDidMount() {
		if (Platform.OS === 'android') {
			JPushModule.initPush();
			JPushModule.notifyJSDidLoad((resultCode) => {
				if (resultCode === 0) {
					this.bindRegisterId(this.props.user);
				}
			});
			JPushModule.addGetRegistrationIdListener((registrationId) => {
				console.log("Device register succeed, registrationId " + registrationId);
			});
		}
		this.bindRegisterId(this.props.user);
		JPushModule.addReceiveNotificationListener((map) => {
			try {
				let payload = map.extras.message ? map.extras.message : JSON.parse(map.extras).message;
				if (typeof payload === 'string')
					payload = JSON.parse(payload);
				if (payload.type === 0) {//(0 公告，1 活动，2 关注,3评论,4精华帖）
					this.props.dispatch({ type: Action.ADD_ANNOUNCE, payload });
				} else if (payload.type === 1 || payload.type === 2) {
					this.props.dispatch({ type: Action.ADD_PUSH, payload });
				}
			}
			catch (ex) {
				console.error(ex, map)
			}

		});


		JPushModule.addReceiveOpenNotificationListener((map) => {
			try {
				let item = map.extras.message ? map.extras.message : JSON.parse(map.extras).message;
				if (typeof item === 'string')
					item = JSON.parse(item);
				if (this.props.user.isSignIn) {
					if (item.type === 3) {
						//0文章  1视频
						if (item.contentFlag === 0) {
							navigation.navigate('ArticleDetail', { id: item.typeId });
						} else if (item.contentFlag === 1) {
							navigation.navigate('VideoDetail', { id: item.typeId });
						}
					} else if (item.type === 4) {//精华帖
						navigation.navigate('SquareDetail', { id: item.typeId });
					} else {
						navigation.navigate('Message');
					}
				} else {
					navigation.navigate('LoginScreen');
				}
			}
			catch (ex) {
				console.error(ex, map)
			}
		});
	}
	componentWillUnmount() {
		JPushModule.removeReceiveNotificationListener(receiveNotificationEvent);
		JPushModule.removeReceiveOpenNotificationListener(openNotificationEvent);
		JPushModule.clearAllNotifications();
	}
	setTag() {
		let { user } = this.props;
		let { userName = '' } = user;
		if (user.isSignIn) {

			/* 请注意这个接口要传一个数组过去，这里只是个简单的示范
			*/
			JPushModule.setTags(userName.split(","), (map) => {
				if (map.errorCode === 0) {
					console.log("Tag operate succeed, tags: " + map.tags);
				} else {
					console.log("error code: " + map.errorCode);
				}
			});
		}
	}
	addTag = () => {
		console.log("Adding tag: " + this.state.tag);
		JPushModule.addTags(this.state.tag.split(","), (map) => {
			if (map.errorCode === 0) {
				console.log("Add tags succeed, tags: " + map.tags);
			} else {
				console.log("Add tags failed, error code: " + map.errorCode);
			}
		});
	}
	deleteTags = () => {
		console.log("Deleting tag: " + this.state.tag);
		JPushModule.deleteTags(this.state.tag.split(","), (map) => {
			if (map.errorCode === 0) {
				console.log("Delete tags succeed, tags: " + map.tags);
			} else {
				console.log("Delete tags failed, error code: " + map.errorCode);
			}
		});
	}
	checkTag = () => {
		console.log("Checking tag bind state, tag: " + this.state.tag);
		JPushModule.checkTagBindState(this.state.tag, (map) => {
			if (map.errorCode === 0) {
				console.log("Checking tag bind state, tag: " + map.tag + " bindState: " + map.bindState);
			} else {
				console.log("Checking tag bind state failed, error code: " + map.errorCode);
			}
		});
	}
	getAllTags = () => {
		JPushModule.getAllTags((map) => {
			if (map.errorCode === 0) {
				console.log("Get all tags succeed, tags: " + map.tags);
			} else {
				console.log("Get all tags failed, errorCode: " + map.errorCode);
			}
		});
	}
	cleanAllTags = () => {
		JPushModule.cleanAllTags((map) => {
			if (map.errorCode === 0) {
				console.log("Clean all tags succeed");
			} else {
				console.log("Clean all tags failed, errorCode: " + map.errorCode);
			}
		});
	}
	setAlias(user) {
		if (user.custId !== undefined) {
			JPushModule.setAlias(user.custId, (map) => {
				// JPushModule.setAlias('584480693202157568', (map) => {
				if (map.errorCode === 0) {
					console.log("set alias succeed");
				} else {
					console.log("set alias failed, errorCode: " + map.errorCode);
				}
			});
		}
	}
	deleteAlias = () => {
		console.log("Deleting alias");
		JPushModule.deleteAlias((map) => {
			if (map.errorCode === 0) {
				console.log("delete alias succeed");
			} else {
				console.log("delete alias failed, errorCode: " + map.errorCode);
			}
		})
	}
	getAlias = () => {
		JPushModule.getAlias((map) => {
			if (map.errorCode === 0) {
				console.log("Get alias succeed, alias: " + map.alias);
			} else {
				console.log("Get alias failed, errorCode: " + map.errorCode);
			}
		});
	}
	setBaseStyle() {
		JPushModule.setStyleBasic();
	}
	setCustomStyle() {
		JPushModule.setStyleCustom();
	}
	render() {
		return null
	}

}