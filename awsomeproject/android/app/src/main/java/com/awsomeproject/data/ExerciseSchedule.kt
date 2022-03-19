package com.awsomeproject.data

import org.json.JSONObject

class ExerciseSchedule(JSONmeg:String) {

    private val meg:String=JSONmeg
    public var exerciseName:MutableList<String> = arrayListOf<String>()
    public var exerciseId:MutableList<Int> = arrayListOf<Int>()
    public var exerciseGroups:MutableList<Int> = arrayListOf<Int>()
    init{
        JSON_decoder()
    }
    private fun JSON_decoder()
    {
        var jsonObj=JSONObject(meg)
        var dataArray=jsonObj.getJSONArray("data")
        for(i in 0..dataArray.length()-1)
        {
            exerciseName.add(dataArray.getJSONObject(i).get("sv_path").toString())
            exerciseId.add(dataArray.getJSONObject(0).get("id").toString().toInt())
            exerciseGroups.add( dataArray.getJSONObject(0).get("groups").toString().toInt())
        }
    }
}
