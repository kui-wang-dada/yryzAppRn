//
//  YRJPushModule.m
//  yryzApp
//
//  Created by 悠然一指 on 2018/7/2.
//  Copyright © 2018年 yryz. All rights reserved.
//

#import "YRJPushModule.h"
#import "JPUSHService.h"

@implementation YRJPushModule

RCT_EXPORT_MODULE(PushModule)

RCT_EXPORT_METHOD(getRegisterId:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
  [JPUSHService registrationIDCompletionHandler:^(int resCode, NSString *registrationID) {
    if (resCode == 1011) {
      rejecter(@"-100", @"获取失败",[NSError errorWithDomain:@"错误" code:-100 userInfo:nil]);
    }else{
      resolver(registrationID?:@"");
    }
  }];
}

@end
