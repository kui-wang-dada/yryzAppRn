//
//  Common.m
//  quanhu30
//
//  Created by lirui on 2018/5/8.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "CacheClear.h"
#import "NSString+Additions.h"
@implementation CacheClear

// 将当前类设置为主线程
- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}


RCT_EXPORT_MODULE()

///获取缓存大小
RCT_EXPORT_METHOD(getCacheSize:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    
    NSString *cachePath = [NSString getCachesPath];
    double cacheSize = [NSString fileSizeAtPath:cachePath];
    NSDictionary *cacheDic = @{@"cacheSize":@(cacheSize)};
    
    if (cacheDic) {
        resolve(cacheDic);
    }else{
        reject(@"-100",@"获取失败",[NSError errorWithDomain:@"错误" code:1 userInfo:nil]);
    }
}

///清除缓存
RCT_EXPORT_METHOD(clearCache:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    
    NSError *error;
    [NSString cleanCacheWithCompletionBlock:^(BOOL success) {
        if (success) {
            resolve(@(true));
        }else{
            reject(@"-100",@"清除失败",error);
        }
    }];
}

@end
