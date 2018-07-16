package com.rz.rz_rrz.react.modules.CleanCache;


import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;


/**
 * Created by lirui on 2018/5/9.
 */


public class CacheModule extends ReactContextBaseJavaModule {


    public CacheModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }


    @Override
    public String getName() {
        return "CacheClear";
    }


    @ReactMethod
    public void getCacheSize(Promise promise) {

        WritableMap cacheMap = Arguments.createMap();
        long imageCache = Fresco.getImagePipelineFactory().getMainFileCache().getSize();//b
        long totalCacheSize = ClearUtil.getTotalCacheSize(getReactApplicationContext());
        cacheMap.putDouble("cacheSize", (imageCache + totalCacheSize));
        promise.resolve(cacheMap);
    }

    @ReactMethod
    public void clearCache(Promise promise) {
        //清楚图片缓存
        ImagePipeline imagePipeline = Fresco.getImagePipeline();
        imagePipeline.clearMemoryCaches();
        imagePipeline.clearDiskCaches();
        // combines above two lines
        imagePipeline.clearCaches();
        ClearUtil.clearAllCache(getReactApplicationContext());
        promise.resolve(CodeStatus.JsCode.TYPE_SUCCESS);
    }

}
