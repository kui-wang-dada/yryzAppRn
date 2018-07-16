
import { http } from "@services";



export async function releaseResource(content, contentType, imgUrl, squareKid, videoDuration, videoThumbnailUrl, videoUrl) {

	let config = {
		url: '/services/app/v1/square/post/add',
		method: 'post',
		data: {
			content: content,
			contentType: contentType,
			imgUrl: imgUrl,
			squareKid: squareKid,
			videoDuration: videoDuration,
			videoThumbnailUrl: videoThumbnailUrl,
			videoUrl: videoUrl
		}
	}

	return await http(config);
}
