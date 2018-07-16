//
//  AppDelegate+SDK.m
//  yryzApp
//
//  Created by shibo on 2017/11/7.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "AppDelegate+SDK.h"
#import <UMCommon/UMCommon.h>
#import <UMAnalytics/MobClick.h>

#import <RCTJPushModule.h>
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif

#import <ShareSDK/ShareSDK.h>
#import <ShareSDKConnector/ShareSDKConnector.h>
#import <TencentOpenAPI/TencentOAuth.h>
#import <TencentOpenAPI/QQApiInterface.h>
#import "WXApi.h"
#import "WeiboSDK.h"
#import <Bugly/Bugly.h>
#import <ydk-ios/YdkKit.h>
#import "YDKTracker.h"

@implementation AppDelegate (SDK)

///配置三方 SDK
- (void)configurationThirdPartySDKWithLaunchOptions:(NSDictionary *)launchOptions {

  [self setJPushWithLaunchOptions:launchOptions JsonObject:Ydk.shared.config];

  NSString *umAppKey = [Ydk.shared.config valueForKeyPath:UM_APPKEY];
  NSString *buglyAppId = [Ydk.shared.config valueForKeyPath:BUGLY_APPID];
  [Bugly startWithAppId:buglyAppId];
  [UMConfigure initWithAppkey:umAppKey channel:@"App Store"];
  [MobClick setScenarioType:E_UM_NORMAL];
  //YDK初始化
  [Ydk build];
  
  //增加埋点实例化
  YDKTracker *tacker = [[YDKTracker alloc] init];
  Ydk.shared.configTrack(tacker);
}


#pragma mark -- SHARESDK

- (void)setShareSDKWithJsonObject:(id)jsonObject{

  NSArray *platforms = @[@(SSDKPlatformTypeSinaWeibo),
                         @(SSDKPlatformTypeWechat),
                         @(SSDKPlatformTypeQQ)];

  [ShareSDK registerActivePlatforms:platforms onImport:^(SSDKPlatformType platformType) {
    [self registerActiveonImport:platformType];
  } onConfiguration:^(SSDKPlatformType platformType, NSMutableDictionary *appInfo) {
    [self setShareSDKKey:platformType APPInfo:appInfo JsonObject:(id)jsonObject];
  }];

}

- (void)registerActiveonImport:(SSDKPlatformType)platformType{

  switch (platformType) {
    case SSDKPlatformTypeSinaWeibo:
      [ShareSDKConnector connectWeibo:[WeiboSDK class]];
      break;
    case SSDKPlatformTypeWechat:
      [ShareSDKConnector connectWeChat:[WXApi class]];
      break;
    case SSDKPlatformTypeQQ:
      [ShareSDKConnector connectQQ:[QQApiInterface class] tencentOAuthClass:[TencentOAuth class]];
      break;
    default:
      break;
  }
}

- (void)setShareSDKKey:(SSDKPlatformType)platformType APPInfo:(NSMutableDictionary *)appInfo JsonObject:(id)jsonObject{

  NSString *sinaAppKey = [jsonObject valueForKeyPath:SINA_APPKEY];
  NSString *sinaAppSecret = [jsonObject valueForKeyPath:SINA_APPSECRET];
  NSString *sinaRedirectUri = [jsonObject valueForKeyPath:SINA_REDIRECTURI];
  NSString *wechatAppId = [jsonObject valueForKeyPath:WECHAT_APPID];
  NSString *wechatAppSecret = [jsonObject valueForKeyPath:WECHAT_APPSECRET];
  NSString *qqAppKey = [jsonObject valueForKeyPath:QQ_APPKEY];
  NSString *qqAppId = [jsonObject valueForKeyPath:QQ_APPID];

  switch (platformType) {
    case SSDKPlatformTypeSinaWeibo:
      [appInfo SSDKSetupSinaWeiboByAppKey:sinaAppKey
                                appSecret:sinaAppSecret
                              redirectUri:sinaRedirectUri
                                 authType:SSDKAuthTypeBoth];
      break;
    case SSDKPlatformTypeWechat:
      [appInfo SSDKSetupWeChatByAppId:wechatAppId
                            appSecret:wechatAppSecret];
      break;
    case SSDKPlatformTypeQQ:
      [appInfo SSDKSetupQQByAppId:qqAppId
                           appKey:qqAppKey
                         authType:SSDKAuthTypeBoth];
      break;
    default:
      break;
  }
}

#pragma mark -- BUGLY AND ZHUGE

#pragma mark -- JPUSH

- (void)setJPushWithLaunchOptions:(NSDictionary *)launchOptions JsonObject:(id)jsonObject{

  if ([[UIDevice currentDevice].systemVersion floatValue] >= 10.0) {
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
    JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
    entity.types = UNAuthorizationOptionAlert|UNAuthorizationOptionBadge|UNAuthorizationOptionSound;
    [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];

#endif
  } else if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
    [JPUSHService registerForRemoteNotificationTypes:(UIUserNotificationTypeBadge |
                                                      UIUserNotificationTypeSound |
                                                      UIUserNotificationTypeAlert)
                                          categories:nil];
  }
  NSString *jpushAppKey = [jsonObject objectForKey:JPUSH_APPKEY];
  BOOL apsForProduction = [[jsonObject objectForKey:APSFORPRODUCTION] boolValue];
  //NSLog(@"apsForProduction:%d",apsForProduction);
  [JPUSHService setupWithOption:launchOptions appKey:jpushAppKey
                        channel:@"" apsForProduction:apsForProduction];

  NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
  [defaultCenter addObserver:self selector:@selector(networkDidReceiveMessage:) name:kJPFNetworkDidReceiveMessageNotification object:nil];
}

//通知方法
- (void)networkDidLoginMessage:(NSNotification *)notification {
  //注销通知
  [[NSNotificationCenter defaultCenter] removeObserver:self name:kJPFNetworkDidLoginNotification object:nil];
}
//自定义消息透传
- (void)networkDidReceiveMessage:(NSNotification *)notification {
  
  NSDictionary * userInfo = [notification userInfo];
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFOpenNotification object:userInfo];

}

@end
