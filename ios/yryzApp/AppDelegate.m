/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>
#import <RCTJPushModule.h>
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>
#import "AppDelegate+SDK.h"

@interface AppDelegate ()<JPUSHRegisterDelegate>

@end

@implementation AppDelegate {
    id   jsonObject;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions{
  
  NSURL *jsCodeLocation;
  
    #ifdef DEBUG
        jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
    #else
//        jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
        jsCodeLocation = [CodePush bundleURL];
    #endif
    
    RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                        moduleName:@"yryz_app"
                                                 initialProperties:nil
                                                     launchOptions:launchOptions];
  
    //增加loadingView
    CGRect viewBounds= [UIScreen mainScreen].bounds;
    NSString *viewOrientation = @"Portrait";
    NSString *launchImageName = nil;
    NSArray* imagesDict = [[[NSBundle mainBundle] infoDictionary] valueForKey:@"UILaunchImages"];
    for (NSDictionary* dict in imagesDict) {
      CGSize imageSize = CGSizeFromString(dict[@"UILaunchImageSize"]);
      if (CGSizeEqualToSize(imageSize, viewBounds.size) && [viewOrientation isEqualToString:dict[@"UILaunchImageOrientation"]]) {
          launchImageName = dict[@"UILaunchImageName"];
      }
    }
    [rootView setFrame:viewBounds];
    UIImageView *launchScreenView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:launchImageName]];
    [launchScreenView setFrame:[UIScreen mainScreen].bounds];
    [rootView setLoadingView: launchScreenView];
  
    rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
    UIViewController *rootViewController = [UIViewController new];
    rootViewController.view = rootView;
  
    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    self.window.rootViewController = rootViewController;
    [self.window makeKeyAndVisible];
    [self getAppKeyJson]; //获取配置信息
    [self configurationThirdPartySDKWithLaunchOptions:launchOptions]; //配置三方SDK
    return YES;
}

- (void)getAppKeyJson{
    NSString *filePath = [[ NSBundle mainBundle ] pathForResource:@"env" ofType:@"json"];
    NSData *jdata = [[ NSData alloc ] initWithContentsOfFile:filePath];
    jsonObject = [NSJSONSerialization JSONObjectWithData:jdata options:kNilOptions error:nil]?:[NSDictionary new];
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options{
    
    return [RCTLinkingManager application:app openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
    return [RCTLinkingManager application:application openURL:url
                        sourceApplication:sourceApplication annotation:annotation];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [JPUSHService registerDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)   (UIBackgroundFetchResult))completionHandler {
    
    if (SYSTEMVERSION < 10) {
        // 如果是10以下，则推送本地推送，因为10以上JPush已做了本地推送
        [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
    }
}

- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler {
    NSDictionary * userInfo = notification.request.content.userInfo;
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
    
    completionHandler(UNNotificationPresentationOptionAlert);
}

- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler {
    NSDictionary * userInfo = response.notification.request.content.userInfo;
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFOpenNotification object:userInfo];
    
    completionHandler();
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:notification.userInfo];
}



@end
