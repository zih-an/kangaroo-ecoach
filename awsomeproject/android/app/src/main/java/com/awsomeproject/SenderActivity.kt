package com.awsomeproject

import android.Manifest
import android.app.AlertDialog
import android.app.Dialog
import android.content.DialogInterface
import android.content.Intent
import android.content.pm.ActivityInfo
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.os.Bundle
import android.os.Process
import android.os.SystemClock
import android.view.*
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.content.ContextCompat
import androidx.fragment.app.DialogFragment
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import com.awsomeproject.camera.CameraSender
import com.awsomeproject.socketconnect.Device

import com.awsomeproject.socketconnect.communication.slave.CommandReceiver
import com.awsomeproject.socketconnect.communication.slave.FrameDataSender
import kotlin.concurrent.thread


class SenderActivity :AppCompatActivity() {
    companion object {
        private const val FRAGMENT_DIALOG = "dialog"
        public var mainHost: Device?=null
    }
    /** A [SurfaceView] for camera preview.   */
    private lateinit var surfaceView: SurfaceView
    private var cameraSender: CameraSender? = null
    private val requestPermissionLauncher =
        registerForActivityResult(
            ActivityResultContracts.RequestPermission()
        ) { isGranted: Boolean ->
            if (isGranted) {
                openCamera()
            } else {
                ErrorDialog.newInstance(getString(R.string.tfe_pe_request_permission))
                    .show(supportFragmentManager, FRAGMENT_DIALOG)
            }
        }
    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sender)

        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        var bundle=intent.getExtras()
        mainHost =Device(bundle!!.getString("hostIp"))
        // keep screen on while app is running
        surfaceView = findViewById(R.id.surfaceView)
        if (!isCameraPermissionGranted()) {
            requestPermission()
        }
        //开始接受通信命令
        CommandReceiver.start(object : CommandReceiver.CommandListener{
            override fun onReceive(command: String?) {
                commandResolver(command)
            }
        })
        thread {
            FrameDataSender.open(mainHost)
        }
        openCamera()

    }
    private fun commandResolver(demand:String?)
    {
        when(demand) {
            "finishSendFrame" -> {
                CommandReceiver.close()
                finish()
            }
            null -> {
            }
        }
    }
    override fun onResume() {
        cameraSender?.resume()
        super.onResume()
    }

    override fun onPause() {
        cameraSender?.pause()

        super.onPause()
    }

    override fun onStop() {
        super.onStop()
//        slavepopView.dismiss()
        cameraSender?.close()
        FrameDataSender.close()

    }



    // check if permission is granted or not.
    private fun isCameraPermissionGranted(): Boolean {
        return checkPermission(
            Manifest.permission.CAMERA,
            Process.myPid(),
            Process.myUid()
        ) == PackageManager.PERMISSION_GRANTED
    }

    // open camera
    private fun openCamera() {
        if (isCameraPermissionGranted()) {
            if (cameraSender == null) {
                cameraSender =
                    CameraSender(surfaceView,baseContext)
                lifecycleScope.launch(Dispatchers.Main) {
                    cameraSender?.initCamera()
                }
            }
        }
    }

    private fun requestPermission() {
        when (PackageManager.PERMISSION_GRANTED) {
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.CAMERA
            ) -> {
                // You can use the API that requires the permission.
                openCamera()
            }
            else -> {
                // You can directly ask for the permission.
                // The registered ActivityResultCallback gets the result of this request.
                requestPermissionLauncher.launch(
                    Manifest.permission.CAMERA
                )
            }
        }
    }


    override fun onKeyDown(keyCode:Int, event: KeyEvent?):Boolean {
        // TODO Auto-generated method stub
        if(keyCode==KeyEvent.KEYCODE_BACK){
            val msg="您的本次运动记录将不会保存，确定退出吗？"
            AlertDialog.Builder(this)
                .setMessage(msg)
                .setTitle("注意")
                .setPositiveButton("确认", DialogInterface.OnClickListener { dialogInterface, i ->
                    finish()
                })
                .setNeutralButton("取消", null)
                .create()
                .show()
            return false
        }
        else {
            return false
        }
    }

    private fun showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }

    class ErrorDialog : DialogFragment() {

        override fun onCreateDialog(savedInstanceState: Bundle?): Dialog =
            AlertDialog.Builder(activity)
                .setMessage(requireArguments().getString(ARG_MESSAGE))
                .setPositiveButton(android.R.string.ok) { _, _ ->
                    // do nothing
                }
                .create()


        companion object {
            @JvmStatic
            private val ARG_MESSAGE = "message"
            @JvmStatic
            fun newInstance(message: String): ErrorDialog = ErrorDialog().apply {
                arguments = Bundle().apply { putString(ARG_MESSAGE, message) }
            }
        }
    }

}