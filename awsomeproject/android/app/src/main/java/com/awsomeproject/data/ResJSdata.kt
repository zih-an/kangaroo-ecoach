package com.awsomeproject.data

import Jama.Matrix
import android.content.Context
import android.os.Environment
import android.widget.Switch
import org.json.JSONArray
import org.json.JSONObject
import com.awsomeproject.R
import com.awsomeproject.utils.BoneVectorPart
import com.awsomeproject.utils.DTWprocess
import com.awsomeproject.utils.DataTypeTransfor
import com.awsomeproject.videodecoder.GlobalStaticVariable
import java.io.*

class ResJSdata(private var sampleId:Int=-1) {

    //用户动作骨架
    private lateinit var Vectorslist:MutableList<Matrix>
    //标准动作骨架
    private lateinit var SampleVectorslist:MutableList<Matrix>
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
    private lateinit var dtwres:Dtwresponse
    //RETURN Json
    private var JsonData:JSONObject?=null
    init {
        Vectorslist = mutableListOf<Matrix>()
        SampleVectorslist = mutableListOf<Matrix>()
        scoreBypart = mutableListOf<MutableList<Double>>()
        completeness = mutableListOf<Boolean>()
        exerciseIntensity = mutableListOf<Double>()
        beatRate=mutableListOf<Int>()
    }
    fun append(scoreByPart :MutableList<Double>,userVector:Matrix,sampleVetor:Matrix)
    {
        //obj1.size为0表示缺失
        scoreBypart.add(scoreByPart)
        Vectorslist.add(userVector)
        SampleVectorslist.add(sampleVetor)
        if(scoreByPart.sum()<=50*scoreByPart.count())
            completeness.add(false)//缺失
        else
            completeness.add(true)//非缺失
        beatRate.add(GlobalStaticVariable.newestWearMesg_HeartBeartRatio.toInt())
        count++
    }

    fun exec()
    {
        exerciseIntensity=arrayListOf<Double>()
        for(i in 1..count-1)
        {
            exerciseIntensity.add(Vectorslist.get(i).minus(Vectorslist.get(i-1)).norm2())
        }
        val ExerciseTendency=ExerciseSchedule.getTendency(sampleId)

        var first:Int=0
        var firstV:Double=0.0

        var second:Int=0
        var secondV:Double=0.0

        var third:Int=0
        var thirdV:Double=0.0

        for(i in 0..10)
        {
            if(ExerciseTendency[i]>=firstV)
            {
                third=second
                second=first
                first=i

                thirdV=secondV
                secondV=firstV
                firstV=ExerciseTendency[i]
            }
            else if(ExerciseTendency[i]>=secondV)
            {
                third=second
                second=i

                thirdV=secondV
                secondV=ExerciseTendency[i]
            }
            else if(ExerciseTendency[i]>=thirdV)
            {
                third=i
                thirdV=ExerciseTendency[i]
            }
        }
        val tool=DataTypeTransfor()
        dtwres=DTWprocess().exec_Jama(
            tool.mergin_Jama(arrayListOf(
                tool.divide_Jama(this.Vectorslist, BoneVectorPart.fromInt(first)),
                tool.divide_Jama(this.Vectorslist, BoneVectorPart.fromInt(second)),
                tool.divide_Jama(this.Vectorslist, BoneVectorPart.fromInt(third)))),
            tool.mergin_Jama(arrayListOf(
                tool.divide_Jama(this.SampleVectorslist, BoneVectorPart.fromInt(first)),
                tool.divide_Jama(this.SampleVectorslist, BoneVectorPart.fromInt(second)),
                tool.divide_Jama(this.SampleVectorslist, BoneVectorPart.fromInt(third))))
        )
    }

    public fun toJson():JSONObject
    {
        var ALLresobj:JSONObject = JSONObject()//最终的返回数据

        var DTWresobj:JSONObject = JSONObject()//DTW的返回数据
        var DTWscore:JSONArray = JSONArray()//DTW的返回数据
        var DTWpathlist:JSONArray = JSONArray()//DTW的返回数据

        var CPNresArray:JSONArray = JSONArray()//完成度的返回数据
        var EXTresArray:JSONArray = JSONArray()//运动强度的返回数据

        var SCOresList:JSONObject = JSONObject()//运动分数的返回数据

        var HeartBeatList:JSONArray = JSONArray()//心率的返回数据
        var PartMap:Map<Int,String> = mapOf(
            0 to "头部",
            1 to  "左臂",
            2 to  "右臂",
            3 to "左腿",
            4 to "右腿",
            5 to "跨部",
            6 to "双肩",
            7 to "左脖子" ,
            8 to "右脖子",
            9 to "躯干左侧",
            10 to "躯干右侧")
        val ExerciseTendency=ExerciseSchedule.getTendency(sampleId)

        var first:Int=0
        var firstV:Double=0.0

        var second:Int=0
        var secondV:Double=0.0

        var third:Int=0
        var thirdV:Double=0.0


        for(i in 0..10)
        {
            if(ExerciseTendency[i]>=firstV)
            {
                third=second
                second=first
                first=i

                thirdV=secondV
                secondV=firstV
                firstV=ExerciseTendency[i]
            }
            else if(ExerciseTendency[i]>=secondV)
            {
                third=second
                second=i

                thirdV=secondV
                secondV=ExerciseTendency[i]
            }
            else if(ExerciseTendency[i]>=thirdV)
            {
                third=i
                thirdV=ExerciseTendency[i]
            }
        }
        val choosed= arrayListOf(first,second,third)
        for(i in choosed)
        {
            var SCOcol: JSONArray = JSONArray()
            for (j in 0..count - 1)
            {
                //获得动作分数
                SCOcol.put(scoreBypart[j][i].toInt())
            }
            SCOresList.put(PartMap.get(i), SCOcol)
        }

        for(i in 0..count-1) {
            //获得完成度
            CPNresArray.put(completeness[i])


        }
        for(i in 0..exerciseIntensity.count()-1)
        {
            //获得运动强度，size-1
            EXTresArray.put(getExerciseIntensityLevel(exerciseIntensity[i]))
        }
        var COOrdination:Double=0.0;
        var X_len=dtwres?.DTW_PathList.get(0).first+1
        var Y_len=dtwres?.DTW_PathList.get(0).second+1
        var k=Y_len.toDouble()/X_len.toDouble()

        for(i in 1..dtwres?.DTW_PathList.count())
        {
            var x=dtwres?.DTW_PathList.get(dtwres?.DTW_PathList.count()-i).first
            var y=dtwres?.DTW_PathList.get(dtwres?.DTW_PathList.count()-i).second
            var path_point:JSONArray = JSONArray()
            path_point.put(x)
            path_point.put((y-k*x.toDouble()).toInt())
            COOrdination+=Math.abs(y.toDouble()-k*x.toDouble())
            DTWpathlist.put(path_point)
        }
        COOrdination=((X_len.toDouble()*Y_len.toDouble()/2.0) - COOrdination)*100/(X_len.toDouble()*Y_len.toDouble()/2.0)
        DTWscore.put(dtwres.score.toInt())
        DTWresobj.put("path",DTWpathlist)
        if(COOrdination<0)
            COOrdination=0.0
        DTWresobj.put("score",COOrdination)

        for(i in 0..beatRate.count()-1)
        {
            HeartBeatList.put(beatRate[i])
        }
        ALLresobj.put("scorebypart",SCOresList)
        ALLresobj.put("completeness",CPNresArray)
        ALLresobj.put("exerciseIntensity",EXTresArray)
        if(GlobalStaticVariable.isWearDeviceConnect)
            ALLresobj.put("heartBeatRatio",HeartBeatList)
        ALLresobj.put("DTW",DTWresobj)
        JsonData=ALLresobj;
        return ALLresobj

    }

    public fun writeTofile(filename:String, context:Context)
    {
        exec()
        var temp= toJson()
        var tempStr:String=temp.toString()
        var path=filename+".txt"
        var fos:FileOutputStream= context.openFileOutput(path,Context.MODE_PRIVATE)
        fos.write(tempStr.toByteArray());
        fos.flush();
        fos.close();
    }
    private fun getExerciseIntensityLevel(value:Double):Int
    {//0 40 80 120 160 200 240 280 320 360 400 440 480 520 560 600
        if(value>=600)
            return 15
        else if(value>560)
            return 14
        else if(value>520)
            return 13
        else if(value>480)
            return 12
        else if(value>440)
            return 11
        else if(value>400)
            return 10
        else if(value>360)
            return 9
        else if(value>320)
            return 8
        else if(value>280)
            return 7
        else if(value>240)
            return 6
        else if(value>200)
            return 5
        else if(value>160)
            return 4
        else if(value>120)
            return 3
        else if(value>80)
            return 2
        else if(value>40)
            return 1
        else return 0;
    }
    public fun getJsonData():JSONObject?
    {
        return JsonData
    }

}