package com.rz.rz_rrz;

import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.support.multidex.MultiDexApplication;

import com.BV.LinearGradient.LinearGradientPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.facebook.cache.disk.DiskCacheConfig;
import com.facebook.common.internal.Supplier;
import com.facebook.common.util.ByteConstants;
import com.facebook.imagepipeline.core.ImagePipelineConfig;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.horcrux.svg.SvgPackage;
import com.hzl.pulltorefresh.RefreshReactPackage;
import com.microsoft.codepush.react.CodePush;
import com.rz.rz_rrz.react.YryzPackage;
import com.rz.rz_rrz.react.modules.CleanCache.CachePackage;
import com.rz.rz_rrz.util.SysSharedPreferences;
import com.tencent.bugly.Bugly;
import com.tencent.bugly.crashreport.CrashReport;
import com.umeng.analytics.MobclickAgent;
import com.umeng.commonsdk.UMConfigure;
import com.yryz.ydk.Ydk;
import com.yryz.ydk.react.YdkPackage;

import java.io.File;
import java.util.Arrays;
import java.util.List;

import cn.jpush.reactnativejpush.JPushPackage;

public class MainApplication extends MultiDexApplication implements ReactApplication {
    private static MainApplication instance;
    private int keyboardHeight = 0;

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {


            DiskCacheConfig diskCacheConfig = DiskCacheConfig.newBuilder(instance)
                    .setMaxCacheSize(2 * 1024 * 1024)//最大缓存
                    .setBaseDirectoryName("imageCache")//子目录
                    .setBaseDirectoryPathSupplier(new Supplier<File>() {
                        @Override
                        public File get() {
                            return instance.getCacheDir();//还是推荐缓存到应用本身的缓存文件夹,这样卸载时能自动清除,其他清理软件也能扫描出来
                        }
                    })
                    .build();
            ImagePipelineConfig imagePipelineConfig = ImagePipelineConfig.newBuilder(instance)
                    .setMainDiskCacheConfig(diskCacheConfig)
                    .setDownsampleEnabled(true)
                    //Downsampling，要不要向下采样,它处理图片的速度比常规的裁剪scaling更快，
                    // 并且同时支持PNG，JPG以及WEP格式的图片，非常强大,与ResizeOptions配合使用
                    .setBitmapsConfig(Bitmap.Config.RGB_565)
                    //如果不是重量级图片应用,就用这个省点内存吧.默认是RGB_888
                    .build();

            MainPackageConfig mainPackageConfig = new MainPackageConfig.Builder().setFrescoConfig(imagePipelineConfig).build();

            return Arrays.asList(
                    new CachePackage(),
                    new MainReactPackage(),
                    new SvgPackage(),
                    new LottiePackage(),
                    new LinearGradientPackage(),
                    new RefreshReactPackage(),
                    new YdkPackage(),
                    new YryzPackage(),
                    new JPushPackage(true, true),
                    new CodePush(BuildConfig.APPLICATION_ID, MainApplication.this, BuildConfig.DEBUG)// Add/change this line.
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
        SoLoader.init(this, /* native exopackage */ false);
        new Ydk.Builder(this)
                .setDebugModel(BuildConfig.DEBUG)
                .setTrackAgent(new MyTrackEventAgent())
                .build();
        initBugly();
        initUmeng();
        fitFont();
    }

    /**
     * 防止字体大小被修改
     */
    private void fitFont() {
        Resources resources = getResources();
        Configuration config = new Configuration();
        config.setToDefaults();
        resources.updateConfiguration(config, resources.getDisplayMetrics());
    }

    private void initBugly() {
        Bugly.init(getApplicationContext(), com.yryz.ydk.BuildConfig.buglyId, BuildConfig.DEBUG);
    }

    private void initUmeng() {
        MobclickAgent.setScenarioType(this, MobclickAgent.EScenarioType.E_UM_NORMAL);
        UMConfigure.init(this, UMConfigure.DEVICE_TYPE_PHONE, "yryz");
        UMConfigure.setLogEnabled(BuildConfig.DEBUG);
    }

    public int getKeyboardHeight() {
        return keyboardHeight == 0 ? SysSharedPreferences.getInstance().getKeyboardHeight() : keyboardHeight;
    }

    public void setKeyboardHeight(int keyboardHeight) {
        this.keyboardHeight = keyboardHeight;
    }
}
