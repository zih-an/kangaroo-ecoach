package com.awsomeproject.videodecoder

import android.view.Surface

class GlobalStaticVariable {
    companion object{
        public var frameLength:Int=640
        public var frameWidth:Int=480
        public var frameDensity:Double=1.0
        public var frameRate:Int=25
        public var isScreenCapture:Boolean=false
        @Volatile
        public var newestWearMesg_HeartBeartRatio=0f;
        @Volatile
        public var isWearDeviceConnect=false;
        fun set_NewestWearMesg_HeartBeartRatio(ratio:Float)
        {
            newestWearMesg_HeartBeartRatio=ratio;
        }
        fun set_WearDeviceConnect(boolean: Boolean)
        {
            isWearDeviceConnect=boolean;
        }
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