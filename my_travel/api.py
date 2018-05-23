# 以下函数用来判断用户是否登录,是否为root用户,用户含有的权限.
from django.http import JsonResponse
from django.shortcuts import redirect
from django.urls import reverse

from travel.models import User


# 验证登录
def verify_login(func):
    def verify(request):
        account_num=request.session.get('account_num')
        if account_num == None:
            return redirect(reverse('travel:login'))
        user = User.get_by_account_num(account_num)
        request.user = user
        return func(request)
    return verify

# 前段异步请求时验证登录
def ajax_verify_login(func):
    def verify(request):
        account_num=request.session.get('account_num')
        if account_num == None:
            return JsonResponse({'result':'error'})
        user = User.get_by_account_num(account_num)
        request.user = user
        return func(request)
    return verify


# 登录保持
def keep_login(request):
    account_num=request.session.get('account_num')
    return account_num