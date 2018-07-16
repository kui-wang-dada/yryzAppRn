import SearchVideo from './SearchVideo';
import SearchArtical from './SearchArtical';
import SearchApp from './SearchApp';

export default searchTab = [
	{ cat: '趣文', tabComp: SearchArtical, moduleCode: '1002' },
	{ cat: '视频', tabComp: SearchVideo, moduleCode: '1007' },
	{ cat: '应用', tabComp: SearchApp, moduleCode: '1001' },
];