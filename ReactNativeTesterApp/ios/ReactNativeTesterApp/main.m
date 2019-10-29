/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <UIKit/UIKit.h>
@import DTXProfiler;
#import "AppDelegate.h"

int main(int argc, char * argv[]) {
	@autoreleasepool {
//		DTXMutableProfilingConfiguration* config = [DTXMutableProfilingConfiguration defaultProfilingConfiguration];
//		config.recordReactNativeBridgeData = YES;
//		config.recordInternalReactNativeEvents = YES;
//		config.recordingFileURL = [NSURL fileURLWithPath:@"/Users/lnatan/Desktop/Testing.dtxrec"];
//		
//		DTXProfiler* _ = [DTXProfiler new];
//		[_ continueProfilingWithConfiguration:config];
//		
//		dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(15 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//			[_ stopProfilingWithCompletionHandler:^(NSError * _Nullable error) {
//				NSLog(@"👹");
//			}];
//		});
		
		return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
	}
}
