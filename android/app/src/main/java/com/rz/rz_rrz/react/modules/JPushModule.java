package com.rz.rz_rrz.react.modules;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import cn.jpush.android.api.JPushInterface;

/**
 * Created by Gsm on 2018/6/27.
 */
public class JPushModule extends ReactContextBaseJavaModule {
    public JPushModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PushModule";
    }

    @ReactMethod
    public void getRegisterId(Promise promise) {
        String registrationID = JPushInterface.getRegistrationID(getReactApplicationContext());
        promise.resolve(registrationID);
    }
}
