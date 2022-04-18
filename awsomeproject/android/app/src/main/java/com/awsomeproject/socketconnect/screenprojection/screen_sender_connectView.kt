package com.awsomeproject.socketconnect.screenprojection

import android.content.Intent
import android.content.res.Resources
import android.os.Bundle
import android.os.SystemClock
import android.view.View
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.ListView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.awsomeproject.CameraActivity
import org.json.JSONObject
import com.awsomeproject.MainActivity
import com.awsomeproject.R
import com.awsomeproject.layoutImpliment.BackArrowView
import com.awsomeproject.layoutImpliment.connectAdapter
import com.awsomeproject.manager.CameraModule.Companion.SCREEN_CAMERA_REQUEST
import com.awsomeproject.service.screenCaptureService
import com.awsomeproject.socketconnect.Device
import com.awsomeproject.socketconnect.communication.host.Command
import com.awsomeproject.socketconnect.communication.host.CommandSender
import com.awsomeproject.socketconnect.communication.slave.FrameDataSender
import com.awsomeproject.socketconnect.search.DeviceSearcher
import com.awsomeproject.videodecoder.GlobalStaticVariable
import kotlin.concurrent.thread


class screen_sender_connectView  : AppCompatActivity()  {


    lateinit var btnSearchDeviceOpen : Button
    lateinit var receiverList: ListView
    lateinit var btnReturn: BackArrowView
    var JsonMeg_Intent:String?=null
    var isSearchDeviceOpen:Boolean=false;
    var devices: MutableMap<String, Device> = mutableMapOf()
    var choosed_device:Device?=null
    fun sendCommand(device: Device,str:String) {
        //发送命令
        val command = Command(str.toByteArray(), object : Command.Callback {
            override fun onEcho(msg: String?) {
            }
            override fun onError(msg: String?) {
            }
            override fun onRequest(msg: String?) {
            }
            override fun onSuccess(msg: String?) {
            }
        })
        command.setDestIp(device.ip)
        CommandSender.addCommand(command)
    }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.screen_projection_launcher)
        GlobalStaticVariable.reSet()
        var bundle=intent.getExtras()
        bundle?.getString("ExerciseScheduleMesg")?.let{
            JsonMeg_Intent=it
        }

        btnReturn=findViewById(R.id.back_arrow)
        btnSearchDeviceOpen=this.findViewById(R.id.connectBtn)
        btnReturn=this.findViewById(R.id.back_arrow)
        btnReturn.setOnClickListener{
            val intent=Intent()
            setResult(RESULT_CANCELED, intent)
            finish()
        }

        receiverList=this.findViewById(R.id.slavelist)
        btnSearchDeviceOpen.setOnClickListener{
            //创建popview进行局域网搜索
            if (isSearchDeviceOpen) {
                //设备搜索已关闭
                clear()
                stopSearch()
                isSearchDeviceOpen = false
                btnSearchDeviceOpen.setText("开始搜索")
                Toast.makeText(this, "设备搜索已关闭", Toast.LENGTH_SHORT).show()

            } else {
                //设备搜索开始
                isSearchDeviceOpen = true
                btnSearchDeviceOpen.setText("搜索关闭")
                Toast.makeText(this, "设备搜索开始", Toast.LENGTH_SHORT).show()
                startSearch()
            }

        }

    }
    override fun onStop() {
        super.onStop()
    }

    override fun onResume() {
        super.onResume()

    }

    override fun onPause() {
        super.onPause()
    }
    /**
     * 开始异步搜索局域网中的设备
     */
    private fun startSearch() {
        DeviceSearcher.search(object : DeviceSearcher.OnSearchListener{
            override fun onSearchFinish() {
//                Toast.makeText(mContext,"",Toast.LENGTH_SHORT).show()
            }
            override fun onSearchStart() {
//                Toast.makeText(mContext,"新设备发现",Toast.LENGTH_SHORT).show()
            }
            override fun onSearchedNewOne(device: Device?) {
                device?.let {
                    devices.put(it.uuid,it)
                    var slaveList_str: ArrayList<String> = arrayListOf()
                    for(item in devices)
                    {
                        slaveList_str.add(item.value.uuid)
                    }
                    var adapter = connectAdapter(slaveList_str,object : View.OnClickListener{
                        override fun onClick(view: View) {
                            var uuid = view.getTag() as String
                            devices.get(uuid)?.let {
                                choosed_device=it
//                                sendCommand(it,"prepareAcceptFrame")
                            }

                            val intent = Intent(baseContext, CameraActivity::class.java)
                            intent.putExtra("isScreenProjection", true)
                            intent.putExtra("screenReceiverIp", devices.get(uuid)!!.ip)
                            JsonMeg_Intent?.let {
                                intent.putExtra("ExerciseScheduleMesg", it)
                            }
                            clear()
                            stopSearch()
                            isSearchDeviceOpen = false
                            btnSearchDeviceOpen.setText("开始搜索")

                            startActivityForResult(intent,SCREEN_CAMERA_REQUEST)
                        }
                    })
                    receiverList.adapter=adapter
                }
            }
        })
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == SCREEN_CAMERA_REQUEST) {
            if(resultCode== RESULT_OK){
                choosed_device?.let {
                    sendCommand(it, "finishAcceptFrame")
                    val intent = Intent()
                    val returnData = data?.getStringExtra("res")
                    intent.putExtra("res", returnData)
                    setResult(RESULT_OK, intent)
                    finish()
                }
            }else if(resultCode== RESULT_CANCELED) {
                choosed_device?.let{
                    sendCommand(it, "finishAcceptFrame")
                    setResult(RESULT_CANCELED, intent)
                    finish()
                }

            }
        }
    }
    private fun stopSearch() {
        DeviceSearcher.close()
        receiverList.setAdapter(
            ArrayAdapter<String>(
                baseContext,
                android.R.layout.simple_list_item_1,
                arrayListOf())
        )
        devices.clear()
    }
    private fun clear()
    {
        receiverList.setAdapter(
            ArrayAdapter<String>(
                baseContext,
                android.R.layout.simple_list_item_1,
                arrayListOf())
        )
        devices.clear()
    }


}