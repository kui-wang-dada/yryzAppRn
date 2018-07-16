//
//  RCTBaseTextInputShadowViewyryz.m
//  yryzApp
//
//  Created by 悠然一指 on 2018/5/29.
//  Copyright © 2018年 yryz. All rights reserved.
//

#import "RCTBaseTextInputShadowView+yryz.h"
#import <objc/runtime.h>

@implementation RCTBaseTextInputShadowView (yryz)

+ (void)load {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    Class class = [self class];
    
    SEL originalSelector = @selector(setText:);
    SEL swizzledSelector = @selector(yr_setText:);
    
    Method originalMethod = class_getInstanceMethod(class, originalSelector);
    Method swizzledMethod = class_getInstanceMethod(class, swizzledSelector);
    
    BOOL success = class_addMethod(class, originalSelector, method_getImplementation(swizzledMethod), method_getTypeEncoding(swizzledMethod));
    if (success) {
      class_replaceMethod(class, swizzledSelector, method_getImplementation(originalMethod), method_getTypeEncoding(originalMethod));
    } else {
      method_exchangeImplementations(originalMethod, swizzledMethod);
    }
  });
}

// MARK: - Method Swizzling
- (void)yr_setText:(NSString *)text {
  [self yr_setText:text];
  [self setValue:[self valueForKey:@"_localAttributedText"] forKey:@"_previousAttributedText"]; // origin: _previousAttributedText = _localAttributedText;
}

@end
