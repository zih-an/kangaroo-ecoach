package com.awsomeproject.manager

import android.content.Intent
import com.awsomeproject.CameraActivity
import com.awsomeproject.socketconnect.screenprojection.screen_sender_connectView
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


class ScreenProjectionManager(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ScreenProjectionModule"
    }

    @ReactMethod
    fun startscreenprojectionActivity(res: String) {
        val intent = Intent(reactApplicationContext, screen_sender_connectView::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtra("ExerciseScheduleMesg", res)
        reactApplicationContext.startActivity(intent)
    }

}