package org.tensorflow.lite.examples.poseestimation.utils

import org.jblas.DoubleMatrix
import org.tensorflow.lite.examples.poseestimation.data.Person
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
    companion object{
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

    //List<Person>数据转List<DoublemMatrix>
    fun listPerson2ListMatrix(Personlist:List<Person>):List<DoubleMatrix>
    {
        //初始化List<DoubleMatrix>数据结构
        var PersonMatrix:MutableList<DoubleMatrix> = arrayListOf<DoubleMatrix>()
        //常量声明
        val sampleNum=Personlist.count()
        var vectorNum=Personlist.get(0).keyPoints.count()

        //遍历
        for(i in 0..sampleNum-1)
        {
            var temp: DoubleMatrix = DoubleMatrix(vectorNum,2)
            for(j in 0..vectorNum-1)
            {
                temp.put(j,0,Personlist.get(i).keyPoints.get(j).coordinate.x.toDouble())
                temp.put(j,1,Personlist.get(i).keyPoints.get(j).coordinate.y.toDouble())
            }
            PersonMatrix.add(temp)
        }
        return PersonMatrix
    }

    //将person中存储的关节点坐标以Matrix的形式提取出来
    fun KeyPoints2Matrix(points: Person): DoubleMatrix
    {
        var pointM: DoubleMatrix = DoubleMatrix(num_points,num_dimension)
        for(i in 0..points.keyPoints.size-1)
        {
            pointM.put(i,0,points.keyPoints[i].coordinate.x.toDouble())
            pointM.put(i,1,points.keyPoints[i].coordinate.y.toDouble())
        }
        return pointM
    }

    //iNPUT:18个关节点、OUTPUT:17个体姿向量
    fun get_posture_vector(points:Person):DoubleMatrix
    {
        var posVec:DoubleMatrix= DoubleMatrix(num_vector,num_dimension)
        //转成matrix
        var x:DoubleMatrix=DataTypeTransfor().KeyPoints2Matrix(points)
        //****胸腹部****
            //6->5
            posVec.putRow(0,x.getRow(6).sub(x.getRow(5)))
            //12->11
            posVec.putRow(1,x.getRow(12).sub(x.getRow(11)))
            //12->24
            posVec.putRow(2,x.getRow(12).sub(x.getRow(24)))
            //11->23
            posVec.putRow(3,x.getRow(11).sub(x.getRow(23)))
        //****头部****
            //0->1
            posVec.putRow(4,x.getRow(0).sub(x.getRow(1)))
            //0->2
            posVec.putRow(5,x.getRow(0).sub(x.getRow(2)))
            //2->4
            posVec.putRow(6,x.getRow(2).sub(x.getRow(4)))
            //0->1
            posVec.putRow(7,x.getRow(0).sub(x.getRow(1)))
        //****左手****
            //6->8
            posVec.putRow(8,x.getRow(6).sub(x.getRow(8)))
            //8->10
            posVec.putRow(9,x.getRow(8).sub(x.getRow(10)))
        //****右手****
        //5->7
            posVec.putRow(10,x.getRow(5).sub(x.getRow(7)))
            //7->9
            posVec.putRow(11,x.getRow(7).sub(x.getRow(9)))
        //****左腿****
            //12->14
            posVec.putRow(12,x.getRow(12).sub(x.getRow(14)))
            //14->16
            posVec.putRow(13,x.getRow(14).sub(x.getRow(16)))
        //****右腿****
            //11->13
            posVec.putRow(14,x.getRow(11).sub(x.getRow(13)))
            //13->15
            posVec.putRow(15,x.getRow(13).sub(x.getRow(15)))
        //****脖子****
            //0->6
            posVec.putRow(16,x.getRow(0).sub(x.getRow(6)))
            //13->15
            posVec.putRow(17,x.getRow(13).sub(x.getRow(15)))
            return posVec

    }

    fun  get_posture_vector(points:DoubleMatrix):DoubleMatrix
    {
        var posVec:DoubleMatrix= DoubleMatrix(num_vector,num_dimension)
        //转成matrix
        var x:DoubleMatrix=points
        //****胸腹部****
        //6->5
        posVec.putRow(0,x.getRow(6).sub(x.getRow(5)))
        //12->11
        posVec.putRow(1,x.getRow(12).sub(x.getRow(11)))
        //12->24
        posVec.putRow(2,x.getRow(12).sub(x.getRow(24)))
        //11->23
        posVec.putRow(3,x.getRow(11).sub(x.getRow(23)))
        //****头部****
        //0->1
        posVec.putRow(4,x.getRow(0).sub(x.getRow(1)))
        //0->2
        posVec.putRow(5,x.getRow(0).sub(x.getRow(2)))
        //2->4
        posVec.putRow(6,x.getRow(2).sub(x.getRow(4)))
        //0->1
        posVec.putRow(7,x.getRow(0).sub(x.getRow(1)))
        //****左手****
        //6->8
        posVec.putRow(8,x.getRow(6).sub(x.getRow(8)))
        //8->10
        posVec.putRow(9,x.getRow(8).sub(x.getRow(10)))
        //****右手****
        //5->7
        posVec.putRow(10,x.getRow(5).sub(x.getRow(7)))
        //7->9
        posVec.putRow(11,x.getRow(7).sub(x.getRow(9)))
        //****左腿****
        //12->14
        posVec.putRow(12,x.getRow(12).sub(x.getRow(14)))
        //14->16
        posVec.putRow(13,x.getRow(14).sub(x.getRow(16)))
        //****右腿****
        //11->13
        posVec.putRow(14,x.getRow(11).sub(x.getRow(13)))
        //13->15
        posVec.putRow(15,x.getRow(13).sub(x.getRow(15)))
        //****脖子****
        //0->6
        posVec.putRow(16,x.getRow(0).sub(x.getRow(6)))
        //13->15
        posVec.putRow(17,x.getRow(13).sub(x.getRow(15)))
        return posVec
    }

    //以List<DoubleMatrix>形式将Persons中的所有关节点提取并转换为骨架向量
    fun get_posture_vectorList(persons:List<Person>):List<DoubleMatrix>
    {
        //初始化List<DoubleMatrix>数据结构
        var posVecList:MutableList<DoubleMatrix> = arrayListOf<DoubleMatrix>()
        val sampleNum=persons.count()
        for(i in 0..sampleNum-1)
        {
            val temp=get_posture_vector(persons.get(i))
            posVecList.add(temp)
        }
        return posVecList
    }

    fun get_posture_vectorList_from_DMlist(persons:List<DoubleMatrix>):List<DoubleMatrix>
    {
        //初始化List<DoubleMatrix>数据结构
        var posVecList:MutableList<DoubleMatrix> = arrayListOf<DoubleMatrix>()
        val sampleNum=persons.count()
        for(i in 0..sampleNum-1)
        {
            val temp=get_posture_vector(persons.get(i))
            posVecList.add(temp)
        }
        return posVecList
    }

    //按部位分割
    fun divide(posVecList:List<DoubleMatrix>,Type:BoneVectorPart):List<DoubleMatrix>
    {
        var partialposVecList:MutableList<DoubleMatrix> = arrayListOf<DoubleMatrix>()
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
            BoneVectorPart.RIGHT_ARM->{
                choocedPart.add(10)
                choocedPart.add(11)
            }
            BoneVectorPart.LEFT_LEG->{
                choocedPart.add(12)
                choocedPart.add(13)
            }
            BoneVectorPart.RIGHT_LEG->{
                choocedPart.add(14)
                choocedPart.add(15)
            }
            BoneVectorPart.CROTCH->{
                choocedPart.add(1)
            }
            BoneVectorPart.SHOULDER->{
                choocedPart.add(0)
            }
            BoneVectorPart.RIGHT_NECK->{
                choocedPart.add(16)
            }
            BoneVectorPart.LEFT_NECK->{
                choocedPart.add(17)
            }
            BoneVectorPart.LEFT_TRUCK->{
                choocedPart.add(2)
            }
            BoneVectorPart.LEFT_TRUCK->{
                choocedPart.add(3)
            }
        }
        for(i in 0..sampleNum-1)
        {
            var temp = DoubleMatrix(choocedPart.count(), num_dimension)
            for (j in 0..choocedPart.count()-1)
            {
                temp.putRow(j,posVecList.get(i).getRow(choocedPart[j]))
            }
            partialposVecList.add(temp)
        }
        return partialposVecList
    }



}