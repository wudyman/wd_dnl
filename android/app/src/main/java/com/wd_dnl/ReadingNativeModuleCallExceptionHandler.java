package com.wd_dnl;

import com.facebook.react.bridge.NativeModuleCallExceptionHandler;
import com.tencent.bugly.crashreport.CrashReport;

public class ReadingNativeModuleCallExceptionHandler implements NativeModuleCallExceptionHandler {
    @Override
    public void handleException(Exception e) {
        CrashReport.postCatchedException(e);
    }
}
