package com.awsomeproject.utils
import Jama.Matrix
import java.lang.Double.isNaN
import kotlin.math.sqrt

class AffineTransprocess {
    //姿势棒图关节点数目
    val num_points:Int=17
    //姿势棒图骨向量数目
    val num_vector:Int=18
    //关节点的维度数目
    val num_dimension:Int=2
//__________________________________jama__________________________________
    //处理骨架的NaN数据，以便于进行最小二乘法时候去除对应的方程
    fun NanMesg_Jama(X:Matrix,Y:Matrix):Matrix
    {
        val num:Int=X.rowDimension
        val NanMesg:Matrix= Matrix(num,1)
        for(i in 0..num-1)
        {
            if(isNaN(X[i,0])||isNaN(X[i,1])||isNaN(Y[i,0])||isNaN(Y[i,1]))
            {
                NanMesg.set(i,0,0.0)
                //将相应数据置为0
                X.set(i,0,0.0)
                X.set(i,1,0.0)
                Y.set(i,0,0.0)
                Y.set(i,1,0.0)
            }
            else
            {
                NanMesg.set(i,0,1.0)
            }
        }
        return NanMesg
    }

    //仿射变换，使用最小二乘法解超定方程组AX+b≈Y，并输出Y_hat
    fun affine_transfor_Jama(X:Matrix,Y:Matrix):Matrix
    {
        //如果X或者Y中有NaN值，则去掉相应的方程
        val len=X.rowDimension
        val m:Matrix = NanMesg_Jama(X,Y)

        var T:Matrix=Matrix(2*len,6)
        var H:Matrix=Matrix(2*len,1)


//            this[X[0,0],X[0,1],0     ,0     ,m[0,0]*1      ,m[0,0]*0      ]= Y[0,0]
//            this[0     ,0     ,X[0,0],X[0,1],m[0,0]*0      ,m[0,0]*1      ]= Y[0,1]
        for(i in 0..len-1)
        {
            T.set(2*i,0,X.get(i,0))
            T.set(2*i,1,X.get(i,1))
            T.set(2*i,4,1*m[i,0])

            T.set(2*i+1,2,X.get(i,0))
            T.set(2*i+1,3,X.get(i,1))
            T.set(2*i+1,5,1*m[i,0])

            H.set(2*i,0,Y.get(i,0))
            H.set(2*i+1,0,Y.get(i,1))
        }

        //调用solve求解最小二乘法方程组
//        val para=T.transpose().times(T).solve(T.transpose().times(H))
        val para=T.solve(H)

        //从param取出A和b
        var A:Matrix= Matrix(num_dimension,num_dimension)
        var b:Matrix= Matrix(num_dimension,1)

        A.set(0,0,para.get(0,0))
        A.set(0,1,para.get(1,0))
        A.set(1,0,para.get(2,0))
        A.set(1,1,para.get(3,0))



        b.set(0,0,para.get(4,0))
        b.set(1,0,para.get(5,0))
//        printJama(A)
//        printJama(b)
        //计算Y_hat=Ax+b
        var Y_hat:Matrix
        Y_hat= A.times(X.transpose()).transpose()
        for(i in 0..len-1)
        {
            if(m[i,0]==1.0.toDouble())
            {
                Y_hat.set(i,0,Y_hat.get(i,0)+ b[0, 0])
                Y_hat.set(i,1,Y_hat.get(i,1)+ b[1, 0])
            }
            else
            {
                Y_hat.set(i,0,Double.NaN)
                Y_hat.set(i,1,Double.NaN)
            }
        }
//        println("error:")
//        println(Y_hat.minus(Y).norm2())
        return Y_hat
    }

    fun affine_transfor_DMlist_Java(Xs:List<Matrix>,Ys:List<Matrix>): List<Matrix>
    {
        var affter_affineTransfor_MatrixList:MutableList<Matrix> = arrayListOf<Matrix>()
        val sampleNum=Xs.count()
        for(i in 0..sampleNum-1 )
        {
            val temp=affine_transfor_Jama(Xs.get(i),Ys.get(i))
            affter_affineTransfor_MatrixList.add(temp)
        }
        return affter_affineTransfor_MatrixList
    }

    fun printJama(obj:Matrix)
    {
        println("------------------")
        for(i in 0..obj.rowDimension-1)
        {
            for(j in 0..obj.columnDimension-1)
            {
                println(obj[i,j])
            }
        }
        println("------------------")
    }


}
fun main(args: Array<String>) {




//    var xx:Matrix= Matrix(18,2)
//    var yy:Matrix= Matrix(18,2)
//    for(i in 0..17)
//    {
//        xx.set(i,0,(i).toDouble())
//        xx.set(i,1,(i*i).toDouble())
//        yy.set(i,0,(21*xx[i,0]+2*xx[i,1]+7).toDouble())
//        yy.set(i,1,(7*xx[i,0]+11*xx[i,1]+15).toDouble())
//
//    }
//    println(AffineTransprocess().affine_transfor_Jama(xx,yy))



    var xx:Matrix= Matrix(17,2)
    var yy:Matrix= Matrix(17,2)
    for(i in 0..16)
    {
        xx.set(i,0,(i).toDouble())
        xx.set(i,1,(i+sqrt(i.toDouble())).toDouble())

        yy.set(i,0,(xx[i,0]+xx[i,1]+5).toDouble())
        yy.set(i,1,(2*xx[i,0]+3*xx[i,1]+7).toDouble())

    }

    AffineTransprocess().affine_transfor_Jama(xx,yy)

}