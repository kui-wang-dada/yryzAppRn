import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image} from 'react-native';
import LoginBigButton from './components/LoginBigButton'
import TextInputString from "./components/TextInputString";
import {
    commonStyle,
    transformSize,
    isPwdValid,
    umengTrack
} from '@utils'

import { SafeAreaView } from 'react-navigation';
import { forgetPassword, excutePwdLogin, logIn } from "./services/LoginPrenster";
import { connect } from 'react-redux';
import {
	signIn,
	signOut,
	signEdit
} from '@modules/user/user.action';
import { login_bg } from './asset';
import commonStyles  from './styles';
import { StackActions, NavigationActions } from 'react-navigation';
import { Icon, Toast, AutoHideKeyboard } from '@components'


let mapStateToProps = (state) => {
	return {
		user: state.user,
	};
};
@connect(mapStateToProps)

@AutoHideKeyboard
export default class SetPasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            isLoading: false
        }
    }

    click() {
        if (isPwdValid(this.state.password)) {
            this.confirm()
        } else {
            Toast.show('密码格式不正确')
        }
    }

    goToHome() {
        //重置navigate栈，返回至home页
        let resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'App' })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    confirm(){
        const { params } = this.props.navigation.state;
        console.log(params)
        const verifyCode = params ? params.code : null;
        const phone = params?params.phone : null;
        const type = params?params.type : 1;
        this.setState({ isLoading: true })
		forgetPassword(this.state.password, phone, verifyCode.toString()).then((res) => {
            this.setState({ isLoading: false })
			if (res.data.code === '200') {
                if (type === 1) {
                    //从注册页面过来的
                    umengTrack('忘记密码', { '结果': '成功' })
                } else {
                    umengTrack('修改密码')
                }
                excutePwdLogin(phone, this.state.password).then((res) => {
                    if (res.data.code === '200') {
                        logIn(res.data.data);
                        umengTrack('登入', { '结果': '成功' })
                        this.goToHome();
                    }
                })
			}
		}).catch((eror) => {
            umengTrack('忘记密码', { '结果': `失败+${eror}` })
            this.setState({ isLoading: false })
        });
    }

    render() {
        let header = (
            <View style={{height: 44, flexDirection: 'column'}}>
                <View style={[{justifyContent: 'center', flexDirection: 'row', justifyContent: 'space-between'}, styles.container]}>
                    <TouchableOpacity
                        onPress={() => { this.props.navigation.goBack() }}
                        activeOpacity={0.2}
                        focusedOpacity={0.5}>
                        <View style={{ paddingLeft: transformSize(40)}}>
                            <Icon name="arrow-back" size={transformSize(36)}/>
                        </View>
                    </TouchableOpacity>
                    <Text style={{fontSize: commonStyle.fontSize_content_detail_34, alignSelf: 'center'}}>设置新登陆密码</Text>
                    <View style={{ paddingRight: transformSize(40)}}></View>
                </View>
                <View style={[{bottom: 0},commonStyles.horizontalLineStyle]} />
            </View>
        )

        return (<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {/* {header} */}
            <View style={styles.container}>
                <View style={styles.InputContainer}>
                    <TextInputString placeholder={'6-18位，数字+字母组合'}
                                     disabled={this.state.isLoading}
                                     secureTextEntry={true}
                                     maxLength={18}
                                     onChangeText={(password) => this.setState({password})}/>
                </View>

                <LoginBigButton clickFinish={() => {this.click()}}
                                isLoading={ this.state.isLoading}
                                complete={ this.state.password.length > 5 }
                />
                <Image source={login_bg} style={commonStyles.bottomBg} />
			</View>
			</SafeAreaView>
        )
    }
}

SetPasswordScreen.navigationOptions = {
    title: '设置新登录密码',
    headerStyle:{
        borderBottomWidth: StyleSheet.hairlineWidth,
        elevation: 0,
        borderBottomColor: '#e5e5e5',
        backgroundColor: '#fff',
    },
    headerRight: (
        <View style={{width: 30, marginRight: 12}}/>
    ),
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    InputContainer: {
        marginTop: transformSize(70),
    },
})
