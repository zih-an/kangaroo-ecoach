from django.shortcuts import render
from .models import standardV
from django.core import serializers
from django.http.response import JsonResponse
import json
# Create your views here.
def index(request):
    """
    展示视频数据
    :param request:
    :return: JsonResponse
    """
    result=standardV.objects.all()
    result_serialize = serializers.serialize('json', result)
    result_json = json.loads(result_serialize)  # 对序列化之后的str类型数据进行转化为json对象
    data = {
        'data': result_json,
        'code': '200',
        'message': '获取成功!'
    }
    return JsonResponse(data=data,safe=False)