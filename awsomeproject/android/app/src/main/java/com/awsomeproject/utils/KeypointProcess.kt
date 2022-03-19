package org.poseestimation.utils

import Jama.Matrix

//import com.facebook.react.bridge.WritableArray
//import com.facebook.react.bridge.WritableNativeArray
enum class TransforType(val Type: Int) {
    ROTATE(0),//first
    MIRROR(1),//second
    ZOOM(2);  //third
    companion object
    {
        private val map = values().associateBy(TransforType::Type)
        fun fromInt(Type: Int): TransforType = map.getValue(Type)
    }
}
class KeypointProcess {

    private fun Zoom(obj:Matrix, screenHeight:Int, screenWidth:Int, imageHeight:Int, imageWidth:Int):Matrix
    {
        val x_ratio=screenWidth.toDouble()/ imageWidth
        val y_ratio=screenHeight.toDouble()/ imageHeight
        var res=Matrix(obj.rowDimension,2)
        for(i in 0..obj.rowDimension-1)
        {
            res.set(i,0,obj.get(i,0)*x_ratio)
            res.set(i,1,obj.get(i,1)*x_ratio)
        }

        return res
    }
    private fun Rotate(obj:Matrix, Height:Int):Matrix
    {
        var res=Matrix(obj.rowDimension,2)
        for(i in 0..obj.rowDimension-1)
        {
            //x'=y   y'=height-x
            res.set(i,0,obj.get(i,1))
            res.set(i,1,Height-obj.get(i,0))
        }
        return res
    }
    private fun Mirror(obj:Matrix,Width:Int):Matrix
    {
        var res=Matrix(obj.rowDimension,2)
        for(i in 0..obj.rowDimension-1)
        {
            //x'=width-x  y=y
            res.set(i,0,Width-obj.get(i,0))
            res.set(i,1,obj.get(i,1))
        }
        return res
    }

//    private fun KeypoointTransfor(obj:List<Matrix>,bitmap: Bitmap,imageProxy: ImageProxy,type:List<TransforType>):List<Matrix>
//    {
//        var afterRotate_obj:MutableList<Matrix> = arrayListOf<Matrix>()
//        obj.forEach {
//            var temp:Matrix=Matrix(it.rowDimension,it.columnDimension)
//            if(TransforType.ROTATE in type)
//            {
//                temp=Rotate(it,bitmap.height)
//            }
//            if(TransforType.ZOOM in type)
//            {
//                temp=Zoom(it,imageProxy.height,imageProxy.width,bitmap.height,bitmap.width)
//            }
//            if(TransforType.MIRROR in type)
//            {
//                temp=Mirror(it,bitmap.width)
//            }
//            afterRotate_obj.add(temp)
//        }
//        return afterRotate_obj
//    }
//

//    private fun ListMatrix2WritableArray(obj:List<Matrix>):WritableArray
//    {
//        var obj2:WritableArray = WritableNativeArray()
//        obj.forEach{
//            var temp:WritableArray = WritableNativeArray()
//            val rowNum=it.rowDimension
//            val colNum=it.columnDimension
//            for(i in 0..rowNum-1)
//            {
//                var ttemp:WritableArray = WritableNativeArray()
//                for(j in 0..colNum-1)
//                {
//                    ttemp.pushDouble(it.get(i,j))
//                }
//                temp.pushArray(ttemp)
//            }
//            obj2.pushArray(temp)
//        }
//        return obj2
//    }

}