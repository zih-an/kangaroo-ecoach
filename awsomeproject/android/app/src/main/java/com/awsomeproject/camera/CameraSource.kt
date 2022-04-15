/* Copyright 2021 The TensorFlow Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================
*/

package com.awsomeproject.camera


import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.graphics.Bitmap
import android.graphics.ImageFormat
import android.graphics.Matrix
import android.graphics.Rect
import android.hardware.camera2.*
import android.media.ImageReader
import android.media.MediaPlayer
import android.os.Handler
import android.os.HandlerThread
import android.util.Log
import android.util.Range
import android.view.Surface
import android.view.SurfaceView
import android.widget.Toast
import kotlin.coroutines.resume
import kotlinx.coroutines.suspendCancellableCoroutine
import org.json.JSONObject
import com.awsomeproject.*
import kotlin.coroutines.resumeWithException
import com.awsomeproject.data.Person
import com.awsomeproject.data.ResJSdata
import com.awsomeproject.data.Sample
import com.awsomeproject.data.VideoViewRepetend
import com.awsomeproject.ml.PoseDetector
import com.awsomeproject.utils.BoneVectorPart
import com.awsomeproject.utils.DTWprocess
import com.awsomeproject.utils.Voice
import java.io.*
import java.util.*
import kotlin.random.Random

class CameraSource(
//    private val videoView:VideoView,0...........................................................................................................................................................................................................................3
    private val surfaceView: SurfaceView,
    private val listener: CameraSourceListener? = null,
    private val context: Context,
    private val mainActivity: Activity,
    private val firstSamplevideoTendency :MutableList<Int>,
    private val firstSamplevideoName :String,
    private val firstSamplevideoId:Int
) {

    companion object {
        private const val PREVIEW_WIDTH = 640
        private const val PREVIEW_HEIGHT = 480

        /** Threshold for confidence score. */
        public const val MIN_CONFIDENCE = .2f
        private const val TAG = "Camera Source"
    }

    private val lock = Any()
    private var detector: PoseDetector? = null
    private var isTrackerEnabled = false
    private var yuvConverter: YuvToRgbConverter = YuvToRgbConverter(surfaceView.context)
    private lateinit var imageBitmap: Bitmap

    /** Frame count that have been processed so far in an one second interval to calculate FPS. */
    private var fpsTimer: Timer? = null
    private var frameProcessedInOneSecondInterval = 0
    private var framesPerSecond = 0

    /** Detects, characterizes, and connects to a CameraDevice (used for all camera operations) */
    private val cameraManager: CameraManager by lazy {
        val context = surfaceView.context
        context.getSystemService(Context.CAMERA_SERVICE) as CameraManager
    }

    /** Readers used as buffers for camera still shots */
    private var imageReader: ImageReader? = null

    /** The [CameraDevice] that will be opened in this fragment */
    private var camera: CameraDevice? = null

    /** Internal reference to the ongoing [CameraCaptureSession] configured with our parameters */
    private var session: CameraCaptureSession? = null

    /** [HandlerThread] where all buffer reading operations run */
    private var imageReaderThread: HandlerThread? = null

    /** [Handler] corresponding to [imageReaderThread] */
    private var imageReaderHandler: Handler? = null
    private var cameraId: String = ""
    @Volatile
    private var isAlive:Boolean=true
    //定时器设置
    private var NewFrameGenerator = Timer().schedule(object :TimerTask(){
        override fun run() {
            if(!isAlive)
            {
                cancel()
            }
            var tempBitmap:Bitmap?=newestBitmap;
            tempBitmap?.let{
                processImage(tempBitmap)
            }
        }
    },500,100)

    @Volatile
    private var newestBitmap:Bitmap?=null;
    @Volatile
    private var newestPersons: MutableList<Person>?=null;

    //语言播放器
    private val  voice=Voice(context)

    //标准视频动作数据
    public var Samples: MutableList<Sample> = arrayListOf<Sample>()

    //用户视频动作数据
    public var Users: MutableList<ResJSdata> = arrayListOf<ResJSdata>()

    //标记当前正在进行运动的索引
    public var index=0

    //是否处理捕获帧
    private var isImageprocess:Boolean=false

    //初期检测人是否在摄像头内部
    private var isPersonDetect:Boolean=false
    //初始化摄像机，并设置监听器
    suspend fun initCamera() {
        camera = openCamera(cameraManager, cameraId)

        Samples.add(Sample(firstSamplevideoName+".processed.json",context,firstSamplevideoId,firstSamplevideoTendency,object:Sample.scorelistener{
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
        Users.add(ResJSdata(firstSamplevideoId))

        imageReader =
            ImageReader.newInstance(PREVIEW_WIDTH, PREVIEW_HEIGHT, ImageFormat.YUV_420_888, 3)
        imageReader?.setOnImageAvailableListener({ reader ->
            val image = reader.acquireLatestImage()
            if (image != null) {
                if (!::imageBitmap.isInitialized) {
                    imageBitmap =
                        Bitmap.createBitmap(
                            PREVIEW_WIDTH,
                            PREVIEW_HEIGHT,
                            Bitmap.Config.ARGB_8888
                        )
                }
                yuvConverter.yuvToRgb(image, imageBitmap)
                val rotateMatrix = Matrix()
                rotateMatrix.postScale(1.0f, -1.0f);
                rotateMatrix.postRotate(180.0f)

                val rotatedBitmap = Bitmap.createBitmap(
                    imageBitmap, 0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT,
                    rotateMatrix, false
                )
//                processImage(rotatedBitmap)
                newestBitmap=rotatedBitmap
                var oldPersons = mutableListOf<Person>();
                newestPersons?.let{
                    oldPersons=it
                }
                visualize(oldPersons,rotatedBitmap)
                image.close()
            }
        }, imageReaderHandler)

        imageReader?.surface?.let { surface ->
            session = createSession(listOf(surface))

            var cameraRequest = camera?.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW)
//            val fps: Range<Int> = Range.create(10,10)
//            cameraRequest?.set(CaptureRequest.CONTROL_AE_TARGET_FPS_RANGE,fps)
            cameraRequest?.addTarget(surface)
            cameraRequest?.build()?.let {
                session?.setRepeatingRequest(it, null, null)
            }
        }
    }

    private suspend fun createSession(targets: List<Surface>): CameraCaptureSession =
        suspendCancellableCoroutine { cont ->
            camera?.createCaptureSession(targets, object : CameraCaptureSession.StateCallback() {
                override fun onConfigured(captureSession: CameraCaptureSession) =
                    cont.resume(captureSession)

                override fun onConfigureFailed(session: CameraCaptureSession) {
                    cont.resumeWithException(Exception("Session error"))
                }
            }, null)
        }

    @SuppressLint("MissingPermission")
    private suspend fun openCamera(manager: CameraManager, cameraId: String): CameraDevice =
        suspendCancellableCoroutine { cont ->
            manager.openCamera("1", object : CameraDevice.StateCallback() {
                override fun onOpened(camera: CameraDevice) = cont.resume(camera)

                override fun onDisconnected(camera: CameraDevice) {
                    camera.close()
                }

                override fun onError(camera: CameraDevice, error: Int) {
                    if (cont.isActive) cont.resumeWithException(Exception("Camera error"))
                }
            }, imageReaderHandler)
        }

    fun prepareCamera() {
        for (cameraId in cameraManager.cameraIdList) {
            val characteristics = cameraManager.getCameraCharacteristics(cameraId)

            // We don't use a front facing camera in this sample.
            val cameraDirection = characteristics.get(CameraCharacteristics.LENS_FACING)
            if (cameraDirection != null &&
                cameraDirection == CameraCharacteristics.LENS_FACING_FRONT
            ) {
                continue
            }
            this.cameraId = cameraId
        }
    }

    fun setDetector(detector: PoseDetector) {
        synchronized(lock) {
            if (this.detector != null) {
                this.detector?.close()
                this.detector = null
            }
            this.detector = detector
        }
    }

    fun pause()
    {
        session?.stopRepeating()
    }

    fun resume() {
        imageReaderThread = HandlerThread("imageReaderThread").apply { start() }
        imageReaderHandler = Handler(imageReaderThread!!.looper)
        fpsTimer = Timer()
        fpsTimer?.scheduleAtFixedRate(
            object : TimerTask() {
                override fun run() {
                    framesPerSecond = frameProcessedInOneSecondInterval
                    frameProcessedInOneSecondInterval = 0
                }
            },
            0,
            1000
        )

    }

    fun close() {
        isAlive=false
        session?.close()
        session = null
        camera?.close()
        camera = null
        imageReader?.close()
        imageReader = null
        stopImageReaderThread()
        detector?.close()
        detector = null
        fpsTimer?.cancel()
        fpsTimer = null
        frameProcessedInOneSecondInterval = 0
        framesPerSecond = 0
    }

    // process image
    private fun processImage(bitmap: Bitmap) {

        val persons = mutableListOf<Person>()
        //总分数
        var score:Double=0.0
        //部位分数
        var scoreBypart: MutableList<Double> = mutableListOf<Double>(0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0)
        //matrix结构的用户关节点
        var uservector:Jama.Matrix =Jama.Matrix(DTWprocess().num_vector,DTWprocess().num_dimension)
        synchronized(lock) {
            if (isImageprocess == true) {
                Samples[index].clock()
                detector?.estimatePoses(bitmap)?.let {
                    //捕获当前帧中的用户关节点
                    persons.addAll(it)
//                    //捕获对应时刻的标准动作关节点
//                    persons.addAll(Samples[index].getPersonNow(it[0].keyPoints[0].coordinate.x.toDouble(),it[0].keyPoints[0].coordinate.y.toDouble()))
                    //如果获取的帧可信，则处理
                    if (it.get(0).isTrust()) {
                        //输入用户关节点动作，进行计算
                        val S = Samples[index].exec(it)
                        score = S.first
                        scoreBypart = S.second
                        uservector = S.third
                    }
                    if(Samples[index].getClock()%2==0)
                        Users[index].append(scoreBypart, uservector,Samples[index].getSampleVectorNow())
                    listener?.onImageprocessListener(score.toInt())
                }
                frameProcessedInOneSecondInterval++
                if (frameProcessedInOneSecondInterval == 1) {
                    // send fps to view
//                    listener?.onFPSListener(framesPerSecond)
                }
            }
            else if (isPersonDetect == false) {
                detector?.estimatePoses(bitmap)?.let {
                    //捕获对应时刻的标准动作关节点
                    persons.addAll(it)
                    persons.addAll(Samples[index].getPersonOnStart(it[0].keyPoints[0].coordinate.x.toDouble(),it[0].keyPoints[0].coordinate.y.toDouble()))
                    if (Samples[index].tryFirstFrame(it)>=85&&it.get(0).isTrustMoreSerious())
                    {
                        isPersonDetect = true
                        listener?.onPersonDetected()
                    }
                }
            }
        }
        newestPersons=persons
//        visualize(persons, bitmap)
    }

    private fun visualize(persons: List<Person>, bitmap: Bitmap) {

        val outputBitmap = VisualizationUtils.drawBodyKeypoints(
            bitmap,
            persons.filter { it.score > MIN_CONFIDENCE }, isTrackerEnabled
        )

        val holder = surfaceView.holder
        val surfaceCanvas = holder.lockCanvas()
        surfaceCanvas?.let { canvas ->
            val screenWidth: Int
            val screenHeight: Int
            val left: Int
            val top: Int

            if (canvas.height > canvas.width) {
                val ratio = outputBitmap.height.toFloat() / outputBitmap.width
                screenWidth = canvas.width
                left = 0
                screenHeight = (canvas.width * ratio).toInt()
                top = (canvas.height - screenHeight) / 2
            } else {
                val ratio = outputBitmap.width.toFloat() / outputBitmap.height
                screenHeight = canvas.height
                top = 0
                screenWidth = (canvas.height * ratio).toInt()
                left = (canvas.width - screenWidth) / 2
            }
            val right: Int = left + screenWidth
            val bottom: Int = top + screenHeight

            canvas.drawBitmap(
                outputBitmap, Rect(0, 0, outputBitmap.width, outputBitmap.height),
                Rect(left, top, right, bottom), null
            )
            surfaceView.holder.unlockCanvasAndPost(canvas)
        }
    }

    private fun stopImageReaderThread() {
        imageReaderThread?.quitSafely()
        try {
            imageReaderThread?.join()
            imageReaderThread = null
            imageReaderHandler = null
        } catch (e: InterruptedException) {
            Log.d(TAG, e.message.toString())
        }
    }

    interface CameraSourceListener {
        fun onFPSListener(fps: Int)
        fun onImageprocessListener(score: Int)
        fun onDetectedInfo(personScore: Float?, poseLabels: List<Pair<String, Float>>?)
        fun onPersonDetected()
    }

    private fun showToast(message: String)
    {
        Toast.makeText(context, message, Toast.LENGTH_LONG).show()
    }

    public fun setProcessImageFlag(flag:Boolean):Boolean
    {
        isImageprocess=flag
        return isImageprocess
    }


}