package com.rz.rz_rrz.react.modules;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.rz.rz_rrz.util.LoadingPage;

import cn.jpush.android.api.JPushInterface;

/**
 * Created by Gsm on 2018/6/27.
 */
public class SplashModule extends ReactContextBaseJavaModule {
    public SplashModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SplashScreen";
    }

    @ReactMethod
    public void closeLoadingPage() {
        LoadingPage.close(getCurrentActivity());
    }


    @ReactMethod
    public void showLoadingPage() {
        LoadingPage.show(getCurrentActivity(), true);
    }
}
