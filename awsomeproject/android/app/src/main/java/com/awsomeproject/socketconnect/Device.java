package com.awsomeproject.socketconnect;

import android.os.Build;

import com.awsomeproject.socketconnect.RemoteConst;

import java.net.DatagramPacket;
import java.text.DecimalFormat;

/**
 * 局域网中的设备
 */
public class Device {
    //ip地址
    private String ip;
    //端口号
    private int port;
    //唯一id
    private String uuid;

    public Device(String ip) {
        super();
        this.ip = ip;
    }
    public Device(String ip, int port, String uuid) {
        super();
        this.ip = ip;
        this.port = port;
        this.uuid = uuid;
    }

    public String getIp() {
        return ip;
    }
    public void setIp(String ip) {
        this.ip = ip;
    }
    public int getPort() {
        return port;
    }
    public void setPort(int port) {
        this.port = port;
    }
    public String getUuid() {
        return uuid;
    }
    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    /**
     * 获取设备字符串数据
     * @return
     */
    public static byte[] packSearchRespData() {
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
    /**s
     * 获取设备uuid
     * @return
     */
    private static byte[] getUuidData() {
        return (Build.PRODUCT + Build.ID).getBytes();
    }
    /**
     * 校验和解析应答的数据包
     * @param pack udp数据包
     * @return
     */
    private static Device parseRespData(DatagramPacket pack) {
        if (pack.getLength() < 2) {
            return null;
        }
        byte[] data = pack.getData();
        int offset = pack.getOffset();
        //检验数据包格式是否符合要求
        if (data[offset++] != RemoteConst.PACKET_PREFIX || data[offset++] != RemoteConst.PACKET_TYPE_SEARCH_DEVICE_RSP) {
            return null;
        }
        int length = data[offset++];
        String uuid = new String(data, offset, length);
        return new Device(pack.getAddress().getHostAddress(), pack.getPort(), uuid);
    }
}
