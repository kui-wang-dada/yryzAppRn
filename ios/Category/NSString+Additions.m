//
//  NSString+Additions.m
//  quanhu30
//
//  Created by lirui on 2018/5/8.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "NSString+Additions.h"

@implementation NSString (Additions)
///获取缓存文件路径
+ (NSString *)getCachesPath{
    // 获取Caches目录路径
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
    NSString *cachesDir = [paths objectAtIndex:0];
    
    //指定文件名
    // NSString *filePath = [cachesDir stringByAppendingPathComponent:@"com.nickcheng.NCMusicEngine"];
    return cachesDir;
}

///计算缓存文件的大小，多少M
+ (double)fileSizeAtPath:(NSString *)cachPath{
    
    NSFileManager* fileManger = [NSFileManager defaultManager];
    
    //通过缓存文件路径创建文件遍历器
    NSDirectoryEnumerator * fileEnumrator = [fileManger enumeratorAtPath:cachPath];
    
    //先定义一个缓存目录总大小的变量
    unsigned long long fileTotalSize = 0;
    
    for (NSString * fileName in fileEnumrator)
        {
        //拼接文件全路径（注意：是文件）
        NSString * filePath = [cachPath stringByAppendingPathComponent:fileName];
        
        //获取文件属性
        NSDictionary * fileAttributes = [fileManger attributesOfItemAtPath:filePath error:nil];
        
        //根据文件属性判断是否是文件夹（如果是文件夹就跳过文件夹，不将文件夹大小累加到文件总大小）
        if ([fileAttributes[NSFileType] isEqualToString:NSFileTypeDirectory]) continue;
        
        //获取单个文件大小,并累加到总大小
        fileTotalSize += [fileAttributes[NSFileSize] integerValue];
        }
    
    //float ff = fileTotalSize/1024.0/1024.0; //换算成多少M
    //NSString *size = [NSString stringWithFormat:@"%0.2fM",ff];
    double ff = fileTotalSize; //换算成多少B
    //  NSString *size = [NSString stringWithFormat:@"%f",ff];
    
    return ff;
}

+ (void)cleanCacheWithCompletionBlock:(void(^)(BOOL success))completion {
    
    dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
    NSString *cacheDirectory = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) firstObject];
    dispatch_async(queue, ^{
        NSError *error;
        NSDirectoryEnumerator *fileEnumeratorCache = [[NSFileManager defaultManager] enumeratorAtPath:[NSString getCachesPath]];
        for (NSString *fileName in fileEnumeratorCache) {
            NSString *filePath = [cacheDirectory stringByAppendingPathComponent:fileName];
            if ([[NSFileManager defaultManager] fileExistsAtPath:filePath]) {
                [[NSFileManager defaultManager] removeItemAtPath:filePath error:&error];
            }
        }
        
        if (completion) {
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(YES);
            });
        }
    });
}

@end
