package com.awsomeproject.utils

import Jama.Matrix
import android.graphics.PointF
import com.awsomeproject.data.BodyPart
import com.awsomeproject.data.KeyPoint
import com.awsomeproject.data.Person


enum class BoneVectorPart(val position: Int) {
    HEAD(0),         //头部
    LEFT_ARM(1),     //左臂
    RIGHT_ARM(2),    //右臂
    LEFT_LEG(3),     //左腿
    RIGHT_LEG(4),    //右腿
    CROTCH(5),       //胯部
    SHOULDER(6),     //双肩
    RIGHT_NECK(7),   //左脖子
    LEFT_NECK(8),    //右脖子
    LEFT_TRUCK(9),   //躯干左侧
    RIGHT_TRUCK(10); //躯干右测
    companion object
    {
        private val map = values().associateBy(BoneVectorPart::position)
        fun fromInt(position: Int): BoneVectorPart = map.getValue(position)
    }
}

class DataTypeTransfor {
    //*************************************基本流程*************************************
    //                                    List<Person>
    //                                        |
    //               listPerson2ListMatrix--->|
    //                                        ↓
    //                                    List<Matrix>
    //                                        |
    //                     affine_transfor--->|
    //                                        ↓
    //                                    List<Matrix>**仿射变换后**
    //                                        |
    //  get_posture_vectorList_from_DMlist--->|
    //                                        ↓
    //                                    List<Matrix>**仿射变换后&&骨架向量**
    //                                        |
    //                              divide--->|
    //                                        ↓
    //                                    List<Matrix>**仿射变换后&&骨架向量&&部位提取**
    //                                        |
    //                                 DTW--->|
    //                                        ↓
    //                               按部位计算得分和生成DTW矩阵
    //姿势棒图关节点数目
    val num_points:Int=17
    //姿势棒图骨向量数目
    val num_vector:Int=18
    //关节点的维度数目
    val num_dimension:Int=2

    //List<Person>数据转List<Matrix>//jama
    fun listPerson2ListMatrix_Jama(Personlist:List<Person>):List<Matrix>
    {
        //初始化List<DoubleMatrix>数据结构
        var PersonMatrix:MutableList<Matrix> = arrayListOf<Matrix>()
        //常量声明
        val sampleNum=Personlist.count()
        var vectorNum=Personlist.get(0).keyPoints.count()

        //遍历
        for(i in 0..sampleNum-1)
        {
            var temp: Matrix = Matrix(vectorNum,2)
            for(j in 0..vectorNum-1)
            {
                temp.set(j,0,Personlist.get(i).keyPoints.get(j).coordinate.x.toDouble())
                temp.set(j,1,Personlist.get(i).keyPoints.get(j).coordinate.y.toDouble())
            }
            PersonMatrix.add(temp)
        }
        return PersonMatrix
    }

    //List<Person>数据转List<Matrix>//jama
    fun ListMatrix2listPerson_Jama(matrixList:List<Matrix>):List<Person>
    {
        var personList:MutableList<Person> = arrayListOf<Person>()
        for(i in 0..matrixList.count()-1)
        {
            var temp:Person
            var keypoints:MutableList<KeyPoint> = arrayListOf<KeyPoint>()
            for(j in 0..matrixList.get(i).rowDimension-1)
            {
                var point:PointF= PointF(matrixList.get(i).get(j,0).toFloat(),matrixList.get(i).get(j,1).toFloat())
                var tempkeypoint:KeyPoint=KeyPoint(BodyPart.fromInt(j),point,1.0.toFloat())
                keypoints.add(tempkeypoint)
            }
            temp=Person(-1,keypoints,null,1.0.toFloat())
            personList.add(temp)
        }
        return personList
    }


    //将person中存储的关节点坐标以Matrix的形式提取出来
    fun KeyPoints2Matrix_Jama(points: Person): Matrix
    {
        var pointM: Matrix = Matrix(num_points,num_dimension)
        for(i in 0..points.keyPoints.size-1)
        {
            pointM.set(i,0,points.keyPoints[i].coordinate.x.toDouble())
            pointM.set(i,1,points.keyPoints[i].coordinate.y.toDouble())
        }
        return pointM
    }

    fun getRow(obj:Matrix,index:Int):Matrix
    {
        return obj.getMatrix(index,index,0,num_dimension-1)
    }

    //iNPUT:18个关节点、OUTPUT:17个体姿向量
    fun get_posture_vector_Jama(points:Matrix):Matrix
    {
        var posVec:Matrix= Matrix(num_vector,num_dimension)
        //转成matrix
        var x:Matrix=points
        //****胸腹部****
        //6->5
        posVec.setMatrix(0,0,0,num_dimension-1,getRow(x,6).minus(getRow(x,5)))
        //12->11
        posVec.setMatrix(1,1,0,num_dimension-1,getRow(x,12).minus(getRow(x,11)))
        //12->6
        posVec.setMatrix(2,2,0,num_dimension-1,getRow(x,12).minus(getRow(x,6)))
        //11->23
        posVec.setMatrix(3,3,0,num_dimension-1,getRow(x,11).minus(getRow(x,5)))
        //****头部****
        //0->1
        posVec.setMatrix(4,4,0,num_dimension-1,getRow(x,0).minus(getRow(x,1)))
        //0->2
        posVec.setMatrix(5,5,0,num_dimension-1,getRow(x,0).minus(getRow(x,2)))
        //2->4
        posVec.setMatrix(6,6,0,num_dimension-1,getRow(x,2).minus(getRow(x,4)))
        //1->3
        posVec.setMatrix(7,7,0,num_dimension-1,getRow(x,1).minus(getRow(x,3)))
        //****左手****
        //6->8
        posVec.setMatrix(8,8,0,num_dimension-1,getRow(x,6).minus(getRow(x,8)))
        //8->10
        posVec.setMatrix(9,9,0,num_dimension-1,getRow(x,8).minus(getRow(x,10)))
        //****右手****
        //5->7
        posVec.setMatrix(10,10,0,num_dimension-1,getRow(x,5).minus(getRow(x,7)))
        //7->9
        posVec.setMatrix(11,11,0,num_dimension-1,getRow(x,7).minus(getRow(x,9)))
        //****左腿****
        //12->14
        posVec.setMatrix(12,12,0,num_dimension-1,getRow(x,12).minus(getRow(x,14)))
        //14->16
        posVec.setMatrix(13,13,0,num_dimension-1,getRow(x,14).minus(getRow(x,16)))
        //****右腿****
        //11->13
        posVec.setMatrix(14,14,0,num_dimension-1,getRow(x,11).minus(getRow(x,13)))
        //13->15
        posVec.setMatrix(15,15,0,num_dimension-1,getRow(x,13).minus(getRow(x,15)))
        //****脖子****
        //0->6
        posVec.setMatrix(16,16,0,num_dimension-1,getRow(x,0).minus(getRow(x,6)))
        //0->5
        posVec.setMatrix(17,17,0,num_dimension-1,getRow(x,0).minus(getRow(x,5)))
        return posVec

    }

    //以List<DoubleMatrix>形式将Persons中的所有关节点提取并转换为骨架向量
    fun get_posture_vectorList_Jama(persons:List<Matrix>):List<Matrix>
    {
        //初始化List<DoubleMatrix>数据结构
        var posVecList:MutableList<Matrix> = arrayListOf<Matrix>()
        val sampleNum=persons.count()
        for(i in 0..sampleNum-1)
        {
            val temp=get_posture_vector_Jama(persons.get(i))
            posVecList.add(temp)
        }
        return posVecList
    }

    //按部位分割
    fun divide_Jama(posVecList:List<Matrix>,Type: BoneVectorPart):MutableList<Matrix>
    {
        var partialposVecList:MutableList<Matrix> = arrayListOf<Matrix>()
        var choocedPart:MutableList<Int> = arrayListOf<Int>()
        val sampleNum=posVecList.count()
        when (Type)
        {
            BoneVectorPart.HEAD -> {
                choocedPart.add(4)
                choocedPart.add(5)
                choocedPart.add(6)
                choocedPart.add(7)
            }
            BoneVectorPart.LEFT_ARM ->{
                choocedPart.add(8)
                choocedPart.add(9)
            }
            BoneVectorPart.RIGHT_ARM ->{
                choocedPart.add(10)
                choocedPart.add(11)
            }
            BoneVectorPart.LEFT_LEG ->{
                choocedPart.add(12)
                choocedPart.add(13)
            }
            BoneVectorPart.RIGHT_LEG ->{
                choocedPart.add(14)
                choocedPart.add(15)
            }
            BoneVectorPart.CROTCH ->{
                choocedPart.add(1)
            }
            BoneVectorPart.SHOULDER ->{
                choocedPart.add(0)
            }
            BoneVectorPart.RIGHT_NECK ->{
                choocedPart.add(16)
            }
            BoneVectorPart.LEFT_NECK ->{
                choocedPart.add(17)
            }
            BoneVectorPart.LEFT_TRUCK ->{
                choocedPart.add(2)
            }
            BoneVectorPart.RIGHT_TRUCK ->{
                choocedPart.add(3)
            }
        }
        for(i in 0..sampleNum-1)
        {
            var temp = Matrix(choocedPart.count(), num_dimension)

            for (j in 0..choocedPart.count()-1)
            {
                temp.setMatrix(j,j,0,num_dimension-1,
                    posVecList.get(i).getMatrix(choocedPart[j],choocedPart[j],0,num_dimension-1))
            }
            partialposVecList.add(temp)
        }
        return partialposVecList
    }

    //合并jamalist
    fun mergin_Jama(JamaListList:MutableList<MutableList<Matrix>>):MutableList<Matrix>
    {
        var res:MutableList<Matrix> = arrayListOf()
        var newRows=0;

        for(i in 0..JamaListList.count()-1)
        {
            JamaListList[i][0]?.let {
                newRows+=it.rowDimension
            }
        }

        for(i in 0..JamaListList[0].count()-1)
        {
            var newMatrix=Matrix(newRows,num_dimension)
            var cnt=0;
            for(j in 0..JamaListList.count()-1)
            {
                for(r in 0..JamaListList[j][i].rowDimension-1)
                {
                    newMatrix.setMatrix(cnt, cnt, 0, num_dimension - 1,
                        JamaListList[j][i].getMatrix(r,r,0,num_dimension-1))
                    cnt++;
                }
            }
            res.add(newMatrix)
        }

        return res
    }


}
fun main(args: Array<String>)
{
//    var persons = arrayListOf<Person>()
//
//    for (i in 0..5)
//    {
//        var person:Person=Person(keyPoints = arrayListOf<KeyPoint>(),
//                                 score = 100.0.toFloat())
//        var p:PointF= PointF(1.0.toFloat(),2.0.toFloat())
//        for (j in 0..16)
//        {
//
//            var points: MutableList<KeyPoint> = arrayListOf<KeyPoint>()
//            points.add(
//                KeyPoint(
//                    bodyPart = BodyPart.LEFT_ANKLE,
//                    coordinate = PointF(j.toFloat(), j.toFloat()),
//                    score = 100.toFloat()
//                ))
//             person = Person(keyPoints = points,
//                                score = 100.0.toFloat())
//        }
//        persons.add(person)
//    }

}