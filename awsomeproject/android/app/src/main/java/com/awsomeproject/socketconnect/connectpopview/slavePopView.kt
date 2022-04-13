package com.awsomeproject.socketconnect.connectpopview


import android.app.Activity
import android.content.Context
import android.util.Log
import android.view.ContextMenu
import android.view.LayoutInflater
import android.view.View
import android.widget.*
import androidx.annotation.UiThread
import androidx.fragment.app.FragmentActivity
import com.awsomeproject.R
import com.awsomeproject.socketconnect.Device
import com.awsomeproject.socketconnect.communication.host.Command
import com.awsomeproject.socketconnect.communication.host.CommandSender
import com.awsomeproject.socketconnect.communication.slave.FrameData
import com.awsomeproject.socketconnect.communication.slave.FrameDataSender
import com.awsomeproject.socketconnect.search.DeviceSearchResponser
import kotlin.concurrent.thread


class slavePopView(private val activity: Activity?=null) :PopupWindow () {
    private var mContext: Context?=null
    lateinit var view:View
    lateinit var btnResponseOpen : Button
    lateinit var hostList:ListView
    companion object {
         var hostDevice: Device? = null
         fun sendFrameData(frameData:ByteArray,device: Device) {
            //发送命令
            val frameData = FrameData(frameData, object : FrameData.Callback {
                override fun onEcho(msg: String?) {
                }
                override fun onError(msg: String?) {
                }
                override fun onRequest(msg: String?) {
                }
                override fun onSuccess(msg: String?) {
                }
            })
            frameData.setDestIp(device.ip)
            FrameDataSender.addFrameData(frameData)
        }
    }
    public fun CreateRegisterPopWindow(mContext:FragmentActivity,handlerOnClick:View.OnClickListener)
    {
        this.mContext=mContext
        this.view = LayoutInflater.from(mContext).inflate(R.layout.slaveconnect_popview,null)
        btnResponseOpen=view.findViewById(R.id.responseOpen)
        hostList=view.findViewById(R.id.hostlist)
        hostList.setOnItemClickListener(object :AdapterView.OnItemClickListener {
            override fun onItemClick(p0: AdapterView<*>?, view: View?, position: Int, id: Long) {
//                hostDevice?.let{sendFrameData(null,it)}
            }
        })
        btnResponseOpen.setOnClickListener(handlerOnClick)
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
     * 开始同步监听局域网中的host发出的搜索包
     */
    public fun startListen() {
        DeviceSearchResponser.open(object : DeviceSearchResponser.OnSearchListener{
            override fun onGetHost(device: Device?) {
                    device?.let {
                        hostDevice = it
                        var hostList_str: MutableList<String> = arrayListOf()
                        hostList_str.add(hostDevice!!.uuid)
                        activity?.runOnUiThread {
                        var adapter: ArrayAdapter<String> =
                            ArrayAdapter<String>(
                                mContext!!,
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
        hostList.setAdapter(ArrayAdapter<String>(
            mContext!!,
            android.R.layout.simple_list_item_1,
            arrayListOf()))
    }



}
