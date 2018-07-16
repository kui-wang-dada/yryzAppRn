package com.rz.rz_rrz;

import com.umeng.analytics.MobclickAgent;
import com.yryz.ydk.Ydk;
import com.yryz.ydk.track.TrackEventAgent;

import java.util.Map;

/**
 * Created by Gsm on 2018/6/29.
 */
public class MyTrackEventAgent implements TrackEventAgent {
    @Override
    public boolean track(String eventName, Map map) {
        map.put("app", "yryz");
        MobclickAgent.onEvent(Ydk.getInstance().getApplicationContext(), eventName, map);
        return true;
    }
}
