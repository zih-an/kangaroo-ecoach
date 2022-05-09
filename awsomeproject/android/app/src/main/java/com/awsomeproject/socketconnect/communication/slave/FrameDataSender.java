package com.awsomeproject.socketconnect.communication.slave;

import android.util.Log;

import com.awsomeproject.R;
import com.awsomeproject.socketconnect.Device;
import com.awsomeproject.socketconnect.RemoteConst;
import com.awsomeproject.socketconnect.communication.CommunicationKey;

import java.io.BufferedOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.DatagramSocket;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.Semaphore;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class FrameDataSender  {
    private static ExecutorService executorService = Executors.newSingleThreadExecutor();
    private static Socket socket;
    private static DataOutputStream os;
    public static volatile boolean isOpen;
    public static void open(Device device)
    {
        try {
            isOpen=true;
            socket = new Socket();
            socket.connect(new InetSocketAddress(device.getIp(), RemoteConst.FRAME_RECEIVE_PORT));
            os = new DataOutputStream(socket.getOutputStream());
        }
        catch  (Throwable e) {
            e.printStackTrace();
        }
    }

    public static void close()
    {
        try {
            if(socket!=null)
            {
                isOpen=false;
                os=null;
                socket.close();
                socket = null;
            }
        }
        catch  (Throwable e) {
            e.printStackTrace();
        }
    }
    public static void addFrameData(final FrameData frameData){
        addTask(new FrameDataRunnable(frameData));
    }

    private static void addTask(FrameDataRunnable runnable){
        try{
            executorService.execute(runnable);
        }catch (RejectedExecutionException e){
            e.printStackTrace();
            if(runnable.frameData.getCallback()!=null){
                runnable.frameData.getCallback().onError("frameData is rejected");
            }
        }
    }

    private static class FrameDataRunnable implements Runnable {
        FrameData frameData;
        public FrameDataRunnable(FrameData frameData) {
            this.frameData = frameData;
        }
        @Override
        public void run() {
            try {
                if(os!=null&&isOpen) {
                    Log.d("Send", "Data:" + frameData.getSize());
                    os.write(frameData.getContent());
                    os.flush();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void addFrameTeminateSignal(){
        Runnable tast=new FrameTeminateRunnable();
        try{
            executorService.execute(tast);
        }catch (RejectedExecutionException e){
            e.printStackTrace();
        }
    }


    private static class FrameTeminateRunnable implements Runnable {
        public FrameTeminateRunnable( ){}
        @Override
        public void run() {
            try {
                if(os!=null) {
                    os.write(CommunicationKey.FRAMESEND_TEMINATE);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
