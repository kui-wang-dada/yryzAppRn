import { http } from "@services";

// 请求接口
const transitionAPI = {
	saveInterest: '/services/app/v3/user/label/save', //保存标签
	interesList: '/services/app/v3/user/label/list', //标签列表
	getUserInterests: '/services/app/v3/user/label/list/user' //获取用户标签
}

//保存标签
export async function saveInterests(checkItems, isUpdate = false) {
	let data = {
		ids: checkItems,
		updateFlag: isUpdate
	}
	return await http.post(transitionAPI.saveInterest, data);
}

//获取标签
export async function getInterestList() {

	return await http.get(transitionAPI.interesList)
}

//获取用户标签
export async function getUserInterestList() {

	return await http.get(transitionAPI.getUserInterests)
}
