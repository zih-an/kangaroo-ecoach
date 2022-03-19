package com.awsomeproject
import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.MediaController
import android.widget.VideoView


class CountDown : AppCompatActivity() {
    private lateinit var videoView: VideoView
    private lateinit var mediaController: MediaController
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_count_down)
        videoView = findViewById<VideoView>(R.id.videoView3)
        mediaController = MediaController(this)
        videoView.setMediaController(mediaController)
        val uri = "android.resource://" + packageName + "/" + R.raw.countdown
        videoView.setOnPreparedListener { mp->
            mp.setLooping(false)
        }
        videoView.setVideoURI(Uri.parse(uri));
        videoView.setOnCompletionListener {
            val intent =Intent()
            /* 指定intent要启动的类 */
            intent.setClass(this, MainActivity::class.java)
            intent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
            /* 启动一个新的Activity */
            startActivity(intent)
            finish()
            //播放结束后的动作
        }
        Log.e("debugLog","in start")

    }

    override fun onStart() {
        super.onStart()
        videoView.start()
    }
}