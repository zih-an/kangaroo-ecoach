package com.awsomeproject.data

import Jama.Matrix
import org.poseestimation.utils.DTWprocess

class ResJSdata {

    //用户动作骨架
    private lateinit var Vectorslist:MutableList<Matrix>
//Respond
    public var count=0
    //动作标准程度
    private lateinit var scoreBypart:MutableList<MutableList<Double>>
    //完成度
    private lateinit var completeness:MutableList<Boolean>
    //心率
    private lateinit var beatRate:MutableList<Int>
    //运动强度
    private lateinit var exerciseIntensity:MutableList<Double>
    //DTW
    private var dtwres: Dtwresponse?=null

    init {
        Vectorslist = mutableListOf<Matrix>()
        scoreBypart = mutableListOf<MutableList<Double>>()
        completeness = mutableListOf<Boolean>()
        exerciseIntensity = mutableListOf<Double>()
    }
    fun append(obj1 :MutableList<Double>,obj2:Matrix)
    {
        //obj1.size为0表示缺失
        scoreBypart.add(obj1)
        Vectorslist.add(obj2)
        if(obj1.count()==0)
            completeness.add(false)//缺失
        else
            completeness.add(true)//非缺失
        count++
    }

    fun exec(sampleVectorList: MutableList<Matrix>)
    {
        exerciseIntensity=arrayListOf<Double>()
        for(i in 1..count-1)
        {
            exerciseIntensity.add(Vectorslist.get(i).minus(Vectorslist.get(i-1)).norm2())
        }
        dtwres=DTWprocess().exec_Jama(this.Vectorslist,sampleVectorList)

        dtwres?.DTW_matrix
        dtwres?.score
    }

    fun toJson()
    {

    }

}