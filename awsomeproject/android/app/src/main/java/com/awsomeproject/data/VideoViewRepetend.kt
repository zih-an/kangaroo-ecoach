package com.awsomeproject.data

import android.app.Activity
import android.content.Context
import android.media.MediaPlayer
import android.net.Uri
import android.os.SystemClock
import android.view.*
import android.widget.*
import androidx.constraintlayout.widget.Constraints
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.awsomeproject.MainApplication
import com.awsomeproject.R
import com.awsomeproject.utils.Voice
import java.util.*
import com.awsomeproject.MainApplication.getProxy
import com.danikula.videocache.HttpProxyCacheServer
import kotlin.concurrent.thread


class VideoViewRepetend(
    private var JSONmeg:String,
    private var mainActivity: Activity,
    private var videoView: VideoView,
    private var countdownView: SurfaceView,
    private var countdownSeekBar: SeekBar,
    private var countdownViewFramLayout:FrameLayout,
    private var countdownBackground:ImageView,
    private var context: Context,
    private var listener: VideoViewRepetendListener?=null)
{
    private val urlPrefix:String="http://120.46.128.131:80/media/"
    public lateinit var schedule: ExerciseSchedule
    var countDountMp:MediaPlayer?=null
    val surfaceHolder=object :SurfaceHolder.Callback{
        override fun surfaceChanged(p0: SurfaceHolder, p1: Int, p2: Int, p3: Int) {
        }
        override fun surfaceCreated(p0: SurfaceHolder) {
            countDountMp?.setDisplay(p0)
        }
        override fun surfaceDestroyed(p0: SurfaceHolder) {
            if (countDountMp?.isPlaying()!!) {
                countDountMp?.stop();
            }
            countDountMp?.release();
        }
    }
    var voice:Voice=com.awsomeproject.utils.Voice(context)
    //记录下当前播放到那哪一组运动视频
    public var index=0
    init {
        countdownBackground.setImageDrawable(context.resources.getDrawable(R.drawable.blackback))
        schedule=ExerciseSchedule(JSONmeg)
        //设置倒计时结束后，倒计时界面隐藏
        countDownHide(true)
        setVideoView()
        setPlayVideo()
        }
    fun setPlayVideo()//0倒计时，1运动，2休息
    {
        // 设计倒计时
        val countDounturi=context.resources.getIdentifier("countdown","raw", context.getPackageName() )
        setCountView(countDounturi)
        if(index>=1)
        {
            countDownShow(false)
        }
        countDountMp?.setOnCompletionListener{
            //隐藏倒计时VIEW
            countDownHide(true)
            //运动开始触发,进入运动视频
            listener?.onExerciseStart(index,ExerciseSchedule.getName(index))
            //播放运动视频
            videoView.start()
            //设置运动视频完成的handler
            videoView?.setOnCompletionListener {
                //运动视频结束，开始进入休息界面
                index++
                if(index<ExerciseSchedule.getSize()) //判断是否播放完毕
                {
                    //尚未播放完毕，转入休息界面，并更新参数以播放下一种运动视频
                    listener?.onExerciseEnd(
                        index,
                        ExerciseSchedule.getName(index),
                        ExerciseSchedule.getTagByIndex(index),
                        ExerciseSchedule.getId(index)
                    )
                    //运动结束触发，进入休息视频
                    val reVideoId = context.resources.getIdentifier("relaxtimer","raw", context.getPackageName() )
                    setCountView(reVideoId)
                    //设置休息倒计时界面显示
                    countDownShow(true)
                    //preload viewView
                    setVideoView()
                    countDountMp?.setOnCompletionListener {
                        //休息视频运动完毕,重新开始播放倒计时
                        countDownHide(true)
                        setPlayVideo()
                    }
                    countDountMp?.start()
                    voice?.voiceRest()
                }
                else
                {
                    //运动finish，播放分析视频.
                    val analysisId = context.resources.getIdentifier("analysis","raw", context.getPackageName() )
                    setCountView(analysisId)
                    //设置分析视频界面显示
                    countDownShow(false)
                    mainActivity.runOnUiThread(java.lang.Runnable {
                        Toast.makeText(context,"运动数据报告生成中",Toast.LENGTH_LONG).show()
                    })
                    countdownBackground.setImageDrawable(context.resources.getDrawable(R.drawable.whiteback))
                    countDountMp?.setOnCompletionListener {
                        val analysisId = context.resources.getIdentifier("analysis","raw", context.getPackageName() )
                        setCountView(analysisId)
                        //设置分析视频界面显示
                        countDountMp?.start()
                    }
                    countDountMp?.start()
                    //运动视频播放完毕，退出运动界面
                    listener?.onExerciseFinish(index)//运动结束触发
                }
            }
        }
        if(index>=1)
        {
            start()
        }
    }
    public fun start()
    {
        voice.voiceCountDown()
        countDountMp?.start()
        mainActivity.runOnUiThread(java.lang.Runnable {
            countDownShow(false)
        })
    }
    private fun setCountView(srcId:Int)
    {
        countDountMp?.release()
        countDountMp=null
        countDountMp=MediaPlayer.create(context,srcId)
        countDountMp?.setVideoScalingMode(MediaPlayer.VIDEO_SCALING_MODE_SCALE_TO_FIT_WITH_CROPPING);
        countDountMp?.setOnPreparedListener(object:MediaPlayer.OnPreparedListener{
            override fun onPrepared(p0: MediaPlayer?) {
                val screenHeight=context.resources.displayMetrics.heightPixels
                val screenWidth=context.resources.displayMetrics.widthPixels
                if(screenHeight>=screenWidth)
                {
                    val ratio:Double=p0!!.videoHeight.toDouble()/p0!!.videoWidth.toDouble()
                    var mp=FrameLayout.LayoutParams(screenWidth,(screenWidth.toDouble()*ratio).toInt())
                    mp.gravity= Gravity.CENTER
                    countdownView.layoutParams=mp
                }
                else
                {
                    val ratio:Double=p0!!.videoWidth.toDouble()/p0!!.videoHeight.toDouble()
                    var mp=FrameLayout.LayoutParams((screenHeight.toDouble()*ratio).toInt(),screenHeight)
                    mp.gravity= Gravity.CENTER
                    countdownView.layoutParams=mp
                }

            }
        })
        countDountMp?.setVolume(0.4f, 0.4f)
        countdownView.holder.addCallback(surfaceHolder)
        //给进度条设置滑动监听
        countDountMp?.let {
            countdownSeekBar.max=it.duration
        }
        countdownSeekBar.setOnSeekBarChangeListener(object :SeekBar.OnSeekBarChangeListener{
            override fun onProgressChanged(p0: SeekBar?, p1: Int, p2: Boolean) {
            }
            override fun onStartTrackingTouch(p0: SeekBar?) {
            }
            override fun onStopTrackingTouch(p0: SeekBar?) {
                val progress: Int = p0!!.getProgress()
                //在当前位置播放
                countDountMp?.seekTo(progress)
            }
        });
        thread {
            while(countdownSeekBar.progress<=countdownSeekBar.max)
            {
                SystemClock.sleep(200)
                try {
                    countDountMp?.let {
                        val postion = it.currentPosition
                        countdownSeekBar.progress = postion
                    }
                }catch (e:Throwable)
                {
                    e.printStackTrace()
                    break
                }
            }
        }
    }

    private fun setVideoView()
    {
        var ExerciseDounturi=urlPrefix+ExerciseSchedule.getName(index)+".mp4"
        var proxy = getProxy(mainActivity)
        var proxyUrl = proxy.getProxyUrl(ExerciseDounturi)
        videoView.setVideoPath(proxyUrl)
        videoView.seekTo(1)

    }
    private fun countDownShow(type:Boolean)
    {
        countdownView.visibility = View.VISIBLE
        if(type)
            countdownSeekBar.visibility= View.VISIBLE
        countdownViewFramLayout.visibility= View.VISIBLE
    }

    private fun countDownHide(type:Boolean)
    {
        countdownView.visibility = View.INVISIBLE
        if(type)
            countdownSeekBar.visibility= View.INVISIBLE
        countdownViewFramLayout.visibility= View.INVISIBLE
    }
    interface VideoViewRepetendListener {
        fun onExerciseStart(index:Int,samplevideoName:String)
        fun onExerciseEnd(index:Int,samplevideoName:String,samplevideoTendency:MutableList<Int>,id:Int)
        fun onExerciseFinish(index:Int)
    }
}