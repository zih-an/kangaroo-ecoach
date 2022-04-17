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


import android.app.Activity
import android.content.Context
import android.graphics.Bitmap
import android.graphics.Matrix
import android.graphics.Rect
import android.media.Image
import android.view.SurfaceView
import android.widget.Toast
import com.awsomeproject.VisualizationUtils
import com.awsomeproject.YuvToRgbConverter
import com.awsomeproject.data.Person
import com.awsomeproject.data.ResJSdata
import com.awsomeproject.data.Sample
import com.awsomeproject.ml.PoseDetector
import com.awsomeproject.socketconnect.communication.host.FrameDataReceiver
import com.awsomeproject.utils.DTWprocess
import com.awsomeproject.utils.Voice
import java.lang.IllegalStateException
import java.util.*


class CameraReceiver(
//    private val videoView:VideoView
    private val surfaceView: SurfaceView,
    private val listener: CameraReceiverListener? = null,
    private val context: Context,
    private val mainActivity: Activity,
    private val firstSamplevideoTendency :MutableList<Int>,
    private val firstSamplevideoName :String,
    private val firstSamplevideoId:Int
) {

    companion object {
        public const val PREVIEW_WIDTH = 640
        public const val PREVIEW_HEIGHT = 480
        /** Threshold for confidence score. */
        public const val MIN_CONFIDENCE = .2f
        private const val TAG = "Camera Receiver"
    }

    private val lock = Any()
    private var detector: PoseDetector? = null
    private var isTrackerEnabled = false
    private var yuvConverter: YuvToRgbConverter = YuvToRgbConverter(surfaceView.context)
    private lateinit var imageBitmap: Bitmap

    @Volatile
    private var newestBitmap:Bitmap?=null;
    @Volatile
    private var newestPersons: MutableList<Person>?=null;

    private val isOpen = false
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
    @Volatile
    private var isAlive:Boolean=true
    //定时器设置
    private var NewFrameGenerator:Timer?=null
    //定时器事件设置
    private var timerTask:TimerTask?=object :TimerTask(){
        override fun run() {
            try {
                if (!isAlive)
                    cancel()
                var tempBitmap: Bitmap? = newestBitmap;
                tempBitmap?.let {
                    processImage(tempBitmap)
                }
            }
            catch (e:InterruptedException)
            {
                e.printStackTrace()
            }
            catch (e: IllegalStateException)
            {
                e.printStackTrace()
            }
            catch (e:Throwable)
            {
                e.printStackTrace()
            }
        }
    }
    //初始化摄像机，并设置监听器
     suspend fun initCamera() {
//        createFile()
        NewFrameGenerator = Timer()
        NewFrameGenerator?.schedule(timerTask,500,100)
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

    }

    fun resume()
    {

    }

    fun close() {
        isAlive=false
        isImageprocess=false
        timerTask?.cancel()
        timerTask=null
        NewFrameGenerator?.cancel()
        NewFrameGenerator=null
        detector?.close()
        detector = null
        isPersonDetect=true

    }

    //process image
    private fun processImage(bitmap: Bitmap){
        val persons = mutableListOf<Person>()
        //总分数
        var score:Double=0.0
        //部位分数
        var scoreBypart: MutableList<Double> = mutableListOf<Double>(0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0)
        //matrix结构的用户关节点
        var uservector:Jama.Matrix =Jama.Matrix(DTWprocess().num_vector,DTWprocess().num_dimension)
        if(isAlive) {
            synchronized(lock) {
                if (isImageprocess == true) {
                    Samples[index].clock()
                    detector?.estimatePoses(bitmap)?.let {
                        //捕获当前帧中的用户关节点
                        persons.addAll(it)
                        //捕获对应时刻的标准动作关节点
//                   persons.addAll(Samples[index].getPersonNow())
                        //如果获取的帧可信，则处理
                        if (it.get(0).isTrust()) {
                            //输入用户关节点动作，进行计算
                            val S = Samples[index].exec(it)
                            score = S.first
                            scoreBypart = S.second
                            uservector = S.third
                        }
                        if (Samples[index].getClock() % 5 == 0)
                            Users[index].append(
                                scoreBypart,
                                uservector,
                                Samples[index].getSampleVectorNow()
                            )
                        listener?.onImageprocessListener(score.toInt())
                    }
                    print("");
                } else if (isPersonDetect == false) {
                    detector?.estimatePoses(bitmap)?.let {
                        persons.addAll(it)
                        if (Samples[index].tryFirstFrame(it) >= 90 && it.get(0)
                                .isTrustMoreSerious()
                        ) {
                            isPersonDetect = true
                            listener?.onPersonDetected()
                        }
                    }
                }
            }
            newestPersons = persons
        }
//        return persons;
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

    fun prepareCamera() {
        //开始接受frame
        FrameDataReceiver.open(null,object : FrameDataReceiver.FrameDataListener {
            override fun onReceive(image: Image) {
                if (image != null) {
                    if (!::imageBitmap.isInitialized) {
                        imageBitmap =
                            Bitmap.createBitmap(
                                CameraReceiver.PREVIEW_WIDTH,
                                CameraReceiver.PREVIEW_HEIGHT,
                                Bitmap.Config.ARGB_8888
                            )
                    }
                    yuvConverter.yuvToRgb(image, imageBitmap)
                    val rotateMatrix = Matrix()
                    rotateMatrix.postScale(1.0f, -1.0f);
                    rotateMatrix.postRotate(180.0f)

                    val rotatedBitmap = Bitmap.createBitmap(
                        imageBitmap, 0, 0, CameraReceiver.PREVIEW_WIDTH, CameraReceiver.PREVIEW_HEIGHT,
                        rotateMatrix, false
                    )
                    newestBitmap=rotatedBitmap
                    var oldPersons = mutableListOf<Person>();
                    newestPersons?.let{
                        oldPersons=it
                    }
                    visualize(oldPersons,rotatedBitmap)
                    image.close()
                }
            }
        })
    }




    interface CameraReceiverListener {
        fun onFPSListener(fps: Int)
        fun onImageprocessListener(score: Int)
        fun onDetectedInfo(personScore: Float?, poseLabels: List<Pair<String, Float>>?)
        fun onPersonDetected()
    }
//    private var fos:FileOutputStream?=null
//    private fun createFile()
//    {
//        fos = context.openFileOutput("test.h264",Context.MODE_PRIVATE)
//    }
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
