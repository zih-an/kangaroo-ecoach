package com.awsomeproject.data

import Jama.Matrix
import android.graphics.Point
import android.util.Pair

data class Dtwresponse (var DTW_PathList: MutableList<Pair<Int,Int>>, var score: Double)