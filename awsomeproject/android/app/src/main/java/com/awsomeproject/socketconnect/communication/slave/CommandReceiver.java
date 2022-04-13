package com.awsomeproject.socketconnect.communication.slave;

import com.awsomeproject.socketconnect.RemoteConst;
import com.awsomeproject.socketconnect.communication.CommunicationKey;

import java.io.DataInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.Charset;
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * 用于接收命令和回写应答
 * Created by gw on 2017/11/6.
 */
public class CommandReceiver {

    private static ThreadPoolExecutor threadPool = new ThreadPoolExecutor(3, 4, 60, TimeUnit.SECONDS, new SynchronousQueue<Runnable>(), new ReceiveCommandThreadFactory(), new RejectedExecutionHandler() {
        @Override
        public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
            throw new RejectedExecutionException();
        }
    });
    private static CommandListener listener;
    private static volatile boolean isOpen;


    public static void start(CommandListener commandListener){
        listener = commandListener;
        isOpen = true;
        threadPool.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    ServerSocket serverSocket = new ServerSocket(RemoteConst.COMMAND_RECEIVE_PORT);
                    while(isOpen){
                        Socket socket = serverSocket.accept();
                        threadPool.execute(new CommandParseRunnable(socket));
                    }
                } catch (Exception e) {
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

    public static class CommandParseRunnable implements Runnable{
        Socket socket;

        public CommandParseRunnable(Socket socket){
            this.socket = socket;
        }

        @Override
        public void run() {
            try {
                DataInputStream is = new DataInputStream(socket.getInputStream());
                byte[] bytes = new byte[1024*8];
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
                        if(listener!=null){
                            listener.onReceive(data);
                        }
                    }
                }
            }catch (Exception e){
                e.printStackTrace();
            }finally {
                if(socket != null){
                    try {
                        socket.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    public interface CommandListener{
        void onReceive(String data);
    }
}
