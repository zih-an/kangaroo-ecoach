package com.awsomeproject.data

import Jama.Matrix
import android.content.Context
import com.awsomeproject.data.Person
import org.json.JSONObject
import org.poseestimation.utils.AffineTransprocess
import org.poseestimation.utils.BoneVectorPart
import org.poseestimation.utils.DTWprocess
import org.poseestimation.utils.DataTypeTransfor
import java.io.BufferedReader
import java.io.InputStreamReader

class Sample(
    private var name:String,
    private val context: Context,
    private val listener: Sample.scorelistener? = null) {
    private lateinit var  sampleKeypointsList: List<Matrix>
    private lateinit var  sampleVectorsList: List<Matrix>
    private lateinit var  samplePersonsList: List<Person>
    var count=-1
    var totalScore=50.0
    var bodyWeight:List<Double> = listOf(0.0,10.0/38,10.0/38,0.0,0.0,0.0,8.0/38,0.0,0.0,5.0/38,5.0/38)
    init
    {
        name?.let{sampleKeypointsList=read_csv(it)}
        sampleKeypointsList?.let{sampleVectorsList= DataTypeTransfor().get_posture_vectorList_Jama(it)}
        sampleKeypointsList?.let{samplePersonsList= DataTypeTransfor().ListMatrix2listPerson_Jama(it)}
    }


    public fun clock():Int
    {
        if(++count>=sampleKeypointsList.count())
        {
            count=0
        }
        return count
    }

    public fun reSet( ampleName:String)
    {
        name?.let{sampleKeypointsList=read_csv(it)}
        sampleKeypointsList?.let{sampleVectorsList= DataTypeTransfor().get_posture_vectorList_Jama(it)}
        sampleKeypointsList?.let{samplePersonsList= DataTypeTransfor().ListMatrix2listPerson_Jama(it)}
        count=-1
        totalScore=50.0
    }

    public fun getPersonNow(): List<Person>
    {
        return listOf(samplePersonsList!!.get(count))
    }
    public fun exec(usrPersonsList:List<Person>):Triple<Double, MutableList<Double>, Matrix> {
        //初始化
        var markScore = 0.0
        var scoreByPart = mutableListOf<Double>(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)

        //初始化计算的前后帧数
        var begin: Int = count - 2
        var end: Int = count + 3
        if (begin < 0) begin = 0
        if (end >= sampleKeypointsList.count()) end = sampleKeypointsList.count()

        //获得Matrix结构的用户关节点数据
        val usrKeypointsList = DataTypeTransfor().listPerson2ListMatrix_Jama(usrPersonsList)

        //开始在选定的标准视频动作帧之间进行计算，选择分数最高的一帧
        for (i in begin..end - 1) {

            //获得仿射变换之后的关节点
            val affAffine_usrKeypoints = AffineTransprocess().affine_transfor_Jama(
                usrKeypointsList[0],
                sampleKeypointsList.get(i)
            )

            //获得用户骨架向量数据
            val usrVectors = DataTypeTransfor().get_posture_vector_Jama(affAffine_usrKeypoints)

            //初始化局部数据结构
            var tempScoreByPart = mutableListOf<Double>(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
            var tempMarkScore = 0.0

            //遍历11个部位，分别计算每个部位的得分
            for (j in 0..10)
            {
                tempScoreByPart[j] = DTWprocess().cosine_point_distance_Jama(
                    DataTypeTransfor().divide_Jama(
                        listOf(usrVectors),
                        BoneVectorPart.fromInt(j)
                    ).get(0),
                    DataTypeTransfor().divide_Jama(
                        listOf(sampleVectorsList.get(i)),
                        BoneVectorPart.fromInt(j)
                    ).get(0)
                )
                tempMarkScore += bodyWeight[j] * tempScoreByPart[j]
            }
            if (tempMarkScore > markScore)
            {
                scoreByPart = tempScoreByPart
                markScore = tempMarkScore
            }
        }

        if (markScore > 90) {
            if(count%20==0) {
                listener?.onFrameScoreHeight(markScore.toInt())
            }
            if (totalScore < 99.7) {
                totalScore += 0.3
            }
        } else if (markScore > 80) {
            if (totalScore < 99.9) {
                totalScore += 0.15
            }
        } else if (markScore > 50) {
            if(count%20==0) {
                listener?.onFrameScoreLow(markScore.toInt())
            }

            if (totalScore > 0.3) {
                totalScore -= 0.3
            }
        } else {
            if (count % 20 == 0) {
                listener?.onFrameScoreLow(markScore.toInt())
                if (totalScore >= 0.6) {
                    totalScore -= 0.6
                }
            }
        }
        return Triple(totalScore,scoreByPart,usrKeypointsList.get(0))
    }

    fun read_csv(filename:String):List<Jama.Matrix>
    {
        var posVecList:MutableList<Jama.Matrix> = arrayListOf<Jama.Matrix>()
        context?.let {
            val isr = InputStreamReader(it.assets.open("samples/"+filename), "UTF-8")
            val br = BufferedReader(isr)
            var line: String?
            val builder = StringBuilder()
            while (br.readLine().also { line = it } != null) {
                builder.append(line)
            }
            br.close()
            isr.close()
            var testjson: JSONObject = JSONObject(builder.toString());//builder读取了JSON中的数据。
            val array = testjson.getJSONArray("item")
            for(i in 0..array.length()-1)
            {
                val temp: Jama.Matrix = Jama.Matrix(array.getJSONArray(i).length() / 2, 2)
                for(j in 0..array.getJSONArray(i).length()/2-1)
                {
                    temp.set(j,0,array.getJSONArray(i).get(2*j).toString().toDouble())
                    temp.set(j,1,array.getJSONArray(i).get(2*j+1).toString().toDouble())
                }
                posVecList.add(temp)
            }
        }
        return posVecList
    }


    interface scorelistener
    {
        fun onFrameScoreHeight(FramScore:Int)
        fun onFrameScoreLow(FramScore:Int)
    }
}