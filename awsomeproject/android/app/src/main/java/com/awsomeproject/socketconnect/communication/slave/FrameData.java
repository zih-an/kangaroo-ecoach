package com.awsomeproject.socketconnect.communication.slave;

import android.graphics.Bitmap;
import android.util.Log;

import com.awsomeproject.socketconnect.communication.CommunicationKey;

/**
 * Created by gw on 2017/9/1.
 */

public class FrameData {
    private String destIp;
    private byte[] bytes;
    private Callback callback;
    public int index=Findex++;
    static public int Findex=0;
    public FrameData(byte[] bytes, Callback callback){
        this.bytes = new byte[bytes.length+12];
        int offset=0;
        int bytelength=bytes.length;
        this.bytes[offset++] = CommunicationKey.FRAMEHEAD_BEGIN;
        this.bytes[offset++] = CommunicationKey.FRAMEHEAD_BEGIN;
        this.bytes[offset++] = CommunicationKey.FRAMEHEAD_BEGIN;
        this.bytes[offset++] = CommunicationKey.FRAMEHEAD_BEGIN;
        this.bytes[offset++] = CommunicationKey.FRAMEHEAD_BEGIN;
        this.bytes[offset++] = CommunicationKey.FRAMEHEAD_BEGIN;
        this.bytes[offset++] = CommunicationKey.FRAMEHEAD_BEGIN;
        this.bytes[offset++] = CommunicationKey.FRAMEHEAD_BEGIN;
        this.bytes[offset++] = (byte) bytelength;
        this.bytes[offset++] = (byte) (bytelength >> 8);
        this.bytes[offset++] = (byte) (bytelength >> 16);
        this.bytes[offset++] = (byte) (bytelength >> 24);
        System.arraycopy(bytes,0,this.bytes,offset,bytes.length);

        this.callback = callback;
    }

    public void setByteArray(byte[] bytes){this.bytes=bytes;}

    public byte[] getContent()
    {
        return bytes;
    }
    public String getDestIp() {
        return destIp;
    }

    public void setDestIp(String destIp) {
        this.destIp = destIp;
    }

    public int getSize()
    {
        return bytes.length;
    }
    public Callback getCallback() {
        return callback;
    }

    public void setCallback(Callback callback) {
        this.callback = callback;
    }

    public interface Callback {
        void onRequest(String msg);
        void onSuccess(String msg);
        void onError(String msg);
        void onEcho(String msg);
    }
}
