package com.awsomeproject.manager

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.awsomeproject.CameraActivity
import com.facebook.react.bridge.*
import android.R.attr.name
import com.awsomeproject.socketconnect.connectview.hostviewActivity
import com.awsomeproject.socketconnect.connectview.slaveviewActivity
import com.awsomeproject.socketconnect.screenprojection.screen_sender_connectView


class CameraModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    private var pickerPromise: Promise? = null
    private lateinit var mreactContext:ReactApplicationContext
    private var mDoneCallback: Callback? = null
    private var mCancelCallback: Callback? = null
    private val activityEventListener =
        object : BaseActivityEventListener() {
            override fun onActivityResult(
                activity:Activity ,
                requestCode: Int,
                resultCode: Int,
                intent: Intent?
            ) {
                super.onActivityResult(activity, requestCode, resultCode, intent)
                if (requestCode == REQUEST_CAMERA_CODE) {
                    when(resultCode) {
                        AppCompatActivity.RESULT_CANCELED -> {
                            pickerPromise?.let { promise ->
                                promise.resolve(0)?.let {
                                    promise.reject(E_NO_IMAGE_DATA_FOUND, "训练未完成！")
                                }
                                pickerPromise = null
                            }
                        }
                        AppCompatActivity.RESULT_OK -> {
                            val res = intent?.getStringExtra("res")
                            pickerPromise?.let { promise ->
                                val res = intent?.getStringExtra("res")
                                res?.let { promise.resolve(res.toString()) }
                                    ?: promise.reject(E_NO_IMAGE_DATA_FOUND, "运动信息有误！")
                                pickerPromise = null
                            }
                        }
                    }
                }else if(requestCode== REQUEST_REMOTE_CODE){
                    when(resultCode) {
                        AppCompatActivity.RESULT_CANCELED -> {
                            pickerPromise?.let { promise ->
                                promise.resolve(0)?.let {
                                    promise.reject(E_NO_IMAGE_DATA_FOUND, "训练未完成！")
                                }
                                pickerPromise = null
                            }
                        }
                        AppCompatActivity.RESULT_OK -> {
                            val res = intent?.getStringExtra("res")
                            pickerPromise?.let { promise ->
                                val res = intent?.getStringExtra("res")
                                res?.let { promise.resolve(res.toString()) }
                                    ?: promise.reject(E_NO_IMAGE_DATA_FOUND, "运动信息有误！")
                                pickerPromise = null
                            }
                        }
                    }
                }else if(requestCode== REQUEST_SCREEN_CODE){
                    when(resultCode) {
                        AppCompatActivity.RESULT_CANCELED -> {
                            pickerPromise?.let { promise ->
                                promise.resolve(0)?.let {
                                    promise.reject(E_NO_IMAGE_DATA_FOUND, "训练未完成！")
                                }
                                pickerPromise = null
                            }
                        }
                        AppCompatActivity.RESULT_OK -> {
                            val res = intent?.getStringExtra("res")
                            pickerPromise?.let { promise ->
                                val res = intent?.getStringExtra("res")
                                res?.let { promise.resolve(res.toString()) }
                                    ?: promise.reject(E_NO_IMAGE_DATA_FOUND, "运动信息有误！")
                                pickerPromise = null
                            }
                        }
                    }
                }else if(requestCode== REQUEST_CLINT_CODE){
                    when(resultCode) {
                        AppCompatActivity.RESULT_CANCELED -> {
                            pickerPromise?.let { promise ->
                                promise.resolve(0)?.let {
                                    promise.reject(E_NO_IMAGE_DATA_FOUND, "训练未完成！")
                                }
                                pickerPromise = null
                            }
                        }
                        AppCompatActivity.RESULT_OK -> {
                            pickerPromise?.let { promise ->
                                promise.resolve(0)?.let {
                                    promise.reject(E_NO_IMAGE_DATA_FOUND, "训练未完成！")
                                }
                                pickerPromise = null
                            }
                        }
                    }
                }

//                if (requestCode == PICK_CONTACT_REQUEST) {
//                    pickerPromise?.let { promise ->
//                        when (resultCode) {
//                            Activity.RESULT_CANCELED ->
//                                promise.reject(E_PICKER_CANCELLED, "Image picker was cancelled")
//                            Activity.RESULT_OK -> {
//                                val uri = intent?.data
//
//                                uri?.let { promise.resolve(uri.toString()) }
//                                    ?: promise.reject(E_NO_IMAGE_DATA_FOUND, "No image data found")
//                            }
//                        }
//
//                        pickerPromise = null
//                    }
//                }
            }
        }

    init {
        super.initialize()
        mreactContext=reactContext
        mreactContext.addActivityEventListener(activityEventListener)
    }

    override fun getName() = "CameraModule"
    @ReactMethod
    fun startcameraActivity(res:String, promise: Promise) {
        pickerPromise=promise
        val intent = Intent(currentActivity, CameraActivity::class.java)
        intent.putExtra("ExerciseScheduleMesg", res)
        currentActivity!!.startActivityForResult(intent,REQUEST_CAMERA_CODE)
    }
    @ReactMethod
    fun startremoteActivity(res:String, promise: Promise) {
        pickerPromise=promise
        val intent = Intent(currentActivity, hostviewActivity::class.java)
        intent.putExtra("ExerciseScheduleMesg", res)
        currentActivity!!.startActivityForResult(intent,REQUEST_REMOTE_CODE)
    }
    @ReactMethod
    fun startscreenprojectionActivity(res:String, promise: Promise) {
        pickerPromise=promise
        val intent = Intent(currentActivity, screen_sender_connectView::class.java)
        intent.putExtra("ExerciseScheduleMesg", res)
        currentActivity!!.startActivityForResult(intent,REQUEST_SCREEN_CODE)
    }

    @ReactMethod
    fun startclintActivity(promise: Promise) {
        pickerPromise=promise
        val intent = Intent(currentActivity, slaveviewActivity::class.java)
        currentActivity!!.startActivityForResult(intent,REQUEST_CLINT_CODE)
    }
    companion object {
        const val REQUEST_CAMERA_CODE = 1
        const val REQUEST_REMOTE_CODE = 2
        const val REQUEST_SCREEN_CODE = 3
        const val REQUEST_CLINT_CODE  = 4
        const val REMOTE_CAMERA_REQUEST = 5
        const val SCREEN_CAMERA_REQUEST= 6
        const val PROJECTION_CAMERA_REQUEST= 6
        const val E_NO_IMAGE_DATA_FOUND = "E_NO_IMAGE_DATA_FOUND"
    }

}