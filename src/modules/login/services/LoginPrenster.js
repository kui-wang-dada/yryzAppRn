import { http } from "@services";
import loginAPI from './api';
import md5 from 'md5';
import {
	signIn,
	signOut,
} from '@modules/user/user.action';
import { saveInterests, getUserInterestList } from '../../transition/service/request';
import { chooseInterest } from '../../transition/transition.action';
import store from '../../../store';

//验证码类型
export const codeType = {
	register: '1',
	findPwdBack: '2',
	changePhone: '5',
	codeLogin: '9',
	bindPhone: '11',
};

const channel = 'Expo';

//根据业务类型发送验证码（1：注册； 2：找回密码； 3：实名认证； 4：设置支付密码； 5：更换手机； 6：找回支付密码； 7：提现；
// 8：其他，只取验证码，不限定使用场景 找回密码可不填 9:验证码登录 10:活动验证手机号 11:第三方登录绑定手机号）
export async function sendVerifyCodeByType(code, phone) {
	let data = {
		code: code,
		phone: phone,
		type: '1'
	};
	return await http.post(loginAPI.sendCodeUrl, data);
}

//注册接口
export async function excuteRegister(inviteCode, code, phone, password) {
	let data = {
		inviteCode: inviteCode,
		custPhone: phone,
		veriCode: code,
		custPwd: md5(password),
		appChannel: channel
	}
	return await http.post(loginAPI.registerUrl, data);
}

//登录接口
export async function excutePwdLogin(phone, password) {
	let data = {
		phone: phone,
		password: md5(password),
		appChannel: channel
	}
	return await http.post(loginAPI.passwordLoginUrl, data);
}
//登录验证码
export async function excuteCodeLogin(phone, veriCode) {
	let data = {
		phone: phone,
		veriCode: veriCode
	}
	return await http.post(loginAPI.codeLoginUrl, data);
}

//三方登录1，微信 2，微博 3，qq
export async function excuteLoginThird(accessToken, openId, devType) {
	let data = {
		accessToken: accessToken,
		appChannel: channel,
		openId: openId,
		type: devType
	}
	return await http.post(loginAPI.loginThirdUrl, data);
}

//校验短信验证码
export async function checkSMS(code, phone, veriCode) {
	let data = {
		code: code,
		phone: phone,
		veriCode: veriCode,
	}
	return await http.post(loginAPI.checkSMS, data);
}

//重置密码
export async function resetPassword(newPassword, password, userId) {
	let data = {
		newPassword: md5(newPassword),
		password: md5(password),
		userId: userId,
	}
	return await http.post(loginAPI.resetPasswordUrl, data);
}

//忘记密码
export async function forgetPassword(password, phone, veriCode) {
	let data = {
		password: md5(password),
		phone: phone,
		veriCode: veriCode,
	}
	return await http.post(loginAPI.forgetPasswordUrl, data);
}


//绑定手机号
export async function loginThirdBindPhone(phone, userId, verifyCode, inviteCode) {
	let data = {
		phone: phone,
		userId: userId,
		veriCode: verifyCode,
		inviteCode: inviteCode
	}
	return await http.post(loginAPI.loginThirdBindPhone, data);
}

export async function saveUserInterests() {

	let transition = store.getState().transition;
	console.log(transition)
	if (transition.interests) {
		let interestIds = transition.interests.map((item, index) => {
			return item.kid
		});
		let res = await saveInterests(interestIds)
		console.log(res)
	}
}

export async function getUserInterests() {

	if(store.getState().user.isSignIn){
		try {
			let res = await getUserInterestList()
			let classifys = res.data.data
			if (classifys) {
				store.dispatch(chooseInterest(classifys))
			}
		} catch(error) {
			console.log(error)
		}
	}
}

export async function logIn(data) {
	store.dispatch(signIn(data))
	let res = await getUserInterestList()
	let classifys = res.data.data
	if (classifys) {
		store.dispatch(chooseInterest(classifys))
	} else {
		let transition = store.getState().transition;
		console.log(transition)
		if (transition.interests &&　transition.interests.length > 0) {
			let interestIds = transition.interests.map((item, index) => {
				return item.kid
			});
			let res = await saveInterests(interestIds)
			console.log(res)
		}
	}
	mengTrack('登入', { '结果': '成功' })
}
