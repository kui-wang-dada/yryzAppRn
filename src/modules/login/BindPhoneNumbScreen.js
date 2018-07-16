import React, {Component} from 'react';
import {View, Text, StyleSheet, Linking, Alert, Image} from 'react-native';
import LoginBigButton from "./components/LoginBigButton";
import TextInputString from "./components/TextInputString";
import TextInputVerifyCode from "./components/TextInputVerifyCode";
import {codeType,sendVerifyCodeByType,loginThirdBindPhone, logIn} from './services/LoginPrenster'
import commonStyles from './styles';
import {
    commonStyle,
    isPhoneAvailable,
    isPwdValid,
    transformSize,
    umengTrack
} from '@utils';
import { http } from "@services";
import { SafeAreaView } from 'react-navigation';
import { Toast, AutoHideKeyboard, Icon } from '@components'
import { StackActions, NavigationActions } from 'react-navigation';
import { login_bg } from './asset';
import getInviteCode from './services/getInviteCode';

@AutoHideKeyboard
export default class BindPhoneNumbScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumb: '',
            verifyCode: '',
            inviteCode: '',
            inviteFlag: false,
            isLoading: false,
        }
    }

	async componentDidMount() {
        this.props.navigation.setParams({ cancelBind: this.cancelBindPhone });
		let inviteFlag = (await http('/services/app/v1/new/invite/checkOnInvite')).data.data.inviteFlag
	  	this.setState({
			inviteCode: await getInviteCode(),
			inviteFlag: inviteFlag
		});

	}

    bindPhone() {
        const { params } = this.props.navigation.state;
        console.log(params)
        const userId = params.userId
        const userData = params.userData
        this.setState({ isLoading: true })
        let res = loginThirdBindPhone(this.state.phoneNumb, userId, this.state.verifyCode, this.state.inviteCode)
            .then((res)=>{
                Toast.show('绑定成功')
                logIn(userData);
                this.setState({ isLoading: false })
                umengTrack('绑定手机号', { '结果': '成功' })
                //重置navigate栈，返回至home页
                let resetAction = StackActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: 'App' })],
                });
                this.props.navigation.dispatch(resetAction);
            }).catch((eror) => {
                this.setState({ isLoading: false })
                umengTrack('绑定手机号', { '结果': `失败+${eror}`})
            });
    }

    onSendVerifyCodePress = (shouldStartCountting) => {
        // 点击发送验证码
        if (isPhoneAvailable(this.state.phoneNumb)) {
            shouldStartCountting(true)
            sendVerifyCodeByType(codeType.changePhone, this.state.phoneNumb)
                .then((res)=>{
                    const {msg} = res.data
                    umengTrack('获取验证码', { '结果': '成功'})
                }).catch(function(error) {
                    umengTrack('获取验证码', { '结果': `失败+${error}`})
					shouldStartCountting(false);
				  })
        } else {
            shouldStartCountting(false);
            Toast.show('请输入正确的手机号');
        }
    }

    cancelBindPhone = () => {
        Alert.alert(
            '', '确定取消绑定？',
            [
                { text: '取消', onPress: () => console.log('取消'), style: 'cancel' },
                {
                    text: '确定', onPress: () => {
                        this.props.navigation.goBack()
                    }
                },
            ]
        )
    }


    render() {

        return (<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={commonStyles.containerStyle}>
                <View style={[commonStyles.headLoginHorizontalViewStyle, { marginTop:transformSize(60)}]}>
                    <Text style={commonStyles.textLoginStyles}>悠然一指</Text>
                </View>
                <View style={commonStyles.loginContainerSecondStyle}>
                        <TextInputString placeholder={'请输入手机号'}
                                         keyboardType='numeric'
                                         maxLength={11}
                                         disabled={this.state.isLoading}
                                         onChangeText={(phoneNumb) => this.setState({phoneNumb})}
                        />
                        <TextInputVerifyCode placeholder={'请输入验证码'}
                                             onChangeText={(verifyCode) => this.setState({verifyCode})}
                                             disabled={this.state.isLoading}
                                             onClick={(shouldStartCountting) => {
                                                 this.onSendVerifyCodePress(shouldStartCountting);
                                             }}
                        />
                        {this.renderInviteCode()}
    			</View>
                <LoginBigButton loginBigButtonText={'绑定'}
                                isLoading={this.isLoading }
                                clickFinish={() => {this.bindPhone()}}
                                complete={isPhoneAvailable(this.state.phoneNumb) && this.state.verifyCode.length === 4}/>
                                <Image source={login_bg} style={commonStyles.bottomBg} />
                            </View>

			</SafeAreaView>
        )
    }

    renderInviteCode = () => {
        if (this.state.inviteFlag) {
            return (
                <TextInputString
                    disabled={this.state.isLoading}
                    keyboardType="numeric"
                    style={{marginTop: transformSize(50)}}
                    returnKeyType='next'
                    placeholder={'邀请码（选填)'}
                    value={this.state.inviteCode}
                    onChangeText={(inviteCode) => this.setState({inviteCode})}
                />
            );
        } else {
            return null
        }
    }
}


BindPhoneNumbScreen.navigationOptions = ({ navigation }) => {
	return {
        headerLeft: (
            <Icon name={'arrow-left'} style={{
                fontSize: commonStyle.transformSize(36),
                width: 30,
                marginLeft: 12
        	}} onPress={navigation.getParam('cancelBind')} />
        ),
	}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'red'
    },
    hightLight: {
        color: 'black'
    },
    sendVerifyCodeBtnStyle: {
        // 发送验证码按钮
        height: 38,
        marginTop: 6,
        marginBottom: 6,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    textContainer: {
        marginTop: transformSize(30),
    }
})
