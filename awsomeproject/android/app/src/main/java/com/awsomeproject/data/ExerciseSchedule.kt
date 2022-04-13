package com.awsomeproject.data

import android.util.Log
import org.json.JSONObject


class ExerciseSchedule(JSONmeg:String) {

    companion object{
        var TagMap:JSONObject= JSONObject()
        fun getTendency(id: Int):MutableList<Double>
        {
            var samplevideoTendency:MutableList<Int> = getTag(id)
            var bodyWeight:MutableList< Double> = arrayListOf(0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0)
            var sum:Double=0.0
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
            return bodyWeight
        }
        public fun getTag(id:Int):MutableList<Int>
        {
            var temp:MutableList<Int> = arrayListOf()
            var JsonArr=TagMap.getJSONArray(id.toString())
            for(i in 0..JsonArr.length()-1)
            {
                temp.add(JsonArr.getInt(i))
            }
            return temp
        }

        public fun getTagByIndex(index:Int):MutableList<Int>
        {
            var temp:MutableList<Int> = arrayListOf()
            var JsonArr=TagMap.getJSONArray(exerciseId.get(index).toString())
            for(i in 0..JsonArr.length()-1)
            {
                temp.add(JsonArr.getInt(i))
            }
            return temp
        }

        public fun getName(index:Int):String{
            return exerciseName.get(index)
        }
        public fun getExerciseGroups(index:Int):String{
            return exerciseName.get(index)
        }
        public fun getId(index:Int):Int{
            return exerciseId.get(index)
        }
        public fun getTotalId():Int
        {
            return id
        }
        private var id:Int=-1
        private var size:Int=0;
        public var  exerciseName:MutableList<String> = arrayListOf<String>()
        public var exerciseId:MutableList<Int> = arrayListOf<Int>()
        public var exerciseGroups:MutableList<Int> = arrayListOf<Int>()
        fun getSize():Int
        {
            return size
        }
    }

    private val meg:String=JSONmeg
    init{
        JSON_decoder()
    }


    private fun JSON_decoder()
    {
        var jsonObj=JSONObject(meg)
        var dataArray=jsonObj.getJSONArray("data")
        id=jsonObj.getInt("id")
        for(i in 0..dataArray.length()-1)
        {
            exerciseName.add(dataArray.getJSONObject(i).get("url").toString())
            exerciseId.add(dataArray.getJSONObject(i).get("id").toString().toInt())
            exerciseGroups.add( dataArray.getJSONObject(i).get("groups").toString().toInt())
        }
        size=exerciseId.count()
        var Tagstr="{\n" +
                "    \"1\": [5,5,5,5,5,5,5,5,5],\n" +
                "    \"2\": [1,2,3,2,5,7,7,7,10],\n" +
                "    \"3\": [7,3,3,7,8,6,3,6,10],\n" +
                "    \"4\": [8,8,8,10,2,2,2,2,1],\n" +
                "    \"5\": [5,5,8,10,0,0,0,0,1],\n" +
                "    \"6\": [5,5,8,10,0,0,0,0,1],\n" +
                "    \"7\": [5,5,8,10,0,0,0,0,1],\n" +
                "    \"8\": [1,2,10,6,2,3,0,0,1],\n" +
                "    \"9\": [4,8,10,4,1,8,0,0,1],\n" +
                "    \"10\": [4,8,10,4,3,8,0,4,1],\n" +
                "    \"11\": [2,8,10,4,1,1,0,0,1],\n" +
                "    \"12\": [10,7,5,8,7,4,1,1,4],\n" +
                "    \"14\": [10,7,5,8,4,2,1,1,3],\n" +
                "    \"15\": [10,7,5,8,4,2,1,1,3],\n" +
                "    \"16\": [2,4,1,1,8,6,1,1,3],\n" +
                "    \"17\": [2,4,1,1,8,6,8,1,3],\n" +
                "    \"18\": [1,5,2,1,6,10,4,1,3],\n" +
                "    \"19\": [2,6,2,1,8,8,2,1,3],\n" +
                "    \"20\": [6,5,1,5,6,8,2,1,3],\n" +
                "    \"21\": [1,6,1,2,9,8,2,1,3],\n" +
                "    \"22\": [1,6,1,1,7,8,5,5,3],\n" +
                "    \"23\": [1,6,1,1,7,8,5,5,3],\n" +
                "    \"24\": [1,1,1,1,2,2,10,10,5],\n" +
                "    \"25\": [1,1,1,1,2,2,9,8,5],\n" +
                "    \"26\": [1,1,1,1,2,2,9,8,5],\n" +
                "    \"29\": [1,1,1,1,2,2,9,7,4],\n" +
                "    \"30\": [1,1,1,1,2,2,9,7,4],\n" +
                "    \"31\": [1,1,1,1,5,4,9,9,4],\n" +
                "    \"34\": [1,1,1,1,3,5,7,6,2],\n" +
                "    \"35\": [1,1,1,1,3,5,7,6,2]\n" +
                "}"
        TagMap=JSONObject(Tagstr)

    }

}
