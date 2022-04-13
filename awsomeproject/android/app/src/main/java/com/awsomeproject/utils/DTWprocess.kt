package com.awsomeproject.utils
import Jama.Matrix
import android.graphics.Point
import android.graphics.PointF
import android.util.Pair
import org.jblas.DoubleMatrix
import com.awsomeproject.data.Dtwresponse
import com.awsomeproject.data.Person
import java.lang.Double.isNaN
import java.lang.Double.NaN
import org.jblas.NativeBlas
import kotlin.math.exp
import kotlin.math.sqrt

class DTWprocess {
    //姿势棒图关节点数目
    public val num_points:Int=17
    //姿势棒图骨向量数目
    public val num_vector:Int=18
    //关节点的维度数目
    public val num_dimension:Int=2

//__________________________________jama__________________________________

    //余弦距离!!!!!!!!!!!这里用到了一些jblas库内容,可能出错!!!!!!!!!!!!!!!!!!!!!!
    fun cosine_point_distance_Jama(X:Matrix,Y:Matrix):Pair<Double,Double>
    {
        var true_dis:Double=0.0.toDouble()
        var fake_dis:Double=0.0.toDouble()
        val dimension:Int=X.rowDimension
        //归一化&&缺陷值NaN处理
        var X_norm:DoubleMatrix= DoubleMatrix(dimension,num_dimension)
        var Y_norm:DoubleMatrix= DoubleMatrix(dimension,num_dimension)
        for(i in 0..dimension-1)
        {
            if(!isNaN(X[i, 0]) &&!isNaN(X[i, 1]) &&!isNaN(Y[i, 0]) &&!isNaN(Y[i, 1]))
            {

                if(X.getMatrix(i,i,0,num_dimension-1).norm2()!=0.0)
                {
                    X_norm.put(i,0,X[i,0]/X.getMatrix(i,i,0,num_dimension-1).norm2())
                    X_norm.put(i,1,X[i,1]/X.getMatrix(i,i,0,num_dimension-1).norm2())
                }
                if(Y.getMatrix(i,i,0,num_dimension-1).norm2()!=0.0)
                {
                    Y_norm.put(i,0,Y[i,0]/Y.getMatrix(i,i,0,num_dimension-1).norm2())
                    Y_norm.put(i,1,Y[i,1]/Y.getMatrix(i,i,0,num_dimension-1).norm2())
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
            if(!isNaN(X_norm[i, 0]) &&!isNaN(X_norm[i, 1]) &&!isNaN(Y_norm[i, 0]) &&!isNaN(Y_norm[i, 1]))
            {
                val tmp_dis=X_norm[i,0]*Y_norm[i,0]+X_norm[i,1]*Y_norm[i,1]
                true_dis+=tmp_dis
                if(tmp_dis> sqrt(3.0) /2)
                    fake_dis+=1
                else if(tmp_dis> sqrt(2.0) /2)
                    fake_dis+=0
                else
                    fake_dis+=-1
            }
            else//如果缺失，则认为缺失
            {
                true_dis+=0
                fake_dis+=0
            }
        }
        //(dis+dimension)*(dis+dimension)*100/(2*dimension*2*dimension)
//        return Pair<Double,Double>(
//            (fake_dis+dimension)*(fake_dis+dimension)*100/(2*dimension*2*dimension),
//            (true_dis+dimension)*100.0/(2*dimension)
//        )
        var true_res_dis:Double=0.0
        true_dis=Math.toDegrees(Math.acos(true_dis/(dimension)))
        if(true_dis<=30&&true_dis>=0)
        {
            true_res_dis=(30-true_dis)*100/30
        }
        return Pair<Double,Double>(
            (fake_dis+dimension.toDouble())*(fake_dis+dimension.toDouble())*100.0/(2*dimension.toDouble()*2*dimension.toDouble()),
            true_res_dis
        )
    }


    //输入用户的List<DoubleMatrix>和标准视频的List<DoubleMatrix>,执行DTW,返回Dtwresponse
    fun exec_Jama(userPointsList:List<Matrix>,samplePointsList:List<Matrix>): Dtwresponse
    {
        val M=userPointsList.count()
        val N=samplePointsList.count()

        //记录DTW选择路径的矩阵即path_matrix初始化
        var path_matrix = Array(M){Array(N){IntArray(2)}}
        path_matrix[0][0][0]=-1
        path_matrix[0][0][1]=-1

        //进行动态规化运算的矩阵&&cost的初始化
        var cost:DoubleMatrix = DoubleMatrix(M,N)
        cost.put(0,0,
            cosine_point_distance_Jama(userPointsList[0], samplePointsList[0]).second)
        for(i in 1..M-1)
        {
            cost.put(i,0,
                cost[i-1,0]+cosine_point_distance_Jama(userPointsList[i], samplePointsList[0]).second)
        }
        for(j in 1..N-1)
        {
            cost.put(0,j,
                cost[0,j-1]+cosine_point_distance_Jama(userPointsList[0], samplePointsList[j]).second)
        }
        //END

        //DTW开始计算
        for(i in 1..M-1)

        {
            var j_begin:Int=listOf(1,i-10000).maxOrNull()!!
            var j_end:Int=listOf(N,i+10000).minOrNull()!!
            for(j in j_begin..j_end-1)
            {
                val choices=listOf(cost[i-1,j-1],cost[i,j-1], cost[i-1,j])
                val choiced:Double =choices.maxOrNull()!!
                if (choiced == cost[i - 1,j - 1]) {
                    path_matrix[i][j][0] = i-1
                    path_matrix[i][j][1] = j-1
                }
                else if (choiced == cost[i,j - 1]) {
                    path_matrix[i][j][0] = i
                    path_matrix[i][j][1] = j-1
                }
                else if (choiced == cost[i - 1,j]) {
                    path_matrix[i][j][0] = i-1
                    path_matrix[i][j][1] = j
                }
                cost.put(i,j,
                    choiced+cosine_point_distance_Jama(userPointsList[i], samplePointsList[j]).second)

            }
        }
        //END
        var path_list:MutableList<Pair<Int,Int>> = arrayListOf<Pair<Int,Int>>()
        var x:Int=M-1
        var y:Int=N-1
        while(x!=-1&&y!=-1)
        {
            path_list.add(Pair<Int,Int>(x,y))
            val tempX=x
            val tempY=y
            x=path_matrix[tempX][tempY][0]
            y=path_matrix[tempX][tempY][1]
        }
        var DTWres=Dtwresponse(path_list,cost[M-1,N-1])
        return  DTWres
    }

}