from django.http import HttpResponse
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
        plan_user=plan.objects.get(user_id=email)
        if plan_user:
            plan_user.ex_plan=new_list
        else:
            plan.objects.create(user_id=email,ex_plan=new_list)
        return new_list
    else:
        return HttpResponse('找不到用户')