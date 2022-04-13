package com.awsomeproject

import android.graphics.Bitmap
import android.os.Bundle
import android.util.Log
import android.view.*
import androidx.appcompat.app.AppCompatActivity

import com.awsomeproject.socketconnect.Device
import com.awsomeproject.socketconnect.communication.host.FrameDataReceiver
import com.awsomeproject.videodecoder.GlobalStaticVariable
import kotlin.concurrent.thread

class screenReceiverActivity  : AppCompatActivity() {
    lateinit var screenSurfaceView: SurfaceView
    public var mainScreenSender: Device?=null
    private lateinit var imageBitmap: Bitmap
    private lateinit var yuvConverter: YuvToRgbConverter
    private var FrameReceiverConnectThread:Thread?=null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.screen_projection_receiver)
        screenSurfaceView=findViewById(R.id.screen)
        yuvConverter=YuvToRgbConverter(screenSurfaceView.context)
        var bundle=intent.getExtras()
        mainScreenSender =Device(bundle!!.getString("mainScreenSenderIp"))
        GlobalStaticVariable.isScreenCapture=true
        screenSurfaceView.holder.addCallback(object :SurfaceHolder.Callback{
            override fun surfaceChanged(holder: SurfaceHolder, format: Int, width: Int, height: Int) {

            }
            override fun surfaceCreated(p0: SurfaceHolder) {
                GlobalStaticVariable.receiverSurface=p0.surface
                FrameReceiverConnectThread=
                    thread{
                        try {
                            FrameDataReceiver.open(null)
                        }
                        catch (e:InterruptedException)
                        {
                            Log.d("old:","Interrupted")
                        }
                    }
            }
            override fun surfaceDestroyed(p0: SurfaceHolder) {
            }
        })

        hideSystemUI()

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
        FrameReceiverConnectThread?.let{
            it.interrupt()
        }
//        FrameDataReceiver.close()
    }

}