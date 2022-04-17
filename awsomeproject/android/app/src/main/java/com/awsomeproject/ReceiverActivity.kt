package com.awsomeproject

import android.Manifest
import android.app.AlertDialog
import android.app.Dialog
import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.content.pm.ActivityInfo
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.Settings
import android.util.Log
import android.view.*
import android.widget.*
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.content.ContextCompat
import androidx.fragment.app.DialogFragment
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject
import com.awsomeproject.camera.CameraReceiver
import com.awsomeproject.data.*
import com.awsomeproject.layoutImpliment.SquareProgress
import com.awsomeproject.ml.ModelType
import com.awsomeproject.ml.MoveNet
import com.awsomeproject.socketconnect.Device
import com.awsomeproject.socketconnect.communication.host.Command
import com.awsomeproject.socketconnect.communication.host.CommandSender
import com.awsomeproject.socketconnect.communication.host.FrameDataReceiver
import com.awsomeproject.socketconnect.communication.slave.FrameDataSender
import com.awsomeproject.utils.Voice
import java.io.FileOutputStream
import kotlin.concurrent.thread
import kotlin.math.log

class ReceiverActivity: AppCompatActivity() {
    companion object {
        private const val FRAGMENT_DIALOG = "dialog"
        public var mainSlave:Device?=null
    }
    /** A [SurfaceView] for remote camera preview.   */
    private lateinit var surfaceView: SurfaceView
//    private lateinit var hostpopView : hostPopView
//    private var isSearchDeviceOpen:Boolean=false


    private var device = com.awsomeproject.data.Device.GPU
    private lateinit var msquareProgress: SquareProgress
    private lateinit var videoView: VideoView

    private lateinit var countdownView: SurfaceView
    private lateinit var countdownViewFramLayout: FrameLayout
    private lateinit var countdownViewBackground: ImageView

    private var cameraReceiver: CameraReceiver? = null
    private val voice= com.awsomeproject.utils.Voice(this)
    private var videoviewrepetend: VideoViewRepetend? =null
    private var FrameReceiverConnectThread:Thread?=null
    private lateinit var scoreTextView: TextView
    //总返回数据
    private var returnData:String?=null
    //正常结束标识符
    private val requestPermissionLauncher =
        registerForActivityResult(
            ActivityResultContracts.RequestPermission()
        ) { isGranted: Boolean ->
            if (isGranted) {
                openCamera()
            } else {
                CameraActivity.ErrorDialog.newInstance(getString(R.string.tfe_pe_request_permission))
                    .show(supportFragmentManager, ReceiverActivity.FRAGMENT_DIALOG)
            }
        }
    fun sendCommand(device: Device) {
        //发送命令
        val command = Command("sendFrame".toByteArray(), object : Command.Callback {
            override fun onEcho(msg: String?) {
            }
            override fun onError(msg: String?) {
            }
            override fun onRequest(msg: String?) {
            }
            override fun onSuccess(msg: String?) {
            }
        })
        command.setDestIp(device.ip)
        CommandSender.addCommand(command)
    }
    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_receiver)
        //accept intent value
        hideSystemUI()
        println("++++++++++++++++++++++onCreate1")
        // keep screen on while app is running
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        println("++++++++++++++++++++++onCreate2")
        var bundle=intent.getExtras()
        mainSlave=Device(bundle!!.getString("slaveIp"))


        msquareProgress = findViewById(R.id.sp);
        countdownView= findViewById(R.id.countDownView)
        surfaceView = findViewById(R.id.surfaceView)
        videoView = findViewById(R.id.videoView)
        countdownViewFramLayout=findViewById(R.id.countDownViewLayout)
        scoreTextView=findViewById(R.id.score)
        countdownViewBackground=findViewById(R.id.mColor)
        //——————————————————————语音初始化—————————————————-—————————//
        Voice.reSet()
        //————————————————————————————————————————————-————————————//


        initView()
        msquareProgress.setCurProgress(0);
        openCamera()
        createPoseEstimator()

    }
    private fun initView(){

        val mainActivity=this
        var JsonMeg="{\n" +
                "    \"id\": 1,\n"+
                "    \"data\": [\n" +
                "        {\n" +
                "            \"id\": 5,\n" +
                "            \"url\": \"sample5\",\n" +
                "            \"groups\": \"2\"\n" +
                "        },\n" +
                "        {\n" +
                "            \"id\": 7,\n" +
                "            \"url\": \"sample7\",\n" +
                "            \"groups\": \"2\"\n" +
                "        }]}"
        var bundle=intent.getExtras()
        bundle?.getString("ExerciseScheduleMesg")?.let{
            JsonMeg=it
        }

        videoviewrepetend= VideoViewRepetend(JsonMeg,this,videoView,countdownView,countdownViewFramLayout,countdownViewBackground,this.baseContext,object:VideoViewRepetend.VideoViewRepetendListener{
            override fun onExerciseEnd(index:Int,samplevideoName:String,samplevideoTendency:MutableList<Int>,id:Int) {
                //一轮运动完成，开始创建下一轮运动的数据结构
                //休息阶段时关闭图像处理
                cameraReceiver!!.setProcessImageFlag(false)
                //创建新一轮运动数据结构
                cameraReceiver!!.Samples.add(Sample(samplevideoName+".processed.json",baseContext,id,samplevideoTendency,object:Sample.scorelistener{
                    override fun onFrameScoreHeight(FrameScore: Int,part:Int) {
                        voice.voicePraise(FrameScore,part)
                    }
                    override fun onFrameScoreLow(FrameScore: Int,part:Int) {
                        voice.voiceRemind(FrameScore,part)
                    }
                    override fun onPersonNotDect() {
                        voice.voiceTips()
                    }
                }))

                thread {
                    cameraReceiver!!.Users.get(index - 1).exec()
                    cameraReceiver!!.Users.get(index - 1).toJson()
//                  cameraSource!!.Users.get(index-1).writeTofile("test", cameraSource!!.Samples[index-1].getSampleVecList(),baseContext)
                }

                //创建新的用户数据收集器
                cameraReceiver!!.Users.add(ResJSdata(id))

                //更新came索引，使其图像处理绑定到下一轮运动的数据结构中
                cameraReceiver!!.index++
            }
            override fun onExerciseStart(index:Int,samplevideoName:String) {
                cameraReceiver!!.setProcessImageFlag(true)
            }

            override fun onExerciseFinish(index: Int) {
                //运动全部结束，准备退出
                //退出前关闭图像处理
                cameraReceiver!!.setProcessImageFlag(false)
                thread {
//                    cameraSource!!.Users.get(index - 1).writeTofile(
//                        "test",
//                        cameraSource!!.Samples[index - 1].getSampleVecList(),
//                        baseContext
//                    )
                    cameraReceiver!!.Users.get(index - 1).exec()
                    cameraReceiver!!.Users.get(index - 1).toJson()
                    var TotalReturnData: JSONObject = JSONObject()
                    var TotalReturnValue: JSONArray = JSONArray()
                    for(i in 0..index-1)
                    {
                        var LineReturnValue= JSONObject()
                        LineReturnValue.put("id",cameraReceiver!!.Samples.get(i).getId())
                        LineReturnValue.put("data",cameraReceiver!!.Users.get(i).getJsonData())
                        TotalReturnValue.put(LineReturnValue)
                    }
                    TotalReturnData.put("id",ExerciseSchedule.getTotalId())
                    TotalReturnData.put("data",TotalReturnValue)

                    returnData=TotalReturnData.toString()
                    val intent = Intent()
                    intent.putExtra("res",returnData)
                    setResult(RESULT_OK, intent)
                    finish()
//                    writeTofile("test",TotalReturnData.toString())
                }
            }
        })
    }

    override fun onResume() {
        cameraReceiver?.resume()
        println("++++++++++++++++++++++onResum")
//        videoviewrepetend?.videoView?.start()
        super.onResume()
    }

    override fun onPause() {
        super.onPause()
        println("++++++++++++++++++++++onPause")
        cameraReceiver?.pause()
//        videoviewrepetend?.videoView?.pause()
        cameraReceiver?.close()
        FrameDataReceiver.close()

    }

    override fun onStop() {
        super.onStop()
        println("++++++++++++++++++++++onStop22222222222")
//        hostpopView.dismiss()
        cameraReceiver?.close()
        FrameDataReceiver.close()
        FrameReceiverConnectThread?.let{
            it.interrupt()
        }
        Voice.close()
        println("++++++++++++++++++++++onStop333333333333")


    }

    // check if permission is granted or not.
    private fun isCameraPermissionGranted(): Boolean {
        return true
    }


    // open camera
    private fun openCamera() {
        if (isCameraPermissionGranted()) {
            if (cameraReceiver == null) {
                cameraReceiver =
                    CameraReceiver(surfaceView, object : CameraReceiver.CameraReceiverListener {
                        override fun onImageprocessListener(score: Int) {
                            msquareProgress.setCurProgress(score)
                            runOnUiThread {
                                scoreTextView.setText(score.toString())
                            }
                        }
                        override fun onDetectedInfo( personScore: Float?,poseLabels: List<Pair<String, Float>>?) {
                            TODO("Not yet implemented")
                        }
                        override fun onFPSListener(fps: Int) {
                            showToast("fps:"+fps.toString())
                        }
                        override fun onPersonDetected()
                        {
                            videoviewrepetend?.start()
                        }
                    },this.baseContext,
                        this,
                        //*************************************************************
                        ExerciseSchedule.getTagByIndex(videoviewrepetend!!.index),
                        //*************************************************************
                        ExerciseSchedule.getName(videoviewrepetend!!.index),
                        //*************************************************************
                        ExerciseSchedule.getId(0)).apply {
                        FrameReceiverConnectThread?.let{
                            it.interrupt()
                        }
                        FrameReceiverConnectThread=
                            thread{
                                try {
                                    prepareCamera()
                                }
                                catch (e:InterruptedException)
                                {
                                    Log.d("old:","Interrupted")
                                }
                            }
                    }
                //*************************************************************
                lifecycleScope.launch(Dispatchers.Main) {
                    cameraReceiver?.initCamera()
                }
                sendCommand(mainSlave!!)
            }
        }
    }

    private fun createPoseEstimator() {
        val poseDetector = MoveNet.create(this, device, ModelType.Thunder)
        poseDetector.let { detector ->
            cameraReceiver?.setDetector(detector)
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
        if(keyCode== KeyEvent.KEYCODE_BACK){
            val msg="您的本次运动记录将不会保存，确定退出吗？"
            AlertDialog.Builder(this)
                .setMessage(msg)
                .setTitle("注意")
                .setPositiveButton("确认", DialogInterface.OnClickListener { dialogInterface, i ->
                    val intent = Intent()
                    setResult(RESULT_CANCELED, intent)
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
    private fun showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }
    private fun writeTofile(filename:String, Jsondata:String)
    {
        var path=filename+".txt"
        var fos: FileOutputStream = baseContext.openFileOutput(path, Context.MODE_PRIVATE)
        fos.write(Jsondata.toByteArray());
        fos.flush();
        fos.close();
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