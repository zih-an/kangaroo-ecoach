package com.awsomeproject.socketconnect.connectview

import android.app.Application
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.content.Intent
import android.content.IntentFilter
import android.os.Bundle
import android.view.View
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.ListView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.awsomeproject.MainActivity
import com.awsomeproject.R
import com.awsomeproject.layoutImpliment.BackArrowView
import com.awsomeproject.layoutImpliment.connectAdapter
import com.awsomeproject.socketconnect.Device
import com.awsomeproject.socketconnect.bluetoothReceiver.BluetoothMesg
import com.awsomeproject.socketconnect.bluetoothReceiver.BluetoothMesgReceiver
import com.awsomeproject.socketconnect.bluetoothReceiver.BluetoothMesgSender
import com.awsomeproject.socketconnect.bluetoothReceiver.ScanBroadcastReceiver
import com.awsomeproject.socketconnect.communication.host.Command
import com.awsomeproject.socketconnect.communication.host.CommandSender
import com.awsomeproject.videodecoder.GlobalStaticVariable
import java.lang.reflect.Method


class BluetoothWearviewActivity : AppCompatActivity() {
    lateinit var btnSearchDeviceOpen : Button
    lateinit var receiverList: ListView
    lateinit var pairedList: ListView
    lateinit var btnReturn: BackArrowView
    var isSearchDeviceOpen:Boolean=false;
    var devices: MutableMap<String, BluetoothDevice> = mutableMapOf()
    var choosed_device: BluetoothDevice?=null

    private var mAdapter: BluetoothAdapter = BluetoothAdapter.getDefaultAdapter()
    private var scanBroadcastReceiver: ScanBroadcastReceiver?=null
    fun sendBluetoothMesg(device: BluetoothDevice, str:String) {
        //发送命令
        val bluetoothMesg = BluetoothMesg(str.toByteArray())
        BluetoothMesg.setBluetoothDevice(device)
        BluetoothMesgSender.addBluetoothMesg(bluetoothMesg)
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_wear)
        btnReturn=findViewById(R.id.back_arrow)
        btnSearchDeviceOpen=this.findViewById(R.id.connectBtn)
        btnReturn=this.findViewById(R.id.back_arrow)
        pairedList=this.findViewById((R.id.pairlist))
        btnReturn.setOnClickListener{
            finish()
        }
        pairListInit()

        try {
            if(mAdapter==null||!mAdapter.isEnabled())
            {
                val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
                startActivityForResult(enableBtIntent, 1)
            }
            receiverList=this.findViewById(R.id.slavelist)
            btnSearchDeviceOpen.setOnClickListener{
                //创建popview进行局域网搜索
                if (isSearchDeviceOpen) {
                    clear()
                    mAdapter.cancelDiscovery()
                    pairListInit()
                    isSearchDeviceOpen = false
                    btnSearchDeviceOpen.setText("开始搜索")
                    Toast.makeText(this, "设备搜索已关闭", Toast.LENGTH_SHORT).show()

                } else {
                    mAdapter.startDiscovery();
                    isSearchDeviceOpen = true
                    btnSearchDeviceOpen.setText("搜索关闭")
                    Toast.makeText(this, "设备搜索开始", Toast.LENGTH_SHORT).show()

                }
            }
        }catch (e:SecurityException)
        {
            e.printStackTrace()
        }

    }
    fun clear(){
        receiverList.setAdapter(
            ArrayAdapter<String>(
                baseContext,
                android.R.layout.simple_list_item_1,
                arrayListOf())
        )
        devices.clear()
    }
    override fun onStart() {
        super.onStart()

    }
    override fun onStop() {
        super.onStop()

    }

    override fun onDestroy() {
        super.onDestroy()

    }
    override fun onResume() {
        super.onResume()
        registerScanBroadcast()
    }

    override fun onPause() {
        super.onPause()
        scanBroadcastReceiver?.let {
            this.application.unregisterReceiver(it);
            scanBroadcastReceiver = null
        }
    }
    fun pairListInit()
    {
        try{
            val pairedDevices: Set<BluetoothDevice> = mAdapter.getBondedDevices()
            var pairedList_str: ArrayList<String> = arrayListOf()
            for(i in pairedDevices)
            {
                pairedList_str.add(i.name)
            }
            var adapter =
                connectAdapter(pairedList_str, object : View.OnClickListener {
                    override fun onClick(view: View) {
                        var name = view.getTag() as String
                        for(item in pairedDevices)
                        {
                            if(item.name==name)
                            {
                                choosed_device = item
                                sendBluetoothMesg(item,"connect")
                                BluetoothMesg.setBluetoothAdapter(mAdapter)
                                GlobalStaticVariable.isWearDeviceConnect=true
                            }
                        }
                    }
                },"连接")
            pairedList.adapter = adapter
        }catch (e:SecurityException)
        {
            e.printStackTrace()
        }
    }
    /**
     * 使用新api扫描
     * 注册蓝牙扫描监听
     */
    fun registerScanBroadcast() {
        val application: Application = this.application
        //注册蓝牙扫描状态广播接收者
        if (scanBroadcastReceiver == null && application != null) {
            scanBroadcastReceiver=ScanBroadcastReceiver(object :ScanBroadcastReceiver.ScanBroadcastReceiverListener{
                override fun on_found(device: BluetoothDevice) {
                    device?.let {
                        try {
                            val pairedDevices: Set<BluetoothDevice> = mAdapter.getBondedDevices()
                            devices.put(it.name, it)
                            var slaveList_str: ArrayList<String> = arrayListOf()
                            for (item in devices) {
                                if(pairedDevices.contains(item.value)==false)
                                    slaveList_str.add(item.value.name)
                            }
                            var adapter =
                                connectAdapter(slaveList_str, object : View.OnClickListener {
                                    override fun onClick(view: View) {
                                        var name = view.getTag() as String
                                        devices.get(name)?.let {
                                            if (mAdapter.isDiscovering()) {
                                                mAdapter.cancelDiscovery();
                                            }
                                            it.createBond()
                                        }
                                    }
                                },"配对")
                            receiverList.adapter = adapter
                        }catch (e:SecurityException)
                        {
                            e.printStackTrace()
                        }
                    }
                }
            })
            val filter = IntentFilter()
            //开始扫描
            filter.addAction(BluetoothAdapter.ACTION_DISCOVERY_STARTED)
            //扫描结束
            filter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED)
            //扫描中，返回结果
            filter.addAction(BluetoothDevice.ACTION_FOUND)
            //扫描模式改变
            filter.addAction(BluetoothAdapter.ACTION_SCAN_MODE_CHANGED)
            //注册广播接收监听，用完不要忘了解注册哦
            application.registerReceiver(scanBroadcastReceiver, filter)
        }
    }



}