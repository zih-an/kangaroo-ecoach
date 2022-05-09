package com.awsomeproject.socketconnect.bluetoothReceiver;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;

import com.awsomeproject.socketconnect.communication.host.Command;

public class BluetoothMesg {
    public static BluetoothAdapter desAdapt;
    public static BluetoothDevice desDevice;
    public static BluetoothAdapter getBluetoothAdapter()
    {
        return desAdapt;
    }
    public static BluetoothDevice getBluetoothDevice()
    {
        return desDevice;
    }
    public static void setBluetoothDevice(BluetoothDevice obj)
    {
        desDevice=obj;
    }
    public static void setBluetoothAdapter(BluetoothAdapter obj)
    {
        desAdapt=obj;
    }
    private byte[] bytes;
    public BluetoothMesg(byte[] bytes){
        this.bytes = bytes;
    }
    public void setByteArray(byte[] bytes){this.bytes=bytes;}
    public byte[] getContent()
    {
        return bytes;
    }

}
