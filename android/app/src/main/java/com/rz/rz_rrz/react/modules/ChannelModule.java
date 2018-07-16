package com.rz.rz_rrz.react.modules;

import android.content.pm.PackageManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

/**
 * Created by Gsm on 2018/7/5.
 */
public class ChannelModule extends ReactContextBaseJavaModule {
    public ChannelModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ChannelModule";
    }

    @ReactMethod
    public void getChannelName(Promise promise) {
        try {
            String channelName = getCurrentActivity().getPackageManager().getApplicationInfo(getCurrentActivity().getPackageName(), PackageManager.GET_META_DATA).metaData.getString("UMENG_CHANNEL", "");
            WritableMap map = Arguments.createMap();
            map.putString("channel", channelName);
            promise.resolve(map);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
            promise.reject("500", e);
        }

    }
}
