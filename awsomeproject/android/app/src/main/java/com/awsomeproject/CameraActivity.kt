package com.awsomeproject

import android.Manifest
import android.app.AlertDialog
import android.app.Dialog
import android.content.pm.PackageManager
import android.media.MediaPlayer
import android.os.*
import android.speech.tts.TextToSpeech
import android.view.SurfaceView
import android.view.WindowManager
import android.widget.MediaController
import android.widget.TextView
import android.widget.Toast
import android.widget.VideoView
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.fragment.app.DialogFragment
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import com.awsomeproject.camera.CameraSource
import com.awsomeproject.data.Device
import com.awsomeproject.data.ResJSdata
import com.awsomeproject.data.Sample
import com.awsomeproject.data.VideoViewRepetend
import com.awsomeproject.ml.ModelType
import com.awsomeproject.ml.MoveNet


class CameraActivity :AppCompatActivity() {
    companion object {
        private const val FRAGMENT_DIALOG = "dialog"
    }

    /** A [SurfaceView] for camera preview.   */
    private lateinit var surfaceView: SurfaceView

    private var device = Device.GPU
    private lateinit var msquareProgress:SquareProgress
    private lateinit var videoView: VideoView
    private lateinit var voicePlayer:MediaPlayer
    private lateinit var mTextToSpeech: TextToSpeech
    private lateinit var mediaController: MediaController
    private lateinit var keep1:KeepCountdownView
    private lateinit var textView: TextView
    private lateinit var ExerciseScheduleMesg:String
    private var cameraSource: CameraSource? = null

    private var videoviewrepetend: VideoViewRepetend? =null

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

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        // keep screen on while app is running
        msquareProgress = findViewById(R.id.sp);
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        surfaceView = findViewById(R.id.surfaceView)
        if (!isCameraPermissionGranted()) {
            requestPermission()
        }
        initView()
        msquareProgress.setCurProgress(0);

        keep1=findViewById(R.id.keep1)
        keep1.setCountdownListener(object: KeepCountdownView.CountdownListener {
            override fun onStart(){
            }
            override fun onEnd() {
            }
        })
        keep1.startCountDown()
    }
    override fun onStart() {
        super.onStart()
        openCamera()
        createPoseEstimator()
        videoView.start();
        voicePlayer.start()

    }

    private fun initView(){
        videoView = findViewById<VideoView>(R.id.videoView)
        mediaController = MediaController(this)
        videoView.setMediaController(mediaController)
        voicePlayer= MediaPlayer()
        ExerciseScheduleMesg= intent.getStringExtra("ExerciseScheduleMesg").toString()
        println("&&&&&&&&&&&"+ExerciseScheduleMesg)
        val JsonMeg="{\n" +
                "    \"data\": [\n" +
                "        {\n" +
                "            \"id\": 1,\n" +
                "            \"sv_path\": \"statics/video/全身/正踢腿.mp4\",\n" +
                "            \"groups\": \"2\"\n" +
                "        },\n" +
                "        {\n" +
                "            \"id\": 1,\n" +
                "            \"sv_path\": \"statics/video/全身/正踢腿.mp4\",\n" +
                "            \"groups\": \"2\"\n" +
                "        },\n" +
                "        {\n" +
                "            \"id\": 1,\n" +
                "            \"sv_path\": \"statics/video/全身/正踢腿.mp4\",\n" +
                "            \"groups\": \"2\"\n" +
                "        },\n" +
                "        {\n" +
                "           \"id\": 1,\n" +
                "            \"sv_path\": \"statics/video/全身/正踢腿.mp4\",\n" +
                "            \"groups\": \"2\"\n" +
                "        },\n" +
                "        {\n" +
                "            \"id\": 1,\n" +
                "            \"sv_path\": \"statics/video/全身/正踢腿.mp4\",\n" +
                "            \"groups\": \"2\"\n" +
                "        },\n" +
                "        {\n" +
                "            \"id\": 1,\n" +
                "            \"sv_path\": \"statics/video/全身/正踢腿.mp4\",\n" +
                "            \"groups\": \"2\"\n" +
                "        },\n" +
                "        {\n" +
                "            \"id\": 1,\n" +
                "            \"sv_path\": \"statics/video/全身/正踢腿.mp4\",\n" +
                "            \"groups\": \"2\"\n" +
                "        }]\n" +
                "}"

       val mainActivity=this
        videoviewrepetend= VideoViewRepetend(JsonMeg,this,videoView,this.baseContext,object:
            VideoViewRepetend.VideoViewRepetendListener{
                    override fun onExerciseEnd() {
                        cameraSource!!.setProcessImageFlag(false)
                        cameraSource!!.index=videoviewrepetend!!.index
                        cameraSource!!.Samples.add(Sample("sample3-10fps.processed.json",baseContext,object:Sample.scorelistener{
                            override fun onFrameScoreHeight(FramScore: Int) {
                                MesgSpeak(mainActivity,"真不戳",true)
                            }
                            override fun onFrameScoreLow(FramScore: Int) {
                                MesgSpeak(mainActivity,"就这，就这啊",true)
                            }
                        }))
                        cameraSource!!.Users.add(ResJSdata())
                    }

                    override fun onExerciseStart() {
                        cameraSource!!.setProcessImageFlag(true)
                    }
                },voicePlayer)

    }
    override fun onResume() {
      cameraSource?.resume()
        super.onResume()
    }

    override fun onPause() {
        cameraSource?.close()
        cameraSource = null
        super.onPause()
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
                        }
                        override fun onDetectedInfo( personScore: Float?,poseLabels: List<Pair<String, Float>>?) {
                            TODO("Not yet implemented")
                        }
                        override fun onFPSListener(fps: Int) {
                            showToast("fps:"+fps.toString())
                        }
                    },this.baseContext,this).apply {
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
