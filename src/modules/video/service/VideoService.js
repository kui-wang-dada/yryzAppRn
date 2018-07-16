
import { http } from "@services";
import Api from './Api';

export async function like(isLike, moduleCode, infoId) {
	let data = { moduleCode, infoId };
	const method = isLike ? 'POST' : 'DELETE';
	return await http({
		method,
		url: Api.like,
		data: data
	});
}

export async function collect(isCollect, moduleCode, infoId) {
	let data = { moduleCode, infoId };
	const method = isCollect ? 'POST' : 'DELETE';
	return await http({
		method,
		url: Api.collect,
		data: data
	});
}

export async function behavior(ids) {
	let url = Api.behavior;
	let params = { articleIds: ids };
	return await http({ url, params })
}

// 视频详情 detail
export async function detail(id) {
	let url = `${Api.detail}${id}`;
	return await http.get(url);
}

export async function share(moduleCode, infoId) {
	let params = { moduleCode, infoId }
	return await http.post(Api.share, params);
}

export async function click(id) {
	let url = `${Api.videoClick}${id}`;
	return await http.get(url);
}

