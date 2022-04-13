package com.awsomeproject.socketconnect.search;

import android.os.Build;
import android.util.Log;

import com.awsomeproject.socketconnect.Device;
import com.awsomeproject.socketconnect.RemoteConst;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;

/**
 * 用于响应局域网设备搜索
 */
public class DeviceSearchResponser {

    private static SearchRespThread searchRespThread;

    /**
     * 启动响应线程，收到设备搜索命令后，自动响应
     */
    public static void open(OnSearchListener searchListener) {
        if (searchRespThread == null) {
            searchRespThread = new SearchRespThread(searchListener);
            searchRespThread.start();
        }
    }

    /**
     * 停止响应
     */
    public static void close() {
        if (searchRespThread != null) {
            searchRespThread.destory();
            searchRespThread = null;
        }
    }
    public static interface OnSearchListener{
        void onGetHost(Device device);
    }
    private static class SearchRespThread extends Thread {
        OnSearchListener searchListener;

        DatagramSocket socket;
        volatile boolean openFlag;

        public void destory() {
            if (socket != null) {
                socket.close();
                socket = null;
            }
            openFlag = false;
        }
        public SearchRespThread(OnSearchListener listener){
            this.searchListener = listener;
        }
        @Override
        public void run() {
            try {
                //指定接收数据包的端口
                socket = new DatagramSocket(RemoteConst.DEVICE_SEARCH_PORT);
                byte[] buf = new byte[1024];
                DatagramPacket recePacket = new DatagramPacket(buf, buf.length);
                openFlag = true;
                while (openFlag) {
                    socket.receive(recePacket);
                    //校验数据包是否是搜索包
                    if (verifySearchData(recePacket)) {
                        if(searchListener!=null)
                        {
                            Device hostDevice=parseRespData(recePacket);
                            searchListener.onGetHost(hostDevice);
                        }
                        //发送搜索应答包
                        byte[] sendData = packSearchRespData();
                        DatagramPacket sendPack = new DatagramPacket(sendData, sendData.length, recePacket.getSocketAddress());
                        socket.send(sendPack);
                    }
                }
            } catch (IOException e) {
                destory();
            }
        }

        /**
         * 生成搜索应答数据
         * 协议：$(1) + packType(1) + uuid.length(1) + uuid(??)+ [data]
         * packType - 报文类型
         * sendSeq - 发送序列
         * dataLen - 数据长度
         * data - 数据内容
         * @return
         */
        private byte[] packSearchRespData() {
            byte[] data = new byte[1024];
            int offset = 0;
            data[offset++] = RemoteConst.PACKET_PREFIX;
            data[offset++] = RemoteConst.PACKET_TYPE_SEARCH_DEVICE_RSP;

            // 添加UUID数据
            byte[] uuid = getUuidData();
            data[offset++] = (byte) uuid.length;
            System.arraycopy(uuid, 0, data, offset, uuid.length);
            offset += uuid.length;
            byte[] retVal = new byte[offset];
            System.arraycopy(data, 0, retVal, 0, offset);
            return retVal;
        }

        /**
         * 校验搜索数据是否符合协议规范
         * 协议：$(1) + packType(1) + sendSeq(4) + dataLen(1) + [data]
         * packType - 报文类型
         * sendSeq - 发送序列
         * dataLen - 数据长度
         * data - 数据内容
         */
        private boolean verifySearchData(DatagramPacket pack) {
            if (pack.getLength() < 6) {
                return false;
            }
            byte[] data = pack.getData();
            int offset = pack.getOffset();
            int sendSeq;
            if (data[offset++] != '$' || data[offset++] != RemoteConst.PACKET_TYPE_SEARCH_DEVICE_REQ) {
                return false;
            }
            sendSeq = data[offset++] & 0xFF;
            sendSeq |= (data[offset++] << 8) & 0xFF00;
            sendSeq |= (data[offset++] << 16) & 0xFF0000;
            sendSeq |= (data[offset++] << 24) & 0xFF000000;
            if (sendSeq < 1 || sendSeq > RemoteConst.SEARCH_DEVICE_TIMES) {
                return false;
            }

            return true;
        }

        /**
         * 获取设备uuid
         * @return
         */
        private byte[] getUuidData() {
            return (Build.BRAND + " "+ Build.ID).getBytes();
        }
        /**
         * 校验和解析应答的数据包,来自host
         * @param pack udp数据包
         * @return
         */
        private Device parseRespData(DatagramPacket pack) {
            if (pack.getLength() < 2) {
                return null;
            }
            byte[] data = pack.getData();
            int offset = pack.getOffset();

            //检验数据包格式是否符合要求
            if (data[offset++] != RemoteConst.PACKET_PREFIX || data[offset++] != RemoteConst.PACKET_TYPE_SEARCH_DEVICE_REQ) {
                return null;
            }
            offset+=4;
            int length = data[offset++];
            String uuid = new String(data, offset, length);
            return new Device(pack.getAddress().getHostAddress(), pack.getPort(), uuid);
        }

    }
}
