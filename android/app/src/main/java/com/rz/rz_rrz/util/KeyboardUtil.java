package com.rz.rz_rrz.util;

import android.app.Activity;
import android.app.Application;
import android.view.WindowManager;
import android.widget.FrameLayout;

import com.rz.rz_rrz.MainApplication;
import com.yryz.ydk.utils.DensityUtils;

/**
 * Created by Gsm on 2018/7/10.
 */
public class KeyboardUtil {

    public void changeSoftInputMode(Activity activity, boolean isResize) {
        int mode = isResize ? WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE : WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING;
        activity.runOnUiThread(() -> activity.getWindow().setSoftInputMode(mode));
    }

    public void calculationKeyboard(Activity activity) {
        int keyHeight = DensityUtils.getScreenH(activity) / 3;
        FrameLayout content = activity.findViewById(android.R.id.content);
        content.addOnLayoutChangeListener((v, left, top, right, bottom, oldLeft, oldTop, oldRight, oldBottom) -> {
            //若将content向上推了屏幕的1/3则认为将软键盘弹起
            if (oldBottom != 0 && bottom != 0 && (oldBottom - bottom) > keyHeight) {
                int keyboardHeight = oldBottom - bottom;
                Application application = activity.getApplication();
                ((MainApplication) application).setKeyboardHeight(keyboardHeight);
                SysSharedPreferences.getInstance().setKeyboardHeight(keyboardHeight);
            }
        });
    }
}
