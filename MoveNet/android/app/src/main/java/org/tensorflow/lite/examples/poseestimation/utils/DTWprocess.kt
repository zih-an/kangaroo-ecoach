package org.tensorflow.lite.examples.poseestimation.utils
import org.jblas.DoubleMatrix
import org.tensorflow.lite.examples.poseestimation.data.Dtwresponse
import org.tensorflow.lite.examples.poseestimation.data.Person
import java.lang.Double.isNaN
import java.lang.Double.NaN
class DTWprocess {
    //姿势棒图关节点数目
    val num_points:Int=17
    //姿势棒图骨向量数目
    val num_vector:Int=18
    //关节点的维度数目
    val num_dimension:Int=2

    //余弦距离
    fun cosine_point_distance(X:DoubleMatrix,Y:DoubleMatrix):Double
    {
        var dis:Double=0.0.toDouble()
        val dimension:Int=X.rows
        //归一化&&缺陷值NaN处理
        var X_norm:DoubleMatrix= DoubleMatrix(dimension,num_dimension)
        var Y_norm:DoubleMatrix= DoubleMatrix(dimension,num_dimension)
        for(i in 0..dimension-1)
        {
            if(!isNaN(X[i, 0]) &&!isNaN(X[i, 1]) &&!isNaN(Y[i, 1]) &&!isNaN(Y[i, 1]))
            {
                if(X.getRow(i).norm2()!=0.0)
                {
                    X_norm.put(i,0,X[i,0]/X.getRow(i).norm2())
                    X_norm.put(i,1,X[i,1]/X.getRow(i).norm2())
                }
                if(Y.getRow(i).norm2()!=0.0)
                {
                    Y_norm.put(i,0,Y[i,0]/Y.getRow(i).norm2())
                    Y_norm.put(i,1,Y[i,1]/Y.getRow(i).norm2())
                }
            }
            else
            {
                X_norm.put(i,0, NaN)
                X_norm.put(i,1, NaN)
                Y_norm.put(i,0, NaN)
                Y_norm.put(i,1, NaN)
            }
        }
        for(i in 0..dimension-1)
        {
            if(!isNaN(X_norm[i, 0]) &&!isNaN(X_norm[i, 1]) &&!isNaN(Y_norm[i, 1]) &&!isNaN(Y_norm[i, 1]))
            {
                dis+=X_norm[i,0]*Y_norm[i,0]+X_norm[i,1]*Y_norm[i,1]
            }
            else//如果缺失，则认为重合
            {
                dis+=1
            }
        }
        return dis
    }

    //欧几里得距离
    fun euclid_point_distance(pointA:Person,pointB:Person):Double
    {
        return 0.0
    }

    //输入用户的List<DoubleMatrix>和标准视频的List<DoubleMatrix>,执行DTW,返回DDtwresponse
    fun exec(userPointsList:List<DoubleMatrix>,samplePointsList:List<DoubleMatrix>): Dtwresponse
    {
        val M=userPointsList.count()
        val N=samplePointsList.count()

        //记录DTW选择路径的矩阵即path_matrix初始化
        var path_matrix = Array(M){Array(N){IntArray(2)}}
        path_matrix[0][0][0]=-1
        path_matrix[0][0][1]=-1

        //进行动态规化运算的矩阵&&cost的初始化
        var cost:DoubleMatrix = DoubleMatrix(M+1,N+1)
        cost.put(0,0,
            cosine_point_distance(userPointsList[0], samplePointsList[0]))
        for(i in 1..M)
        {
            cost.put(i,0,
                cost[i-1,0]+cosine_point_distance(userPointsList[i], samplePointsList[0]))
        }
        for(j in 1..N)
        {
            cost.put(0,j,
                cost[0,j-1]+cosine_point_distance(userPointsList[0], samplePointsList[j]))
        }
        //END

        //DTW开始计算
        var i :Int=1
        while(i<=M)
        {
            var j:Int?=listOf(1,i-10000).maxOrNull()
            var j_end:Int?=listOf(N,i+10000).minOrNull()
            if(j!=null&&j_end!=null)
            {
                while(j<=j_end)
                {
                    val choices=listOf(cost[i-1,j-1],cost[i,j-1], cost[i-1,j])
                    val choiced:Double? =choices.minOrNull()
                    if(choiced!=null)
                    {
                        if (choiced == cost[i - 1,j - 1])
                            path_matrix[i][j] = intArrayOf(i,j)
                        else if (choiced == cost[i,j - 1])
                            path_matrix[i][j] = intArrayOf(i,j-1)
                        else if (choiced == cost[i - 1,j])
                            path_matrix[i][j] = intArrayOf(i - 1,j)
                        cost.put(i,j,
                            choiced+cosine_point_distance(userPointsList[i], samplePointsList[j]))
                    }
                    j++
                }
            }
            i++
        }
        //END

        var DTWres=Dtwresponse(path_matrix,cost[-1,-1])
        return  DTWres
    }

}