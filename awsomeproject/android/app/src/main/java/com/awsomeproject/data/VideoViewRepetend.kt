package com.awsomeproject.data

import android.app.Activity
import android.content.Context
import android.media.MediaPlayer
import android.net.Uri
import android.view.*
import android.widget.FrameLayout
import android.widget.VideoView
import androidx.constraintlayout.widget.Constraints
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.awsomeproject.utils.Voice
import java.util.*


class VideoViewRepetend(
    private var JSONmeg:String,
    private var mainActivity: Activity,
    private var videoView: VideoView,
    private var countdownView: SurfaceView,
    private var countdownViewFramLayout:FrameLayout,
    private var context: Context,
    private var listener: VideoViewRepetendListener?=null)
{
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
        schedule=ExerciseSchedule(JSONmeg)
        //设置倒计时结束后，倒计时界面隐藏
        countDownHide()
        setPlayVideo()
        }
    fun setPlayVideo()//0倒计时，1运动，2休息
    {
        // 设计倒计时
        val countDounturi=context.resources.getIdentifier("countdown","raw", context.getPackageName() )
        setCountView(countDounturi)
        if(index>=1)
        {
            countDownShow()
        }
        setVideoView()
        countDountMp?.setOnCompletionListener{
            //隐藏倒计时VIEW
            countDownHide()
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
                    countDownShow()
                    countDountMp?.setOnCompletionListener {
                        //休息视频运动完毕,重新开始播放倒计时
                        countDownHide()
                        setPlayVideo()
                    }
                    countDountMp?.start()
                    voice?.voiceRest()
                }
                else
                {
                    //运动视频播放完毕，退出运动界面
                    listener?.onExerciseFinish(index)//运动结束触发
                }
            }
        }
        if(index>=1)
        {
            countDountMp?.start()
        }

    }
    public fun start()
    {
        voice.voiceCountDown()
        countDountMp?.start()
        mainActivity.runOnUiThread(java.lang.Runnable {
            countDownShow()
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

    }
    private fun setVideoView()
    {
        val exVideoId=context.resources.getIdentifier(ExerciseSchedule.getName(index), "raw", context.getPackageName())
        val ExerciseDounturi = "android.resource://" + context.packageName + "/" + exVideoId
        println("444444"+ExerciseDounturi)
        videoView.setVideoURI(Uri.parse(ExerciseDounturi))
        videoView.seekTo(1)

    }
    private fun countDownShow()
    {
        countdownView.visibility = View.VISIBLE
        countdownViewFramLayout.visibility= View.VISIBLE
    }
    private fun countDownHide()
    {
        countdownView.visibility = View.INVISIBLE
        countdownViewFramLayout.visibility= View.INVISIBLE
    }

    interface VideoViewRepetendListener {
        fun onExerciseStart(index:Int,samplevideoName:String)
        fun onExerciseEnd(index:Int,samplevideoName:String,samplevideoTendency:MutableList<Int>,id:Int)
        fun onExerciseFinish(index:Int)
    }
}