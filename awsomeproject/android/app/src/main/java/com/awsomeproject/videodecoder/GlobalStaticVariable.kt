package com.awsomeproject.videodecoder

import android.view.Surface

class GlobalStaticVariable {
    companion object{
        public var frameLength:Int=640
        public var frameWidth:Int=480
        public var frameRate:Int=25
        public var isScreenCapture:Boolean=false
        public var receiverSurface:Surface?=null
    }
}