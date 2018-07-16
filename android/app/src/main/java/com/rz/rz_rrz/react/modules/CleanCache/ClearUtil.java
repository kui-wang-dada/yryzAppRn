package com.rz.rz_rrz.react.modules.CleanCache;

import android.content.Context;
import android.os.Environment;

import java.io.File;

/**
 * Created by lirui on 2018/5/9.
 */


public class ClearUtil {

    /**
     * 清除web缓存
     *
     * @param context
     */
    private static void deleteWebCache(Context context) {
        context.deleteDatabase("webview.db");
        context.deleteDatabase("webview.db-shm");
        context.deleteDatabase("webview.db-wal");
        context.deleteDatabase("webviewCache.db");
        context.deleteDatabase("webviewCache.db-shm");
        context.deleteDatabase("webviewCache.db-wal");
    }

    public static long getTotalCacheSize(Context context) {
        long cacheSize = getFolderSize(context.getCacheDir());
        if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
            cacheSize += getFolderSize(context.getExternalCacheDir());
        }
        return cacheSize;
    }

    public static void clearAllCache(Context context) {
        deleteWebCache(context);
        deleteDir(context.getCacheDir());
        if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
            deleteDir(context.getExternalCacheDir());
        }
    }

    private static boolean deleteDir(File dir) {
        if (dir != null && dir.isDirectory()) {
            String[] children = dir.list();
            if (children != null) {
                for (int i = 0; i < children.length; i++) {
                    boolean success = deleteDir(new File(dir, children[i]));
                    if (!success) {
                        return false;
                    }
                }
            }
        }
        return dir.delete();
    }

    // 获取文件
    // Context.getExternalFilesDir() --> SDCard/Android/data/你的应用的包名/files/
    // 目录，一般放一些长时间保存的数据
    // Context.getExternalCacheDir() -->
    // SDCard/Android/data/你的应用包名/cache/目录，一般存放临时缓存数据
    public static long getFolderSize(File file) {
        long size = 0;
        try {
            File[] fileList = file.listFiles();
            for (int i = 0; i < fileList.length; i++) {
                // 如果下面还有文件
                if (fileList[i].isDirectory()) {
                    size = size + getFolderSize(fileList[i]);
                } else {
                    size = size + fileList[i].length();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return size;


    }
}
