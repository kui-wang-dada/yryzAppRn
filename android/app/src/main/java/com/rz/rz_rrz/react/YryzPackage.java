package com.rz.rz_rrz.react;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.rz.rz_rrz.react.modules.ChannelModule;
import com.rz.rz_rrz.react.modules.JPushModule;
import com.rz.rz_rrz.react.modules.SplashModule;
import com.rz.rz_rrz.react.modules.keyboard.KeyboardModule;
import com.rz.rz_rrz.react.modules.viewpager.YryzViewPagerManager;

import java.util.Arrays;
import java.util.List;

/**
 * Created by Gsm on 2018/6/27.
 */
public class YryzPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.asList(
                new JPushModule(reactContext),
                new ChannelModule(reactContext),
                new SplashModule(reactContext),
                new KeyboardModule(reactContext)
        );
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.asList(
                new YryzViewPagerManager()
        );
    }
}
