package com.awsomeproject.socketconnect.communication.host;

import android.graphics.Bitmap;

/**
 * Created by gw on 2017/9/1.
 */

public class Command {
    private String destIp;
    private byte[] bytes;
    private Callback callback;
    public Command(byte[] bytes, Callback callback){
        this.bytes = bytes;
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
