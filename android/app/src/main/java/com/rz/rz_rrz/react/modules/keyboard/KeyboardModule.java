package com.rz.rz_rrz.react.modules.keyboard;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.rz.rz_rrz.MainApplication;
import com.rz.rz_rrz.util.KeyboardUtil;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by Gsm on 2018/7/10.
 */
public class KeyboardModule extends ReactContextBaseJavaModule {

    private static final int MODE_RESIZE = 0;
    private static final int MODE_NOTHING = 1;

    public KeyboardModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        HashMap<String, Object> hashMap = new HashMap<>();
        hashMap.put("resize", MODE_RESIZE);
        hashMap.put("nothing", MODE_NOTHING);
        return hashMap;
    }

    @Override
    public String getName() {
        return "KeyboardModule";
    }

    @ReactMethod
    public void changeKeyboardMode(int modeType, Promise promise) {
        boolean isResize = modeType != MODE_NOTHING;
        new KeyboardUtil().changeSoftInputMode(getCurrentActivity(), isResize);
        promise.resolve(true);
    }

    @ReactMethod
    public void getKeyboardHeight(Promise promise) {
        int keyboardHeight = ((MainApplication) getCurrentActivity().getApplication()).getKeyboardHeight();
        WritableMap map = Arguments.createMap();
        map.putInt("keyboardHeight", keyboardHeight);
        promise.resolve(map);
    }
}
