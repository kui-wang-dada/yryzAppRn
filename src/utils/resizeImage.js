import nodeUrl from 'url';

const resizeImage = (url, mode = 'article-item') => {
	const urlObject = nodeUrl.parse(url, true);
	const extraParams = modes[mode];

	if (!extraParams) {
		console.error(`'${mode}' is not a valid resizing mode, will affect nothing.`);
		return url;
	}

	Object.assign(urlObject.query, parseExtraParams(extraParams));
	delete urlObject.search;
	const newUrl = nodeUrl.format(urlObject);
	return newUrl;
};

const parseExtraParams = (params) => {
	return {
		'x-oss-process': Object.keys(params).reduce((result, key) => `${result},${key}_${params[key]},`, 'image/resize')
	};
};

const to2x = (number) => Number.parseInt(number / 3 * 2);

const modes = {
	'article-item': {
		'w': to2x(1142),
		'h': to2x(514),
		'm': 'mfit'
	},
	'article-item-s': {
		'w': to2x(384),
		'h': to2x(296),
		'm': 'mfit'
	},
};

export default resizeImage;