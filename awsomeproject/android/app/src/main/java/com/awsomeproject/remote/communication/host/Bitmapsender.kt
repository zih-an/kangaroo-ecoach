package com.awsomeproject.remote.communication.host

import android.graphics.Bitmap
import com.awsomeproject.remote.communication.CommunicationKey
import java.io.ByteArrayOutputStream
import java.io.DataOutputStream

class Bitmapsender {

    public fun writeBitmap(writer: DataOutputStream, bitmap: Bitmap) {
        val bout = ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG,1,bout);
        //写入字节的长度，再写入图片的字节
        val len: Int = bout.size();
        //这里打印一下发送的长度
        println("[server] len: ${len}... ")
        writer.writeInt(len);
        writer.write(bout.toByteArray());
        writer.write(CommunicationKey.EOF.toByteArray());
    }
    public fun createColors(size: Int): IntArray {
        val colors = IntArray(size)
        val rd = java.util.Random()
        rd.nextInt()
        for (i in 0 until size) {
            colors[i] = 0xFF shl 24 or (rd.nextInt() shl 16) or (rd.nextInt() shl 8) or rd.nextInt()
        }
        return colors
    }
}