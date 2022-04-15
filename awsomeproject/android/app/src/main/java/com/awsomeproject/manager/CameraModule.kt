package com.awsomeproject.manager

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.awsomeproject.CameraActivity
import com.facebook.react.bridge.*
import android.R.attr.name




class CameraModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    private val REQUEST_CODE = 5
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
                if (requestCode == REQUEST_CODE) {
                    println("######"+resultCode)
                    when(resultCode)
                    {
                        AppCompatActivity.RESULT_CANCELED->{
                            println("1111225552222")
//                            mCancelCallback?.invoke("取消")
                            pickerPromise?.let { promise ->
                                promise.resolve(0)?.let{
                                    promise.reject(E_NO_IMAGE_DATA_FOUND, "No image data found")}
                                pickerPromise = null
                            }
                        }
                        AppCompatActivity.RESULT_OK-> {
                            println("1111222222222222")
                            val res = intent?.getStringExtra("res")
                            println("++++++++++++++" + res)
//                            mDoneCallback?.invoke(res)
                            pickerPromise?.let { promise ->
                                println("1111133333333333333")
                                val res = intent?.getStringExtra("res")
                                println("++++++++++++++" + res)
                                res?.let { promise.resolve(res.toString()) }
                                    ?: promise.reject(E_NO_IMAGE_DATA_FOUND, "No image data found")
                                pickerPromise = null
                            }

                        }
                    }
                    pickerPromise = null
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
//        reactApplicationContext.startActivity(intent)
        currentActivity!!.startActivityForResult(intent,REQUEST_CODE)
    }
    companion object {
        const val IMAGE_PICKER_REQUEST = 1
        const val E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST"
        const val E_PICKER_CANCELLED = "E_PICKER_CANCELLED"
        const val E_FAILED_TO_SHOW_PICKER = "E_FAILED_TO_SHOW_PICKER"
        const val E_NO_IMAGE_DATA_FOUND = "E_NO_IMAGE_DATA_FOUND"
    }

}