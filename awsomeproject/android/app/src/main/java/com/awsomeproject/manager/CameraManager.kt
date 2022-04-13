package com.awsomeproject.manager

import android.content.Intent
import com.awsomeproject.CameraActivity
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


class CameraManager(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "CameraModule"
    }

    @ReactMethod
    fun startcameraActivity(res: String) {
        val intent = Intent(reactApplicationContext, CameraActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtra("ExerciseScheduleMesg", res)
        reactApplicationContext.startActivity(intent)
    }

}