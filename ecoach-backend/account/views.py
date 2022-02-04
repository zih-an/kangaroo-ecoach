from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.http import JsonResponse
import random, time
from django.conf import settings
from .email_send import *
from .models import User
# Create your views here.


def user_register(request):
    """
        用户注册
        :param requset: check_code:验证码,email:邮箱
        :return: json：{'email': email,'error': '',} error为空则无异常
    """
    if request.method == 'GET':
        return render(request, 'account/register.html')
    elif request.method == 'POST':
        p_code = request.POST.get('check_code')
        pass_word=request.POST.get('pass_word')
        email = request.POST.get('email')
        data = {
            'email': email,
            'error': '',
        }
        try:
            check_code = EmailVerifyRecord.objects.get(code=p_code, email=email)
            if float(time.time()) - float(check_code.c_time) > 120:
                check_code.delete()
                data['error'] = "验证码超时"
                return JsonResponse(data)
            check_code.delete()
            if User.objects.filter(email=email):
                data['error'] = "邮箱已存在"
                return JsonResponse(data)
            else:
                User.add(email=email,password=pass_word)
                data['error'] = ""
                return JsonResponse(data)
        except:
            print(1233333333)


def author_login(request):
    if request.method == 'GET':
        return
    elif request.method == 'POST':
        email=request.POST.get('email')
        password=request.POST.get('password')
        user=User.get_user(email=email,password=password)
        data = {
            'email': email,
            'error': ''
        }
        if user:
            user.update_status()
            return JsonResponse(data)
        else:
            data['error'] = "账号或密码错误，请重试"
            return JsonResponse(data)



def author_logout(request):
    if request.method == 'GET':
        pass



def refind_password(request):
    """
    找回密码，发送验证码
    :param request:
    :return:
    """
    if request.method == 'POST':
        email = request.POST.get('email', None)
        data = {
            'email': email,
            'error': '',
        }
        try:
            user_obj = User.objects.filter(emial=email)
            if user_obj:
                res_email = send_code_email(email,"retrieve")
                if (res_email):
                    return JsonResponse(data)
                else:
                    data['error']="验证码发送失败，请稍后再试"
                    return JsonResponse(data)
            else:
                data['error'] = "邮箱错误，请检查"
                return JsonResponse(data)
        except:
            data['error'] = "验证错误, 请稍后重试"
        return JsonResponse(data)


def author_code(request):
    if request.method == 'POST':
        email = request.POST.get('email', None)
        data = {
            'email': email,
            'error': '',
        }
        try:
            user_obj = User.objects.filter(emial=email)
            if user_obj:
                data['error']="用户已存在"
                return JsonResponse(data)
            else:
                res_email = send_code_email(email)
                if(res_email):
                    return JsonResponse(data)
                else:
                    data['error']="验证码发送失败，请稍后再试"
                    return JsonResponse(data)
        except:
            data['error'] = "验证错误, 请稍后重试"
        return JsonResponse(data)
