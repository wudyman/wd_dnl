package com.wd_dnl.webview;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;

public class PickerActivityEventListener extends BaseActivityEventListener {

    private ActivityResultInterface mCallback;

    public PickerActivityEventListener(ReactApplicationContext reactContext, ActivityResultInterface callback) {
        reactContext.addActivityEventListener(this);
        mCallback = callback;
    }

    // < RN 0.33.0
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        mCallback.callback(requestCode, resultCode, data);
    }

    // >= RN 0.33.0
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        mCallback.callback(requestCode, resultCode, data);
    }
    /*
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
            super.onActivityResult(requestCode, resultCode, data);
            if(requestCode==FILECHOOSER_RESULTCODE)
            {
                    if (null == mUploadMessage && null == mUploadCallbackAboveL) return;
                    Uri result = data == null || resultCode != RESULT_OK ? null : data.getData();
                    if (mUploadMessage != null) {
                        mUploadMessage.onReceiveValue(result);
                        mUploadMessage = null;
                }
            }
    }

    public void onActivityResult(Activity activity,int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode==FILECHOOSER_RESULTCODE)
        {
                if (null == mUploadMessage && null == mUploadCallbackAboveL) return;
                Uri result = data == null || resultCode != RESULT_OK ? null : data.getData();
                if (mUploadMessage != null) {
                    mUploadMessage.onReceiveValue(result);
                    mUploadMessage = null;
            }
        }
    }
    */
}