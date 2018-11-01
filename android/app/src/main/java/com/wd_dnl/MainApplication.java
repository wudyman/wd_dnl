package com.wd_dnl;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.wd_dnl.webview.WebViewReactPackage;
import com.tencent.bugly.crashreport.CrashReport;
import com.tencent.bugly.Bugly; 
//import com.tencent.bugly.beta.Beta;  
//import com.tencent.tinker.loader.app.DefaultApplicationLike;  
import com.theweflex.react.WeChatPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import com.oblador.vectoricons.VectorIconsPackage;
import javax.annotation.Nullable;
import com.reactnative.ivpusic.imagepicker.PickerPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new SplashScreenReactPackage(),
          new CustomToastPackage(),
          new WebViewReactPackage(),
          new WeChatPackage(),
          new CodePush(BuildConfig.CODEPUSH_KEY, MainApplication.this, BuildConfig.DEBUG),
          new RNDeviceInfo(),
          new VectorIconsPackage(),
          new PickerPackage()
      );
    }

    @Nullable
    @Override
    protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
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
    SoLoader.init(this, /* native exopackage */ false);
    if (!BuildConfig.DEBUG) {
    //  CrashReport.initCrashReport(getApplicationContext(), "dbbed70da8", false);
      Bugly.init(getApplicationContext(), "dbbed70da8", false);
    }
  }
}
