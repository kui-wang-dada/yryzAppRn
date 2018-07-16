//
//  RCTBaseTextInputView+yryz.m
//  yryzApp
//
//  Created by 悠然一指 on 2018/5/29.
//  Copyright © 2018年 yryz. All rights reserved.
//

#import "RCTBaseTextInputView+yryz.h"
#import <objc/runtime.h>

@implementation RCTBaseTextInputView (yryz)

+ (void)load {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    Class class = [self class];
    
    SEL originalSelector = @selector(textInputDidChange);
    SEL swizzledSelector = @selector(yr_textInputDidChange);
    
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
- (void)yr_textInputDidChange {
  
#pragma clang diagnostic push
#pragma clang diagnostic ignored"-Wundeclared-selector"
  [self performSelector:@selector(updateLocalData)]; // origin: //  [self updateLocalData];
#pragma clang diagnostic pop
  
  id<RCTBackedTextInputViewProtocol> backedTextInputView = self.backedTextInputView;
  
  // Detect when `backedTextInputView` updates happend that didn't invoke `shouldChangeTextInRange`
  // (e.g. typing simplified chinese in pinyin will insert and remove spaces without
  // calling shouldChangeTextInRange).  This will cause JS to get out of sync so we
  // update the mismatched range.
  NSRange currentRange;
  NSRange predictionRange;
  if (findMismatch(backedTextInputView.attributedText.string, [self valueForKey:@"_predictedText"]/* origin: _predictedText */, &currentRange, &predictionRange)) {
    NSString *replacement = [backedTextInputView.attributedText.string substringWithRange:currentRange];
    [self textInputShouldChangeTextInRange:predictionRange replacementText:replacement];
    // JS will assume the selection changed based on the location of our shouldChangeTextInRange, so reset it.
    [self textInputDidChangeSelection];
    [self setValue:backedTextInputView.attributedText.string forKey:@"_predictedText"]; // origin: _predictedText = backedTextInputView.attributedText.string;
  }
  
  NSInteger _nativeEventCount = [[self valueForKey:@"_nativeEventCount"] integerValue];
  _nativeEventCount++;
  [self setValue:@(_nativeEventCount) forKey:@"_nativeEventCount"]; // _nativeEventCount++;
  
  if (self.onChange && backedTextInputView.markedTextRange == nil) {
    self.onChange(@{
                    @"text": self.attributedText.string,
                    @"target": self.reactTag,
                    @"eventCount": @(_nativeEventCount),
                    });
  }
}

// MRK: - Static Method
static BOOL findMismatch(NSString *first, NSString *second, NSRange *firstRange, NSRange *secondRange)
{
  NSInteger firstMismatch = -1;
  for (NSUInteger ii = 0; ii < MAX(first.length, second.length); ii++) {
    if (ii >= first.length || ii >= second.length || [first characterAtIndex:ii] != [second characterAtIndex:ii]) {
      firstMismatch = ii;
      break;
    }
  }
  
  if (firstMismatch == -1) {
    return NO;
  }
  
  NSUInteger ii = second.length;
  NSUInteger lastMismatch = first.length;
  while (ii > firstMismatch && lastMismatch > firstMismatch) {
    if ([first characterAtIndex:(lastMismatch - 1)] != [second characterAtIndex:(ii - 1)]) {
      break;
    }
    ii--;
    lastMismatch--;
  }
  
  *firstRange = NSMakeRange(firstMismatch, lastMismatch - firstMismatch);
  *secondRange = NSMakeRange(firstMismatch, ii - firstMismatch);
  return YES;
}

@end
