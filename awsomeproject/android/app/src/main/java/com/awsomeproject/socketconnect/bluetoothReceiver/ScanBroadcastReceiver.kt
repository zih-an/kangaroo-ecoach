package com.awsomeproject.socketconnect.bluetoothReceiver

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.hardware.SensorEventListener
import android.util.Log
import android.view.View
import com.awsomeproject.layoutImpliment.connectAdapter

//监听扫描广播
class ScanBroadcastReceiver(private var listener: ScanBroadcastReceiverListener?=null) : BroadcastReceiver() {
    interface ScanBroadcastReceiverListener{
        fun on_found(device:BluetoothDevice);
    }
    override fun onReceive(context: Context?, intent: Intent) {
        Log.d("BluetoothScan", "intent=$intent")
        val action = intent.action
        if (action != null) {
            try {
                when (action) {
                    BluetoothAdapter.ACTION_SCAN_MODE_CHANGED -> Log.d("BluetoothScan", "扫描模式改变")
                    BluetoothAdapter.ACTION_DISCOVERY_STARTED -> Log.d("BluetoothScan", "扫描开始")
                    BluetoothAdapter.ACTION_DISCOVERY_FINISHED -> Log.d("BluetoothScan", "扫描结束")
                    BluetoothDevice.ACTION_FOUND -> {
                        Log.d("BluetoothScan", "发现设备")
                        //获取蓝牙设备
                        val device =
                            intent.getParcelableExtra<BluetoothDevice>(BluetoothDevice.EXTRA_DEVICE)
                        if (device != null && null != device.name) {
                            listener?.on_found(device)
                        }
                    }
                }
            }catch (e:SecurityException)
            {
                e.printStackTrace()
            }
        }
    }
}