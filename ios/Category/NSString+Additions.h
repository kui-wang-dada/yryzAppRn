//
//  NSString+Additions.h
//  quanhu30
//
//  Created by lirui on 2018/5/8.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSString (Additions)
///获取缓存文件路径
+ (NSString *)getCachesPath;

///计算缓存文件的大小，多少M
+ (double)fileSizeAtPath:(NSString *)cachPath;

+ (void)cleanCacheWithCompletionBlock:(void(^)(BOOL success))completion;
@end
