package com.awsomeproject.socketconnect.communication;

/**
 * 定义通信用的一些标识
 * Created by gw on 2017/7/28.
 */
public class CommunicationKey {
    public static final String RESPONSE_OK = "ok";
    public static final String RESPONSE_ECHO = "echo:";
    public static final String RESPONSE_ERROR = "error:";
    public static final String EOF = "\r";
    public static final byte FRAMEHEAD_BEGIN = (byte)'<';
    public static final byte FRAMEHEAD_END = (byte)'>';
    public static final byte[] FRAMESEND_TEMINATE=
            new byte[]{FRAMEHEAD_END,FRAMEHEAD_END,FRAMEHEAD_END,FRAMEHEAD_END,FRAMEHEAD_END,FRAMEHEAD_END,FRAMEHEAD_END,FRAMEHEAD_END};
}
