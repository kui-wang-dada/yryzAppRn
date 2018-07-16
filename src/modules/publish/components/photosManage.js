import {
	Media,
	HttpManager
} from 'ydk-react-native';
import { Alert } from '@components';


///选择多张图片，无裁剪
async function seletePhotos(maxNum) {
	const config = {
		type: Media.image,
		style: { numColumns: 4, showCamera: false },
		picture: { maxNum: maxNum, isCrop: false, cropScale: 1.0 }
	}
	return await Media.picturePick(config)
}

///选择单张图片，有裁剪
async function seletePhoto() {
	const config = {
		type: Media.image,
		style: { numColumns: 4, showCamera: false },
		picture: { maxNum: 1, isCrop: true, cropScale: 1.0 }
	}
	return await Media.picturePick(config)
}

///选择视频
async function seleteVideo() {
	const config = {
		type: Media.video,
		style: { numColumns: 4, showCamera: false },
		picture: { maxNum: 1, isCrop: true, cropScale: 1.0 }
	}
	return await Media.picturePick(config)
}

///上传多个资源
function uploadDatas(datas, callback) {
	let datasStr = ''
	let j = 0
	for (let i = 0; i < datas.length; i++) {
		HttpManager.upload(datas[i]).then(res => {
			j++;
			const { url, width, height } = res
			let uri = `${url}?w=${width}&h=${height}`

			if (datasStr) {
				datasStr = datasStr + ',' + uri
			} else {
				datasStr = uri
			}
			if (j === (datas.length)) {
				callback(datasStr)
			}
		})
	}
}

///上传单个资源
function uploadData(data, callback) {
	HttpManager.upload(data).then(res => {
		const { url, width, height } = res
		let uri = `${url}?w=${width}&h=${height}`
		callback(uri)
	})
}
function uploadVideoData(data, callback) {
	HttpManager.upload(data).then(res => {
		const { url } = res
		callback(url)
	})
}



export default {
	seletePhoto,
	seletePhotos,
	seleteVideo,
	uploadDatas,
	uploadData,
	uploadVideoData
}











