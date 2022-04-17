package com.awsomeproject.videodecoder

import android.view.Surface

class GlobalStaticVariable {
    companion object{
        public var frameLength:Int=640
        public var frameWidth:Int=480
        public var frameDensity:Double=1.0
        public var frameRate:Int=25
        public var isScreenCapture:Boolean=false
        fun reSet()
        {
            frameLength=640
            frameWidth=480
            frameDensity=1.0
            frameRate=25
            isScreenCapture=false
        }
    }
}