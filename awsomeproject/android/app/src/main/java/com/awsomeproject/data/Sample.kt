package com.awsomeproject.data

import Jama.Matrix
import android.content.Context
import org.json.JSONObject
import com.awsomeproject.utils.AffineTransprocess
import com.awsomeproject.utils.BoneVectorPart
import com.awsomeproject.utils.DTWprocess
import com.awsomeproject.utils.DataTypeTransfor
import java.io.BufferedReader
import java.io.InputStreamReader
import java.util.*

class Sample(
    private var name:String,
    private val context: Context,
    private val id: Int,
    private val samplevideoTendency:MutableList<Int>,
    private val listener: Sample.scorelistener? = null) {
    private lateinit var  sampleKeypointsList: List<Matrix>
    private lateinit var  sampleVectorsList: List<Matrix>
    private lateinit var  samplePersonsList: List<Person>
    var count=-1
    var countForDect=-1
    var totalScore=50.0
    var bodyWeight:MutableList<Double> = arrayListOf(0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0)
    var voiceMap:MutableList<Int> = arrayListOf(0,1,2,3,4,5,6,7,7,8,8)

    //arrayListOf(0.0,10.0/38,10.0/38,0.0,0.0,0.0,8.0/38,0.0,0.0,5.0/38,5.0/38)
    var isVoice:Boolean=true
    init
    {
        name?.let{sampleKeypointsList=read_json(it)}
        sampleKeypointsList?.let{sampleVectorsList= DataTypeTransfor().get_posture_vectorList_Jama(it)}
        sampleKeypointsList?.let{samplePersonsList= DataTypeTransfor().ListMatrix2listPerson_Jama(it)}
        var sum=0.0
        for(i in 0..samplevideoTendency.count()-1)
        { //0头部 1左臂 2右臂 3左腿 4右腿 5跨部 6双肩 7左脖子 8右脖子 9躯干左侧 10躯干右侧
            when(i)
            {
                0-> {
                    bodyWeight[9] += samplevideoTendency[i].toDouble()/2
                    bodyWeight[10] += samplevideoTendency[i].toDouble()/2
                    sum+=samplevideoTendency[i].toDouble()
                }
                1-> {
                    bodyWeight[9] += samplevideoTendency[i].toDouble()/2
                    bodyWeight[10] += samplevideoTendency[i].toDouble()/2
                    sum+=samplevideoTendency[i].toDouble()
                }
                2-> {
                    bodyWeight[6] += samplevideoTendency[i].toDouble()
                    sum+=samplevideoTendency[i].toDouble()
                }
                3-> {
                    bodyWeight[1] += samplevideoTendency[i].toDouble()
                    bodyWeight[2] += samplevideoTendency[i].toDouble()
                    sum+=2*samplevideoTendency[i].toDouble()
                }
                4-> {
                    bodyWeight[5] += samplevideoTendency[i].toDouble()/2
                    sum+=0.5*samplevideoTendency[i].toDouble()
                }
                5-> {
                    bodyWeight[5] += samplevideoTendency[i].toDouble()/2
                    sum+=0.5*samplevideoTendency[i].toDouble()
                }
                6-> {
//                    bodyWeight[5] += samplevideoTendency[i].toDouble()
                    bodyWeight[3] += samplevideoTendency[i].toDouble()/2
                    bodyWeight[4] += samplevideoTendency[i].toDouble()/2
                    sum+=samplevideoTendency[i].toDouble()
                }
                7-> {
                    bodyWeight[3] += samplevideoTendency[i].toDouble()/2
                    bodyWeight[4] += samplevideoTendency[i].toDouble()/2
                    sum+=samplevideoTendency[i].toDouble()
                }
                8-> {
                    bodyWeight[0] += samplevideoTendency[i].toDouble()/5
                    bodyWeight[1] += samplevideoTendency[i].toDouble()/5
                    bodyWeight[2] += samplevideoTendency[i].toDouble()/5
                    bodyWeight[3] += samplevideoTendency[i].toDouble()/5
                    bodyWeight[4] += samplevideoTendency[i].toDouble()/5
                    bodyWeight[5] += samplevideoTendency[i].toDouble()/5
                    bodyWeight[6] += samplevideoTendency[i].toDouble()/5
                    bodyWeight[7] += samplevideoTendency[i].toDouble()/5
                    bodyWeight[8] += samplevideoTendency[i].toDouble()/5
                    bodyWeight[9] += samplevideoTendency[i].toDouble()/5
                    bodyWeight[10] += samplevideoTendency[i].toDouble()/5
                    sum+=(11/5)*samplevideoTendency[i].toDouble()
                }

            }

        }
        for(i in 0..bodyWeight.count()-1)
        {
            bodyWeight[i]=bodyWeight[i]/sum
        }

    }
    public fun getSampleVectorNow():Matrix
    {
        return sampleVectorsList[count]
    }

    public fun clock():Int
    {
        if(++count>=sampleKeypointsList.count())
        {
            count=sampleKeypointsList.count()-1
        }
        return count
    }
    public fun getClock():Int{
        return count;
    }
    public fun reSet( ampleName:String)
    {
        name?.let{sampleKeypointsList=read_json(it)}
        sampleKeypointsList?.let{sampleVectorsList= DataTypeTransfor().get_posture_vectorList_Jama(it)}
        sampleKeypointsList?.let{samplePersonsList= DataTypeTransfor().ListMatrix2listPerson_Jama(it)}
        count=-1
        totalScore=50.0
    }

    public fun getPersonNow(x:Double,y:Double): List<Person>
    {
        var res=samplePersonsList!!.get(count)
        val x_bias=res.keyPoints[0].coordinate.x-x
        val y_bias=res.keyPoints[0].coordinate.y-y
        for(i in 0..res.keyPoints.count()-1)
        {
            res.keyPoints[i].coordinate.x-=x_bias.toFloat()
            res.keyPoints[i].coordinate.y-=y_bias.toFloat()
        }
        return listOf(res)
    }
    public fun getPersonOnStart(x:Double,y:Double): List<Person>
    {
        var res=samplePersonsList!!.get(0)
        val x_bias=res.keyPoints[0].coordinate.x-x
        val y_bias=res.keyPoints[0].coordinate.y-y
        for(i in 0..res.keyPoints.count()-1)
        {
            res.keyPoints[i].coordinate.x-=x_bias.toFloat()
            res.keyPoints[i].coordinate.y-=y_bias.toFloat()
        }
        return listOf(res)
    }
    public fun exec(usrPersonsList:List<Person>):Triple<Double, MutableList<Double>, Matrix> {
        //初始化
        var fake_markScore = 0.0
        var fake_scoreByPart = mutableListOf<Double>(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
        var true_scoreByPart = mutableListOf<Double>(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
        //初始化计算的前后帧数
        var begin: Int = count
        var end: Int = count + 1
        if (begin < 0) begin = 0
        if (end >= sampleKeypointsList.count()) end = sampleKeypointsList.count()

        //获得Matrix结构的用户关节点数据
        val usrKeypointsList = DataTypeTransfor().listPerson2ListMatrix_Jama(usrPersonsList)
        var usrVectors = Matrix(0,0)

        //开始在选定的标准视频动作帧之间进行计算，选择分数最高的一帧
        for (i in begin..end - 1) {

            //获得仿射变换之后的关节点
            val affAffine_usrKeypoints = AffineTransprocess().affine_transfor_Jama(
                usrKeypointsList[0],
                sampleKeypointsList.get(i)
            )

            //获得用户骨架向量数据
            var tempUsrVectors = DataTypeTransfor().get_posture_vector_Jama(affAffine_usrKeypoints)

            //初始化局部数据结构
            var fake_tempScoreByPart = mutableListOf<Double>(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
            var true_tempScoreByPart = mutableListOf<Double>(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
            var fake_tempMarkScore = 0.0
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
            //遍历11个部位，分别计算每个部位的得分
            for (j in 0..10)
            {

                val dis= DTWprocess().cosine_point_distance_Jama(
                    DataTypeTransfor().divide_Jama(
                        listOf(tempUsrVectors),
                        BoneVectorPart.fromInt(j)
                    ).get(0),
                    DataTypeTransfor().divide_Jama(
                        listOf(sampleVectorsList.get(i)),
                        BoneVectorPart.fromInt(j)
                    ).get(0)
                )
                fake_tempScoreByPart[j] =dis.first //fake
                true_tempScoreByPart[j] =dis.second//true
                fake_tempMarkScore += bodyWeight[j] * fake_tempScoreByPart[j]
            }
            if (fake_tempMarkScore > fake_markScore)
            {
                fake_scoreByPart = fake_tempScoreByPart
                true_scoreByPart = true_tempScoreByPart
                fake_markScore = fake_tempMarkScore
                usrVectors= tempUsrVectors
            }
        }
        if(isVoice&&(count%50==0)&&(Math.random()<=0.5)&&count!=0) {
            throwForVoice(fake_markScore)
        }

        if (fake_markScore > 90) {
            if (totalScore <= 99.80) {
                totalScore += 0.20
            }
            else
            {
                totalScore = 100.00
            }
        } else if (fake_markScore > 80) {
            if (totalScore <= 99.88) {
                totalScore += 0.12
            }
        } else if (fake_markScore > 50) {
            if (totalScore >= 0.5) {
                totalScore -= 0.5
            }
        } else {
            if (totalScore >= 0.8) {
                totalScore -= 0.8
            }
        }
        return Triple(totalScore,true_scoreByPart,usrVectors)
    }

    fun read_json(filename:String):List<Jama.Matrix>
    {
        var posVecList:MutableList<Jama.Matrix> = arrayListOf<Jama.Matrix>()
        context?.let {
            val isr = InputStreamReader(it.assets.open("samplesjson/"+filename), "UTF-8")
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

    private fun throwForVoice(score:Double)
    {
        val temp=bodyWeight.indexOf(Collections.max(bodyWeight))
        if(score>80)
            listener?.onFrameScoreHeight(score.toInt(),voiceMap.get(temp))
        else
            listener?.onFrameScoreLow(score.toInt(),voiceMap.get(temp))

    }

    public fun getSampleVecList():List<Matrix>
    {
        return sampleVectorsList
    }

    public fun tryFirstFrame(usrPersonsList:List<Person>):Double
    {
        //初始化
        var fake_markScore = 0.0
        var fake_scoreByPart = mutableListOf<Double>(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)

        //获得Matrix结构的用户关节点数据
        val usrKeypointsList = DataTypeTransfor().listPerson2ListMatrix_Jama(usrPersonsList)

        //获得仿射变换之后的关节点
        val affAffine_usrKeypoints = AffineTransprocess().affine_transfor_Jama(
            usrKeypointsList[0],
            sampleKeypointsList[0]
        )

        //获得用户骨架向量数据
        var tempUsrVectors = DataTypeTransfor().get_posture_vector_Jama(affAffine_usrKeypoints)

        //遍历11个部位，分别计算每个部位的得分
        for (j in 0..10)
        {
            fake_scoreByPart[j] = DTWprocess().cosine_point_distance_Jama(
                DataTypeTransfor().divide_Jama(
                    listOf(tempUsrVectors),
                    BoneVectorPart.fromInt(j)
                ).get(0),
                DataTypeTransfor().divide_Jama(
                    listOf(sampleVectorsList[0]),
                    BoneVectorPart.fromInt(j)
                ).get(0)
            ).first
            fake_markScore += bodyWeight[j] * fake_scoreByPart[j]
        }
        countForDect++;
        if(fake_markScore<=97&&countForDect%100==0)
        {
            listener?.onPersonNotDect()
        }
        return fake_markScore
    }
    public fun getId():Int
    {
        return id;
    }
    interface scorelistener
    {
        fun onFrameScoreHeight(FrameScore:Int,part:Int)
        fun onFrameScoreLow(FrameScore:Int,part:Int)
        fun onPersonNotDect()
    }


}