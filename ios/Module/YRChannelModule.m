//
//  YRChannelModule.m
//  yryzApp
//
//  Created by 悠然一指 on 2018/7/11.
//  Copyright © 2018年 yryz. All rights reserved.
//

#import "YRChannelModule.h"

@implementation YRChannelModule

RCT_EXPORT_MODULE(ChannelModule)

RCT_EXPORT_METHOD(getChannelName:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
  resolver(@{@"channel" : @"AppStore"});
}

@end
