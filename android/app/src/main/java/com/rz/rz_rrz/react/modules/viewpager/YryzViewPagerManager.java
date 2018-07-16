package com.rz.rz_rrz.react.modules.viewpager;

import android.content.Context;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.viewpager.ReactViewPager;
import com.facebook.react.views.viewpager.ReactViewPagerManager;
import com.yryz.ydk.utils.DensityUtils;

/**
 * Created by Gsm on 2018/6/29.
 */
public class YryzViewPagerManager extends ReactViewPagerManager {
    @Override
    public String getName() {
        return "YryzViewPagerAndroid";
    }

    @ReactProp(name = "clipToPadding", defaultBoolean = true)
    public void setClipToPadding(ReactViewPager pager, boolean value) {
        pager.setClipToPadding(value);
    }

    @ReactProp(name = "clipPadding")
    public void setClipPadding(ReactViewPager pager, ReadableMap map) {
        pager.setPadding(getPadding(pager.getContext(), map, "left"),
                getPadding(pager.getContext(), map, "top"),
                getPadding(pager.getContext(), map, "right"),
                getPadding(pager.getContext(), map, "bottom"));
    }

    private int getPadding(Context context, ReadableMap map, String key) {
        return map.hasKey(key) ? DensityUtils.dip2px(context, map.getInt(key)) : 0;
    }
}
