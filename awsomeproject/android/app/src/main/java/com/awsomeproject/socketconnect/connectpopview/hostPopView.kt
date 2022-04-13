package com.awsomeproject.socketconnect.connectpopview


import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.widget.*
import androidx.fragment.app.FragmentActivity
import com.awsomeproject.R
import com.awsomeproject.socketconnect.Device
import com.awsomeproject.socketconnect.communication.host.Command
import com.awsomeproject.socketconnect.communication.host.CommandSender
import com.awsomeproject.socketconnect.search.DeviceSearcher


class hostPopView :PopupWindow () {
    private var mContext: Context?=null
    lateinit var view:View
    lateinit var btnSearchDeviceOpen : Button
    lateinit var slaveList:ListView
    companion object {
         var devices: MutableMap<String,Device> = mutableMapOf()
         fun sendCommand(device: Device) {
            //发送命令
            val command = Command("openCamera".toByteArray(), object : Command.Callback {
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
    }
    public fun CreateRegisterPopWindow(mContext:FragmentActivity,handlerOnClick:View.OnClickListener)
    {
        this.mContext=mContext
        this.view = LayoutInflater.from(mContext).inflate(R.layout.hostconnect_popview,null)
        btnSearchDeviceOpen=view.findViewById(R.id.searchdeviceOpen)
        slaveList=view.findViewById(R.id.slavelist)
        slaveList.setOnItemClickListener(object :AdapterView.OnItemClickListener {
            override fun onItemClick(p0: AdapterView<*>?, view: View?, position: Int, id: Long) {
                val listView = p0 as ListView
                val listAdapter = listView.adapter
                val choosed: String = listAdapter.getItem(position)  as String
                devices.get(choosed)?.let {
                    sendCommand(it)
                }
            }
        })
        btnSearchDeviceOpen.setOnClickListener(handlerOnClick)

        // 设置外部可点击
        this.setOutsideTouchable(true);
        /* 设置弹出窗口特征 */
        // 设置视图
        this.setContentView(this.view);
        // 设置弹出窗体的宽和高
        /*
       * 获取圣诞框的窗口对象及参数对象以修改对话框的布局设置, 可以直接调用getWindow(),表示获得这个Activity的Window
       * 对象,这样这可以以同样的方式改变这个Activity的属性.
       */
        mContext?.let {
            var dialogWindow = mContext.window
            var windowManger= mContext.windowManager

            var windowDPara=windowManger.defaultDisplay
            var windowPara=dialogWindow.attributes

            this.height=RelativeLayout.LayoutParams.WRAP_CONTENT
            this.width=(windowDPara.width*0.8).toInt()

            this.isFocusable=true
        }

    }

    /**
     * 开始异步搜索局域网中的设备
     */
    public fun startSearch() {
        DeviceSearcher.search(object :DeviceSearcher.OnSearchListener{
            override fun onSearchFinish() {
//                Toast.makeText(mContext,"",Toast.LENGTH_SHORT).show()
            }

            override fun onSearchStart() {
//                Toast.makeText(mContext,"新设备发现",Toast.LENGTH_SHORT).show()
            }

            override fun onSearchedNewOne(device: Device?) {
                device?.let {
                    devices.put(it.uuid,it)
                    var slaveList_str: MutableList<String> = arrayListOf()
                    for(item in devices)
                    {
                        slaveList_str.add(item.value.uuid)
                    }
                    var adapter: ArrayAdapter<String> =
                        ArrayAdapter<String>(
                        mContext!!,
                        android.R.layout.simple_list_item_1,
                        slaveList_str
                    )
                    slaveList.setAdapter(adapter)
                }
            }
        })
    }
    public fun stopSearch() {
        DeviceSearcher.close()
        slaveList.setAdapter(ArrayAdapter<String>(
            mContext!!,
            android.R.layout.simple_list_item_1,
            arrayListOf()))
        devices.clear()
    }
    public fun clear()
    {
        slaveList.setAdapter(ArrayAdapter<String>(
            mContext!!,
            android.R.layout.simple_list_item_1,
            arrayListOf()))
        devices.clear()
    }

}
