package com.awsomeproject.manager

import android.content.Intent
import com.awsomeproject.CameraActivity
import com.awsomeproject.socketconnect.connectview.hostviewActivity
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


class RemoteManager(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "RemoteModule"
    }

    @ReactMethod
    fun startremoteActivity(res: String) {
        val intent = Intent(reactApplicationContext, hostviewActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtra("ExerciseScheduleMesg", res)
        reactApplicationContext.startActivity(intent)
    }

}