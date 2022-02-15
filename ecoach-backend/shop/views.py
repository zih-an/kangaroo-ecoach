from django.core.serializers.json import DjangoJSONEncoder
from django.shortcuts import render
from .models import shop
from django.core import serializers
from django.http.response import JsonResponse
from django_redis import get_redis_connection
import json

# Create your views here.
def index(request):
    data = {
        'data': [],
        'code': '',
        'message': ''
    }
    cache=get_redis_connection("default")
    try:
        result = shop.objects.values()
        serialized_r = json.dumps(list(result), cls=DjangoJSONEncoder)
        cache_shop_list = json.loads(serialized_r)  # 对序列化之后的str类型数据进行转化为json对
        data['data']=cache_shop_list
        data['code']='1'
        data['message']='获取成功!'
        # print(data['data'][0]['name'])
        return JsonResponse(data=data, safe=False)
    except:
        data['code'] = '0'
        data['message'] = '获取失败!'
        return JsonResponse(data=data, safe=False)