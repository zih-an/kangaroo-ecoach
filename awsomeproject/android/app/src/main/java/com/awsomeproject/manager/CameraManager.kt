package com.awsomeproject.manager

import android.content.Intent
import android.os.Bundle
import com.awsomeproject.CameraActivity
import com.awsomeproject.socketconnect.connectview.hostviewActivity
import com.awsomeproject.socketconnect.connectview.slaveviewActivity
import com.awsomeproject.socketconnect.screenprojection.screen_sender_connectView
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

const val PICK_CONTACT_REQUEST = 1 // The request code

class CameraManager(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "CameraModule"
    }

    @ReactMethod
    fun startcameraActivity(res: String) {
        val intent = Intent(reactApplicationContext, CameraActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtra("ExerciseScheduleMesg", res)
//        reactApplicationContext.startActivity(intent)
        reactApplicationContext.startActivityForResult(intent,PICK_CONTACT_REQUEST, Bundle.EMPTY)
    }
    @ReactMethod
    fun startclintActivity(res: String) {
        val intent = Intent(reactApplicationContext, slaveviewActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactApplicationContext.startActivity(intent)
    }
    @ReactMethod
    fun startremoteActivity(res: String) {
        val intent = Intent(reactApplicationContext, hostviewActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtra("ExerciseScheduleMesg", res)
        reactApplicationContext.startActivity(intent)
    }
    @ReactMethod
    fun startscreenprojectionActivity(res: String) {
        val intent = Intent(reactApplicationContext, screen_sender_connectView::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtra("ExerciseScheduleMesg", res)
        reactApplicationContext.startActivity(intent)
    }

}