package com.awsomeproject.socketconnect.connectview

import android.content.Intent
import android.os.Bundle
import android.os.SystemClock
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.ListView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import org.json.JSONObject
import com.awsomeproject.R
import com.awsomeproject.ReceiverActivity
import com.awsomeproject.SenderActivity
import com.awsomeproject.layoutImpliment.BackArrowView
import com.awsomeproject.screenReceiverActivity
import com.awsomeproject.socketconnect.Device
import com.awsomeproject.socketconnect.communication.host.FrameDataReceiver
import com.awsomeproject.socketconnect.communication.slave.CommandReceiver
import com.awsomeproject.socketconnect.search.DeviceSearchResponser
import com.awsomeproject.videodecoder.GlobalStaticVariable

class slaveviewActivity : AppCompatActivity() {
    lateinit var btnListeningOpen : Button
    lateinit var hostList: ListView
    lateinit var btnReturn: BackArrowView
    var isListeningOpen:Boolean=false;
    var hostDevice: Device?=null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.remote_camera_sender)
        GlobalStaticVariable.reSet()
        btnReturn=findViewById(R.id.back_arrow)
        hostList=findViewById(R.id.hostlist)
        btnListeningOpen=findViewById(R.id.connectBtn)
        btnListeningOpen?.setOnClickListener {
            if(isListeningOpen)
            {
                //停在响应搜索
                stopListen()
                isListeningOpen=false
                btnListeningOpen.setText("打开监听")
                //停止接受通信命令
                CommandReceiver.close()
                Toast.makeText(this, "已经关闭监听", Toast.LENGTH_SHORT).show()
            }
            else{
                //开始响应搜索
                startListen()
                isListeningOpen=true
                btnListeningOpen.setText("关闭应答")
                CommandReceiver.open()
                Toast.makeText(baseContext, "已经打开监听程序！", Toast.LENGTH_SHORT).show()
            }
        }
        btnReturn.setOnClickListener{
            val intent = Intent()
            stopListen()
            CommandReceiver.close()
            setResult(RESULT_CANCELED, intent)
            finish()
        }
    }
    private fun commandResolver(demand:String?)
    {
        when(demand) {
            "openCamera" -> {
                //                openCamera()
            }
            "sendFrame" -> {
                SystemClock.sleep(500)
                runOnUiThread {
                    hostDevice?.let {
                        val intent = Intent(baseContext, SenderActivity::class.java)
                        var hostIp = it.ip
                        intent.putExtra("hostIp", hostIp)
                        CommandReceiver.close()
                        stopListen()
                        isListeningOpen = false
                        btnListeningOpen.setText("开始监听")
                        startActivity(intent)
                    }
                }
            }
            "prepareAcceptFrame" -> {
                GlobalStaticVariable.frameRate=25
                FrameDataReceiver.close()
                runOnUiThread {

                    val intent = Intent(baseContext, screenReceiverActivity::class.java)
                    var hostIp = hostDevice!!.ip
                    intent.putExtra("mainScreenSenderIp", hostIp)
                    stopListen()
                    CommandReceiver.close()
                    isListeningOpen = false
                    btnListeningOpen.setText("开始监听")
                    startActivity(intent)
                }
            }
            null -> {
            }
        }

    }
    override fun onStop() {
        super.onStop()

    }

    override fun onResume() {
        super.onResume()
        //开始接受通信命令
        CommandReceiver.start(object : CommandReceiver.CommandListener{
            override fun onReceive(command: String?) {
                commandResolver(command)
            }
        })
    }

    override fun onPause() {
        super.onPause()
    }
    /**
     * 开始同步监听局域网中的host发出的搜索包
     */
    public fun startListen() {
        DeviceSearchResponser.open(object : DeviceSearchResponser.OnSearchListener{
            override fun onGetHost(device: Device?) {
                device?.let {
                    hostDevice = it
                    var hostList_str: MutableList<String> = arrayListOf()
                    hostList_str.add(hostDevice!!.uuid)
                    runOnUiThread {
                        var adapter: ArrayAdapter<String> =
                            ArrayAdapter<String>(
                                baseContext,
                                android.R.layout.simple_list_item_1,
                                hostList_str
                            )
                        hostList.setAdapter(adapter)
                    }

                }
            }
        })

    }
    public fun stopListen() {
        DeviceSearchResponser.close()
        hostList.setAdapter(
            ArrayAdapter<String>(
                baseContext,
                android.R.layout.simple_list_item_1,
                arrayListOf())
        )
    }

}