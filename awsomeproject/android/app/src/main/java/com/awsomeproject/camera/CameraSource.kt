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
import com.awsomeproject.MainActivity
import com.awsomeproject.MesgSpeak
import kotlin.coroutines.resumeWithException
import com.awsomeproject.VisualizationUtils
import com.awsomeproject.YuvToRgbConverter
import com.awsomeproject.data.Person
import com.awsomeproject.data.ResJSdata
import com.awsomeproject.data.Sample
import com.awsomeproject.data.VideoViewRepetend
import com.awsomeproject.ml.PoseDetector
import java.io.BufferedReader
import java.io.InputStreamReader
import java.util.*

class CameraSource(
//    private val videoView:VideoView,0...........................................................................................................................................................................................................................3
    private val surfaceView: SurfaceView,
    private val listener: CameraSourceListener? = null,
    private val context: Context? = null,
    private val mainActivity: Activity
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
    //    private var yuvvideo : YuvToRgbConverter=YuvToRgbConverter(videoView.context)
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


    //标准视频动作数据
    public var Samples: MutableList<Sample> = arrayListOf<Sample>()

    //用户视频动作数据
    public var Users: MutableList<ResJSdata> = arrayListOf<ResJSdata>()

    //标记当前正在进行运动的索引
    public var index=0

    //是否处理捕获帧
    private var isImageprocess:Boolean=false

    //初始化摄像机，并设置监听器，如果有可用图像就
    suspend fun initCamera() {
        camera = openCamera(cameraManager, cameraId)
        Samples.add(Sample("sample3-10fps.processed.json",context!!, object:Sample.scorelistener{
            override fun onFrameScoreHeight(FramScore: Int) {
                MesgSpeak(mainActivity,"真不戳",true)
            }
            override fun onFrameScoreLow(FramScore: Int) {
                MesgSpeak(mainActivity,"就这，就这啊",true)
            }
        }))
        Users.add(ResJSdata())
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
                processImage(rotatedBitmap)
                image.close()
            }
        }, imageReaderHandler)

        imageReader?.surface?.let { surface ->
            session = createSession(listOf(surface))

            val fps: Range<Int> = Range.create(10,10)
            var cameraRequest = camera?.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW)
            cameraRequest?.set(CaptureRequest.CONTROL_AE_TARGET_FPS_RANGE,fps)
            cameraRequest?.build()

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
        var scoreBypart: MutableList<Double> = mutableListOf<Double>()
        //matrix结构的用户关节点
        var keypointmatrix:Jama.Matrix =Jama.Matrix(0,0)

        if(isImageprocess==true) {
            Samples[index].clock()
            synchronized(lock) {
                detector?.estimatePoses(bitmap)?.let {
                    //捕获当前帧中的用户关节点
                    persons.addAll(it)
                    //捕获对应时刻的标准动作关节点
                    persons.addAll(Samples[index].getPersonNow())
                    //如果获取的帧可信，则处理
                    if(it.get(0).isTrust()) {
                        //输入用户关节点动作，进行计算
                        val S=Samples[index].exec(it)
                        score = S.first
                        scoreBypart = S.second
                        keypointmatrix = S.third
                    }
                    Users[index].append(scoreBypart,keypointmatrix)
                    listener?.onImageprocessListener(score.toInt())
                    }
                }

            frameProcessedInOneSecondInterval++
            if (frameProcessedInOneSecondInterval == 1)
            {
                // send fps to view
                listener?.onFPSListener(framesPerSecond)
            }
        }
        visualize(persons, bitmap)
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

    fun read_csv(filename:String):List<Jama.Matrix>
    {
        var posVecList:MutableList<Jama.Matrix> = arrayListOf<Jama.Matrix>()
        context?.let {
            val isr = InputStreamReader(it.assets.open("samples/"+filename), "UTF-8")
            val br = BufferedReader(isr)
            var line: String?
            val builder = StringBuilder()
            while (br.readLine().also { line = it } != null) {
                builder.append(line)
            }
            br.close()
            isr.close()
            var testjson: JSONObject = JSONObject(builder.toString());//builder读取了JSON中的数据。
            val array = testjson.getJSONArray("item")
            for(i in 0..array.length()-1)
            {
                val temp: Jama.Matrix = Jama.Matrix(array.getJSONArray(i).length() / 2, 2)
                for(j in 0..array.getJSONArray(i).length()/2-1)
                {
                    temp.set(j,0,array.getJSONArray(i).get(2*j).toString().toDouble())
                    temp.set(j,1,array.getJSONArray(i).get(2*j+1).toString().toDouble())
                }
                posVecList.add(temp)
            }
        }
        return posVecList
    }

    interface CameraSourceListener {
        fun onFPSListener(fps: Int)
        fun onImageprocessListener(score: Int)
        fun onDetectedInfo(personScore: Float?, poseLabels: List<Pair<String, Float>>?)
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
