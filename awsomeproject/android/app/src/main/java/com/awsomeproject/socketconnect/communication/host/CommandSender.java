    package com.awsomeproject.socketconnect.communication.host;

    import android.util.Log;

    import com.awsomeproject.socketconnect.RemoteConst;
    import com.awsomeproject.socketconnect.communication.CommunicationKey;
    import com.awsomeproject.socketconnect.communication.host.SendCommandThreadFactory;

    import java.io.DataOutputStream;
    import java.io.IOException;
    import java.io.InputStream;
    import java.net.InetSocketAddress;
    import java.net.Socket;
    import java.nio.charset.Charset;
    import java.util.concurrent.RejectedExecutionException;
    import java.util.concurrent.RejectedExecutionHandler;
    import java.util.concurrent.SynchronousQueue;
    import java.util.concurrent.ThreadPoolExecutor;
    import java.util.concurrent.TimeUnit;

    /**
     * 用于发送byts
     * Created by gw on 2017/11/4.
     */
    public class CommandSender {
        private static ThreadPoolExecutor threadPool =
                new ThreadPoolExecutor(2, 2, 1,
                TimeUnit.SECONDS, new SynchronousQueue<Runnable>(), new SendCommandThreadFactory(),
                new RejectedExecutionHandler() {
            @Override
            public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
                throw new RejectedExecutionException();
            }
        });


        public static void addCommand(final Command command){
            addTask(new CommandRunnable(command));
        }

        private static void addTask(CommandRunnable runnable){
            try{
                threadPool.execute(runnable);
            }catch (RejectedExecutionException e){
                e.printStackTrace();
                if(runnable.command.getCallback()!=null){
                    runnable.command.getCallback().onError("command is rejected");
                }
            }
        }
        private static class CommandRunnable implements Runnable{

            Command command;
            public CommandRunnable(Command command){
                this.command = command;
            }
            @Override
            public void run() {
                Socket socket = new Socket();
                try {
                    socket.connect(new InetSocketAddress(command.getDestIp(), RemoteConst.COMMAND_RECEIVE_PORT));
                    DataOutputStream os = new DataOutputStream(socket.getOutputStream());
                    //发送命令内容
                    os.write(command.getContent());
                    os.write(CommunicationKey.EOF.getBytes());
                } catch (IOException e) {
                    e.printStackTrace();
                }finally {
                    try {
                        socket.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }
