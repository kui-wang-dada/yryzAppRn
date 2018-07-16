import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import LoginBigButton from './components/LoginBigButton'
import PhoneTextInput from './components/TextInputString'
import TextInputVerifyCode from "./components/TextInputVerifyCode";
import {
    commonStyle,
    isPwdValid,
    isPhoneAvailable,
    transformSize,
} from '@utils'
import { SafeAreaView } from 'react-navigation';
import { codeType, sendVerifyCodeByType} from "./services/LoginPrenster";
import commonStyles from './styles';
import { connect } from 'react-redux';
import { Icon, Toast, AutoHideKeyboard } from '@components'
import { login_bg } from './asset';

let mapStateToProps = (state) => {
	return {
		user: state.user,
	};
};
@connect(mapStateToProps)
@AutoHideKeyboard
export default class ChangePasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumb: this.props.user.custPhone,
            verifyCode: '',
            isLoading: false,
        }
    }
    componentDidMount(){

    }

    nextStep() {

        if (true) {

        }
        this.props.navigation.navigate('SetPasswordScreen',{ code: this.state.verifyCode ,phone:this.state.phoneNumb ,type:1})
    }

    onSendVerifyCodePress = (shouldStartCountting) => {
        //点击发送验证码
        if (isPhoneAvailable(this.state.phoneNumb)) {
            sendVerifyCodeByType(codeType.findPwdBack, this.state.phoneNumb)
				.then((res) => {
					shouldStartCountting(true)
                    console.log(res)
                    const {msg} = res.data
                    umengTrack('获取验证码', { '结果': '成功' })
				}).catch(function(error) {
                    umengTrack('获取验证码', { '结果': `失败+${error}`})
					shouldStartCountting(false);
				  })
        } else {
            shouldStartCountting(false);
            Toast.show('请输入正确的手机号');
        }
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
                    <Text style={{fontSize: commonStyle.fontSize_content_detail_34, alignSelf: 'center'}}>找回密码</Text>
                    <View style={{ paddingRight: transformSize(40)}}></View>
                </View>
                <View style={[{bottom: 0},commonStyles.horizontalLineStyle]} />
            </View>
        )

        return (<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {/* {header} */}
            <View style={styles.container}>
                <View style={styles.InputContainer}>
                    <Text style={styles.phoneText}>
                        {`验证码将会发至您${this.state.phoneNumb.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}的手机`}
                    </Text>
                    <TextInputVerifyCode placeholder={'请输入验证码'}
                                         disabled={this.state.isLoading}
                                         onChangeText={(verifyCode) => this.setState({verifyCode})}
                                         onClick={(shouldStartCountting) => {
                                             // shouldStartCountting(this.onSendVerifyCodePress);
                                             this.onSendVerifyCodePress(shouldStartCountting);
                                         }}
                    />
                </View>

                <LoginBigButton loginBigButtonText={'下一步'}
                                isLoading={this.state.isLoading}
                                clickFinish={() => {this.nextStep()}}
                                complete={isPhoneAvailable(this.state.phoneNumb) && this.state.verifyCode.length === 4}
                />
                <Image source={login_bg} style={commonStyles.bottomBg} />
			</View>
			</SafeAreaView>
        )
    }
}

ChangePasswordScreen.navigationOptions = {
    headerStyle:{
        borderBottomWidth: StyleSheet.hairlineWidth,
        elevation: 0,
        borderBottomColor: '#e5e5e5',
        backgroundColor: '#fff',
    },
    title: '修改密码',
    headerTitleStyle: {
        textAlign: 'center',
        flex: 1
    },
    headerRight: (
        <View style={{width: 30, marginRight: 12}}/>
    ),
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    phoneText: {
    	marginTop: transformSize(50),
        height: transformSize(70),
        fontSize: commonStyle.fontSize_login_30
    },
    InputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: transformSize(130)
    },
})
