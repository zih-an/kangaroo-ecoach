package com.awsomeproject.socketconnect.bluetoothReceiver;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothServerSocket;
import android.bluetooth.BluetoothSocket;
import android.os.SystemClock;
import android.util.Log;

import com.awsomeproject.socketconnect.RemoteConst;
import com.awsomeproject.socketconnect.communication.CommunicationKey;
import com.awsomeproject.socketconnect.communication.slave.CommandReceiver;
import com.awsomeproject.socketconnect.communication.slave.ReceiveCommandThreadFactory;
import com.awsomeproject.videodecoder.GlobalStaticVariable;

import java.io.DataInputStream;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.Charset;
import java.util.UUID;
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class BluetoothMesgReceiver {
    private static ThreadPoolExecutor threadPool = new ThreadPoolExecutor(1, 4, 60, TimeUnit.SECONDS, new SynchronousQueue<Runnable>(), new ReceiveCommandThreadFactory(), new RejectedExecutionHandler() {
        @Override
        public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
            throw new RejectedExecutionException();
        }
    });
    static UUID uuid=UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
    private static volatile boolean isOpen;

    public static void start(){
        isOpen = true;
        threadPool.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    BluetoothServerSocket serverSocket = BluetoothMesg.getBluetoothAdapter().listenUsingRfcommWithServiceRecord("serverSocket", uuid);
                    while(isOpen){
                        BluetoothSocket socket = serverSocket.accept();
                        threadPool.execute(new BluetoothMesgRunnable(socket));
                    }
                }catch (SecurityException e)
                {
                    e.printStackTrace();
                }
                catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }
    public static void open(){
        isOpen = true;
    }
    public static void close(){
        isOpen = false;
    }
    public static void finish()
    {
        threadPool.shutdown();
    }

    public static class  BluetoothMesgRunnable implements Runnable{
        BluetoothSocket socket;

        public BluetoothMesgRunnable(BluetoothSocket socket){
            this.socket = socket;
        }

        @Override
        public void run() {
            try {
                DataInputStream is = new DataInputStream(socket.getInputStream());
                byte[] bytes = new byte[1024];
                int i=0;
                while(true){
                    bytes[i] = (byte) is.read();
                    if (bytes[i] == -1) {
                        break;
                    }
                    if((char)bytes[i] != CommunicationKey.EOF.charAt(0)){
                        i++;
                    }else{
                        String data = new String(bytes, 0, i+1, Charset.defaultCharset()).replace(CommunicationKey.EOF, "");
                        Float hearBeatRatio=Float.parseFloat(data);
                        Log.d("", "HeartBeatRatio:"+hearBeatRatio);
                        GlobalStaticVariable.Companion.set_NewestWearMesg_HeartBeartRatio(hearBeatRatio);
                    }
                }
            }catch (Exception e){
                e.printStackTrace();
            }finally {
                if(socket != null){
                    try {
                        socket.close();
                    } catch (Throwable e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }


}
