import datetime
import time

import os
from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from my_travel.api import verify_login
from travel.models import User, Code
from travel.views.code import send_register_email, random_str, verify


# 登录
def login(request):
    if request.method == 'GET':
        return render(request, 'travel/login.html')
    if request.method == 'POST':
        username = request.POST.get('USERNAME')
        password = request.POST.get('PASSWORD')
        user = User.objects.filter(account_num=username).first()
        if not user or user.password != password:
            return JsonResponse({'result':'usererror'})
        request.session['account_num'] = username
        return JsonResponse({'result':'success'})

# 退出
def logout(request):
    del request.session['account_num']
    return HttpResponseRedirect(reverse('travel:home'))

# 注册
def do_register(request):
    username = request.POST.get('USERNAME')
    password = request.POST.get('PASSWORD')
    name = request.POST.get('NAME')
    email = request.POST.get('EMAIL')
    rcode = request.POST.get('rcode')
    if User.objects.filter(account_num=username).exists():
        return JsonResponse({"result": "04"})
    if verify(email,rcode) == '0':
        return JsonResponse({"result": "06"})
    elif verify(email,rcode) == '1':
        return JsonResponse({"result": "08"})
    user = User()
    user.account_num=username
    user.password=password
    user.name=name
    user.email=email
    user.save()
    return JsonResponse({"result": "00"})

# 注册时发送邮件
def send_email(request):
    user_email=request.POST.get('EMAIL')
    user = User.get_by_email(user_email)
    code_num = random_str()
    if user:
        return JsonResponse({"result": "05"})
    elif send_register_email(user_email,code_num) == 'ok':
        code=Code()
        code.email = user_email
        code.code = code_num
        code.created_at = time.time()
        code.save()
        return JsonResponse({"result": "00"})
    return JsonResponse({"result": "04"})

# 用户上传头像
@csrf_exempt
@verify_login
def submit_avatar(request):
    avatar = request.FILES.get('avatar')
    nowTime = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    avatar_name = nowTime+'_'+avatar.name
    avatar_abs_name = os.path.join("media/avatar", avatar_name)
    user = request.user
    avatar_file_old = "media"+str(user.avatar)
    if os.path.exists(avatar_file_old):
        os.remove(avatar_file_old)
    with open(avatar_abs_name, "wb") as f:
        for chunk in avatar.chunks():
            f.write(chunk)
    avatar_file_new = '/avatar/'+avatar_name
    user.avatar = avatar_file_new
    user.save()
    return JsonResponse({"result": "success",'avatar_file':avatar_file_new})

# 修改用户信息时发送邮件
def revise_userinfo_send_email(request):
    user_email=request.POST.get('EMAIL')
    code_num = random_str()
    if send_register_email(user_email,code_num) == 'ok':
        code=Code()
        code.email = user_email
        code.code = code_num
        code.created_at = time.time()
        code.save()
        return JsonResponse({"result": "00"})
    return JsonResponse({"result": "04"})

# 验证用户修改个人信息时输入的邮箱验证码
@verify_login
def verify_email(request):
    email = request.user.email
    rcode = request.POST.get('EMAIL')
    if verify(email,rcode) == '0':
        return JsonResponse({"result": "06"})
    elif verify(email,rcode) == '1':
        return JsonResponse({"result": "08"})
    request.session['is_verify_email'] = 'yes'
    return JsonResponse({"result": "00"})

# 用户个人信息验证状态保持
def get_session_email(request):
    is_verify_email = request.session.get('is_verify_email')
    print(is_verify_email)
    return JsonResponse({'is_verify_email':is_verify_email})

# 保存用户个人资料
@verify_login
def userset(request):
    if request.method == 'GET':
        return render(request,'travel/userset.html',locals())
    if request.method == 'POST':
        nickname = request.POST.get('nickname')
        birthday = request.POST.get('birthday')
        sex = request.POST.get('sex')
        profile = request.POST.get('profile')
        school = request.POST.get('school')
        user =request.user
        user.name = nickname
        user.birthday =birthday
        user.sex = sex
        user.intro = profile
        user.school = school
        user.save()
        return JsonResponse({'result':'success'})

# 保存用户个人资料
@verify_login
def user_revise_save(request):
    if request.method == 'POST':
        password = request.POST.get('password')
        email = request.POST.get('email')
        code= request.POST.get('code')
        user = request.user
        if email:
            if verify(email, code) == '0':
                return JsonResponse({"result": "06"})
            elif verify(email, code) == '1':
                return JsonResponse({"result": "08"})
            user.password = password
            user.email = email
            user.save()
            return JsonResponse({"result": "00"})
        user.password = password
        user.save()
        return JsonResponse({"result": "00"})

@verify_login
def user_home_page(request):
    user = request.user
    return render(request,'travel/userinfo.html',locals())

# 404页面
def not_find(request):
    return render(request,'not_find_404.html')
