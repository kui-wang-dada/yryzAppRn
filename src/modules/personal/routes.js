import PersonalScreen from './PersonalScreen'
import MyFavorite from './MyFavorite'
import SettingScreen from './SettingScreen'
import Profile from './Profile';
import MyProfileScreen from './MyProfileScreen'
import EditMyProfileScreen from './EditMyProfileScreen'
import InviteFriends from './InviteFriends'
import { routes as messageRoutes } from './message';
import { routes as rechargeRoutes } from './recharge';
import { routes as attentionRoutes } from './attention';
import CustomService from './CustomService';
import Help from './Help';

const PersonalRoute = {
	...messageRoutes,
	...rechargeRoutes,
	...attentionRoutes,
	PersonalScreen: {
		screen: PersonalScreen,
		tabBarVisible: false,
	},
	SettingScreen: {
		screen: SettingScreen,
		tabBarVisible: false,
	},
	Profile: {
		screen: Profile,
	},
	MyFavorite: {
		screen: MyFavorite,
	},
	MyProfile: {
		screen: MyProfileScreen,
		tabBarVisible: false,
	},
	CustomService: {
		screen: CustomService,
	},
	EditMyProfile: {
		screen: EditMyProfileScreen,
		tabBarVisible: false,
	},
	Help: {
		screen: Help
	},
	InviteFriends: {
		screen: InviteFriends,
	}
}

export default PersonalRoute
