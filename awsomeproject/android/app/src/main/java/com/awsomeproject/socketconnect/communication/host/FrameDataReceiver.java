package com.awsomeproject.socketconnect.communication.host;

import android.media.Image;
import android.util.Log;
import android.view.Surface;

import androidx.annotation.Nullable;

import com.awsomeproject.camera.CameraReceiver;
import com.awsomeproject.socketconnect.RemoteConst;
import com.awsomeproject.socketconnect.communication.CommunicationKey;
import com.awsomeproject.videodecoder.DecoderH264;
import com.awsomeproject.videodecoder.GlobalStaticVariable;

import java.io.BufferedInputStream;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.Charset;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class FrameDataReceiver {
    private static ExecutorService executorService = Executors.newSingleThreadExecutor();
    //    private static ThreadPoolExecutor threadPool = new ThreadPoolExecutor(1, 1,60,
//            TimeUnit.SECONDS, new SynchronousQueue<Runnable>(), new ReceiveFrameDataThreadFactory(), new RejectedExecutionHandler() {
//        @Override
//        public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
//            throw new RejectedExecutionException();
//        }
//    });
    private static FrameDataReceiver.FrameDataListener listener;
    private static DecoderH264 decoder;
    private static volatile boolean isOpen;
    private static ServerSocket serverSocket;
    private static Socket socket;
    private static DataInputStream is;

    public static void open(Surface surface,FrameDataReceiver.FrameDataListener frameDataListener)
    {
        try {
            Log.d("TAG", "open: 111111111111111111111111111111111");
            serverSocket = new ServerSocket(RemoteConst.FRAME_RECEIVE_PORT);
            socket = serverSocket.accept();
            is = new DataInputStream(socket.getInputStream());
            Log.d("TAG", "open: 1111111111111111111122222222");
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        listener = frameDataListener;
        isOpen = true;
        decoder=new DecoderH264(surface,GlobalStaticVariable.Companion.getFrameLength(), GlobalStaticVariable.Companion.getFrameWidth(),
                new DecoderH264.DecoderListener() {
                    @Override
                    public void YUV420(@Nullable Image image) {
                        if(listener!=null)
                        {
                            listener.onReceive(image);
                        }
                    }
                },GlobalStaticVariable.Companion.getFrameRate());
        executorService.execute(new Runnable() {
            @Override
            public void run() {
                try {

                    int FrameLength = 0;
                    int type = 0;
                    int etype=0;
                    int FrameLengthOffSet = 0;
                    //0还没开始读，1读到了<,2读到了<<,3读到了<<<,4读到了<<<<,
                    //5读到了<<<<<,6读到了<<<<<<,7读到了<<<<<<<,8读到了<<<<<<<<
                    //9读到了<<<<<<<<****>,
                    while (isOpen)
                    {
                        int b = is.read();
                        if (b == -1) {
                            FrameLength = 0;
                            type = 0;
                            FrameLengthOffSet = 0;
                            break;
                        }
                        else if ((byte) b == CommunicationKey.FRAMEHEAD_BEGIN)
                        {
                            assert type <= 8;
                            type += 1;
                            if (type == 8) {
                                while (FrameLengthOffSet < 4)
                                {
                                    b = is.read();
                                    FrameLength |=
                                            ((byte) b << FrameLengthOffSet * 8) & (0xFF << FrameLengthOffSet * 8);
                                    FrameLengthOffSet++;
                                }
                                assert FrameLengthOffSet == 4;
                                byte[] resData = new byte[FrameLength];
                                is.readFully(resData);

                                if (decoder != null) {
                                    decoder.decoderH264(resData);
                                }
                                FrameLength = 0;
                                FrameLengthOffSet = 0;
                                type = 0;
                                etype=0;
                            }
                            continue;
                        }
                        else if((byte)b==CommunicationKey.FRAMEHEAD_END)
                        {
                            etype++;
                            if(etype==8)
                            {
                                break;
                            }
                            continue;
                        }
                        else {
                            type = 0;
                            etype=0;
                            continue;
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    public static void close(){
        isOpen = false;
        if(socket!=null)
        {
            try {
                socket.shutdownInput();
                socket=null;
                serverSocket.close();
                serverSocket=null;
                decoder.close();
                decoder=null;
            }
            catch (IOException e)
            {
                e.printStackTrace();
            }
        }
    }

    public interface FrameDataListener {
        void onReceive(Image image);
    }

}