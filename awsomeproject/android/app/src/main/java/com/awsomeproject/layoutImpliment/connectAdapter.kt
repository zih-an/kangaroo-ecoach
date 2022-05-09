package com.awsomeproject.layoutImpliment

import android.R
import android.content.Context
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import java.util.*

class connectAdapter(  //数据项
    private val data: List<String>?,
    private val listener:View.OnClickListener?,
    private val btnText:String
) : BaseAdapter(),
    View.OnClickListener {
    //上下文
    private var context: Context? = null
    override fun getCount(): Int {
        return data?.size ?: 0
    }

    override fun getItem(i: Int): Any {
        return data!![i]
    }

    override fun getItemId(i: Int): Long {
        return i.toLong()
    }
    override fun getView(i: Int, view: View?, viewGroup: ViewGroup): View {
        var view: View? = view
        var viewHolder: ViewHolder? = null
        if (context == null) context = viewGroup.context
        if (view == null) {
            view = LayoutInflater.from(viewGroup.context).inflate(com.awsomeproject.R.layout.mylist_item, null)
            viewHolder = ViewHolder()
            viewHolder.text = view.findViewById(com.awsomeproject.R.id.text)
            viewHolder.btn = view.findViewById(com.awsomeproject.R.id.btn) as Button
            view.setTag(viewHolder)
        }
        //获取viewHolder实例
        view?.getTag()
        viewHolder = view?.getTag() as ViewHolder
        //设置数据
        viewHolder!!.text!!.text = data!![i]
        //设置数据
        viewHolder.btn?.setText(btnText)
        viewHolder.btn?.setTag(data!![i])
        viewHolder.btn?.setOnClickListener(listener)
        return view
    }
    override fun onClick(view: View) {

    }

    override fun isEnabled(position: Int): Boolean {
        return false;
    }
    internal class ViewHolder {
        var text: TextView? = null
        var btn: Button? = null
    }
}