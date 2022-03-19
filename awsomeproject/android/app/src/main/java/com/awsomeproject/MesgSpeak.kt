package com.awsomeproject
import android.app.Activity
import android.speech.tts.TextToSpeech
import android.widget.Toast
import java.util.*
import android.speech.tts.UtteranceProgressListener




class MesgSpeak(private val activity: Activity,
                private val message: String,
                private val br: Boolean) : TextToSpeech.OnInitListener {

    private val tts: TextToSpeech = TextToSpeech(activity, this)

    override fun onInit(i: Int) {
        if (i == TextToSpeech.SUCCESS) {
//            tts.setOnUtteranceProgressListener(UtteranceProgressListener() {
//                override fun onDone(s: String) { //完成之后
//                    DemoActivity.videoView
//                }
//            })
            tts.setPitch(1.0f)
            // 设置语速
            // 设置语速
            tts.setSpeechRate(1.0f)
            val localeCH = Locale.CHINESE

            val result: Int
            result = tts.setLanguage(localeCH)

            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                Toast.makeText(activity, "This Language is not supported", Toast.LENGTH_SHORT).show()
            } else {
                speakOut(message)
            }

        } else {
            Toast.makeText(activity, "Initilization Failed!", Toast.LENGTH_SHORT).show()
        }
    }

    private fun speakOut(message: String) {
        tts.speak(message, TextToSpeech.QUEUE_FLUSH, null, null)
    }
}

