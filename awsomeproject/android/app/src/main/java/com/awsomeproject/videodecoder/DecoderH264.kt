package com.awsomeproject.videodecoder

import android.graphics.ImageFormat
import android.graphics.SurfaceTexture
import android.media.Image
import android.media.MediaCodec
import android.media.MediaFormat
import android.view.Surface
import com.awsomeproject.videodecoder.GlobalStaticVariable
import java.lang.IllegalStateException
import java.lang.NullPointerException


class DecoderH264(
    private val surface: Surface?,
    private val width:Int,
    private val height:Int,
    private var listener: DecoderListener? = null,
    private var frameRate:Int=25) {
    private val COLOR_FormatI420 = 1
    private val COLOR_FormatNV21 = 2
    private fun isImageFormatSupported(image: Image): Boolean {
        val format = image.format
        when (format) {
            ImageFormat.YUV_420_888, ImageFormat.NV21, ImageFormat.YV12 -> return true
        }
        return false
    }
    public fun close()
    {
        mediaCodec?.release()
        mediaCodec=null
    }
    private var mediaCodec: MediaCodec?=null
    init {
        mediaCodec = MediaCodec.createDecoderByType("video/avc")
        //height和width一般都是照相机的height和width。
        var mediaFormat = MediaFormat.createVideoFormat("video/avc", width, height)
        //描述平均位速率（以位/秒为单位）的键。 关联的值是一个整数
        mediaFormat.setInteger(MediaFormat.KEY_BIT_RATE, width * height)
        //描述视频格式的帧速率（以帧/秒为单位）的键。帧率，一般在15至30之内，太小容易造成视频卡顿。
        mediaFormat.setInteger(MediaFormat.KEY_FRAME_RATE, frameRate)
        //关键帧间隔时间，单位是秒
        mediaFormat.setInteger(MediaFormat.KEY_I_FRAME_INTERVAL, 1)
        if(GlobalStaticVariable.isScreenCapture)
        {
            mediaCodec?.configure(mediaFormat, surface, null, 0)
        }
        else
        {
            mediaCodec?.configure(mediaFormat,null, null, 0)
        }

        //开始编码
        mediaCodec?.start()
    }
    public fun decoderH264(byteArray: ByteArray){
        synchronized(Any())
        {
            try {
                mediaCodec?.let {
                    //拿到输入缓冲区,用于传送数据进行解码
                    var inputBuffers = it.inputBuffers
                    //拿到输出缓冲区,用于取到解码后的数据
                    val outputBuffers = it.outputBuffers
                    val inputBufferIndex = it.dequeueInputBuffer(0)
                    //当输入缓冲区有效时,就是>=0
                    if (inputBufferIndex >= 0) {
                        var inputBuffer = inputBuffers[inputBufferIndex]
                        inputBuffer.clear()
                        //往输入缓冲区写入数据
                        inputBuffer.put(byteArray)
                        //五个参数，第一个是输入缓冲区的索引，第二个数据是输入缓冲区起始索引，第三个是放入的数据大小，第四个是时间戳，保证递增就是
                        it.queueInputBuffer(
                            inputBufferIndex,
                            0,
                            byteArray.count(),
                            System.nanoTime(),
                            0
                        )
                    }
                    val bufferInfo = MediaCodec.BufferInfo()
                    //拿到输出缓冲区的索引

                    var outputBufferIndex = it.dequeueOutputBuffer(bufferInfo, 0)
                    while (outputBufferIndex >= 0) {
//                var outputBuffer = outputBuffers[outputBufferIndex]
//                var outData = ByteArray(bufferInfo.size)
//            outputBuffer.get(outData)
                        listener?.YUV420(it.getOutputImage(outputBufferIndex))
                        it.releaseOutputBuffer(outputBufferIndex, true)
                        outputBufferIndex = it.dequeueOutputBuffer(bufferInfo, 0);
                    }
                }
            }
            catch (e:NullPointerException)
            {
                e.printStackTrace()
            }
            catch (e:IllegalStateException)
            {
                e.printStackTrace()
            }
            catch  (e:Throwable) {
                e.printStackTrace();
            }
        }
    }



    interface DecoderListener
    {
        fun YUV420(image: Image?)

    }
}