from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from account.models import User
from standardV.models import standardV
import numpy as np
from .models import plan
# Create your views here.

#前7个动作
count=7

def cos_sim(a, b):
    a_norm = np.linalg.norm(a)
    b_norm = np.linalg.norm(b)
    cos = np.dot(a,b)/(a_norm * b_norm)
    return cos

def takeSecond(elem):
    return elem[1]

def general_plan(request,email):
    """
    生成计划
    :param request:
    :param email:
    :return:
    """
    data={
        'code':'',
        'message':''
    }
    user=User.objects.get(email=email)
    if user:
        t=np.array(user.prefer_list)
        action_list=standardV.objects.all()
        list=[]
        for item in action_list:
            t1=np.array(item.action_tag)
            cos=cos_sim(t,t1)
            list.append((item.id, cos))
        list.sort(key=takeSecond,reverse=True)
        new_list=[]
        for i in range(count):
            new_list.append(list[i][1])
        plan_user=plan.objects.filter(user_id=email)
        if plan_user:
            plan_user.ex_plan=new_list
        else:
            plan.objects.create(user_id=email,ex_plan=new_list)
        data['code']='1'
        data['message']='生成计划成功!'
        return JsonResponse(data=data, safe=False)
    else:
        data['code']='0'
        data['message']='找不到用户!'
        return JsonResponse(data=data, safe=False)


def index(request,email):
    """
    展示计划
    :param request:
    :param email:
    :return:
    """
    data={
        'data':[],
        'code':'',
        'message':''
    }
    try:
        plan_user=plan.objects.filter(user_id=email)
        plan_list=[]
        if plan_user:
            plan_list=plan_user['ex_plan']
        else:
            data['code']=0
            data['message']='计划为空!'
            return JsonResponse(data=data, safe=False)
        for item in plan_list:
            video=standardV.objects.filter(id=int(item))
            data['data'].append([item,video[0]['title']])
        return JsonResponse(data=data, safe=False)
    except:
        data['code'] = 0
        data['message'] = '查询失败!'
        return JsonResponse(data=data, safe=False)