package com.rz.rz_rrz;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.rz.rz_rrz.util.KeyboardUtil;
import com.rz.rz_rrz.util.LoadingPage;
import com.umeng.analytics.MobclickAgent;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "yryz_app";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        LoadingPage.show(this, true);
        new KeyboardUtil().calculationKeyboard(this);
        super.onCreate(savedInstanceState);
    }

    @Override
    protected void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);
    }

    @Override
    protected void onStart() {
        super.onStart();
    }

    @Override
    protected void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
    }
}
