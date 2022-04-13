package com.awsomeproject.manager

import android.content.Intent
import com.awsomeproject.CameraActivity
import com.awsomeproject.socketconnect.connectview.slaveviewActivity
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


class ClintManager(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ClintModule"
    }

    @ReactMethod
    fun startclintActivity(res: String) {
        val intent = Intent(reactApplicationContext, slaveviewActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactApplicationContext.startActivity(intent)
    }

}