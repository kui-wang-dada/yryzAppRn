package com.rz.rz_rrz.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.rz.rz_rrz.R;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.yryz.ydk.BuildConfig;
import com.yryz.ydk.pay.WeChatPay;

public class WXPayEntryActivity extends Activity implements IWXAPIEventHandler {

    private IWXAPI wxapi;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_wxpay_entry);
        wxapi = WXAPIFactory.createWXAPI(this, BuildConfig.wechatAppId);
        wxapi.handleIntent(getIntent(), this);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        wxapi.handleIntent(getIntent(), this);
    }

    @Override
    public void onReq(BaseReq baseReq) {
    }

    @Override
    public void onResp(BaseResp baseResp) {
        finish();
        WeChatPay.Companion.resp(baseResp);
    }
}
