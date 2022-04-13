package com.awsomeproject.remote.communication.host;

import android.graphics.Bitmap;

/**
 * Created by gw on 2017/9/1.
 */

public class Command {
    private String destIp;
    private String content;
    private Callback callback;
    private Bitmap bitmap;
    public Command(String command, Callback callback){
        this.content = command;
        this.callback = callback;
    }
    public void setBitmap(Bitmap bitmap){
        bitmap=bitmap;
    }

    public String getDestIp() {
        return destIp;
    }

    public void setDestIp(String destIp) {
        this.destIp = destIp;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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
