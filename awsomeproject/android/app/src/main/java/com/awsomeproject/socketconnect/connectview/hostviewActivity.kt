package com.awsomeproject.socketconnect.connectview

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.awsomeproject.R
import com.awsomeproject.ReceiverActivity
import com.awsomeproject.layoutImpliment.BackArrowView
import com.awsomeproject.layoutImpliment.connectAdapter
import com.awsomeproject.socketconnect.Device
import com.awsomeproject.socketconnect.communication.host.Command
import com.awsomeproject.socketconnect.communication.host.CommandSender
import com.awsomeproject.socketconnect.search.DeviceSearcher


class hostviewActivity: AppCompatActivity() {

    private val REQUEST_CODE = 1

    lateinit var btnSearchDeviceOpen : Button
    lateinit var slaveList: ListView
    lateinit var btnReturn:BackArrowView
    var isSearchDeviceOpen:Boolean=false;
    var devices: MutableMap<String, Device> = mutableMapOf()
    var choosed_device:Device?=null
    var JsonMeg_Intent:String?=null
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

        var bundle=intent.getExtras()
        bundle?.getString("ExerciseScheduleMesg")?.let{
            JsonMeg_Intent=it
        }

        setContentView(R.layout.remote_camera_launcher)
        btnSearchDeviceOpen=this.findViewById(R.id.connectBtn)
        btnReturn=this.findViewById(R.id.back_arrow)
        btnReturn.setOnClickListener{
            finish()
        }
        slaveList=this.findViewById(R.id.slavelist)
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
                    var adapter = connectAdapter(slaveList_str,object :View.OnClickListener{
                        override fun onClick(view: View) {
                            var uuid = view.getTag() as String
                            devices.get(uuid)?.let {
                                choosed_device=it
                                sendCommand(it,"openCamera")
                            }

                            var slaveIp=devices.get(uuid)!!.ip
                            val intent = Intent(baseContext, ReceiverActivity::class.java)
                            intent.putExtra("slaveIp",slaveIp)
                            JsonMeg_Intent?.let {
                                intent.putExtra("ExerciseScheduleMesg", it)
                            }
                            //状态清空
                            clear()
                            stopSearch()
                            isSearchDeviceOpen = false
                            btnSearchDeviceOpen.setText("开始搜索")
                            //跳转并等待返回REQUEST_CODE
                            startActivityForResult(intent,REQUEST_CODE)
                        }
                    })
                    slaveList.adapter=adapter
                }
            }
        })
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_CODE) {
            choosed_device?.let {
                sendCommand(it, "finishSendFrame")
            }
        }
    }
    private fun stopSearch() {
        DeviceSearcher.close()
        slaveList.setAdapter(
            ArrayAdapter<String>(
                baseContext,
                android.R.layout.simple_list_item_1,
                arrayListOf())
        )
        devices.clear()
    }
    private fun clear()
    {
        slaveList.setAdapter(
            ArrayAdapter<String>(
                baseContext,
                android.R.layout.simple_list_item_1,
                arrayListOf())
        )
        devices.clear()
    }
}