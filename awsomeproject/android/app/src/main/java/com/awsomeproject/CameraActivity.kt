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
import android.media.projection.MediaProjectionManager
import android.os.*
import android.provider.Settings
import android.util.Log
import android.view.*
import android.widget.*
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.fragment.app.DialogFragment
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject
import com.awsomeproject.camera.CameraSource
import com.awsomeproject.data.*
import com.awsomeproject.layoutImpliment.SquareProgress
import com.awsomeproject.manager.CameraModule.Companion.PROJECTION_CAMERA_REQUEST
import com.awsomeproject.ml.ModelType
import com.awsomeproject.ml.MoveNet
import com.awsomeproject.service.screenCaptureService
import com.awsomeproject.socketconnect.communication.slave.FrameData
import com.awsomeproject.socketconnect.communication.slave.FrameDataSender
import com.awsomeproject.utils.Voice
import com.awsomeproject.videodecoder.EncoderH264
import com.awsomeproject.videodecoder.GlobalStaticVariable
import java.io.FileOutputStream
import kotlin.concurrent.thread

class CameraActivity :AppCompatActivity() {
    companion object {
        private const val FRAGMENT_DIALOG = "dialog"
    }
    //摄像机preview
    private lateinit var surfaceView: SurfaceView
    //返回码
    private val REQUEST_CODE = 1
    //模型默认GPU
    private var device = Device.GPU
    //分数条Progress
    private lateinit var msquareProgress: SquareProgress
    //运动视频View
    private lateinit var videoView: VideoView
    //倒计时View
    private lateinit var countdownView: SurfaceView
    //倒计时framLayaout
    private lateinit var countdownViewFramLayout: FrameLayout
    //倒计时背景
    private lateinit var countdownViewBackground: ImageView
    //分数框
    private lateinit var scoreTextView: TextView
    //摄像机
    private var cameraSource: CameraSource? = null
    //语言提示
    private val voice= com.awsomeproject.utils.Voice(this)
    //运动视频循环节
    private var videoviewrepetend:VideoViewRepetend? =null
    //总返回数据
    private var returnData:String?=null
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~For Screen Projection~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //编码器
    private var encoder: EncoderH264?=null
    //投屏模式下的接收方
    private var mainScreenReceiver:com.awsomeproject.socketconnect.Device?=null
    //发送帧函数
    fun sendFrameData(frameData:ByteArray,device: com.awsomeproject.socketconnect.Device) {
        //发送命令
        val frameData = FrameData(frameData, object : FrameData.Callback {
            override fun onEcho(msg: String?) {
            }
            override fun onError(msg: String?) {
            }
            override fun onRequest(msg: String?) {
            }
            override fun onSuccess(msg: String?) {
            }
        })
        frameData.setDestIp(device.ip)
        FrameDataSender.addFrameData(frameData)
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~For Screen Projection~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //获取权限
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
        setContentView(R.layout.activity_main)

        //创建运动数据文件
        //createFile()
        //隐藏UI
        hideSystemUI()
        //————————————获取Intent数据，判断是否需要开启投屏服务————————————//
        var bundle=intent.getExtras()
        if(bundle?.getBoolean("isScreenProjection")!=null)
        {
            bundle?.getBoolean("isScreenProjection").let {
                if (it == true) {
                    GlobalStaticVariable.frameRate = 25
                    GlobalStaticVariable.isScreenCapture = true
                    mainScreenReceiver =
                        com.awsomeproject.socketconnect.Device(bundle?.getString("screenReceiverIp"))
                    screenProjectioninit()
                }
            }
        }
        else
        {
           GlobalStaticVariable.reSet()
        }
        //————————————————————————————————————————————-————————————//

        //———————————————————————初始化控件——————————————————————————//
        msquareProgress = findViewById(R.id.sp)
        msquareProgress.setCurProgress(0)
        countdownView= findViewById(R.id.countDownView)
        surfaceView = findViewById(R.id.surfaceView)
        videoView = findViewById(R.id.videoView)
        countdownViewFramLayout=findViewById(R.id.countDownViewLayout)
        scoreTextView=findViewById(R.id.score)
        countdownViewBackground=findViewById(R.id.mColor)
        //————————————————————————————————————————————-————————————//

        //———————————————————————权限申请————————————————————————————//
        if (!isCameraPermissionGranted()) {
            requestPermission()
        }
//        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R ||
//            Environment.isExternalStorageManager()) {
//            Toast.makeText(this, "已获得访问所有文件的权限", Toast.LENGTH_SHORT).show();
//        } else {
//            var intent:Intent =Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION);
//            startActivity(intent);
//        }
        //————————————————————————————————————————————-————————————//

        //——————————————————————语音初始化—————————————————-—————————//
        Voice.reSet()
        //————————————————————————————————————————————-————————————//

        //——————————————————————————初始化循环节——————————————————————//
        initView()
        //————————————————————————————————————————————-————————————//

        //——————————————————————————初始化摄像机——————————————————————//
        openCamera()
        //————————————————————————————————————————————-————————————//

        //—————————————————————————初始化模型——————————-————————————//
        createPoseEstimator()
        //————————————————————————————————————————————-————————————//
    }

    override fun onStart() {
        super.onStart()
    }

    private fun initView(){
        val mainActivity=this

        var JsonMeg      ="{\n" +
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
//                ="{\n" +
//                "    \"id\": 5,\n"+
//                "    \"data\": [\n" +
//                "        {\n" +
//                "            \"id\": 24,\n" +
//                "            \"url\": \"sample24\",\n" +
//                "            \"groups\": \"2\"\n" +
//                "        }]}"
        var bundle=intent.getExtras()
        bundle?.getString("ExerciseScheduleMesg")?.let{
            JsonMeg=it
        }

        videoviewrepetend= VideoViewRepetend(JsonMeg,this,videoView,countdownView,countdownViewFramLayout,countdownViewBackground,this.baseContext,object:VideoViewRepetend.VideoViewRepetendListener{
            override fun onExerciseEnd(index:Int,samplevideoName:String,samplevideoTendency:MutableList<Int>,id:Int) {
                //一轮运动完成，开始创建下一轮运动的数据结构
                //休息阶段时关闭图像处理
                cameraSource!!.setProcessImageFlag(false)
                //创建新一轮运动数据结构
                cameraSource!!.Samples.add(Sample(samplevideoName+".processed.json",baseContext,id,samplevideoTendency,object:Sample.scorelistener{
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
                    cameraSource!!.Users.get(index - 1).exec()
                    cameraSource!!.Users.get(index - 1).toJson()
//                  cameraSource!!.Users.get(index-1).writeTofile("test", cameraSource!!.Samples[index-1].getSampleVecList(),baseContext)
                }

                //创建新的用户数据收集器
                cameraSource!!.Users.add(ResJSdata(id))

                //更新came索引，使其图像处理绑定到下一轮运动的数据结构中
                cameraSource!!.index++
            }
            override fun onExerciseStart(index:Int,samplevideoName:String) {
                cameraSource!!.setProcessImageFlag(true)
            }

            override fun onExerciseFinish(index: Int) {
                //运动全部结束，准备退出
                //退出前关闭图像处理
                cameraSource!!.setProcessImageFlag(false)
                thread {
//                    cameraSource!!.Users.get(index - 1).writeTofile(
//                        "test",
//                        cameraSource!!.Samples[index - 1].getSampleVecList(),
//                        baseContext
//                    )
                    cameraSource!!.Users.get(index - 1).exec()
                    cameraSource!!.Users.get(index - 1).toJson()
                    var TotalReturnData:JSONObject= JSONObject()
                    var TotalReturnValue:JSONArray= JSONArray()
                    for(i in 0..index-1)
                    {
                        var LineReturnValue= JSONObject()
                        LineReturnValue.put("id",cameraSource!!.Samples.get(i).getId())
                        LineReturnValue.put("data",cameraSource!!.Users.get(i).getJsonData())
                        TotalReturnValue.put(LineReturnValue)
                    }
                    TotalReturnData.put("id",ExerciseSchedule.getTot从d())
                    TotalReturnData.put("data",TotalReturnValue)

                    returnData=TotalReturnData.toString()
                    val intent = Intent()
                    intent.putExtra("res",returnData)
                    mainScreenReceiver?.let {
                        stopProjection()
                        intent.putExtra("state", "finish")
                    }
                    setResult(RESULT_OK, intent)
                    finish()
//                    writeTofile("test",TotalReturnData.toString())
                }

            }
        })
    }

    override fun onResume() {
        cameraSource?.resume()
        super.onResume()
    }

    override fun onPause() {
        cameraSource?.pause()
        super.onPause()
    }

    override fun onStop() {
        super.onStop()
        encoder?.close()
        cameraSource?.close()
        Voice.close()

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
            if (cameraSource == null) {
                cameraSource =
                    CameraSource(surfaceView, object : CameraSource.CameraSourceListener {
                        override fun onImageprocessListener(score: Int) {
                            msquareProgress.setCurProgress(score);
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
                        //*************************************************************
                        prepareCamera()
                    }
                lifecycleScope.launch(Dispatchers.Main) {
                    cameraSource?.initCamera()
                }
            }
        }
    }


    private fun createPoseEstimator() {
        val poseDetector = MoveNet.create(this, device, ModelType.Thunder)
        poseDetector.let { detector ->
            cameraSource?.setDetector(detector)
        }
    }

    //权限申请
    private fun requestPermission()
    {
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


    //退出提醒
    override fun onKeyDown(keyCode:Int, event: KeyEvent?):Boolean {
        // TODO Auto-generated method stub
        if(keyCode==KeyEvent.KEYCODE_BACK){
            val msg="您的本次运动记录将不会保存，确定退出吗？"
            AlertDialog.Builder(this)
                .setMessage(msg)
                .setTitle("注意")
                .setPositiveButton("确认", DialogInterface.OnClickListener { dialogInterface, i ->
                    val intent = Intent()
                    mainScreenReceiver?.let {
                        stopProjection()
                        intent.putExtra("state", "finish")
                    }
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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~For Screen Projection~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    private fun screenProjectioninit()
    {
        // get width and height
        encoder= EncoderH264(
            GlobalStaticVariable.frameLength,GlobalStaticVariable.frameWidth
            ,object : EncoderH264.EncoderListener{
                override fun h264(data: ByteArray) {
                    Log.d("TAG","H264 SIZE:"+data.size)
                    mainScreenReceiver?.let {
                        sendFrameData(data,it)
                    }
                }
            },GlobalStaticVariable.frameRate)
        startProjection()
    }
    private fun startProjection()
    {
        val mProjectionManager =
            getSystemService(MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        startActivityForResult(mProjectionManager.createScreenCaptureIntent(), PROJECTION_CAMERA_REQUEST)
    }
    private fun stopProjection()
    {
        startService(screenCaptureService.getStopIntent(this))
    }
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?)
    {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == PROJECTION_CAMERA_REQUEST) {
            if (resultCode == RESULT_OK) {
                startService(
                    screenCaptureService.getStartIntent(
                        this,
                        resultCode,
                        data
                    )
                )
            }
            else
            {
                val intent = Intent()
                setResult(RESULT_CANCELED, intent)
                finish()
            }
        }
    }
//    private var fos:FileOutputStream?=null
//    private fun createFile()
//    {
//        fos = baseContext.openFileOutput("test.h264",Context.MODE_PRIVATE)
//    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~For Screen Projection~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    private fun hideSystemUI() {
        // Enables regular immersive mode.
        // For "lean back" mode, remove SYSTEM_UI_FLAG_IMMERSIVE.
        // Or for "sticky immersive," replace it with SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        //设置屏幕常亮
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
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