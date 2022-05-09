package com.awsomeproject

import android.app.Activity
import android.content.Intent
import android.content.pm.ActivityInfo
import android.content.res.Configuration
import android.content.res.Resources
import android.graphics.Bitmap
import android.graphics.Matrix
import android.graphics.Rect
import android.media.Image
import android.os.Bundle
import android.os.PersistableBundle
import android.os.SystemClock
import android.util.DisplayMetrics
import android.util.Log
import android.view.*
import android.widget.FrameLayout
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout
import org.json.JSONObject

import com.awsomeproject.socketconnect.Device
import com.awsomeproject.socketconnect.communication.host.FrameDataReceiver
import com.awsomeproject.socketconnect.communication.slave.CommandReceiver
import com.awsomeproject.videodecoder.GlobalStaticVariable
import kotlin.concurrent.thread

class screenReceiverActivity  : AppCompatActivity() {
    private var FrameReceiverConnectThread:Thread?=null
    lateinit var screenSurfaceView: SurfaceView
    public var mainScreenSender: Device?=null

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.screen_projection_receiver)
        screenSurfaceView=findViewById(R.id.screen)
        GlobalStaticVariable.isScreenCapture=true
        hideSystemUI()

        var bundle=intent.getExtras()
        mainScreenSender =Device(bundle!!.getString("mainScreenSenderIp"))

        screenSurfaceView.holder.addCallback(object :SurfaceHolder.Callback{
            override fun surfaceChanged(holder: SurfaceHolder, format: Int, width: Int, height: Int) {
            }
            override fun surfaceCreated(p0: SurfaceHolder) {
                FrameReceiverConnectThread=
                    thread{
                        try {
                            FrameDataReceiver.open(p0.surface,null)
                        }
                        catch (e:Throwable)
                        {
                            Log.d("old:","Interrupted")
                        }
                    }
            }
            override fun surfaceDestroyed(p0: SurfaceHolder) {
            }
        })
        //开始接受通信命令
        CommandReceiver.start(object : CommandReceiver.CommandListener{
            override fun onReceive(command: String?) {
                commandResolver(command)
            }
        })


    }
    private fun commandResolver(demand:String?)
    {
        when(demand) {
            "finishAcceptFrame" -> {
                CommandReceiver.close()
                finish()
            }
            null -> {
            }
        }

    }
    private fun hideSystemUI() {
        // Enables regular immersive mode.
        // For "lean back" mode, remove SYSTEM_UI_FLAG_IMMERSIVE.
        // Or for "sticky immersive," replace it with SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_IMMERSIVE
                // Set the content to appear under the system bars so that the
                // content doesn't resize when the system bars hide and show.
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                // Hide the nav bar and status bar
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_FULLSCREEN)
    }
    override fun onStop() {
        super.onStop()
        FrameReceiverConnectThread?.interrupt()
        FrameDataReceiver.close()

    }

}