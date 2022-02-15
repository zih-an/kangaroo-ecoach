from django.shortcuts import render
from .models import ex_record
import datetime
from django.http import HttpResponse
from plan.models import plan
# Create your views here.

def query(request,email):
    """
    查询所有就
    :param request:
    :param email: 用户的email
    :return:
    """
    if request.method == 'GET':
        record_list=ex_record.objects.filter(user_id=email).values('report_id','start_time','A_length')

        return record_list


def detail_query(request,email,year,month,day):
    if request.method == 'GET':
        date = datetime.date(year,month,day)
        date1 = date + datetime.timedelta(days=+1)
        record_list=ex_record.objects.filter(user_id=email,finish_time__range=(date,date1))
        return HttpResponse(record_list)

def begin(request,email):
    """
    开始运动选项，创建一个运动记录
    :param request:
    :param email:
    :return:
    """
    user_plan= plan.objects.filter(user_id=email)
    if user_plan:
        exiercise = ex_record.objects.create(user_id=email,start_time=datetime.datetime.now(),v_chosen=user_plan.ex_plan)
        return
    else:
        return HttpResponse("请先推荐计划")