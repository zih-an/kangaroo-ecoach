package com.awsomeproject.data

import android.app.Activity
import android.content.Context
import android.media.MediaPlayer
import android.net.Uri
import android.widget.VideoView
import com.awsomeproject.R

class VideoViewRepetend(
    private var JSONmeg:String,
    private var mainActivity: Activity,
    private var videoView: VideoView,
    private var context: Context,
    private var listener: VideoViewRepetendListener?=null,
    private var voicePlayer :MediaPlayer)
{
    private lateinit var schedule: ExerciseSchedule
//    private val listener: VideoViewRepetendListener ?= null
    //记录下当前播放到那哪一组运动视频
    public var index=0
    init {
        schedule= ExerciseSchedule(JSONmeg)
        setPlayVideo()
        }
    fun setPlayVideo()//0倒计时，1运动，2休息
    {
        videoView.setOnPreparedListener(object : MediaPlayer.OnPreparedListener{
            override fun onPrepared(mp: MediaPlayer) {
                mp.setVideoScalingMode(MediaPlayer.VIDEO_SCALING_MODE_SCALE_TO_FIT);
            }
        })
        videoView.setOnCompletionListener{
            //倒计时完毕后开始播放运动视频
            listener?.onExerciseStart()//运动开始触发,进入运动视频
            // uri = "android.resource://" + context.packageName + "/" +  schedule.exerciseName.get(i++)，
            val ExerciseDounturi = "android.resource://" + context.packageName + "/" + R.raw.sample3
            videoView.setVideoURI(Uri.parse(ExerciseDounturi));
            videoView.setOnPreparedListener { it.isLooping = false }
            videoView.start()

            videoView.setOnCompletionListener {
                //运动视频结束，开始进入休息界面
                index++
                listener?.onExerciseEnd()//运动结束触发，进入休息视频
                val Relaxingturi = "android.resource://" + context.packageName + "/" + R.raw.relaxtimer
                videoView.setVideoURI(Uri.parse(Relaxingturi));
                videoView.setOnPreparedListener { it.isLooping = false }
                videoView.start()
                videoView.setOnCompletionListener {
                    //休息视频运动完毕,重新开始播放倒计时
                    setPlayVideo()
                }

            }
        }

        // 进入倒计时
        val countDounturi = "android.resource://" + context.packageName + "/" + R.raw.countdown
        videoView.setVideoURI(Uri.parse(countDounturi));
        videoView.setOnPreparedListener { it.isLooping = false }

        //播放倒计时提示声音
        val fd = context.assets.openFd("countdownfloder/countdownfive.mp3");
        voicePlayer.setDataSource(fd)
        voicePlayer.setOnCompletionListener { }
        voicePlayer.prepare()






    }

    interface VideoViewRepetendListener {
        fun onExerciseStart()
        fun onExerciseEnd()
    }
}