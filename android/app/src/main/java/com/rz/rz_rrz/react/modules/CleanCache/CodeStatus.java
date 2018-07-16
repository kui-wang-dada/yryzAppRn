package com.rz.rz_rrz.react.modules.CleanCache;

/**
 * Created by lirui on 2018/5/9.
 */

public interface CodeStatus {
    interface JsCode {
        String TYPE_ERROR = "-100";
        String TYPE_CANCEL = "-101";
        String TYPE_SUCCESS = "100";
    }

    interface Type {
        int UN_STATUS_BAR = 4;

        int STATUS_BAR = 3;
    }
}