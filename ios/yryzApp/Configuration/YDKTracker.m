//
//  YDKTracker.m
//  yryzApp
//
//  Created by lirui on 2018/6/20.
//  Copyright © 2018年 yryz. All rights reserved.
//

#import "YDKTracker.h"
#import <UMAnalytics/MobClick.h>
@interface YDKTracker ()

@end

@implementation YDKTracker

- (void)event:(NSString *)eventId attributes:(NSDictionary *)attributes {
  [MobClick event:eventId attributes:attributes];
}

@end
