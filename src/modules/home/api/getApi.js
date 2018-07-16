import api from './api'
import { cache } from '@utils'
import { http } from '@services'

const getHomeRecommend = async (data) => {
	let url = api.homeRecommend
	let params = data
	let dataCallback = (await http({ url, params })).data.data
	return dataCallback
}

const getHomeVideo = async (pageNo = 1, pageSize = 10) => {
	let url = `${api.homeVideo}/${pageNo}/${pageSize}`
	let dataCallback
	if (pageNo === 1) {
		await cache(url, (res, type) => {
			if (type === "fromhttp") {
				dataCallback = res.data.data;
			}
		})
	} else {
		await http(url, (res) => {
			dataCallback = res.data.data;

		})
	}
	return dataCallback

}

const getHomeInterest = async (pageNo = 1, pageSize = 10, classifyId) => {
	let url = `${api.homeInterest}/${pageNo}/${pageSize}`
	let params = {
		classifyId: classifyId
	}
	let dataCallback
	if (pageNo === 1) {
		await cache({ url, params }, (res) => {
			dataCallback = res.data.data;

		})
	} else {
		await http({ url, params }, (res) => {
			dataCallback = res.data.data
		})
	}
	return dataCallback
}

const getHomeInterestTab = async () => {
	let url = api.homeInterestTab

	let dataCallback = (await http(url)).data.data

	return dataCallback
}

export {
	getHomeRecommend,
	getHomeVideo,
	getHomeInterest,
	getHomeInterestTab
}