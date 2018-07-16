
// 登录注册相关
export default loginAPI = {
	passwordLoginUrl: '/services/app/v1/user/login', // 密码登录
	codeLoginUrl: '/services/app/v1/user/login/vercode', // 验证码登录
	registerUrl: '/services/app/v1/user/register', // 注册
	sendCodeUrl: '/services/app/v1/user/sender/vercode', // 发送验证码
	resetPasswordUrl: '/services/app/v1/user/pwd/editor', //重设密码
	forgetPasswordUrl: '/services/app/v1/user/pwd/forget', //忘记密码密码
	loginThirdUrl: '/services/app/v1/user/login/third', // 三方登录
	loginThirdBindPhone: '/services/app/v1/user/account/phone/binder', // 三方登录绑定手机号
	checkSMS: '/services/app/v1/user/checker/vercode', // 验证码校验
};
