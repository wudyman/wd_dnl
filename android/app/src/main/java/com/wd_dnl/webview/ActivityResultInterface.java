package com.wd_dnl.webview;

import android.content.Intent;

interface ActivityResultInterface {
    void callback(int requestCode, int resultCode, Intent data);
}
