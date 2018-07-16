package com.rz.rz_rrz.util;

import android.app.Activity;
import android.app.Dialog;

import com.rz.rz_rrz.R;

import java.lang.ref.WeakReference;

public class LoadingPage {
    private static Dialog mSplashDialog;
    private static WeakReference<Activity> mActivity;

    /**
     * 打开启动屏
     */
    public static void show(final Activity activity, final boolean isload) {
        if (activity == null) return;
        mActivity = new WeakReference<Activity>(activity);
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (!activity.isFinishing()) {

                    mSplashDialog = new Dialog(activity, isload ? R.style.SplashScreen_Fullscreen : R.style.SplashScreen_SplashTheme);
                    mSplashDialog.setContentView(R.layout.loading_view);
                    mSplashDialog.setCancelable(false);

                    if (!mSplashDialog.isShowing()) {
                        mSplashDialog.show();
                    }
                }
            }
        });
    }

    public static void open(final Activity activity) {
        show(activity, false);
    }

    /**
     * 关闭启动屏
     */
    public static void close(Activity activity) {
        if (activity == null) activity = mActivity.get();
        if (activity == null) return;

        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (mSplashDialog != null && mSplashDialog.isShowing()) {
                    mSplashDialog.dismiss();
                }
            }
        });
    }
}
