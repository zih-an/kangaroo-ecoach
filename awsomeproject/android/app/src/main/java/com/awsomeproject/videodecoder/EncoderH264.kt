package com.awsomeproject.videodecoder

import android.graphics.ImageFormat
import android.graphics.PixelFormat
import android.media.Image
import android.media.MediaCodec
import android.media.MediaCodecInfo
import android.media.MediaFormat
import android.view.Surface
import com.awsomeproject.service.screenCaptureService
import java.nio.ByteBuffer


class EncoderH264(
        private var width:Int,
        private var height:Int,
        private var listener: EncoderListener? = null,
        private var frameRate:Int=25)
{
    private lateinit var mediaCodec: MediaCodec
    private val COLOR_FormatI420 = 1
    private val COLOR_FormatNV21 = 2
    companion object{
        var index:Int=0;
    }
    init{
        initMediaCodec()
    }

    private fun initMediaCodec()
    {
        mediaCodec = MediaCodec.createEncoderByType("video/avc")
        //height和width一般都是照相机的height和width。
        var mediaFormat = MediaFormat.createVideoFormat("video/avc", width, height)
        //描述平均位速率（以位/秒为单位）的键。 关联的值是一个整数
        mediaFormat.setInteger(MediaFormat.KEY_BIT_RATE, width * height)
        //描述视频格式的帧速率（以帧/秒为单位）的键。帧率，一般在15至30之内，太小容易造成视频卡顿。
        mediaFormat.setInteger(MediaFormat.KEY_FRAME_RATE, frameRate)
//        mediaFormat.setInteger(MediaFormat.KEY_BITRATE_MODE,MediaCodecInfo.EncoderCapabilities.BITRATE_MODE_CBR)
        //色彩格式，具体查看相关API，不同设备支持的色彩格式不尽相同
        //COLOR_FormatYUV420SemiPlanar
        if(GlobalStaticVariable.isScreenCapture)
            mediaFormat.setInteger(MediaFormat.KEY_COLOR_FORMAT, MediaCodecInfo.CodecCapabilities.COLOR_FormatSurface)
        else
            mediaFormat.setInteger(MediaFormat.KEY_COLOR_FORMAT, MediaCodecInfo.CodecCapabilities.COLOR_FormatYUV420SemiPlanar )
        //关键帧间隔时间，单位是秒
        mediaFormat.setInteger(MediaFormat.KEY_I_FRAME_INTERVAL, 1);
        mediaCodec.configure(mediaFormat, null, null, MediaCodec.CONFIGURE_FLAG_ENCODE)

        if(GlobalStaticVariable.isScreenCapture)
        {
            screenCaptureService.surface = mediaCodec.createInputSurface()
            //开始编码
            mediaCodec.start()
            val videoEncoderThread=Thread{
                while(true) {
                    //拿到输出缓冲区,用于取到编码后的数据
                    val outputBuffers = mediaCodec.outputBuffers
                    val bufferInfo = MediaCodec.BufferInfo()
                    //拿到输出缓冲区的索引
                    var outputBufferIndex = mediaCodec.dequeueOutputBuffer(bufferInfo, 0)
                    while (outputBufferIndex >= 0) {
                        var outputBuffer = outputBuffers[outputBufferIndex]
                        var outData = ByteArray(bufferInfo.size)
                        outputBuffer.get(outData);
                        //outData就是输出的h264数据
                        listener?.h264(outData)
                        mediaCodec.releaseOutputBuffer(outputBufferIndex, false);
                        outputBufferIndex = mediaCodec.dequeueOutputBuffer(bufferInfo, 0);
                    }
                }

            }
            videoEncoderThread.start()
        }
        else {
            //开始编码
            mediaCodec.start()
        }

    }

    public fun encoderH264(image: Image) {
        synchronized(Any())
        {
            index++
            var nv21 = getDataFromImage(image, COLOR_FormatNV21)
            var nv12 = NV21ToNv12(nv21, width, height)
            //拿到输入缓冲区,用于传送数据进行编码
            var inputBuffers = mediaCodec.inputBuffers
            //拿到输出缓冲区,用于取到编码后的数据
            val outputBuffers = mediaCodec.outputBuffers

            val inputBufferIndex = mediaCodec.dequeueInputBuffer(0)
            //当输入缓冲区有效时,就是>=0
            if (inputBufferIndex >= 0) {
                var inputBuffer = inputBuffers[inputBufferIndex]
                inputBuffer.clear()
                //往输入缓冲区写入数据
                inputBuffer.put(nv12)
                //五个参数，第一个是输入缓冲区的索引，第二个数据是输入缓冲区起始索引，第三个是放入的数据大小，第四个是时间戳，保证递增就是
                mediaCodec.queueInputBuffer(
                    inputBufferIndex,
                    0,
                    nv12.count(),
                    System.nanoTime(),
                    0
                )
            }
            val bufferInfo = MediaCodec.BufferInfo()
            //拿到输出缓冲区的索引
            var outputBufferIndex = mediaCodec.dequeueOutputBuffer(bufferInfo, 0)
            while (outputBufferIndex >= 0) {
                var outputBuffer = outputBuffers[outputBufferIndex]
                var outData = ByteArray(bufferInfo.size)
                outputBuffer.get(outData);
                //outData就是输出的h264数据
                listener?.h264(outData)
                mediaCodec.releaseOutputBuffer(outputBufferIndex, false);
                outputBufferIndex = mediaCodec.dequeueOutputBuffer(bufferInfo, 0);
            }
        }
    }
    private fun NV21ToNv12(nv21:ByteArray,width:Int,height: Int):ByteArray
    {
        var nv12:ByteArray = ByteArray(width * height * 3 / 2)
        var frameSize:Int = width * height;
        System.arraycopy(nv21, 0, nv12, 0, frameSize);
        for (i in 0..frameSize-1)
        {
            nv12[i] = nv21[i];
        }
        for (j in 0..frameSize/2-1  step 2)
        {
            nv12[frameSize + j - 1] = nv21[j + frameSize];
        }
        for (j in 0..frameSize/2-1  step 2)
        {
            nv12[frameSize + j] = nv21[j + frameSize - 1];
        }
        return nv12;
    }

    private fun rotateNV2by90(data:ByteArray, imageWidth:Int,imageHeight:Int):ByteArray
    {
        var yuv:ByteArray = ByteArray(imageWidth * imageHeight * 3 / 2)
        var i:Int=0
        for(x in 0..imageWidth-1)
        {
            for(y in imageHeight-1 downTo 0)
            {
                yuv[i] = data[y * imageWidth + x]
                i++
            }
        }
        // Rotate the U and V color components
        i = imageWidth*imageHeight*3/2 - 1;
        for (x in imageWidth - 1 downTo 0 step 2)
        {
            for (y in 0..imageHeight/2-1)
            {
                yuv[i] = data[(imageWidth * imageHeight) + (y * imageWidth) + x]
                i--
                yuv[i] = data[(imageWidth * imageHeight) + (y * imageWidth) + (x - 1)]
                i--
            }
        }
        return yuv
    }

    private fun isImageFormatSupported(image:Image):Boolean
    {
        val format = image.format
        when (format) {
            PixelFormat.RGBA_8888, ImageFormat.YUV_420_888, ImageFormat.NV21, ImageFormat.YV12 -> return true
        }
        return false
    }
    fun image_rgba8888_to_nv21(image: Image, width: Int, height: Int): ByteArray {
        //获取基本参数
        val mWidth: Int = image?.width                            //image中图像数据得到的宽
        val mHeight: Int = image?.height                          //image中图像数据得到的高
        val planes = image.planes       							//image图像数据对象
        val buffer = planes[0].getBuffer()
        val pixelStride = planes[0].getPixelStride()          	//像素步幅
        val rowStride = planes[0].getRowStride()     		 	    //行距
        val rowPadding = rowStride - pixelStride * mWidth         //行填充数据（得到的数据宽度大于指定的width,多出来的数据就是填充数据）
        /*
          以480*640尺寸为例
          Image对象获取到的RGBA_8888数据格式分析如下
          1.getPixelStride方法获取相邻像素间距 = 4
          2.getRowStride方法获取行跨度 = 2048
          3.2048-4*480 = 128，说明每行多出128个byte，这128个byte表示行填充的值，里面的数据为无效数据。
          4.转换：需要将每行的最后128个数据忽略掉，再进行转换
         */
        //得到bytes类型的rgba数据
        val len: Int = buffer.limit() - buffer.position()
        val rgba = ByteArray(len)
        buffer.get(rgba)

        var yIndex = 0
        var uvIndex = width * height
        var argbIndex = 0
        //nv21数据初始化
        val nv21 = ByteArray(width * height * 3 / 2)

        for (j in 0 until height) {
            for (i in 0 until width) {
                var r: Int = rgba.get(argbIndex ++).toInt()
                var g: Int = rgba.get(argbIndex ++).toInt()
                var b: Int = rgba.get(argbIndex ++).toInt()
                argbIndex ++ //跳过a
                r = r and 0x000000FF
                g = g and 0x000000FF
                b = b and 0x000000FF
                val y = (66 * r + 129 * g + 25 * b + 128 shr 8) + 16
                nv21[yIndex ++] = (if (y > 0xFF) 0xFF else if (y < 0) 0 else y).toByte()
                if (j and 1 == 0 && argbIndex shr 2 and 1 == 0 && uvIndex < nv21.size - 2) {
                    val u = (- 38 * r - 74 * g + 112 * b + 128 shr 8) + 128
                    val v = (112 * r - 94 * g - 18 * b + 128 shr 8) + 128
                    nv21[uvIndex ++] = (if (v > 0xFF) 0xFF else if (v < 0) 0 else v).toByte()
                    nv21[uvIndex ++] = (if (u > 0xFF) 0xFF else if (u < 0) 0 else u).toByte()
                }
            }
            argbIndex += rowPadding	//跳过rowPadding长度的填充数据
        }
        return nv21;
    }

    fun YV12toYUV420PackedSemiPlanar(input: ByteArray, width: Int, height: Int): ByteArray? {
        val frameSize = width * height
        val qFrameSize = frameSize / 4
        val output = ByteArray(input.size)
        System.arraycopy(input, 0, output, 0, frameSize)
        for (i in 0 until qFrameSize) {
            val b = input[frameSize + qFrameSize + i - 32 - 320]
            output[frameSize + i * 2] = b
            output[frameSize + i * 2 + 1] = input[frameSize + i - 32 - 320]
        }
        System.arraycopy(input, 0, output, 0, frameSize) // Y
        for (i in 0 until qFrameSize) {
            output[frameSize + i * 2] = input[frameSize + i + qFrameSize] // Cb (U)
            output[frameSize + i * 2 + 1] = input[frameSize + i] // Cr (V)
        }
        return output
    }
    private fun getDataFromImage(image:Image, colorFormat:Int):ByteArray
    {
        if (colorFormat != COLOR_FormatI420 && colorFormat != COLOR_FormatNV21) {
            throw IllegalArgumentException("only support COLOR_FormatI420 " + "and COLOR_FormatNV21");
        }
        if (!isImageFormatSupported(image)) {
            throw RuntimeException("can't convert Image to byte array, format " + image.getFormat());
        }
        if(image.format==PixelFormat.RGBA_8888&&colorFormat==COLOR_FormatNV21)
        {
            return  image_rgba8888_to_nv21(image,image.width,image.height)
        }
        val crop=image.cropRect
        val format=image.format
        val width=crop.width()
        val height=crop.height()
        val planes=image.planes
        var data:ByteArray= ByteArray(width * height * ImageFormat.getBitsPerPixel(format)/8)
        var rowData=ByteArray(planes[0].rowStride)
        var channelOffset = 0
        var outputStride = 1
        for(i in 0..planes.count()-1)
        {
            when(i)
            {
                0->{
                    channelOffset=0
                    outputStride=1
                }
                1->{
                    if (colorFormat == COLOR_FormatI420)
                    {
                        channelOffset = width * height
                        outputStride = 1
                    } else if (colorFormat == COLOR_FormatNV21) {
                        channelOffset = width * height + 1
                        outputStride = 2
                    }
                }
                2->{
                    if (colorFormat == COLOR_FormatI420)
                    {
                        channelOffset =(width * height * 1.25).toInt()
                        outputStride = 1;
                    } else if (colorFormat == COLOR_FormatNV21) {
                        channelOffset = width * height
                        outputStride = 2
                    }
                }
            }
            val buffer:ByteBuffer=planes[i].buffer
            val rowStride = planes[i].rowStride
            val pixelStride = planes[i].pixelStride
            var shift:Int=1
            if(i==0)shift=0
            var w=width shr shift
            var h=height  shr shift
            buffer.position(rowStride * (crop.top shr shift) + pixelStride * (crop.left shr shift))
            for(row in 0..h-1)
            {
                var length=0
                if (pixelStride == 1 && outputStride == 1)
                {
                    length = w;
                    buffer.get(data, channelOffset, length);
                    channelOffset += length;
                }
                else
                {
                    length = (w - 1) * pixelStride + 1;
                    buffer.get(rowData, 0, length);
                    for(col in 0..w-1)
                    {
                        data[channelOffset] = rowData[col * pixelStride];
                        channelOffset += outputStride;
                    }
                }
                if(row<h-1)
                    buffer.position(buffer.position() + rowStride - length)
            }
        }
        return data
    }
    interface EncoderListener
    {
        fun h264(data:ByteArray)
    }
}