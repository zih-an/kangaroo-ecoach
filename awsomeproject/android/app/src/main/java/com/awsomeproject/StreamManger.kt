package com.awsomeproject

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


class StreamManager(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "MyNativeModule"
    }

    @ReactMethod
    fun startcameraActivity(res: String) {
        val intent = Intent(reactApplicationContext, CameraActivity::class.java)
        intent.putExtra("ExerciseScheduleMesg", res)
        reactApplicationContext.startActivity(intent)
    }

}