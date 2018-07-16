package com.rz.rz_rrz.util;

import android.content.Context;
import android.content.SharedPreferences;

import com.yryz.ydk.Ydk;
import com.yryz.ydk.utils.DensityUtils;

/**
 * Created by Gsm on 2018/7/10.
 */
public class SysSharedPreferences {
    private static final String NAME = "yryzSysSP";
    private static final String KEYBOARD_HEIGHT = "keyboardHeight";
    private static SharedPreferences sysSp;
    private static SysSharedPreferences instance;
    private static int defaultHeight;

    private SysSharedPreferences() {
        Context context = Ydk.getInstance().getApplicationContext();
        defaultHeight = DensityUtils.getScreenH(context) * 2 / 5;
        sysSp = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
    }

    public static SysSharedPreferences getInstance() {
        if (instance == null) {
            synchronized (SysSharedPreferences.class) {
                if (instance == null)
                    instance = new SysSharedPreferences();
            }
        }
        return instance;
    }

    public void setKeyboardHeight(int height) {
        sysSp.edit().putInt(KEYBOARD_HEIGHT, height).apply();
    }

    public int getKeyboardHeight() {
        return sysSp.getInt(KEYBOARD_HEIGHT, defaultHeight);
    }

}
